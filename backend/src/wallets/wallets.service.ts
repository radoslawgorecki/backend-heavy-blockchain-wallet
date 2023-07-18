import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { TatumSDK } from "@tatumio/sdk";
import { FilterQuery, Model, ObjectId } from "mongoose";
import { RegisterWalletDto } from "src/auth/dto/register-wallet.dto";
import { Wallet } from "./entities/wallet.entity";
import { Currency, Fiat, FiatOrCryptoCurrency } from "@tatumio/api-client";
import { ConfigService } from "@nestjs/config";
import { CryptService } from "src/crypt/crypt.service";
import { SendTransactionDto } from "src/account/dto/send-transaction.dto";

const options = { testnet: true };

@Injectable()
export class WalletService {
  Tatum = TatumSDK({ apiKey: this.configService.get<string>("TATUM_API_KEY") });
  constructor(
    @InjectModel(Wallet.name) private readonly walletModel: Model<Wallet>,
    private readonly configService: ConfigService,
    private readonly cryptService: CryptService
  ) {}

  findOneByAddress(address: string) {
    return this.walletModel.findOne({ address });
  }

  findOne(query: FilterQuery<Wallet>) {
    return this.walletModel.findOne(query);
  }

  async createWallet(
    registerWalletDto: RegisterWalletDto,
    chain: Currency,
    parent?: ObjectId
  ) {
    const { password } = registerWalletDto;

    const { mnemonic, xpub } = await this.Tatum.wallet.generateBlockchainWallet(
      chain,
      null,
      options
    );
    const address = this.Tatum.wallet.generateAddressFromXPub(
      chain,
      xpub,
      1,
      options
    );
    const privateKey = await this.Tatum.wallet.generatePrivateKeyFromMnemonic(
      chain,
      mnemonic,
      1,
      options
    );
    // hash wallet infos
    const [hashMnemonic, hashPub] = await Promise.all([
      this.cryptService.encode(mnemonic),
      this.cryptService.encode(xpub),
    ]);
    await this.walletModel.create({
      address,
      mnemonic: hashMnemonic,
      xpub: hashPub,
      privateKey,
      password,
      parent,
      currency: chain,
    });
    return { mnemonic, privateKey, address };
  }

  async addWalletToParent(parentAddress: string, chain: Currency) {
    const parent = await this.walletModel.findOne({ address: parentAddress });
    if (!parent) throw new ForbiddenException();
    //IMPORTANT: Password ugly hack to speed up task & demo.
    const wallet = await this.createWallet(
      { password: parent.password },
      chain,
      parent._id
    );
    return { ...wallet, chain };
  }

  async changeWalletPassword(_id: ObjectId, newPassword: string) {
    return await this.walletModel.updateOne(
      { _id },
      { $set: { password: newPassword } }
    );
  }

  async getWalletBalance(address: string, currency: Currency) {
    const balance = await this.Tatum.blockchain[
      currency.toLowerCase()
    ]?.blockchain.getBlockchainAccountBalance(address);
    return balance;
  }

  async getExchangeRate(first: FiatOrCryptoCurrency, second: Fiat) {
    return await this.Tatum.getExchangeRate(first, second);
  }

  async sendTransaction(
    from: string,
    to: string,
    amount: string,
    currency: Currency,
    fee: string,
    senderPk?: string
  ) {
    const dbWallet = await this.walletModel.findOne({ address: from });

    if (!dbWallet) throw new ForbiddenException("Missing privatekey for payer");
    const payload = {
      fromAddress: [
        { address: from, privateKey: senderPk ?? dbWallet.privateKey },
      ],
      to: [{ address: to, value: +amount }],
      fee,
      changeAddress: from,
    };
    // what a lack of consequences with developing SDK without implementing one interface
    // .transaction methods - few chains got .send, few .sendTransaction..
    // this.Tatum.blockchain.btc.transaction.
    return await this.Tatum.blockchain.btc.transaction.sendTransaction(
      payload,
      options
    );
    // return await this.Tatum.blockchain[
    //   currency.toLowerCase()
    // ]?.transaction.sendTransaction(payload, options);
  }

  async getSubWallets(parentAddress: string) {
    const parent = await this.walletModel.findOne({ address: parentAddress });
    if (!parent) throw new ForbiddenException();

    return await this.walletModel.aggregate([
      { $match: { parent: parent._id } },
      {
        $project: {
          address: 1,
          mnemonic: 1,
          privateKey: 1,
          currency: 1,
        },
      },
    ]);
  }

  async estimateGasFee(transactionDto: SendTransactionDto) {
    return await this.Tatum.blockchain[
      transactionDto.currency.toLowerCase()
    ]?.blockchain.estimateFee({
      chain: Currency.BTC,
      type: "TRANSFER",
      fromAddress: [transactionDto.from],
      to: [
        { address: transactionDto.to, value: Number(transactionDto.amount) },
      ],
    });
  }

  async getTransactionList(address: string, currency: Currency) {
    const key = currency.toLowerCase();
    const txes = await this.Tatum.blockchain[
      key
    ].blockchain.getTransactionsByAddress(address, 50, 0);
    const promises = [];
    for (const transaction of txes) {
      // HACK: fast developing, on promise.all reaching easily free tier rate-limiter (5/sec)
      promises.push(
        await this.Tatum.blockchain[key]?.blockchain.getTransaction(
          transaction.hash
        )
      );
    }
    return promises;
  }
}

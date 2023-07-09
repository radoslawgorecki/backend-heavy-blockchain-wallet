import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { TatumSDK } from "@tatumio/sdk";
import { FilterQuery, Model, ObjectId } from "mongoose";
import { RegisterWalletDto } from "src/auth/dto/register-wallet.dto";
import { Wallet } from "./entities/wallet.entity";
import { Currency, Fiat, FiatOrCryptoCurrency } from "@tatumio/api-client";
import { ConfigService } from "@nestjs/config";
import { CryptService } from "src/crypt/crypt.service";

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
    const [hashPrivateKey, hashMnemonic, hashPub] = await Promise.all([
      this.cryptService.encode(privateKey),
      this.cryptService.encode(mnemonic),
      this.cryptService.encode(xpub),
    ]);
    await this.walletModel.create({
      address,
      mnemonic: hashMnemonic,
      xpub: hashPub,
      privateKey: hashPrivateKey,
      password,
      parent,
      currency: chain,
    });
    return { mnemonic, privateKey, address };
  }

  async addWalletToParent(
    parentId: ObjectId,
    password: string,
    chain: Currency
  ) {
    const parent = await this.walletModel.findOne({ _id: parentId });
    if (!parent) throw new ForbiddenException();
    return await this.createWallet({ password }, chain, parent._id);
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
    currency: Currency
  ) {
    const payload = { from: [from], to: [{ address: to, value: amount }] };
    return this.Tatum.blockchain[currency.toLowerCase()]?.sendTransaction(
      payload,
      options
    );
  }
}

import { Currency } from "@tatumio/api-client";
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { LeanDocument } from "mongoose";
import { Wallet } from "src/wallets/entities/wallet.entity";
import { WalletService } from "src/wallets/wallets.service";
import { RegisterWalletDto } from "./dto/register-wallet.dto";
import { CryptService } from "src/crypt/crypt.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly walletService: WalletService,
    private readonly cryptService: CryptService
  ) {}

  async createNewWallet(
    newWallet: RegisterWalletDto,
    type: Currency = Currency.BTC
  ) {
    const password = await this.cryptService.encode(newWallet.password);
    try {
      return await this.walletService.createWallet(
        {
          password,
        },
        type
      );
    } catch (err) {
      console.error(`Error occurred during wallet creation, ${err}`);
      throw err;
    }
  }

  async validateWallet(
    address: string,
    mnemonicOrPk: string,
    pass: string
  ): Promise<{ address: string; currency: Currency } | null> {
    const wallet = await this.walletService.findOne({ address }).lean();
    if (!wallet) throw new ForbiddenException("Wallet not found");
    const isPrivateKeyMatch = wallet.privateKey === mnemonicOrPk;
    const [isMnemonicMatch, isPasswordMatching] = await Promise.all([
      this.cryptService.decode(mnemonicOrPk, wallet.mnemonic),
      this.cryptService.decode(pass, wallet.password),
    ]);
    if (!isPasswordMatching) throw new ForbiddenException();
    if (!(isPrivateKeyMatch || isMnemonicMatch)) throw new ForbiddenException();
    return { address: wallet.address, currency: wallet.currency };
  }

  async changeUserPassword(
    walletAddress: string,
    newPassword: string,
    newPasswordConfirmation: string,
    oldPassword: string,
    wallet: Wallet
  ) {
    if (newPassword !== newPasswordConfirmation)
      throw new ForbiddenException("Passwords must be the same");
    const dbWallet = await this.walletService
      .findOneByAddress(walletAddress)
      .lean();
    if (!dbWallet || !wallet) throw new NotFoundException("User not found");
    if (dbWallet.address !== wallet.address)
      throw new ForbiddenException(
        "Cannot change password for someone's wallet"
      );
    const isOldPasswordsTheSame = await this.cryptService.decode(
      oldPassword,
      dbWallet.password
    );
    if (!isOldPasswordsTheSame) {
      throw new ForbiddenException("Current password doesnt match");
    }

    await this.walletService.changeWalletPassword(
      dbWallet._id,
      await this.cryptService.encode(newPassword)
    );
    return { success: true };
  }
}

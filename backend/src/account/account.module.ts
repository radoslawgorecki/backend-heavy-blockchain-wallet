import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { WalletService } from "src/wallets/wallets.service";
import { WalletsModule } from "src/wallets/wallets.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Wallet, WalletSchema } from "src/wallets/entities/wallet.entity";
import { CryptService } from "src/crypt/crypt.service";
import { AccountService } from "./account.service";

@Module({
  imports: [
    WalletsModule,
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
  ],
  controllers: [AccountController],
  providers: [WalletService, CryptService, AccountService, WalletService],
})
export class AccountModule {}

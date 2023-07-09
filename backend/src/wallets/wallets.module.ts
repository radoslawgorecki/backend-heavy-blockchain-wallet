import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Wallet, WalletSchema } from "./entities/wallet.entity";
import { WalletService } from "./wallets.service";
import { CryptService } from "src/crypt/crypt.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
  ],
  providers: [WalletService, CryptService],
  exports: [WalletService],
})
export class WalletsModule {}

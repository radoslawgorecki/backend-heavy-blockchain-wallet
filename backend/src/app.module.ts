import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { WalletsModule } from "./wallets/wallets.module";
import { CryptModule } from "./crypt/crypt.module";
import { ChainsController } from './chains/chains.controller';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    WalletsModule,
    MongooseModule.forRoot(process.env.MONGO_URL),
    CryptModule,
    AccountModule,
  ],
  controllers: [AppController, ChainsController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { SessionSerializer } from "./session.serializer";
import { WalletsModule } from "src/wallets/wallets.module";
import { CryptService } from "src/crypt/crypt.service";

@Module({
  imports: [WalletsModule, PassportModule.register({ session: true })],
  providers: [AuthService, LocalStrategy, SessionSerializer, CryptService],
  controllers: [AuthController],
})
export class AuthModule {}

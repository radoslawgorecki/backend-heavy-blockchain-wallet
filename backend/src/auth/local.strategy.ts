import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from "express";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "username", passReqToCallback: true });
  }
  async validate(
    req: Request<{ address: string }>,
    pkOrMnemonic: string,
    password: string
  ): Promise<any> {
    const wallet = await this.authService.validateWallet(
      req.params.address,
      pkOrMnemonic,
      password
    );
    if (!wallet) throw new UnauthorizedException();
    return wallet;
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  SerializeOptions,
  UseGuards,
} from "@nestjs/common";
import { SessionRequest } from "types";
import { AuthService } from "./auth.service";
import { AuthenticatedGuard } from "./authenticated.guard";
import { RegisterWalletDto } from "./dto/register-wallet.dto";
import { LocalAuthGuard } from "./local.guard";

@Controller("auth")
@SerializeOptions({
  excludePrefixes: ["pass", "_"],
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() registerWalletDto: RegisterWalletDto) {
    return this.authService.createNewWallet(registerWalletDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login/:address")
  async login(@Request() req: SessionRequest) {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Post("logout")
  async logout(@Request() req: SessionRequest) {
    return req.logout(function (err) {
      req.session = null;
      if (err) throw "Error during logout" + err;
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Get("me")
  async me(@Request() req: SessionRequest) {
    return req.user ? req.user : "e";
  }

  @UseGuards(AuthenticatedGuard)
  @Post("change-password")
  async changePassword(
    @Body()
    body: {
      username: string;
      newPassword: string;
      newPasswordConfirmation: string;
      currentPassword: string;
    },
    @Req() req: SessionRequest
  ) {
    await this.authService.changeUserPassword(
      body.username,
      body.newPassword,
      body.newPasswordConfirmation,
      body.currentPassword,
      req.user
    );
    return req.logout(function (err) {
      if (err) throw err;
    });
  }
}

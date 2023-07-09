import { Currency, FiatOrCryptoCurrency, Fiat } from "@tatumio/api-client";
import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthenticatedGuard } from "src/auth/authenticated.guard";
import { AccountService } from "./account.service";

@Controller("account")
@UseGuards(AuthenticatedGuard)
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Get("balance/:address/:currency")
  getBalance(
    @Param("address") address: string,
    @Param("currency") currency: Currency
  ) {
    return this.service.getBalance(address, currency);
  }

  @Get("ratio/:first/:second")
  getRatio(
    @Param("first") first: FiatOrCryptoCurrency,
    @Param("second") second: Fiat
  ) {
    return this.service.getRatio(first, second);
  }
}

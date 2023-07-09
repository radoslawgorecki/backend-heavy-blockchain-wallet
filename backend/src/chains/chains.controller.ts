import { Controller, Get, UseGuards } from "@nestjs/common";
import { Currency, Fiat } from "@tatumio/api-client";
import { AuthenticatedGuard } from "src/auth/authenticated.guard";

@Controller("chains")
export class ChainsController {
  @Get("list")
  @UseGuards(AuthenticatedGuard)
  retrieveList() {
    // every key === value - so we don't need object here
    return { chain: Object.keys(Currency), fiat: Object.keys(Fiat) };
  }
}

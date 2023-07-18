import {
  Currency,
  FiatOrCryptoCurrency,
  Fiat,
  NATIVE_CURRENCIES,
} from "@tatumio/api-client";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthenticatedGuard } from "src/auth/authenticated.guard";
import { AccountService } from "./account.service";
import { WalletService } from "src/wallets/wallets.service";
import { SessionRequest } from "types";
import { SendTransactionDto } from "./dto/send-transaction.dto";

@Controller("account")
@UseGuards(AuthenticatedGuard)
export class AccountController {
  constructor(
    private readonly service: AccountService,
    private readonly walletService: WalletService
  ) {}

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

  @Get("chains-list")
  retrieveChainsList() {
    return NATIVE_CURRENCIES.map((i) => ({ label: i, value: i }));
  }

  @Post("create-sub-wallet")
  createSubWallet(
    @Req() req: SessionRequest,
    @Body() body: { chain: Currency }
  ) {
    return this.walletService.addWalletToParent(req.user.address, body.chain);
  }

  @Get("sub-list")
  retrieveSubWalletsList(@Req() req: SessionRequest) {
    return this.walletService.getSubWallets(req.user.address);
  }

  @Post("transaction/send")
  sendTransaction(@Body() sendTransactionDto: SendTransactionDto) {
    return this.service.sendTransaction(sendTransactionDto);
  }

  @Post("transaction/estimate")
  estimateFee(@Body() sendTransactionDto: SendTransactionDto) {
    return this.service.estimateFee(sendTransactionDto);
  }

  @Get("transaction/history/:address/:chain")
  getTransactionList(
    @Param("address") address: string,
    @Param("chain") chain: Currency
  ) {
    return this.service.getTransactionList(address, chain);
  }
}

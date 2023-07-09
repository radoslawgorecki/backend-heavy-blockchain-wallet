import { Injectable } from "@nestjs/common";
import { Currency, FiatOrCryptoCurrency, Fiat } from "@tatumio/api-client";
import { WalletService } from "src/wallets/wallets.service";

@Injectable()
export class AccountService {
  constructor(private readonly walletService: WalletService) {}

  getBalance(address: string, currency: Currency) {
    return this.walletService.getWalletBalance(address, currency);
  }

  getRatio(currencyOrFiat: FiatOrCryptoCurrency, pair: Fiat) {
    return this.walletService.getExchangeRate(currencyOrFiat, pair);
  }
}

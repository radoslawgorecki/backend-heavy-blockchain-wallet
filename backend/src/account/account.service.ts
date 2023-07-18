import { Injectable } from "@nestjs/common";
import { Currency, FiatOrCryptoCurrency, Fiat } from "@tatumio/api-client";
import { WalletService } from "src/wallets/wallets.service";
import { SendTransactionDto } from "./dto/send-transaction.dto";

@Injectable()
export class AccountService {
  constructor(private readonly walletService: WalletService) {}

  getBalance(address: string, currency: Currency) {
    return this.walletService.getWalletBalance(address, currency);
  }

  getRatio(currencyOrFiat: FiatOrCryptoCurrency, pair: Fiat) {
    return this.walletService.getExchangeRate(currencyOrFiat, pair);
  }

  sendTransaction(transactionDto: SendTransactionDto) {
    return this.walletService.sendTransaction(
      transactionDto.from,
      transactionDto.to,
      transactionDto.amount,
      transactionDto.currency,
      transactionDto.fee,
      transactionDto.senderPk
    );
  }

  estimateFee(transactionDto: SendTransactionDto) {
    return this.walletService.estimateGasFee(transactionDto);
  }
  getTransactionList(address: string, chain: Currency) {
    return this.walletService.getTransactionList(address, chain);
  }
}

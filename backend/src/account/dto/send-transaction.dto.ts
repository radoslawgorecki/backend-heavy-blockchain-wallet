import { Currency } from "@tatumio/api-client";

export class SendTransactionDto {
  readonly from: string;
  readonly to: string;
  readonly amount: string;
  readonly currency: Currency;
  readonly fee: string;
  readonly senderPk?: string;
}

import { Request } from "express";
import { Wallet } from "src/wallets/entities/wallet.entity";

export interface SessionRequest extends Request {
  user: Wallet;
}

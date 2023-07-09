export type Wallet = {
  address: string;
  currency: string;
};

export enum StorageKey {
  Address = "interview_wallet_address",
  Mnemonic = "interview_wallet_mnemonic",
  PrivateKey = "interview_wallet_pk",
}

export enum RegisterFormStep {
  Password,
  Remember,
}

export type RatioResponse = {
  basePair: string;
  id: string;
  source: string;
  timestamp: number;
  value: string;
};

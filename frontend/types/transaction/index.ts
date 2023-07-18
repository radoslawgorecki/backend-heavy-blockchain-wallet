export type Transaction = {
  from: string;
  to: string;
  amount: string;
  currency: string;
  fee?: string;
  senderPk?: string;
};

export type GasFee = {
  slow: string;
  medium: string;
  fast: string;
};

export type TxListItem = {
  fee: number;
  hash: string;
  blockNumber: number;
  index: number;
  inputs: Array<{
    coin: {
      address: string;
      value: number;
    };
  }>;
  outputs: Array<{
    address: string;
    value: number;
  }>;
};

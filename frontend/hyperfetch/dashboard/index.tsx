import { RatioResponse, Wallet } from "@/types";
import { client } from "../server/client";
import { RegisterResponse } from "@/types/register/register-response.type";
import { GasFee, Transaction, TxListItem } from "@/types/transaction";
type CurrenciesResponse = {
  fiat: Record<string, string>[];
  chain: Record<string, string>[];
};

type AvailableChains = Record<string, string>[];

export const fetchAvailableCurrencies =
  client.createRequest<CurrenciesResponse>()({
    endpoint: "/chains/list",
    queued: true,
    cache: true,
    retry: 0,
  });

export const fetchWalletBalance = client.createRequest<
  Record<string, string>
>()({
  endpoint: "/account/balance/:walletAddress/:currency",
  cache: true,
  queued: true,
});

export const getRatio = client.createRequest<RatioResponse>()({
  endpoint: "/account/ratio/:first/:second",
  queued: true,
  cache: true,
});

export const fetchChainsList = client.createRequest<AvailableChains>()({
  endpoint: "/account/chains-list",
  queued: true,
  cache: true,
});

export const submitChildWallet = client.createRequest<
  RegisterResponse & { chain: string },
  { chain: string }
>()({
  endpoint: "/account/create-sub-wallet",
  method: "POST",
  retry: 0,
  queued: true,
});

export const fetchSubWalletList = client.createRequest<Wallet[]>()({
  endpoint: "/account/sub-list",
  method: "GET",
  queued: true,
  cache: true,
});

export const fetchEstimatedFee = client.createRequest<GasFee, Transaction>()({
  endpoint: "/account/transaction/estimate",
  method: "POST",
  queued: true,
  cache: true,
  retry: 1,
});

export const sendTransaction = client.createRequest<any, Transaction>()({
  endpoint: "/account/transaction/send",
  method: "POST",
  queued: true,
  retry: 0,
});

export const getTransactionsList = client.createRequest<TxListItem[]>()({
  method: "GET",
  endpoint: "/account/transaction/history/:address/:chain",
  queued: true,
  retry: 0,
});

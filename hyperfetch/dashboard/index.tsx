import { RatioResponse } from "@/types";
import { client } from "../server/client";
type CurrenciesResponse = { fiat: string[]; chain: string[] };

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
  queued: true,
  cache: true,
});

export const getRatio = client.createRequest<RatioResponse>()({
  endpoint: "/account/ratio/:first/:second",
  queued: true,
  cache: true,
});

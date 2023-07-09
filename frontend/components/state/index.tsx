"use client";
import Loader from "@/components/loader";
import { authMe } from "@/hyperfetch/auth";
import { fetchAvailableCurrencies } from "@/hyperfetch/dashboard";
import { Wallet } from "@/types";
import { useFetch } from "@hyper-fetch/react";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { createGlobalState } from "react-hooks-global-state";

const initialGlobalState: {
  wallet?: Wallet;
  loading: boolean;
  availableChains: Record<"fiat" | "chain", string[]>;
  baseFiat: string;
  selectedWallet?: Wallet;
  balance?: Record<string, string>;
} = {
  wallet: undefined,
  baseFiat: "USD",
  loading: false,
  availableChains: { fiat: [], chain: [] },
  selectedWallet: undefined,
  balance: {},
};
const withoutAuth = ["/register"];

export const { useGlobalState, getGlobalState, setGlobalState } =
  createGlobalState(initialGlobalState);

const GlobalStateProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [loading] = useGlobalState("loading");
  const [wallet] = useGlobalState("wallet");
  const pathname = usePathname();
  const { push } = useRouter();

  const { onSuccess: authMeSuccess, onError: authMeError } = useFetch(authMe, {
    disabled: !!(pathname && withoutAuth.includes(pathname)),
    dependencies: [pathname],
  });

  const { onSuccess: onGetChainsSuccess, onError: onGetChainsError } = useFetch(
    fetchAvailableCurrencies,
    {
      disabled: !wallet?.address,
      dependencies: [wallet?.address],
    }
  );
  onGetChainsSuccess(({ response }) =>
    setGlobalState("availableChains", response)
  );
  onGetChainsError((err) => console.error("Failed to fetch chain list", err));
  authMeSuccess(({ response }) => {
    setGlobalState("wallet", response);
    if (pathname === "/") push("/wallet");
  });
  authMeError((err) => {
    setGlobalState("wallet", undefined);
    console.error("Error during auth-me", err);
    setTimeout(() => push("/"), 600);
  });

  return (
    <>
      {loading ? (
        <div className="modal-backdrop fixed z-10 flex h-screen w-screen items-center justify-center bg-gray-400/75">
          <Loader />
        </div>
      ) : null}
      {children}
    </>
  );
};

export default GlobalStateProvider;

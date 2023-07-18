"use client";
import { useGlobalState } from "@/components/state";
import { fetchSubWalletList } from "@/hyperfetch/dashboard";
import { useFetch } from "@hyper-fetch/react";
import { FC } from "react";
import WalletItem from "./wallet-item";

const WalletList: FC = () => {
  const [fiat] = useGlobalState("baseFiat");
  const [wallet] = useGlobalState("wallet");

  const { data: subWalletList } = useFetch(fetchSubWalletList, {
    disabled: !wallet,
    dependencies: [wallet],
  });
  if (!subWalletList) return null;
  return subWalletList.map((item, idx) => (
    <WalletItem key={idx} {...item} fiat={fiat} />
  ));
};

export default WalletList;

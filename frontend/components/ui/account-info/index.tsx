import { useGlobalState } from "@/components/state";
import { fetchWalletBalance, getRatio } from "@/hyperfetch/dashboard";
import { RatioResponse } from "@/types";
import { useFetch } from "@hyper-fetch/react";
import React, { useState } from "react";
import CurrencyIcon from "../currency-icon";
import { calcFiatAmount } from "@/helpers";

const AccountInfo = () => {
  const [wallet] = useGlobalState("wallet");
  const [fiat] = useGlobalState("baseFiat");
  const [selectedWallet] = useGlobalState("selectedWallet");
  const [balance, setBalance] = useGlobalState("balance");
  const [ratio, setRatio] = useState<RatioResponse>();
  const choosenWallet = selectedWallet ?? wallet;

  const { onSuccess } = useFetch(
    fetchWalletBalance.setParams({
      walletAddress: String(choosenWallet?.address),
      currency: String(choosenWallet?.currency),
    }),
    {
      disabled: !choosenWallet,
      dependencies: [choosenWallet],
      refreshTime: 10,
    }
  );
  onSuccess(({ response }) => setBalance(response));

  const { onSuccess: onRatioSuccess } = useFetch(
    getRatio.setParams({
      first: String(choosenWallet?.currency),
      second: fiat,
    }),
    {
      disabled: !choosenWallet?.currency || !fiat,
    }
  );
  onRatioSuccess(({ response }) => setRatio(response));

  if (!choosenWallet) return null;
  return (
    <div className="stats mt-2">
      <div className="stat">
        <div className="stat-figure text-secondary">
          <CurrencyIcon currency={choosenWallet.currency} />
        </div>
        <div className="stat-title text-primary">
          {choosenWallet.currency} balance
        </div>
        <div>
          {Object.entries(balance ?? {})?.map(([key, value], idx) => {
            return (
              <div key={idx} className="grid grid-cols-2 gap-x-2 border-b-2">
                <span className="stat-desc">{key}</span>
                <span className="stat-desc col-start-2">
                  {value} {choosenWallet.currency} (
                  {calcFiatAmount(value, fiat, ratio?.value)})
                </span>
              </div>
            );
          })}
        </div>
        <div className="stat-desc">
          <small className="text-primary-focus ">
            1 {choosenWallet.currency} = {ratio?.value} {fiat}
          </small>
        </div>
      </div>
      {/* <div className="stat">
        <div className="stat-figure text-secondary">
          <div className="avatar online">
            <div className="w-16 rounded-full">
              <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
        </div>
        <div className="stat-value">86%</div>
        <div className="stat-title">Tasks done</div>
        <div className="stat-desc text-secondary">31 tasks remaining</div>
      </div> */}
    </div>
  );
};

export default AccountInfo;

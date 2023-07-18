import { calcFiatAmount } from "@/helpers";
import { fetchWalletBalance, getRatio } from "@/hyperfetch/dashboard";
import { RatioResponse } from "@/types";
import { useFetch } from "@hyper-fetch/react";
import React, { FC, memo, useState } from "react";
import CurrencyIcon from "../../currency-icon";

const AccordionItem: FC<{
  address: string;
  currency: string;
  fiat: string;
}> = ({ address, currency, fiat }) => {
  const [balance, setBalance] = useState<Record<string, string>>({});
  const [ratio, setRatio] = useState<RatioResponse>();

  const { onSuccess } = useFetch(
    fetchWalletBalance.setParams({
      walletAddress: address,
      currency,
    }),
    {
      disabled: !address || !currency,
      dependencies: [address, currency],
      refreshTime: 10,
    }
  );
  onSuccess(({ response }) => setBalance(response));

  const { onSuccess: onRatioSuccess } = useFetch(
    getRatio.setParams({
      first: currency,
      second: fiat,
    }),
    {
      disabled: !currency || !fiat,
    }
  );
  onRatioSuccess(({ response }) => setRatio(response));
  return (
    <div className="collapse bg-base-200">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium grid grid-cols-[1fr_50px] items-center">
        <span>Account: {address}</span>
        <div className="justify-self-end self-center">
          <CurrencyIcon currency={currency} />
        </div>
      </div>
      <div className="collapse-content">
        <div className="stat-title text-primary">{currency} balance</div>
        <div>
          {Object.entries(balance ?? {})?.map(([key, value], idx) => {
            return (
              <div key={idx} className="grid grid-cols-2 gap-x-2 border-b-2">
                <span className="stat-desc">{key}</span>
                <span className="stat-desc col-start-2">
                  {value} {currency} (
                  {calcFiatAmount(value, fiat, ratio?.value)})
                </span>
              </div>
            );
          })}
        </div>
        <div className="stat-desc">
          <small className="text-primary-focus ">
            1 {currency} = {ratio?.value} {fiat}
          </small>
        </div>
      </div>
    </div>
  );
};

export default memo(AccordionItem);

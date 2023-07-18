import { calcFiatAmount } from "@/helpers";
import {
  fetchWalletBalance,
  getRatio,
  getTransactionsList,
} from "@/hyperfetch/dashboard";
import { RatioResponse } from "@/types";
import { useFetch } from "@hyper-fetch/react";
import React, { FC, memo, useState } from "react";
import CurrencyIcon from "../../currency-icon";
import { TxListItem } from "@/types/transaction";
import Link from "next/link";

const WalletItem: FC<{
  address: string;
  currency: string;
  fiat: string;
  setSenderBalance?: React.Dispatch<React.SetStateAction<string>>;
}> = ({ address, currency, fiat, setSenderBalance }) => {
  const [balance, setBalance] = useState<Record<string, string>>({});
  const [ratio, setRatio] = useState<RatioResponse>();
  const [history, setHistory] = useState<TxListItem[]>();

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
  onSuccess(({ response }) => {
    setSenderBalance?.(response.incoming);
    setBalance(response);
  });

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

  const { onSuccess: onTxHistorySuccess } = useFetch(
    getTransactionsList.setParams({ address, chain: currency }),
    {
      disabled: !address || !currency,
    }
  );
  onTxHistorySuccess(({ response }) => setHistory(response));
  console.log(history);
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
        <div className="stat-desc border border-gray-400">
          <span className="border-gray-400 border-b w-full flex">
            Tx history
          </span>
          <div className="overflow-x-auto">
            {history && history.length ? (
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Hash</th>
                    <th>blockNumber</th>
                    <th>from</th>
                    <th>to</th>
                    <th>value</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((tx, idx) => {
                    return (
                      <tr key={idx}>
                        <th>{idx + 1}</th>
                        <td className="btn-link">
                          <Link
                            href={`https://live.blockcypher.com/btc-testnet/tx/${tx.hash}`}
                            target="_blank"
                          >
                            {tx.hash.substring(tx.hash.length - 9)}
                          </Link>
                        </td>
                        <td>{tx.blockNumber}</td>
                        <td className="btn-link">
                          <Link
                            href={`https://live.blockcypher.com/btc-testnet/address/${tx.inputs[0]?.coin.address}/`}
                          >
                            {tx.inputs[0]?.coin.address?.substring(
                              tx.inputs[0]?.coin.address.length - 9
                            )}
                          </Link>
                        </td>
                        <td className="btn-link">
                          <Link
                            href={`https://live.blockcypher.com/btc-testnet/address/${tx.outputs[0]?.address}/`}
                          >
                            {tx.outputs[0]?.address?.substring(
                              tx.outputs[0]?.address.length - 9
                            )}
                          </Link>
                        </td>
                        <td>{tx.outputs[0]?.value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(WalletItem);

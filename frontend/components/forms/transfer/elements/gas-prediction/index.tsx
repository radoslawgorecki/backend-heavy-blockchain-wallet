import { fetchEstimatedFee } from "@/hyperfetch/dashboard";
import { GasFee, Transaction } from "@/types/transaction";
import { useFetch } from "@hyper-fetch/react";
import { FC, useEffect, useState } from "react";

const GasPrediction: FC<
  Partial<Transaction> & {
    setFee: React.Dispatch<React.SetStateAction<string>>;
  }
> = ({ from, to, amount, currency, senderPk, setFee }) => {
  const [gasFee, setGasFee] = useState<GasFee>();
  const { loading, onSuccess, onError } = useFetch(
    fetchEstimatedFee.setData({
      from: String(from),
      to: String(from),
      amount: String(amount),
      currency: String(currency),
    }),
    {
      disabled: !from || !to || !amount || !currency,
      dependencies: [from, to, currency],
      bounce: true,
      bounceTime: 400,
      bounceType: "throttle",
    }
  );
  onSuccess(({ response }) => {
    setGasFee(response);
    const key = Object.keys(response)[1];
    setFee(response[key as keyof typeof gasFee]);
  });
  onError((err) => console.error(err));

  if (!gasFee || loading) return null;
  return (
    <div className="mt-8">
      <span>Please specify transaction speed</span>
      <input
        type="range"
        min={0}
        max="2"
        defaultValue="1"
        className="range mt-4"
        step="1"
        onChange={(e) => {
          const val = e.target.value;
          const key = Object.keys(gasFee)[+val];
          setFee(gasFee[key as keyof typeof gasFee]);
        }}
      />
      <div className="w-full flex justify-between text-xs px-2">
        {Object.entries(gasFee).map(([key, value], idx) => {
          return (
            <span key={idx}>
              {key} - {value} {currency}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default GasPrediction;

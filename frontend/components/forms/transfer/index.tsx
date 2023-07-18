"use client";
import { useGlobalState } from "@/components/state";
import WalletItem from "@/components/ui/wallet-list/wallet-item";
import { fetchSubWalletList } from "@/hyperfetch/dashboard";
import { useFetch } from "@hyper-fetch/react";
import { useEffect, useState } from "react";
import Select from "react-select";
import TransferTarget from "./elements/target";
import TransactionModal from "@/components/popups/transaction";
import GasPrediction from "./elements/gas-prediction";
import { useRouter } from "next/navigation";

export interface WalletList {
  label: string;
  value: string;
  address: string;
  currency: string;
}

const TransferForm = () => {
  // app globals
  const [wallet] = useGlobalState("wallet");
  const [fiat] = useGlobalState("baseFiat");
  const router = useRouter();

  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [from, setFrom] = useState<Partial<WalletList>>();
  const [target, setTarget] = useState<Partial<WalletList>>();
  const [walletList, setWalletList] = useState<Partial<WalletList>[]>([
    { label: wallet?.address, value: wallet?.address },
  ]);
  const [amount, setAmount] = useState<string>("");
  const [fee, setFee] = useState<string>("");
  const [senderBalance, setSenderBalance] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const { onSuccess } = useFetch(fetchSubWalletList, {
    disabled: !wallet,
    dependencies: [wallet],
  });
  onSuccess(({ response }) => {
    setWalletList((prev) => {
      const initialList = [
        { ...wallet, label: wallet?.address, value: wallet?.address },
      ];
      const result = initialList.concat(
        response.map((i) => ({ ...i, label: i.address, value: i.address }))
      );
      return result;
    });
  });

  useEffect(() => {
    if (!amount || !fee || !senderBalance) {
      setAmountError("");
      return;
    }
    const costSummary = +amount + +fee;
    if (costSummary > +senderBalance) {
      setAmountError(
        "Unsufficient funds. Tx + gas will cost: " +
          costSummary +
          " but your balance is: " +
          senderBalance
      );
    } else {
      setAmountError("");
    }
  }, [amount, fee, senderBalance]);

  return (
    <>
      <TransactionModal
        from={from?.address}
        to={target?.address}
        currency={from?.currency}
        amount={amount}
        fee={fee}
        isOpened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
      <div className="flex flex-col max-w-screen-md w-full">
        <span>Transfer coins</span>
        <div className="mt-12 w-full border rounded-md p-4 border-slate-400">
          <span>From</span>
          <Select
            instanceId={"from-react-select"}
            className="basic-single mb-4 z-20"
            classNamePrefix="select"
            placeholder="Pick one of your wallets"
            onChange={(val) => (val?.value ? setFrom(val) : null)}
            name="color"
            options={
              target
                ? walletList.filter((i) => i.value !== target.value)
                : walletList
            }
          />
          {from && from.value ? (
            <WalletItem
              address={from.value}
              currency={String(from.currency)}
              fiat={fiat}
              setSenderBalance={setSenderBalance}
            />
          ) : null}
        </div>
        <div className="divider w-1/2 self-center" />
        <TransferTarget
          setTarget={setTarget}
          fiat={fiat}
          target={target}
          options={
            from
              ? walletList.filter(
                  (i) => i.value !== from.value && i.currency === from.currency
                )
              : walletList
          }
        />
        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text">Amount</span>
          </label>
          <input
            type="text"
            placeholder="Amount.."
            className="input input-bordered w-full"
            onChange={(e) => setAmount(e.target.value)}
          />
          {amountError ? (
            <label className="label">
              <span className="label-text-alt text-error">{amountError}</span>
            </label>
          ) : null}
        </div>
        <GasPrediction
          from={from?.address}
          to={target?.address}
          amount={amount}
          currency={from?.currency}
          setFee={setFee}
        />
        <div className="divider" />
        <button
          onClick={() => setModalOpened(!modalOpened)}
          className="btn btn-primary"
        >
          Send
        </button>
        <button
          onClick={() => router.push("/wallet")}
          className="btn btn-primary mt-4 btn-outline"
        >
          Go back
        </button>
      </div>
    </>
  );
};

export default TransferForm;

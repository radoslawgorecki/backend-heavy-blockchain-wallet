import { sendTransaction } from "@/hyperfetch/dashboard";
import { Transaction } from "@/types/transaction";
import { useSubmit } from "@hyper-fetch/react";
import React, { FC } from "react";

interface TransactionModal extends Partial<Exclude<Transaction, "amount">> {
  isOpened: boolean;
  onClose: () => void;
  fee: string;
}

const TransactionModal: FC<TransactionModal> = ({
  from,
  to,
  amount = 0,
  senderPk,
  currency,
  isOpened,
  onClose,
  fee,
}) => {
  const { onSubmitSuccess, onSubmitError, submit } = useSubmit(sendTransaction);

  onSubmitSuccess(({ response }) => {
    debugger;
  });
  onSubmitError((err) => console.error(err));
  if (!isOpened) return null;
  return (
    <dialog
      id="transaction-modal"
      className={`modal bg-white ${isOpened ? "modal-open" : ""}`}
    >
      <form
        method="dialog"
        className="modal-box"
        onSubmit={() =>
          submit({
            data: {
              from: String(from),
              to: String(to),
              fee: String(fee),
              amount: String(amount),
              currency: String(currency),
            },
          })
        }
      >
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        <h3 className="font-bold text-lg">Transaction summary</h3>
        <div className="grid grid-cols-1">
          <span className="border-b border-gray-400 mt-2">From: {from}</span>
          <span className="border-b border-gray-400 mt-2">To: {to}</span>
          <span className="border-b border-gray-400 mt-2">
            Amount: {amount} {currency}
          </span>
          <span className="border-b border-gray-400 mt-2">
            Total (with gas): {+fee + +amount} {currency}
          </span>
        </div>
        <button type="submit" className="btn btn-primary btn-md">
          Confirm
        </button>
      </form>
    </dialog>
  );
};

export default TransactionModal;

"use client";
import React, { FC, useState } from "react";
import { WalletList } from "..";
import Select from "react-select";
import WalletItem from "@/components/ui/wallet-list/wallet-item";

enum FormStateType {
  SELF = "input",
  PREDEFINED = "select",
}

const TransferTarget: FC<{
  setTarget: React.Dispatch<
    React.SetStateAction<Partial<WalletList> | undefined>
  >;
  target?: Partial<WalletList>;
  options: Array<Partial<WalletList>>;
  fiat: string;
}> = ({ setTarget, options, target, fiat }) => {
  //TODO: Add way to indicate delivery address - input with destination address on the same chain
  const [formState, setFormState] = useState<FormStateType>(
    FormStateType.PREDEFINED
  );
  return (
    <div className="w-full border rounded-md p-4 border-slate-400">
      <span>Destination</span>
      <Select
        instanceId={"from-react-select"}
        className="basic-single mb-4 z-20"
        classNamePrefix="select"
        placeholder="Pick one of your wallets"
        onChange={(val) => {
          return val?.value ? setTarget(val) : null;
        }}
        name="target"
        options={options}
      />
      {target && target.value ? (
        <WalletItem
          address={target.value}
          currency={String(target.currency)}
          fiat={fiat}
        />
      ) : null}
    </div>
  );
};

export default TransferTarget;

"use client";
import { useGlobalState } from "@/components/state";
import WalletList from "@/components/ui/wallet-list";
import AccountInfo from "@/components/ui/account-info";
import { fetchSubWalletList } from "@/hyperfetch/dashboard";
import { useFetch } from "@hyper-fetch/react";
import Link from "next/link";
import React from "react";

const Dashboard = () => {
  const [wallet] = useGlobalState("wallet");

  return (
    <div className="card items-center bg-slate-100">
      <span className="card-title mt-8">Dashboard</span>
      <div className="card-body p-4">
        <div className="flex card p-2  flex-col text-md bg-white">
          <span className="text-center w-full">Current wallet:</span>
          <span className="text-center w-full">{wallet?.address}</span>
          <AccountInfo />
          <WalletList />
          <div className="divider" />
          <Link href={"/wallet/transfer"} className="btn btn-primary my-4 mx-2">
            <button>Transactions</button>
          </Link>
          <div className="divider" />
          <Link href={"/wallet/new"} className="btn btn-primary my-4 mx-2">
            <button>Add new wallet</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

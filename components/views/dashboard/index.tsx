"use client";
import { useGlobalState } from "@/components/state";
import Accordion from "@/components/ui/accordion";
import AccountInfo from "@/components/ui/account-info";
import { StorageKey } from "@/types";
import React from "react";

const Dashboard = () => {
  const [wallet] = useGlobalState("wallet");
  const pk = localStorage.getItem(StorageKey.PrivateKey);

  return (
    <div className="card items-center bg-slate-100">
      <span className="card-title">Dashboard</span>
      <div className="card-body p-4">
        <div className="flex card p-2  flex-col text-md bg-white">
          <span className="text-center w-full">Current wallet:</span>
          <span className="text-center w-full">{wallet?.address}</span>
          <AccountInfo />
        </div>
        <Accordion />
      </div>
    </div>
  );
};

export default Dashboard;

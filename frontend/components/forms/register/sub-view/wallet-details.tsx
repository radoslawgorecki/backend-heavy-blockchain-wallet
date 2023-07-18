"use client";
import { useRouter } from "next/navigation";
import React, { FC } from "react";

interface WalletDetails {
  address: string;
  mnemonic: string;
  privateKey: string;
}

const DialogPart: FC<{
  question: string;
  answer?: string;
}> = ({ question, answer }) => {
  if (!answer) return null;
  return (
    <>
      <div className="chat chat-end">
        <div className="chat-bubble chat-bubble-primary">{question}</div>
      </div>
      <div className="chat chat-start break-all">
        <div className="chat-bubble chat-bubble-secondary">{answer}</div>
      </div>
    </>
  );
};

const WalletDetails: FC<{
  address: string;
  mnemonic: string;
  privateKey: string;
  redirect?: string;
  buttonText?: string;
}> = ({ address, mnemonic, privateKey, redirect, buttonText }) => {
  const router = useRouter();
  if (!address || !mnemonic) return null;
  return (
    <div className="flex flex-col justify-center w-full p-6 bg-white border-t-4 border-gray-600 rounded-md shadow-md border-top lg:max-w-lg">
      <h2 className="input-group inline-block mt-20 text-center px-4 text-xl">
        Check below conversation and store information somewhere safe
        <br />
        <strong className="text-error text-sm">
          it is one-time opportunity
        </strong>
      </h2>
      <div className="card card-body">
        <DialogPart question="What is my wallet address?" answer={address} />
        <DialogPart question="aaaaaand.. private key?" answer={privateKey} />
        <DialogPart
          question="Is it everything i should know?"
          answer={`You need to store below words (mnemonic) somewhere safe:
            ${mnemonic}`}
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={() => router.push(redirect ?? "/")}
      >
        {buttonText ?? "Log me in"}
      </button>
    </div>
  );
};

export default WalletDetails;

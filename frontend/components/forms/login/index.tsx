"use client";
import { setGlobalState } from "@/components/state";
import { login } from "@/hyperfetch/auth";
import { StorageKey } from "@/types";
import { useSubmit } from "@hyper-fetch/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";

// FYI: I'm aware that localstorage can be manipulated from various scripts
// but there's no need to harden security in interview wallet app
const retrieveStoragePkOrMnemonic = () => {
  const mnemonic = localStorage.getItem(StorageKey.Mnemonic);
  const pk = localStorage.getItem(StorageKey.PrivateKey);
  return pk ?? mnemonic;
};

type Payload = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [address, setAddress] = useState<string>();
  const [payload, setPayload] = useState<Payload>({
    username: "",
    password: "",
  });
  const [addressEditable, setAddressEditable] = useState<boolean>(false);
  const { submit, onSubmitError, onSubmitSuccess } = useSubmit(login);
  const router = useRouter();
  onSubmitSuccess(({ response }) => {
    setGlobalState("wallet", response);
    setTimeout(() => {
      router.push("/wallet");
    }, 600);
  });

  onSubmitError((err) => {
    console.error(err);
  });

  useEffect(() => {
    // localstorage not defined hack for client components
    const pkOrMnemonic = retrieveStoragePkOrMnemonic();

    setAddress(localStorage.getItem(StorageKey.Address) ?? "");
    setPayload((prev) => ({ ...prev, username: pkOrMnemonic ?? "" }));
  }, []);

  //TODO: add validation for address checksum;
  const handleChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const { name, value } = ev.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  };
  const toggleAddress: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setAddressEditable(!addressEditable);
  };
  return (
    <div className="w-full p-6 bg-white border-t-4 border-gray-600 rounded-md shadow-md border-top lg:max-w-lg">
      <h1 className="text-3xl font-semibold text-center text-gray-700">
        Wallet
      </h1>
      <form className="space-y-4">
        {addressEditable ? (
          <div className="flex flex-col items-center justify-center">
            <input
              type="text"
              name="address"
              placeholder="Wallet Address"
              className="w-full input input-bordered"
              defaultValue={address ?? ""}
              onChange={handleChange}
            />
            <button
              disabled={!address}
              className="btn btn-primary mt-4"
              onClick={toggleAddress}
            >
              Confirm
            </button>
          </div>
        ) : (
          <div className="card">
            <span>Your wallet address: {address}</span>
            <button className="btn btn-primary mt-4" onClick={toggleAddress}>
              Change
            </button>
          </div>
        )}
        <div className="divider" />
        {payload.username ? (
          <label className="label flex flex-col">
            <span className="text-base label-text break-all">Private key:</span>
            <span className="text-base label-text break-all">
              {payload.username}
            </span>
          </label>
        ) : (
          <div>
            <label className="label">
              <span className="text-base label-text">Private key/Mnemonic</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter private key or mnemonic here..."
              className="w-full input input-bordered"
            />
          </div>
        )}
        <div>
          <label className="label">
            <span className="text-base label-text">Password</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            className="w-full input input-bordered"
            onChange={handleChange}
          />
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              submit({
                params: {
                  address: String(address),
                },
                data: payload,
              });
            }}
            className="btn btn-block"
          >
            Login
          </button>
        </div>
      </form>
      <div className="divider" />
      <Link href={"/register"}>
        <div className="hover hover:bg-slate-200 p-4 rounded-md cursor-pointer">
          Don&apos;t have wallet yet? Click here to create one.
        </div>
      </Link>
    </div>
  );
};

export default LoginPage;

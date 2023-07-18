"use client";
import WalletDetails from "@/components/forms/register/sub-view/wallet-details";
import { useGlobalState } from "@/components/state";
import { fetchChainsList, submitChildWallet } from "@/hyperfetch/dashboard";
import { RegisterFormStep, StorageKey } from "@/types";
import { useFetch, useSubmit } from "@hyper-fetch/react";
import { Form, Formik } from "formik";
import { useState } from "react";
import Select from "react-select";
import * as Yup from "yup";

const validationSchema = Yup.object({
  chain: Yup.string().required(),
});
const initValues = {
  chain: "",
};

const SubWalletForm = () => {
  const [wallet] = useGlobalState("wallet");
  const [formState, setFormState] = useState<RegisterFormStep>(
    RegisterFormStep.Password
  );
  const [availableChains, setAvailableChains] = useState<
    Record<string, string>[]
  >([]);
  const { onSubmitSuccess, onSubmitError, submit } =
    useSubmit(submitChildWallet);
  const { onSuccess, onError } = useFetch(fetchChainsList, {
    disabled: !wallet,
    dependencies: [wallet],
  });

  onSuccess(({ response }) => setAvailableChains(response));
  onSubmitSuccess(({ response }) => {
    const detailedKey = response.chain.toLowerCase() + "_";
    localStorage.setItem(detailedKey + StorageKey.Address, response.address);
    localStorage.setItem(detailedKey + StorageKey.Mnemonic, response.mnemonic);
    localStorage.setItem(
      detailedKey + StorageKey.PrivateKey,
      response.privateKey
    );
    setResult(response);
  });

  onSubmitError((err) => console.error(err));
  onError((err) => console.error(err));

  const [result, setResult] = useState({
    address: "",
    mnemonic: "",
    privateKey: "",
    chain: "",
  });
  const handleSubmit = async (values: typeof initValues) => {
    await submit({ data: values });
    setFormState(RegisterFormStep.Remember);
  };

  return formState === RegisterFormStep.Password ? (
    <Formik
      initialValues={initValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnBlur
    >
      {({ isValid, setFieldValue }) => {
        return (
          <Form className="flex flex-col justify-center w-full p-6 bg-white border-t-4 border-gray-600 rounded-md shadow-md border-top lg:max-w-lg">
            <h2 className="input-group col-start-1 col-end-4 mt-20 flex justify-center px-4 pt-8 text-2xl">
              Add new child wallet
            </h2>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isSearchable={true}
              name="color"
              options={availableChains}
              onChange={(newValue) => setFieldValue("chain", newValue?.value)}
            />
            <button
              disabled={!isValid}
              type="submit"
              className={
                "bg btn mt-10 w-auto justify-self-center bg-slate-400 text-black hover:text-white self-center"
              }
            >
              Add new wallet
            </button>
          </Form>
        );
      }}
    </Formik>
  ) : (
    <WalletDetails
      {...result}
      redirect="/wallet"
      buttonText="Go to dashboard"
    />
  );
};

export default SubWalletForm;

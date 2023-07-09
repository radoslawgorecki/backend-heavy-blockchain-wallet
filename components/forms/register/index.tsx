"use client";
import { register } from "@/hyperfetch/auth";
import { RegisterFormStep, StorageKey } from "@/types";
import { useSubmit } from "@hyper-fetch/react";
import { FormikValues } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import NewWalletForm from "./sub-view/new-wallet-form";
import WalletDetails from "./sub-view/wallet-details";

const initValues = {
  password: "",
  passwordConfirmation: "",
} as const;

const validationSchema = Yup.object({
  password: Yup.string().required().min(8),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords doesn't match")
    .required()
    .min(8),
});

const RegisterForm = () => {
  const [formState, setFormState] = useState<RegisterFormStep>(
    RegisterFormStep.Password
  );
  const [result, setResult] = useState({
    mnemonic: "",
    address: "",
    privateKey: "",
  });
  const { submit, onSubmitError, onSubmitSuccess } = useSubmit(register);

  onSubmitSuccess(({ response }) => {
    localStorage.setItem(StorageKey.Address, response.address);
    localStorage.setItem(StorageKey.Mnemonic, response.mnemonic);
    localStorage.setItem(StorageKey.PrivateKey, response.privateKey);
    setResult(response);
    setTimeout(() => {
      setFormState(RegisterFormStep.Remember);
    }, 400);
  });

  onSubmitError((err) => console.log(err));
  const handleSubmit = async (values: FormikValues) => {
    if (values.password !== values.passwordConfirmation) return;
    submit({ data: { password: values.password } });
  };
  return formState === RegisterFormStep.Password ? (
    <NewWalletForm
      initValues={initValues}
      handleSubmit={handleSubmit}
      validationSchema={validationSchema}
    />
  ) : (
    <WalletDetails {...result} />
  );
};

export default RegisterForm;

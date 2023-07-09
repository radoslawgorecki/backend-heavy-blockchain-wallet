"use client";
import { RegisterFormStep } from "@/types";
import React, { useState } from "react";
import NewWalletForm from "../register/sub-view/new-wallet-form";
import WalletDetails from "../register/sub-view/wallet-details";
import * as Yup from "yup";
import { FormikValues } from "formik";
import InputElement from "@/components/ui/input-element";

const validationSchema = Yup.object({
  password: Yup.string().required().min(8),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords doesn't match")
    .required()
    .min(8),
});
const initValues = {
  password: "",
  chain: "",
};

const SubWalletForm = () => {
  const [formState, setFormState] = useState<RegisterFormStep>(
    RegisterFormStep.Password
  );
  const [result, setResult] = useState({
    address: "",
    mnemonic: "",
    privateKey: "",
  });
  const handleSubmit = async (values: FormikValues) => {
    debugger;
  };

  return formState === RegisterFormStep.Password ? (
    <>
      <NewWalletForm
        initValues={initValues}
        handleSubmit={handleSubmit}
        validationSchema={validationSchema}
      />
    </>
  ) : (
    <WalletDetails {...result} />
  );
};

export default SubWalletForm;

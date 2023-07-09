"use client";
import InputElement from "@/components/ui/input-element";
import { Formik, Form, FormikValues } from "formik";
import Link from "next/link";
import React, { FC } from "react";

const NewWalletForm: FC<{
  handleSubmit: (values: FormikValues) => Promise<void>;
  initValues: FormikValues;
  validationSchema: any; //formik x yup "any"
}> = ({ handleSubmit, validationSchema, initValues }) => {
  return (
    <Formik
      initialValues={initValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnBlur
    >
      {({ values, isValid, handleChange, errors, handleBlur, touched }) => {
        return (
          <Form className="flex flex-col justify-center w-full p-6 bg-white border-t-4 border-gray-600 rounded-md shadow-md border-top lg:max-w-lg">
            <h2 className="input-group col-start-1 col-end-4 mt-20 flex justify-center px-4 pt-8 text-2xl">
              Signup form
            </h2>
            <InputElement
              label="Password"
              name="password"
              type="password"
              handleBlur={handleBlur}
              handleChange={handleChange}
              value={values.password}
              error={errors.password && String(errors.password)}
              touched={!!touched.password}
              autoComplete="new-password"
            />
            <InputElement
              label="Confirm your password"
              type="password"
              name="passwordConfirmation"
              handleBlur={handleBlur}
              handleChange={handleChange}
              value={values.passwordConfirmation}
              error={
                errors.passwordConfirmation &&
                String(errors.passwordConfirmation)
              }
              touched={!!touched.passwordConfirmation}
              autoComplete="new-password"
            />
            <button
              disabled={!isValid}
              type="submit"
              className={
                "bg btn mt-10 w-1/3 justify-self-center bg-slate-400 text-black hover:text-white self-center"
              }
            >
              Signup
            </button>
            <div className="divider"></div>
            <Link href={"/"}>
              <div className="mt-4 hover hover:bg-slate-200 p-4 rounded-md cursor-pointer text-center">
                Already got an account? Login here.
              </div>
            </Link>
          </Form>
        );
      }}
    </Formik>
  );
};

export default NewWalletForm;

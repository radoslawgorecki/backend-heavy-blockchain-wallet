"use client";
import { FormikHandlers } from "formik";
import React from "react";

const InputElement: React.FC<{
  handleBlur: FormikHandlers["handleBlur"];
  handleChange: FormikHandlers["handleChange"];
  value: string | number;
  label: string;
  name: string;
  type: string;
  error?: string;
  touched?: boolean;
  autoComplete?: string;
}> = ({
  handleBlur,
  handleChange,
  value,
  error,
  touched,
  label,
  name,
  type,
  autoComplete,
}) => {
  return (
    <div className="relative form-control col-start-2 col-end-3 mt-4 w-full cursor-default justify-self-center hover:bg-transparent">
      <label className="label">
        <span className="text-base label-text">{label}</span>
      </label>
      <input
        name={name}
        type={type}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
        className="input-bordered input w-full"
        autoComplete={autoComplete}
      />
      {error && touched ? (
        <span className="absolute -bottom-6 pl-2 text-red-500 text-sm">
          {error}
        </span>
      ) : null}
    </div>
  );
};

export default InputElement;

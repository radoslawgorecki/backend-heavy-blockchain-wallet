"use client";
import React, { FC } from "react";
import { binanceCurrencyIcons, binanceCryptoIcons } from "binance-icons";
const CurrencyIcon: FC<{ currency: string; fiat?: boolean }> = ({
  currency,
  fiat,
}) => {
  let icon;
  if (fiat) {
    icon = binanceCurrencyIcons.get(currency?.toLowerCase());
  } else {
    icon = binanceCryptoIcons.get(currency?.toLowerCase());
  }
  if (!icon) return null;
  return (
    <div className="avatar online">
      <div dangerouslySetInnerHTML={{ __html: icon }}></div>
    </div>
  );
};

export default CurrencyIcon;

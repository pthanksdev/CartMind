import React, { createContext, useContext, useState } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "NGN" | "CAD" | "AUD" | "JPY" | "INR" | "AED";

export const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number }> = {
  USD: { symbol: "$", rate: 1.0 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
  NGN: { symbol: "₦", rate: 1550.0 },
  CAD: { symbol: "CA$", rate: 1.36 },
  AUD: { symbol: "A$", rate: 1.52 },
  JPY: { symbol: "¥", rate: 155.0 },
  INR: { symbol: "₹", rate: 83.5 },
  AED: { symbol: "AED", rate: 3.67 },
};

type CurrencyContextType = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const formatPrice = (amountInUSD: number): string => {
    const config = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
    const converted = amountInUSD * config.rate;
    if (currency === "JPY") {
      return `${config.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${config.symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useMobileCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useMobileCurrency must be used within a CurrencyProvider");
  }
  return context;
};

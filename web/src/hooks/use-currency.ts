import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CurrencyInfo = {
  code: string;
  symbol: string;
  name: string;
  rate: number; // exchange rate relative to 1 USD
  flag: string;
};

export const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", rate: 1.0, flag: "🇺🇸" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92, flag: "🇪🇺" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79, flag: "🇬🇧" },
  NGN: { code: "NGN", symbol: "₦", name: "Nigerian Naira", rate: 1500.0, flag: "🇳🇬" },
  CAD: { code: "CAD", symbol: "CA$", name: "Canadian Dollar", rate: 1.36, flag: "🇨🇦" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.52, flag: "🇦🇺" },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 155.0, flag: "🇯🇵" },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.5, flag: "🇮🇳" },
  AED: { code: "AED", symbol: "AED ", name: "UAE Dirham", rate: 3.67, flag: "🇦🇪" },
};

type CurrencyStore = {
  currentCurrency: string; // e.g. "USD"
  setCurrency: (code: string) => void;
  formatPrice: (usdAmount: number) => string;
};

export const useCurrency = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currentCurrency: "USD",
      setCurrency: (code: string) => {
        if (CURRENCIES[code]) {
          set({ currentCurrency: code });
        }
      },
      formatPrice: (usdAmount: number) => {
        const code = get().currentCurrency;
        const curr = CURRENCIES[code] || CURRENCIES.USD;
        const converted = usdAmount * curr.rate;

        try {
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: curr.code,
            maximumFractionDigits: curr.code === "JPY" ? 0 : 2,
          }).format(converted);
        } catch {
          return `${curr.symbol}${converted.toFixed(curr.code === "JPY" ? 0 : 2)}`;
        }
      },
    }),
    {
      name: "storefast_selected_currency",
    }
  )
);

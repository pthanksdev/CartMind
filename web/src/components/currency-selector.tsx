import { useCurrency, CURRENCIES } from "@/hooks/use-currency";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";

export const CurrencySelector = () => {
  const currentCurrency = useCurrency((state) => state.currentCurrency);
  const setCurrency = useCurrency((state) => state.setCurrency);

  const active = CURRENCIES[currentCurrency] || CURRENCIES.USD;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground transition hover:bg-accent focus:outline-none"
        >
          <span className="text-sm">{active.flag}</span>
          <span>{active.code}</span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 max-h-64 overflow-y-auto">
        <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Globe className="size-3" /> Select Store Currency
        </div>
        {Object.values(CURRENCIES).map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr.code)}
            className={`flex items-center justify-between cursor-pointer text-xs ${
              curr.code === currentCurrency ? "bg-accent font-bold text-primary" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{curr.flag}</span>
              <span>{curr.name}</span>
            </div>
            <span className="font-mono text-muted-foreground">{curr.symbol}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

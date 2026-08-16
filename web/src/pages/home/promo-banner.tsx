import React, { useState } from "react";
import { Tag, Copy, Check, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PUBLIC_ROUTES } from "@/routes/route";
import { useQuery } from "@tanstack/react-query";
import { getActiveCouponsQueryFn } from "@/lib/api";

const PromoBanner = () => {
  const [copied, setCopied] = useState(false);

  // Fetch active promo coupons from backend PostgreSQL database
  const { data } = useQuery({
    queryKey: ["active-coupons"],
    queryFn: getActiveCouponsQueryFn,
  });

  const activeCoupons = data?.coupons ?? [];
  const primaryCoupon = activeCoupons.length > 0 ? activeCoupons[0] : null;

  const couponCode = primaryCoupon?.code ?? "WELCOME15";
  const discountLabel = primaryCoupon
    ? primaryCoupon.type === "percentage"
      ? `${primaryCoupon.discountValue}% OFF`
      : `$${primaryCoupon.discountValue} OFF`
    : "15% OFF";
  const minSpendLabel = primaryCoupon?.minSpend ? `$${primaryCoupon.minSpend}` : "$30";

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="my-10 w-full rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-950 p-8 md:p-10 text-white border border-emerald-500/30 shadow-2xl relative overflow-hidden text-center md:text-left">
      {/* Ambient Emerald Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            <Tag className="w-3.5 h-3.5" /> Live Backend Promotional Offer
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Unlock {discountLabel} Your CartMind Order
          </h2>
          <p className="text-slate-300 text-sm md:text-base mt-2 leading-relaxed">
            Experience lightning-fast grocery delivery, AI voice ordering, and guaranteed fresh quality.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Min spend {minSpendLabel}
            </span>
            <span>•</span>
            <span>Valid for online checkouts</span>
            <span>•</span>
            <span>Instant wallet discount</span>
          </div>
        </div>

        {/* Coupon Code Action Card */}
        <div className="flex flex-col items-center gap-3 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full md:w-auto min-w-[280px]">
          <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
            Use Promo Code
          </span>

          <div className="flex items-center gap-2 bg-slate-950 border border-emerald-500/40 px-4 py-2.5 rounded-xl w-full justify-between">
            <span className="font-mono text-lg font-bold text-emerald-400 tracking-wider">
              {couponCode}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
              title="Copy Coupon Code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <Button
            asChild
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 rounded-xl shadow-lg transition-all"
          >
            <Link to={PUBLIC_ROUTES.PRODUCTS} className="flex items-center justify-center gap-2">
              Start Shopping Now <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          {copied && (
            <span className="text-xs text-emerald-400 font-medium animate-pulse">
              Code copied to clipboard!
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;

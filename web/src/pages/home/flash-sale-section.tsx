import { useState, useEffect } from "react";
import { Timer, Flame, ArrowRight } from "lucide-react";
import ProductCard from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import { getProductDealsQueryFn } from "@/lib/api";
import { Link } from "react-router-dom";
import { PUBLIC_ROUTES } from "@/routes/route";

const FlashSaleSection = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 45, seconds: 30 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["flash-sale-products"],
    queryFn: () => getProductDealsQueryFn(6),
  });

  const products = data?.products ?? [];

  if (isLoading || products.length === 0) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="my-8 w-full rounded-2xl bg-gradient-to-br from-rose-950/40 via-background to-amber-950/20 p-6 border border-rose-500/20 shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Flash Sale Deals</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white uppercase tracking-wider">
                Up to 40% Off
              </span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Limited-quantity grocery discounts expiring soon.
            </p>
          </div>
        </div>

        {/* Live Ticking Countdown */}
        <div className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-xl shadow-xs">
          <Timer className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-semibold text-muted-foreground mr-1">Ends in:</span>
          <div className="flex items-center gap-1 font-mono font-bold text-sm">
            <span className="bg-rose-500 text-white px-2 py-1 rounded-md">{pad(timeLeft.hours)}</span>
            <span>:</span>
            <span className="bg-rose-500 text-white px-2 py-1 rounded-md">{pad(timeLeft.minutes)}</span>
            <span>:</span>
            <span className="bg-rose-500 text-white px-2 py-1 rounded-md">{pad(timeLeft.seconds)}</span>
          </div>
        </div>
      </div>

      {/* Grid of Flash Sale Products */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-6">
        {products.slice(0, 6).map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            slug={product.slug}
            imageUrl={product.images?.[0] || ""}
            name={product.name}
            salePrice={product.salePrice}
            originalPrice={product.originalPrice}
            discountPercent={product.discountPercent || 25}
            discountLabel={product.discountLabel || "FLASH SALE"}
            ratingAverage={product.ratingAverage}
            reviewCount={product.reviewCount}
            unit={product.unit}
            stockCount={product.stockCount}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          to={PUBLIC_ROUTES.PRODUCTS}
          className="text-xs md:text-sm font-semibold text-rose-500 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
        >
          View all flash deals <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default FlashSaleSection;

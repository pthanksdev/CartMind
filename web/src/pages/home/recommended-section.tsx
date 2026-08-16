
import { Sparkles, ThumbsUp } from "lucide-react";
import ProductCard from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import { getProductsQueryFn } from "@/lib/api";

const RecommendedSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["recommended-products"],
    queryFn: () => getProductsQueryFn({ limit: 6, page: 1 }),
  });

  const products = data?.products ?? [];

  if (isLoading || products.length === 0) return null;

  return (
    <section className="my-8 w-full rounded-2xl bg-card border border-border p-6 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Recommended For You</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" /> AI Tailored
              </span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Personalized selections based on your browsing & shopping preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            slug={product.slug}
            imageUrl={product.images?.[0] || ""}
            name={product.name}
            salePrice={product.salePrice}
            originalPrice={product.originalPrice}
            discountPercent={product.discountPercent}
            discountLabel={product.discountLabel || ""}
            ratingAverage={product.ratingAverage}
            reviewCount={product.reviewCount}
            unit={product.unit}
            stockCount={product.stockCount}
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendedSection;

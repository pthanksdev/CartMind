import { useCompare } from "@/hooks/use-compare";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/utils/helper";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart, ArrowLeft, Check, X } from "lucide-react";
import { toast } from "sonner";

const CompareProductsPage = () => {
  const { items, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product._id,
      name: product.name,
      imageUrl: product.images[0] || "",
      salePrice: product.salePrice,
      originalPrice: product.originalPrice,
      discountPercent: product.discountPercent,
      discountLabel: product.discountLabel || "",
      unit: product.unit || "piece",
      stockCount: product.stockCount,
    }, 1);
    toast.success(`${product.name} added to cart!`);
  };

  if (items.length === 0) {
    return (
      <div className="container max-w-xl py-20 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingCart className="size-8" />
        </div>
        <h2 className="text-2xl font-bold">No Products to Compare</h2>
        <p className="mt-2 text-muted-foreground">
          Browse products and click the compare icon to add items to your comparison matrix.
        </p>
        <Button asChild className="mt-6">
          <Link to="/products">Browse Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link to="/products">
              <ArrowLeft className="mr-2 size-4" /> Back to Catalog
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Compare Products ({items.length}/4)</h1>
          <p className="text-sm text-muted-foreground">
            Side-by-side feature, price, and availability comparison.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={clearCompare} className="text-destructive hover:bg-destructive/10">
          <Trash2 className="mr-2 size-4" /> Clear All
        </Button>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="p-4 text-sm font-semibold w-48 text-muted-foreground">Product</th>
              {items.map((product) => (
                <th key={product._id} className="p-4 w-64 align-top">
                  <div className="relative group">
                    <button
                      onClick={() => removeFromCompare(product._id)}
                      className="absolute right-0 top-0 size-7 rounded-full bg-background border border-border text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="size-4" />
                    </button>
                    <div className="aspect-square w-full max-w-[160px] mx-auto overflow-hidden rounded-lg bg-muted/20 mb-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>
                    <Link
                      to={`/products/${product.slug}`}
                      className="font-semibold text-foreground hover:text-primary line-clamp-2 text-sm text-center block"
                    >
                      {product.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border text-sm">
            {/* Price */}
            <tr>
              <td className="p-4 font-semibold text-muted-foreground">Sale Price</td>
              {items.map((product) => (
                <td key={product._id} className="p-4 font-bold text-primary">
                  {formatPrice(product.salePrice)}
                  {product.originalPrice > product.salePrice && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Unit / Packaging */}
            <tr>
              <td className="p-4 font-semibold text-muted-foreground">Unit Size</td>
              {items.map((product) => (
                <td key={product._id} className="p-4 capitalize">
                  {product.unit}
                </td>
              ))}
            </tr>

            {/* Availability */}
            <tr>
              <td className="p-4 font-semibold text-muted-foreground">Availability</td>
              {items.map((product) => (
                <td key={product._id} className="p-4">
                  {product.stockCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <Check className="size-3" /> In Stock ({product.stockCount})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                      <X className="size-3" /> Out of Stock
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Discount Label */}
            <tr>
              <td className="p-4 font-semibold text-muted-foreground">Offer / Discount</td>
              {items.map((product) => (
                <td key={product._id} className="p-4">
                  {product.discountPercent > 0 ? (
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                      {product.discountPercent}% OFF
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Description Summary */}
            <tr>
              <td className="p-4 font-semibold text-muted-foreground">Description</td>
              {items.map((product) => (
                <td key={product._id} className="p-4 text-xs text-muted-foreground leading-relaxed">
                  <p className="line-clamp-4">{product.description || "No description provided."}</p>
                </td>
              ))}
            </tr>

            {/* Action Buttons */}
            <tr className="bg-muted/20">
              <td className="p-4 font-semibold text-muted-foreground">Action</td>
              {items.map((product) => (
                <td key={product._id} className="p-4">
                  <Button
                    size="sm"
                    className="w-full gap-2"
                    disabled={product.stockCount <= 0}
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="size-4" /> Add to Cart
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareProductsPage;

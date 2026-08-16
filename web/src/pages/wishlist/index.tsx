import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HeartCrack, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { formatPrice } from "@/utils/helper";

const WishlistPage = () => {
  const { items, removeItem, clearWishlist } = useWishlist();
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
    toast.success(`${product.name} added to cart`);
  };

  const handleMoveAllToCart = () => {
    items.forEach((product: any) => addToCart({
      productId: product._id,
      name: product.name,
      imageUrl: product.images[0] || "",
      salePrice: product.salePrice,
      originalPrice: product.originalPrice,
      discountPercent: product.discountPercent,
      discountLabel: product.discountLabel || "",
      unit: product.unit || "piece",
      stockCount: product.stockCount,
    }, 1));
    toast.success("All items added to cart");
    clearWishlist();
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 grid size-20 place-items-center rounded-full bg-muted/50 text-muted-foreground">
          <HeartCrack className="size-10" />
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-foreground">
          Your Wishlist is Empty
        </h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          You haven't saved any items to your wishlist yet. Start exploring and save your favorites!
        </p>
        <Button asChild size="lg">
          <Link to="/products">Explore Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Wishlist
          </h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearWishlist}>
            Clear All
          </Button>
          <Button onClick={handleMoveAllToCart}>
            <ShoppingCart className="mr-2 size-4" />
            Move all to Cart
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((product) => (
          <div key={product._id} className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card">
            <Link to={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted/20">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              {product.discountPercent > 0 && (
                <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                  -{product.discountPercent}%
                </span>
              )}
            </Link>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                removeItem(product._id);
              }}
              className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full bg-background/80 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background hover:text-red-500"
              aria-label="Remove from wishlist"
            >
              <Trash2 className="size-4" />
            </button>

            <div className="flex flex-1 flex-col p-4">
              <Link to={`/products/${product.slug}`} className="mb-1 text-sm font-medium hover:underline line-clamp-2">
                {product.name}
              </Link>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="font-semibold">{formatPrice(product.salePrice)}</span>
                   {product.originalPrice > product.salePrice && (
                       <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                   )}
                </div>
                <Button size="sm" onClick={() => handleAddToCart(product)}>
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;

import { useCart } from "@/hooks/use-cart";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { ShoppingCart, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

const CartButton = () => {
  const { data: user } = useUser();
  const cartCount = useCart((state) => state.cartCount());
  const setIsCartOpen = useCart((state) => state.setIsCartOpen);

  if (user?.isAdmin) {
    return (
      <Link
        to="/admin"
        className="flex shrink-0 items-center gap-2 rounded-lg bg-green-light px-3.5 py-2 text-white font-bold transition hover:opacity-90 shadow-sm"
      >
        <LayoutDashboard className="size-5" />
        <span className="hidden text-sm sm:block">Admin Portal</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsCartOpen(true)}
      className="relative flex shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 text-foreground transition hover:bg-accent cursor-pointer"
    >
      <span className="relative">
        <ShoppingCart className="size-7 stroke-[2.3]" />
        <span
          className={cn(
            "absolute -right-3 -top-2 grid h-5 min-w-6 place-items-center rounded-full px-1.5 text-xs font-bold leading-none text-primary-foreground",
            cartCount > 0 ? "bg-green-light" : "bg-foreground"
          )}
        >
          {cartCount}
        </span>
      </span>
      <span className="hidden text-sm font-bold sm:block">Cart</span>
    </button>
  );
};

export default CartButton;

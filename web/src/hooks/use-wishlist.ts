import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductType } from "@/types/products.type";

interface WishlistStore {
  items: ProductType[];
  addItem: (product: ProductType) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items;
        if (!currentItems.find((item) => item._id === product._id)) {
          set({ items: [...currentItems, product] });
        }
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item._id !== productId),
        });
      },
      isInWishlist: (productId) => {
        return !!get().items.find((item) => item._id === productId);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "ecommerce-wishlist",
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductType } from "@/types/products.type";
import { toast } from "sonner";

interface CompareStore {
  items: ProductType[];
  addToCompare: (product: ProductType) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
}

export const useCompare = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCompare: (product) => {
        const current = get().items;
        if (current.find((item) => item._id === product._id)) {
          toast.info("Product already in comparison list");
          return;
        }
        if (current.length >= 4) {
          toast.error("You can compare up to 4 products at a time");
          return;
        }
        set({ items: [...current, product] });
        toast.success("Added to product comparison");
      },
      removeFromCompare: (productId) => {
        set({ items: get().items.filter((item) => item._id !== productId) });
        toast.info("Removed from comparison");
      },
      isInCompare: (productId) => {
        return !!get().items.find((item) => item._id === productId);
      },
      clearCompare: () => set({ items: [] }),
    }),
    {
      name: "instant-compare",
    }
  )
);

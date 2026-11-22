import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SavedState {
  productIds: string[];
  toggle: (productId: string) => void;
  isSaved: (productId: string) => boolean;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (productId) => {
        const { productIds } = get();
        set({
          productIds: productIds.includes(productId)
            ? productIds.filter((id) => id !== productId)
            : [...productIds, productId],
        });
      },
      isSaved: (productId) => get().productIds.includes(productId),
    }),
    { name: "appollo-saved", skipHydration: true }
  )
);

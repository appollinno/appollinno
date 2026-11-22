"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cart";
import { useSavedStore } from "@/lib/store/saved";

export function CartHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useSavedStore.persist.rehydrate();
  }, []);
  return null;
}

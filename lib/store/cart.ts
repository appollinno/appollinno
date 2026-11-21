import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  priceCents: number;
  image: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  couponCode: string | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addLine: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeLine: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  applyCoupon: (code: string) => void;
  clearCoupon: () => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      couponCode: null,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),
      addLine: (line, quantity = 1) => {
        const lines = [...get().lines];
        const existing = lines.find((l) => l.variantId === line.variantId);
        if (existing) {
          existing.quantity += quantity;
        } else {
          lines.push({ ...line, quantity });
        }
        set({ lines, isOpen: true });
      },
      removeLine: (variantId) =>
        set({ lines: get().lines.filter((l) => l.variantId !== variantId) }),
      setQuantity: (variantId, quantity) =>
        set({
          lines: get()
            .lines.map((l) => (l.variantId === variantId ? { ...l, quantity } : l))
            .filter((l) => l.quantity > 0),
        }),
      applyCoupon: (code) => set({ couponCode: code.toUpperCase() }),
      clearCoupon: () => set({ couponCode: null }),
      clear: () => set({ lines: [], couponCode: null }),
    }),
    { name: "appollo-cart", skipHydration: true }
  )
);

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0);
}

export const COUPONS: Record<string, number> = {
  WAKEUP10: 0.1,
  FIRSTBREW: 0.15,
};

export function cartDiscount(lines: CartLine[], couponCode: string | null) {
  if (!couponCode) return 0;
  const rate = COUPONS[couponCode];
  if (!rate) return 0;
  return Math.round(cartSubtotal(lines) * rate);
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore, cartSubtotal, cartDiscount } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const couponCode = useCartStore((s) => s.couponCode);
  const prefersReducedMotion = useReducedMotion();

  const subtotal = cartSubtotal(lines);
  const discount = cartDiscount(lines, couponCode);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-[70] bg-charcoal/50"
            onClick={close}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: prefersReducedMotion ? "tween" : "spring",
              duration: prefersReducedMotion ? 0 : undefined,
              stiffness: 320,
              damping: 34,
            }}
            className="fixed right-0 top-0 z-[75] flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-display text-xl">Your Cart</h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close cart"
                className="text-foreground-muted hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-foreground-muted">Your cart is empty.</p>
                <Link
                  href="/shop"
                  onClick={close}
                  className="bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground"
                >
                  Shop Coffee
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6 py-4">
                  {lines.map((line) => (
                    <li
                      key={line.variantId}
                      className="flex gap-4 border-b border-border py-4 last:border-none"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-surface">
                        <Image
                          src={line.image}
                          alt={line.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">{line.name}</p>
                            <p className="text-xs text-foreground-muted">
                              {line.variantLabel}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLine(line.variantId)}
                            aria-label={`Remove ${line.name} from cart`}
                            className="text-foreground-muted hover:text-foreground"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-3 border border-border px-2 py-1">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                setQuantity(line.variantId, line.quantity - 1)
                              }
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-4 text-center text-sm">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                setQuantity(line.variantId, line.quantity + 1)
                              }
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <p className="text-sm font-medium">
                            {formatPrice(line.priceCents * line.quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border px-6 py-5">
                  <div className="flex justify-between text-sm text-foreground-muted">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="mt-1 flex justify-between text-sm text-accent">
                      <span>Coupon ({couponCode})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="mt-2 flex justify-between font-display text-lg">
                    <span>Total</span>
                    <span>{formatPrice(subtotal - discount)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="mt-5 block w-full bg-primary py-3 text-center text-sm font-semibold uppercase tracking-wide text-primary-foreground"
                  >
                    Checkout
                  </Link>
                  <p className="mt-3 text-center text-xs text-foreground-muted">
                    Shipping and taxes calculated at checkout.
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function AddToCartForm({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const addLine = useCartStore((s) => s.addLine);

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const outOfStock = variant.stock <= 0;

  return (
    <div>
      <fieldset>
        <legend className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
          Weight
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVariantId(v.id)}
              disabled={v.stock <= 0}
              className={`border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                v.id === variantId
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:border-foreground"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 flex items-center gap-4">
        <p className="font-display text-3xl">{formatPrice(variant.priceCents)}</p>
        {variant.stock > 0 && variant.stock <= 15 && (
          <span className="text-sm text-accent">Only {variant.stock} left</span>
        )}
        {outOfStock && <span className="text-sm text-foreground-muted">Out of stock</span>}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex items-center border border-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="px-3 py-3"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus size={14} />
          </button>
          <span className="min-w-8 text-center text-sm">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="px-3 py-3"
            onClick={() => setQuantity((q) => Math.min(variant.stock, q + 1))}
          >
            <Plus size={14} />
          </button>
        </div>

        <Button
          type="button"
          disabled={outOfStock}
          className="flex-1"
          onClick={() =>
            addLine(
              {
                productId: product.id,
                variantId: variant.id,
                name: product.name,
                variantLabel: variant.label,
                priceCents: variant.priceCents,
                image: product.images[0].url,
              },
              quantity
            )
          }
        >
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { ShopExplorer } from "@/components/shop/ShopExplorer";
import { PRODUCTS } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Shop Specialty Coffee",
  description:
    "Browse Appollo's single-origin coffees, blends, and decaf — ethically sourced, roasted in small batches.",
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-28 md:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          The Full Catalog
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight-display md:text-5xl">
          Shop Coffee
        </h1>
        <p className="mt-4 text-foreground-muted">
          Single-origin lots, house blends, and a Swiss Water decaf — all
          roasted to order and shipped within days.
        </p>
      </div>

      <div className="mt-10">
        <ShopExplorer products={PRODUCTS} />
      </div>
    </div>
  );
}

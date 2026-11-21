import { ProductCard } from "@/components/shop/ProductCard";
import type { Product } from "@/lib/types";

export function FeaturedCollection({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Featured Collection
          </p>
          <h2 className="mt-2 font-display text-4xl tracking-tight-display md:text-5xl">
            This Season&apos;s Lots
          </h2>
        </div>
        <p className="max-w-sm text-sm text-foreground-muted">
          A rotating edit of our most distinctive single-origins and blends —
          chosen for flavour, limited by harvest.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

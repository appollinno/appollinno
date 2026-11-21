import { ProductCard } from "@/components/shop/ProductCard";
import type { Product } from "@/lib/types";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="mt-20 border-t border-border pt-10">
      <h2 className="font-display text-2xl">You Might Also Like</h2>
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

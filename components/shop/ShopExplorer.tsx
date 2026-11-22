"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/data/products";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

const SORT_LABELS: Record<SortKey, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Highest Rated",
};

function ExplorerInner({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "All";
  const [category, setCategory] = useState<string>(initialCategory);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    let list = products;
    if (category !== "All") {
      list = list.filter((p) => p.category === category);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.tastingNotes.some((n) => n.toLowerCase().includes(q))
      );
    }
    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.variants[0].priceCents - b.variants[0].priceCents);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.variants[0].priceCents - a.variants[0].priceCents);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return sorted;
  }, [products, category, query, sort]);

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
            />
            <input
              id="shop-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search coffee, notes…"
              aria-label="Search products"
              className="w-56 border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus-visible:border-primary"
            />
          </div>
          <label className="sr-only" htmlFor="shop-sort">
            Sort products
          </label>
          <select
            id="shop-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary"
          >
            {Object.entries(SORT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="py-4 text-sm text-foreground-muted">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
      </p>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-foreground-muted">
          No coffee matches that search — try another term or category.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ShopExplorer({ products }: { products: Product[] }) {
  return (
    <Suspense fallback={<div className="py-16 text-center text-foreground-muted">Loading coffee…</div>}>
      <ExplorerInner products={products} />
    </Suspense>
  );
}

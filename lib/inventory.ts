import { PRODUCTS } from "@/lib/data/products";
import { readStore, withStore } from "@/lib/server-store";

// File-backed inventory overlay on top of the static PRODUCTS catalog (see
// lib/server-store.ts for why — a module-level Map isn't reliably shared
// between the admin API route and the pages that read it back). Replace
// with the `inventory` table (supabase/migrations/0001_init.sql) once a
// real database is connected.
// Keyed by SKU, the one globally-unique variant identifier — variant `id`
// values (e.g. "250g") repeat across products.
const STORE_NAME = "inventory-overrides";

function load(): Record<string, number> {
  return readStore<Record<string, number>>(STORE_NAME, {});
}

export function getStock(sku: string, baseStock: number) {
  const overrides = load();
  return sku in overrides ? overrides[sku] : baseStock;
}

export function adjustStock(sku: string, baseStock: number, delta: number) {
  return withStore<Record<string, number>, number>(STORE_NAME, {}, (overrides) => {
    const current = sku in overrides ? overrides[sku] : baseStock;
    const next = Math.max(0, current + delta);
    return { next: { ...overrides, [sku]: next }, result: next };
  });
}

export function listInventory() {
  const overrides = load();
  return PRODUCTS.flatMap((product) =>
    product.variants.map((variant) => ({
      productId: product.id,
      productName: product.name,
      sku: variant.sku,
      label: variant.label,
      stock: variant.sku in overrides ? overrides[variant.sku] : variant.stock,
      reorderThreshold: 10,
    }))
  );
}

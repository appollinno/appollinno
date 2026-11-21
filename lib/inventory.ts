import { PRODUCTS } from "@/lib/data/products";

// Mutable, in-memory inventory overlay on top of the static PRODUCTS catalog.
// Replace with the `inventory` table (supabase/migrations/0001_init.sql)
// once a real database is connected — writes here do not persist across
// server restarts or multiple instances.
// Keyed by SKU, the one globally-unique variant identifier — variant `id`
// values (e.g. "250g") repeat across products.
const stockOverrides = new Map<string, number>();

export function getStock(sku: string, baseStock: number) {
  return stockOverrides.has(sku) ? stockOverrides.get(sku)! : baseStock;
}

export function adjustStock(sku: string, baseStock: number, delta: number) {
  const current = getStock(sku, baseStock);
  const next = Math.max(0, current + delta);
  stockOverrides.set(sku, next);
  return next;
}

export function listInventory() {
  return PRODUCTS.flatMap((product) =>
    product.variants.map((variant) => ({
      productId: product.id,
      productName: product.name,
      sku: variant.sku,
      label: variant.label,
      stock: getStock(variant.sku, variant.stock),
      reorderThreshold: 10,
    }))
  );
}

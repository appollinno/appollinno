import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";
import { PRODUCTS } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

async function ProductsContent() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Products</h1>
        <p className="text-xs text-foreground-muted">
          {PRODUCTS.length} products catalogued
        </p>
      </div>
      <p className="mt-1 text-sm text-foreground-muted">
        Catalog is defined in lib/data/products.ts. Full create/edit/delete
        will move here once the `products` table (supabase/migrations) is
        connected — for now, manage stock levels from the Inventory tab.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-foreground-muted">
              <th className="py-2 font-medium">Product</th>
              <th className="py-2 font-medium">Category</th>
              <th className="py-2 font-medium">Roast</th>
              <th className="py-2 font-medium">From</th>
              <th className="py-2 font-medium">Rating</th>
              <th className="py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p) => (
              <tr key={p.id} className="border-b border-border">
                <td className="py-3 font-medium">{p.name}</td>
                <td className="py-3 text-foreground-muted">{p.category}</td>
                <td className="py-3 text-foreground-muted">{p.roastLevel}</td>
                <td className="py-3">{formatPrice(p.variants[0].priceCents)}</td>
                <td className="py-3">
                  {p.rating.toFixed(1)} ({p.reviewCount})
                </td>
                <td className="py-3 text-right">
                  <Link href={`/shop/${p.slug}`} className="text-xs underline">
                    View on site
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-foreground-muted">Loading…</div>}>
      <ProductsContent />
    </Suspense>
  );
}

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";
import { listOrders } from "@/lib/orders";
import { PRODUCTS } from "@/lib/data/products";
import { listUsers } from "@/lib/auth/store";
import { formatPrice } from "@/lib/utils";

async function OverviewContent() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const orders = listOrders();
  const revenueCents = orders.reduce((sum, o) => sum + o.totalCents, 0);
  const aovCents = orders.length ? Math.round(revenueCents / orders.length) : 0;
  const customerCount = listUsers().filter((u) => u.role === "customer").length;

  const salesByProduct = new Map<string, number>();
  for (const order of orders) {
    for (const item of order.items) {
      salesByProduct.set(item.name, (salesByProduct.get(item.name) ?? 0) + item.quantity);
    }
  }
  const topProducts = Array.from(salesByProduct.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const lowStock = PRODUCTS.flatMap((p) =>
    p.variants
      .filter((v) => v.stock > 0 && v.stock <= 15)
      .map((v) => ({ product: p.name, variant: v.label, stock: v.stock }))
  );

  return (
    <AdminShell>
      <h1 className="font-display text-2xl">Sales Overview</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Live for this server session — placing a test order updates these
        numbers immediately.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue (session)" value={formatPrice(revenueCents)} />
        <StatCard label="Orders" value={String(orders.length)} />
        <StatCard label="Avg. Order Value" value={formatPrice(aovCents)} />
        <StatCard label="Registered Customers" value={String(customerCount)} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="border border-border p-6">
          <h2 className="font-display text-lg">Top Products (by units sold)</h2>
          {topProducts.length === 0 ? (
            <p className="mt-4 text-sm text-foreground-muted">
              No orders placed yet this session.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {topProducts.map(([name, qty]) => {
                const max = topProducts[0][1];
                return (
                  <li key={name}>
                    <div className="flex justify-between text-sm">
                      <span>{name}</span>
                      <span className="text-foreground-muted">{qty} sold</span>
                    </div>
                    <div className="mt-1 h-2 bg-surface">
                      <div
                        className="h-2 bg-primary"
                        style={{ width: `${(qty / max) * 100}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border border-border p-6">
          <h2 className="font-display text-lg">Low Stock Alerts</h2>
          {lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-foreground-muted">
              All variants are healthily stocked.
            </p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm">
              {lowStock.map((item, i) => (
                <li key={i} className="flex justify-between border-b border-border pb-2">
                  <span>
                    {item.product} <span className="text-foreground-muted">({item.variant})</span>
                  </span>
                  <span className="text-accent">{item.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border p-5">
      <p className="text-xs uppercase tracking-wide text-foreground-muted">{label}</p>
      <p className="mt-2 font-display text-2xl">{value}</p>
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<div className="p-10 text-foreground-muted">Loading…</div>}>
      <OverviewContent />
    </Suspense>
  );
}

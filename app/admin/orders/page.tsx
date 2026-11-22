import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { listOrders } from "@/lib/orders";

async function OrdersContent() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <AdminShell>
      <h1 className="font-display text-2xl">Orders</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Update fulfillment status as orders are packed and shipped.
      </p>
      <OrdersTable initialOrders={listOrders()} />
    </AdminShell>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-10 text-foreground-muted">Loading…</div>}>
      <OrdersContent />
    </Suspense>
  );
}

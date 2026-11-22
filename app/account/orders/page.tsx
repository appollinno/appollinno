import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AccountNav } from "@/components/account/AccountNav";
import { MOCK_ORDER_HISTORY } from "@/lib/data/mock-order-history";
import { formatPrice } from "@/lib/utils";

async function OrdersContent() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-5xl px-5 py-28 md:px-8">
      <h1 className="font-display text-3xl">My Account</h1>
      <div className="mt-10 flex flex-col gap-10 md:flex-row">
        <AccountNav userName={user.name} />
        <div className="flex-1">
          <h2 className="font-display text-xl">Order History</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-foreground-muted">
                  <th className="py-2 font-medium">Order</th>
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium">Items</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ORDER_HISTORY.map((order) => (
                  <tr key={order.orderNumber} className="border-b border-border">
                    <td className="py-3 font-medium">{order.orderNumber}</td>
                    <td className="py-3 text-foreground-muted">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 text-foreground-muted">{order.items}</td>
                    <td className="py-3">
                      <span className="bg-surface px-2 py-1 text-xs uppercase tracking-wide">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">{formatPrice(order.totalCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={<div className="px-5 py-28 text-center text-foreground-muted">Loading…</div>}
    >
      <OrdersContent />
    </Suspense>
  );
}

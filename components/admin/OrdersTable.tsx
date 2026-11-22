"use client";

import { useState } from "react";
import type { Order } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

const STATUS_OPTIONS: Order["fulfillmentStatus"][] = [
  "pending",
  "fulfilled",
  "shipped",
  "delivered",
];

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateStatus(id: string, status: Order["fulfillmentStatus"]) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? data.order : o)));
    } finally {
      setUpdating(null);
    }
  }

  if (orders.length === 0) {
    return (
      <p className="mt-6 text-sm text-foreground-muted">
        No orders placed yet this server session. Place a test order through
        the storefront checkout to see it appear here.
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-foreground-muted">
            <th className="py-2 font-medium">Order</th>
            <th className="py-2 font-medium">Customer</th>
            <th className="py-2 font-medium">Items</th>
            <th className="py-2 font-medium">Total</th>
            <th className="py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border">
              <td className="py-3 font-medium">{order.orderNumber}</td>
              <td className="py-3 text-foreground-muted">
                {order.shippingAddress.fullName}
                <br />
                <span className="text-xs">{order.shippingAddress.email}</span>
              </td>
              <td className="py-3 text-foreground-muted">
                {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
              </td>
              <td className="py-3">{formatPrice(order.totalCents)}</td>
              <td className="py-3">
                <select
                  value={order.fulfillmentStatus}
                  disabled={updating === order.id}
                  onChange={(e) =>
                    updateStatus(order.id, e.target.value as Order["fulfillmentStatus"])
                  }
                  className="border border-border bg-background px-2 py-1 text-xs capitalize outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

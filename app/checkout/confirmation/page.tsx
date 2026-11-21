"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/orders";

export default function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("appollo-last-order");
    if (raw) {
      try {
        setOrder(JSON.parse(raw));
      } catch {
        setOrder(null);
      }
    }
    setChecked(true);
  }, []);

  if (checked && !order) {
    return (
      <div className="mx-auto max-w-xl px-5 py-28 text-center md:px-8">
        <h1 className="font-display text-3xl">No recent order found</h1>
        <p className="mt-3 text-foreground-muted">
          We couldn&apos;t find an order for this session.
        </p>
        <Button href="/shop" className="mt-8">
          Shop Coffee
        </Button>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="mx-auto max-w-2xl px-5 py-28 text-center md:px-8">
      <CheckCircle2 size={48} className="mx-auto text-accent" />
      <h1 className="mt-4 font-display text-3xl md:text-4xl">Order Confirmed</h1>
      <p className="mt-3 text-foreground-muted">
        Thank you — your order <span className="font-semibold">{order.orderNumber}</span>{" "}
        has been placed. A confirmation has been sent to {order.shippingAddress.email}.
      </p>

      <div className="mt-10 border border-border p-6 text-left">
        <h2 className="font-display text-lg">Order Summary</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between">
              <span className="text-foreground-muted">
                {item.name} ({item.variantLabel}) × {item.quantity}
              </span>
              <span>{formatPrice(item.unitPriceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4 font-display text-lg">
          <span>Total</span>
          <span>{formatPrice(order.totalCents)}</span>
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-4">
        <Button href="/shop" variant="secondary">
          Continue Shopping
        </Button>
        <Button href="/account/orders">View Order History</Button>
      </div>
    </div>
  );
}

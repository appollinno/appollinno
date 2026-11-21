import { readStore, withStore } from "@/lib/server-store";

export interface OrderItem {
  name: string;
  variantLabel: string;
  unitPriceCents: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  couponCode: string | null;
  shippingAddress: {
    fullName: string;
    email: string;
    line1: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: "card" | "paypal";
  paymentStatus: "paid";
  fulfillmentStatus: "pending" | "fulfilled" | "shipped" | "delivered";
  createdAt: string;
}

// File-backed store for the demo/mock checkout flow (see
// lib/server-store.ts for why — a plain module-level Map isn't reliably
// shared between the checkout route and the pages that read it back).
// Replace with the `orders` table (supabase/migrations/0001_init.sql) once
// a real database and payment provider are connected.
const STORE_NAME = "orders";

function load(): Order[] {
  return readStore<Order[]>(STORE_NAME, []);
}

export function createOrder(order: Order) {
  return withStore<Order[], Order>(STORE_NAME, [], (orders) => ({
    next: [...orders, order],
    result: order,
  }));
}

export function getOrder(id: string) {
  return load().find((o) => o.id === id);
}

export function listOrders() {
  return load().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function updateOrderStatus(id: string, status: Order["fulfillmentStatus"]) {
  return withStore<Order[], Order | null>(STORE_NAME, [], (orders) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return { next: orders, result: null };
    const updated = { ...order, fulfillmentStatus: status };
    return {
      next: orders.map((o) => (o.id === id ? updated : o)),
      result: updated,
    };
  });
}

export function generateOrderNumber() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `APC-${n}`;
}

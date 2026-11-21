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

// In-memory store for the demo/mock checkout flow. Ephemeral — replace with
// the `orders` table (see supabase/migrations/0001_init.sql) once a real
// database and payment provider are connected.
const orders = new Map<string, Order>();

export function createOrder(order: Order) {
  orders.set(order.id, order);
  return order;
}

export function getOrder(id: string) {
  return orders.get(id);
}

export function listOrders() {
  return Array.from(orders.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function updateOrderStatus(id: string, status: Order["fulfillmentStatus"]) {
  const order = orders.get(id);
  if (!order) return null;
  order.fulfillmentStatus = status;
  return order;
}

export function generateOrderNumber() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `APC-${n}`;
}

import { NextResponse } from "next/server";
import { createOrder, generateOrderNumber, type OrderItem } from "@/lib/orders";
import { COUPONS } from "@/lib/store/cart";

interface CheckoutLine {
  name: string;
  variantLabel: string;
  priceCents: number;
  quantity: number;
}

interface CheckoutBody {
  lines: CheckoutLine[];
  couponCode?: string | null;
  paymentMethod: "card" | "paypal";
  shippingAddress: {
    fullName: string;
    email: string;
    line1: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
}

const SHIPPING_FLAT_CENTS = 600;
const FREE_SHIPPING_THRESHOLD_CENTS = 5000;

export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!Array.isArray(body.lines) || body.lines.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  const addr = body.shippingAddress;
  if (!addr?.fullName || !addr?.email || !addr?.line1 || !addr?.city || !addr?.postalCode || !addr?.country) {
    return NextResponse.json({ error: "Missing shipping details" }, { status: 400 });
  }
  if (body.paymentMethod !== "card" && body.paymentMethod !== "paypal") {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }

  // Recompute totals server-side rather than trusting client-supplied totals.
  const items: OrderItem[] = body.lines.map((l) => ({
    name: l.name,
    variantLabel: l.variantLabel,
    unitPriceCents: l.priceCents,
    quantity: l.quantity,
  }));
  const subtotalCents = items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);

  const couponCode = body.couponCode?.toUpperCase() || null;
  const discountRate = couponCode ? COUPONS[couponCode] ?? 0 : 0;
  const discountCents = Math.round(subtotalCents * discountRate);

  const shippingCents =
    subtotalCents - discountCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;
  const totalCents = subtotalCents - discountCents + shippingCents;

  // TODO: integrate a real payment provider (Stripe/PayPal sandbox) here.
  // Until credentials are provided, the order is recorded as paid in this
  // mock flow so the rest of the e-commerce experience can be exercised
  // end-to-end (order confirmation, admin order management, etc).
  const order = createOrder({
    id: crypto.randomUUID(),
    orderNumber: generateOrderNumber(),
    items,
    subtotalCents,
    discountCents,
    shippingCents,
    totalCents,
    couponCode,
    shippingAddress: addr,
    paymentMethod: body.paymentMethod,
    paymentStatus: "paid",
    fulfillmentStatus: "pending",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ order });
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore, cartSubtotal, cartDiscount, COUPONS } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";

type Step = "shipping" | "payment" | "review";

const STEPS: Step[] = ["shipping", "payment", "review"];
const SHIPPING_FLAT_CENTS = 600;
const FREE_SHIPPING_THRESHOLD_CENTS = 5000;

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const couponCode = useCartStore((s) => s.couponCode);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const clearCoupon = useCartStore((s) => s.clearCoupon);
  const clearCart = useCartStore((s) => s.clear);

  const [step, setStep] = useState<Step>("shipping");
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    line1: "",
    city: "",
    region: "",
    postalCode: "",
    country: "United States",
  });

  const subtotal = cartSubtotal(lines);
  const discount = cartDiscount(lines, couponCode);
  const shippingCents =
    subtotal - discount >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;
  const total = subtotal - discount + shippingCents;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-28 text-center md:px-8">
        <h1 className="font-display text-3xl">Your cart is empty</h1>
        <p className="mt-3 text-foreground-muted">
          Add some coffee before heading to checkout.
        </p>
        <Button href="/shop" className="mt-8">
          Shop Coffee
        </Button>
      </div>
    );
  }

  function handleCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (!COUPONS[code]) {
      setCouponError("That code isn't valid.");
      return;
    }
    applyCoupon(code);
    setCouponError("");
  }

  function handleShippingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("payment");
  }

  async function handlePlaceOrder() {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            name: l.name,
            variantLabel: l.variantLabel,
            priceCents: l.priceCents,
            quantity: l.quantity,
          })),
          couponCode,
          paymentMethod,
          shippingAddress: shipping,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");

      sessionStorage.setItem("appollo-last-order", JSON.stringify(data.order));
      clearCart();
      router.push(`/checkout/confirmation?order=${data.order.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-28 md:px-8">
      <h1 className="font-display text-3xl md:text-4xl">Checkout</h1>

      <ol className="mt-6 flex gap-6 text-sm">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={`flex items-center gap-2 ${
              step === s ? "text-foreground" : "text-foreground-muted"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                STEPS.indexOf(step) > i
                  ? "border-primary bg-primary text-primary-foreground"
                  : step === s
                    ? "border-primary"
                    : "border-border"
              }`}
            >
              {STEPS.indexOf(step) > i ? <Check size={12} /> : i + 1}
            </span>
            <span className="capitalize">{s}</span>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          {step === "shipping" && (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <h2 className="font-display text-xl">Shipping Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  value={shipping.fullName}
                  onChange={(v) => setShipping((s) => ({ ...s, fullName: v }))}
                  required
                />
                <Field
                  label="Email"
                  type="email"
                  value={shipping.email}
                  onChange={(v) => setShipping((s) => ({ ...s, email: v }))}
                  required
                />
              </div>
              <Field
                label="Address"
                value={shipping.line1}
                onChange={(v) => setShipping((s) => ({ ...s, line1: v }))}
                required
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label="City"
                  value={shipping.city}
                  onChange={(v) => setShipping((s) => ({ ...s, city: v }))}
                  required
                />
                <Field
                  label="State / Region"
                  value={shipping.region}
                  onChange={(v) => setShipping((s) => ({ ...s, region: v }))}
                />
                <Field
                  label="Postal code"
                  value={shipping.postalCode}
                  onChange={(v) => setShipping((s) => ({ ...s, postalCode: v }))}
                  required
                />
              </div>
              <Field
                label="Country"
                value={shipping.country}
                onChange={(v) => setShipping((s) => ({ ...s, country: v }))}
                required
              />
              <Button type="submit" className="mt-4">
                Continue to Payment
              </Button>
            </form>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <h2 className="font-display text-xl">Payment</h2>
              <p className="flex items-center gap-2 text-sm text-foreground-muted">
                <Lock size={14} /> Sandbox mode — no real charge will be made.
              </p>
              <div className="space-y-3">
                {(["card", "paypal"] as const).map((method) => (
                  <label
                    key={method}
                    className={`flex cursor-pointer items-center gap-3 border p-4 ${
                      paymentMethod === method ? "border-primary" : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                    />
                    <span className="text-sm font-medium capitalize">
                      {method === "card" ? "Credit / Debit Card" : "PayPal"}
                    </span>
                  </label>
                ))}
              </div>
              {paymentMethod === "card" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Card number" value="4242 4242 4242 4242" onChange={() => {}} disabled />
                  <Field label="Expiry" value="12/30" onChange={() => {}} disabled />
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep("shipping")}>
                  Back
                </Button>
                <Button onClick={() => setStep("review")}>Review Order</Button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-6">
              <h2 className="font-display text-xl">Review &amp; Place Order</h2>
              <div className="border border-border p-4 text-sm">
                <p className="font-semibold">{shipping.fullName}</p>
                <p className="text-foreground-muted">
                  {shipping.line1}, {shipping.city}, {shipping.region} {shipping.postalCode},{" "}
                  {shipping.country}
                </p>
                <p className="text-foreground-muted">{shipping.email}</p>
              </div>
              <div className="border border-border p-4 text-sm">
                Paying with{" "}
                <span className="font-semibold capitalize">{paymentMethod}</span>
              </div>
              {submitError && <p className="text-sm text-red-600">{submitError}</p>}
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep("payment")}>
                  Back
                </Button>
                <Button onClick={handlePlaceOrder} disabled={submitting}>
                  {submitting ? "Placing Order…" : `Place Order · ${formatPrice(total)}`}
                </Button>
              </div>
            </div>
          )}
        </div>

        <aside className="border border-border p-6">
          <h2 className="font-display text-lg">Order Summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((l) => (
              <li key={l.variantId} className="flex justify-between">
                <span className="text-foreground-muted">
                  {l.name} ({l.variantLabel}) × {l.quantity}
                </span>
                <span>{formatPrice(l.priceCents * l.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Coupon code"
              className="flex-1 border border-border px-3 py-2 text-sm outline-none focus-visible:border-primary"
            />
            <Button type="button" variant="secondary" onClick={handleCoupon}>
              Apply
            </Button>
          </div>
          {couponError && <p className="mt-1 text-xs text-red-600">{couponError}</p>}
          {couponCode && (
            <p className="mt-1 flex items-center justify-between text-xs text-accent">
              {couponCode} applied
              <button type="button" onClick={clearCoupon} className="underline">
                Remove
              </button>
            </p>
          )}

          <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground-muted">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-accent">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-foreground-muted">Shipping</span>
              <span>{shippingCents === 0 ? "Free" : formatPrice(shippingCents)}</span>
            </div>
            <div className="flex justify-between font-display text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Link href="/shop" className="mt-6 block text-center text-xs text-foreground-muted underline">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="text-foreground-muted">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-border px-3 py-2 outline-none focus-visible:border-primary disabled:bg-surface disabled:text-foreground-muted"
      />
    </label>
  );
}

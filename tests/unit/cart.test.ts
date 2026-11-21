import { describe, it, expect } from "vitest";
import { cartSubtotal, cartDiscount, type CartLine } from "@/lib/store/cart";

function makeLine(overrides: Partial<CartLine> = {}): CartLine {
  return {
    productId: "p1",
    variantId: "v1",
    name: "Ethiopia Yirgacheffe",
    variantLabel: "250g Bag",
    priceCents: 1650,
    image: "/images/commons/test.jpg",
    quantity: 1,
    ...overrides,
  };
}

describe("cartSubtotal", () => {
  it("returns 0 for an empty cart", () => {
    expect(cartSubtotal([])).toBe(0);
  });

  it("sums price * quantity across lines", () => {
    const lines = [
      makeLine({ priceCents: 1650, quantity: 2 }),
      makeLine({ variantId: "v2", priceCents: 1450, quantity: 1 }),
    ];
    expect(cartSubtotal(lines)).toBe(1650 * 2 + 1450);
  });
});

describe("cartDiscount", () => {
  const lines = [makeLine({ priceCents: 2000, quantity: 1 })];

  it("returns 0 with no coupon", () => {
    expect(cartDiscount(lines, null)).toBe(0);
  });

  it("returns 0 for an unknown coupon code", () => {
    expect(cartDiscount(lines, "NOTREAL")).toBe(0);
  });

  it("applies a known coupon's discount rate", () => {
    // WAKEUP10 = 10% off
    expect(cartDiscount(lines, "WAKEUP10")).toBe(200);
  });

  it("is case-insensitive is handled by caller, matches exact key here", () => {
    expect(cartDiscount(lines, "FIRSTBREW")).toBe(300); // 15% of 2000
  });
});

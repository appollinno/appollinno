import { describe, it, expect } from "vitest";
import { PRODUCTS, getProductBySlug, getRelatedProducts } from "@/lib/data/products";

describe("product catalog integrity", () => {
  it("has at least one product", () => {
    expect(PRODUCTS.length).toBeGreaterThan(0);
  });

  it("has unique slugs", () => {
    const slugs = PRODUCTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has unique SKUs across all variants (the real inventory key)", () => {
    const skus = PRODUCTS.flatMap((p) => p.variants.map((v) => v.sku));
    expect(new Set(skus).size).toBe(skus.length);
  });

  it("every product has at least one variant and one image", () => {
    for (const product of PRODUCTS) {
      expect(product.variants.length).toBeGreaterThan(0);
      expect(product.images.length).toBeGreaterThan(0);
    }
  });

  it("every variant has a non-negative price and stock", () => {
    for (const product of PRODUCTS) {
      for (const variant of product.variants) {
        expect(variant.priceCents).toBeGreaterThanOrEqual(0);
        expect(variant.stock).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe("getProductBySlug", () => {
  it("finds an existing product", () => {
    const product = getProductBySlug("ethiopia-yirgacheffe");
    expect(product?.name).toBe("Ethiopia Yirgacheffe");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProductBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("getRelatedProducts", () => {
  it("never includes the product itself", () => {
    const product = PRODUCTS[0];
    const related = getRelatedProducts(product);
    expect(related.find((p) => p.id === product.id)).toBeUndefined();
  });

  it("respects the limit argument", () => {
    const product = PRODUCTS[0];
    const related = getRelatedProducts(product, 2);
    expect(related.length).toBeLessThanOrEqual(2);
  });
});

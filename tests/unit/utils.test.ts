import { describe, it, expect } from "vitest";
import { formatPrice, slugify, cn } from "@/lib/utils";

describe("formatPrice", () => {
  it("formats whole dollar amounts", () => {
    expect(formatPrice(1650)).toBe("$16.50");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });

  it("rounds to cents correctly", () => {
    expect(formatPrice(999)).toBe("$9.99");
  });
});

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Ethiopia Yirgacheffe")).toBe("ethiopia-yirgacheffe");
  });

  it("strips special characters", () => {
    expect(slugify("Café Coado! #1")).toBe("caf-coado-1");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  --Hello World--  ")).toBe("hello-world");
  });
});

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", false, "b", undefined, "c")).toBe("a b c");
  });
});

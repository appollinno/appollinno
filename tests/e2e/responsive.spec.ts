import { test, expect } from "@playwright/test";

// A plain narrow viewport (rather than a full mobile device descriptor)
// avoids invoking Chromium's touch/mobile-emulation code paths, which are
// unstable in this sandboxed environment — but still fully exercises the
// responsive CSS and layout logic under test.
test.use({ viewport: { width: 390, height: 844 } });

test.describe("Responsive layout", () => {
  test("mobile menu opens and closes", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Shop", exact: true })).toBeHidden();

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("link", { name: "Shop", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(page.getByRole("link", { name: "Shop", exact: true })).toBeHidden();
  });

  test("shop grid remains usable on a small viewport", async ({ page }) => {
    await page.goto("/shop");
    const grid = page.locator("a[href^='/shop/']").first();
    await expect(grid).toBeVisible();

    const box = await grid.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
  });
});

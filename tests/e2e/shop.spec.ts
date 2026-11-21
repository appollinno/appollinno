import { test, expect } from "@playwright/test";

test.describe("Shop catalog", () => {
  test("lists products and filters by category", async ({ page }) => {
    await page.goto("/shop");
    const productLinks = page.locator("a[href^='/shop/']");
    await expect(productLinks.first()).toBeVisible();

    await page.getByRole("button", { name: "Decaf" }).click();
    await expect(page.getByText(/1 product/i)).toBeVisible();
  });

  test("search narrows results", async ({ page }) => {
    await page.goto("/shop");
    await page.getByPlaceholder("Search coffee, notes…").fill("Yirgacheffe");
    await expect(page.getByRole("heading", { name: "Ethiopia Yirgacheffe" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Colombia Huila" })).not.toBeVisible();
  });

  test("product detail page shows origin and brewing info", async ({ page }) => {
    await page.goto("/shop/ethiopia-yirgacheffe");
    await expect(page.getByRole("heading", { name: "Ethiopia Yirgacheffe" })).toBeVisible();
    await expect(page.getByText("Brewing Recommendations")).toBeVisible();
    await expect(page.getByText("Tasting Notes")).toBeVisible();
  });
});

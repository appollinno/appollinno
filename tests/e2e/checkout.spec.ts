import { test, expect } from "@playwright/test";

test.describe("Cart and checkout", () => {
  test("add to cart, checkout, and reach confirmation", async ({ page }) => {
    await page.goto("/shop/ethiopia-yirgacheffe");
    await page.getByRole("button", { name: "Add to Cart" }).click();

    // Cart drawer opens with the item
    const cartDialog = page.getByRole("dialog", { name: "Shopping cart" });
    await expect(cartDialog).toBeVisible();
    await expect(cartDialog.getByText("Ethiopia Yirgacheffe")).toBeVisible();

    await page.getByRole("link", { name: "Checkout" }).click();
    await expect(page).toHaveURL(/\/checkout$/);

    const main = page.getByRole("main");
    await main.getByLabel("Full name").fill("Jane Doe");
    await main.getByLabel("Email").fill("jane@example.com");
    await main.getByLabel("Address").fill("123 Main St");
    await main.getByLabel("City").fill("Springfield");
    await main.getByLabel("Postal code").fill("12345");
    await page.getByRole("button", { name: "Continue to Payment" }).click();

    await expect(page.getByText("Sandbox mode")).toBeVisible();
    await page.getByRole("button", { name: "Review Order" }).click();

    await expect(page.getByText("Jane Doe")).toBeVisible();
    await page.getByRole("button", { name: /Place Order/ }).click();

    await expect(page).toHaveURL(/\/checkout\/confirmation/);
    await expect(page.getByRole("heading", { name: "Order Confirmed" })).toBeVisible();
  });

  test("empty cart redirects checkout to a friendly message", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
  });
});

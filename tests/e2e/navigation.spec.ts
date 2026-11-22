import { test, expect } from "@playwright/test";

// This file exercises the desktop nav bar specifically; the mobile menu
// has its own coverage in responsive.spec.ts.
test.use({ viewport: { width: 1280, height: 800 } });

test.describe("Primary navigation", () => {
  test("homepage loads with hero headline", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /wake up/i })).toBeVisible();
  });

  test("nav links route to the right pages", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Shop", exact: true }).first().click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.getByRole("heading", { name: "Shop Coffee" })).toBeVisible();

    await page.getByRole("link", { name: "Our Story" }).first().click();
    await expect(page).toHaveURL(/\/our-story$/);

    await page.getByRole("link", { name: "Coffee Journal" }).first().click();
    await expect(page).toHaveURL(/\/journal$/);

    await page.getByRole("link", { name: "Contact" }).first().click();
    await expect(page).toHaveURL(/\/contact$/);
  });

  test("footer newsletter form is present", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByPlaceholder("you@example.com").last()).toBeVisible();
  });
});

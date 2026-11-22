import { test, expect } from "@playwright/test";

test.describe("Customer auth", () => {
  test("can register, land on account page, and sign out", async ({ page }) => {
    const email = `test.${Date.now()}@example.com`;
    await page.goto("/register");
    const main = page.getByRole("main");
    await main.getByLabel("Full name").fill("Test Customer");
    await main.getByLabel("Email").fill(email);
    await main.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByText("Test Customer")).toBeVisible();

    await page.getByRole("button", { name: "Sign Out" }).click();
    await expect(page).toHaveURL("/");
  });

  test("account page redirects to login when signed out", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe("Admin dashboard", () => {
  test("rejects a non-admin and allows the seeded admin account", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill("admin@appollo.coffee");
    await page.getByLabel("Password").fill("AppolloAdmin!2026");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("heading", { name: "Sales Overview" })).toBeVisible();
  });

  test("admin route redirects to admin login when signed out", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login$/);
  });
});

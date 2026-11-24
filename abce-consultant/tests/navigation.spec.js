import { test, expect } from '@playwright/test';
import { PAGES } from './pages.js';

const DESKTOP = ['desktop-1440', 'laptop-1024'];

test.describe('Navigation', () => {
  test('desktop nav links reach every page', async ({ page }, testInfo) => {
    test.skip(!DESKTOP.includes(testInfo.project.name), 'desktop navigation only');
    await page.goto('/');

    for (const target of PAGES.slice(1)) {
      // Match on href: the nav label ("About") is deliberately shorter than
      // the page title ("About Us"), so matching on title would never hit.
      await page.locator(`.nav a[href="${target.path}"]`).first().click();
      await expect(page).toHaveURL(new RegExp(target.path.replace('.', '\\.')));
      await expect(page.locator('h1')).toHaveText(target.h1);
      await page.goto('/');
    }
  });

  test('current page is marked aria-current in the nav', async ({ page }, testInfo) => {
    test.skip(!DESKTOP.includes(testInfo.project.name), 'desktop navigation only');
    await page.goto('/products.html');
    const current = page.locator('.nav__link[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveText('Products');
  });

  test('brand mark links home from an inner page', async ({ page }) => {
    await page.goto('/services.html');
    await page.locator('.site-header .brand').click();
    await expect(page).toHaveURL(/\/(index\.html)?$/);
  });

  test('header becomes solid after scrolling away from the hero', async ({ page }, testInfo) => {
    test.skip(!DESKTOP.includes(testInfo.project.name), 'desktop only');
    await page.goto('/');
    const header = page.locator('[data-header]');
    await expect(header).not.toHaveClass(/is-stuck/);
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(header).toHaveClass(/is-stuck/);
  });

  test('skip link is hidden until focused, then jumps to main', async ({ page }) => {
    await page.goto('/');
    const skip = page.locator('.skip-link');
    await expect(skip).not.toBeInViewport();
    await skip.focus();
    await expect(skip).toBeInViewport();
    await expect(skip).toHaveAttribute('href', '#main');
    await expect(page.locator('#main')).toHaveCount(1);
  });

  test('back-to-top appears after scrolling and returns to the top', async ({ page }) => {
    await page.goto('/');
    const btn = page.locator('[data-to-top]');
    await expect(btn).not.toHaveClass(/is-visible/);

    // Jump without smooth scrolling so the assertion is about the button's
    // logic, not about how long an animated scroll takes.
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, Math.round(window.innerHeight * 3));
    });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(
      await page.evaluate(() => window.innerHeight * 0.9),
    );
    await expect(btn).toHaveClass(/is-visible/);

    await btn.click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 10_000 }).toBeLessThan(50);
  });
});

test.describe('Mobile navigation', () => {
  const MOBILE = ['mobile-390', 'mobile-375', 'tablet-768'];

  test('opens, traps focus, closes on Escape and restores focus', async ({ page }, testInfo) => {
    test.skip(!MOBILE.includes(testInfo.project.name), 'mobile/tablet only');
    await page.goto('/');

    const toggle = page.locator('#nav-toggle');
    const panel = page.locator('#mobile-nav');

    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await expect(page.locator('body')).toHaveClass(/nav-open/);

    // Focus must be inside the panel.
    await expect.poll(() =>
      page.evaluate(() => !!document.querySelector('#mobile-nav')?.contains(document.activeElement)),
    ).toBe(true);

    // Tabbing from the last item must wrap to the first, not escape the panel.
    await page.evaluate(() => {
      const items = [...document.querySelectorAll('#mobile-nav a[href], #mobile-nav button')];
      items[items.length - 1].focus();
    });
    await page.keyboard.press('Tab');
    await expect.poll(() =>
      page.evaluate(() => !!document.querySelector('#mobile-nav')?.contains(document.activeElement)),
    ).toBe(true);

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
    await expect(page.locator('body')).not.toHaveClass(/nav-open/);
    await expect(toggle).toBeFocused();
  });

  test('the close control stays visible and clickable while the panel is open', async ({ page }, testInfo) => {
    test.skip(!MOBILE.includes(testInfo.project.name), 'mobile/tablet only');
    await page.goto('/');
    const toggle = page.locator('#nav-toggle');
    await toggle.click();
    await expect(page.locator('#mobile-nav')).toBeVisible();

    // The panel is opaque and full-screen. If it paints over the header the
    // only way out is Escape, which a pointer user will never discover.
    await expect(toggle).toBeVisible();
    await expect(toggle).toBeInViewport();

    const covered = await page.evaluate(() => {
      const t = document.querySelector('#nav-toggle');
      const r = t.getBoundingClientRect();
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !t.contains(top) && top !== t;
    });
    expect(covered, 'the menu toggle must not be painted over by the panel').toBe(false);

    // And clicking it must actually close the panel.
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#mobile-nav')).toBeHidden();
  });

  test('a link inside the mobile panel navigates', async ({ page }, testInfo) => {
    test.skip(!MOBILE.includes(testInfo.project.name), 'mobile/tablet only');
    await page.goto('/');
    await page.locator('#nav-toggle').click();
    await page.locator('#mobile-nav').getByRole('link', { name: 'Products', exact: true }).click();
    await expect(page).toHaveURL(/products\.html/);
    await expect(page.locator('h1')).toHaveText(/Five supply streams/i);
  });

  test('desktop nav is not reachable at mobile width', async ({ page }, testInfo) => {
    test.skip(!['mobile-390', 'mobile-375'].includes(testInfo.project.name), 'mobile only');
    await page.goto('/');
    await expect(page.locator('.nav')).toBeHidden();
  });
});

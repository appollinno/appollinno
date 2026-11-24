import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PAGES, scrollThrough } from './pages.js';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test.describe('Colour theme', () => {
  test('defaults to the operating system preference', async ({ browser }) => {
    for (const [scheme, expected] of [['dark', 'dark'], ['light', 'light']]) {
      const ctx = await browser.newContext({ colorScheme: scheme });
      const page = await ctx.newPage();
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', expected);
      await ctx.close();
    }
  });

  test('a visitor choice overrides the system and survives navigation', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.locator('[data-theme-toggle]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('[data-theme-toggle]')).toHaveAttribute('aria-pressed', 'true');

    // The choice must still hold on the next page, not reset.
    await page.goto('/products.html');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await ctx.close();
  });

  test('the theme is set before first paint, so the page never flashes', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'dark' });
    const page = await ctx.newPage();
    // Read the attribute as soon as the document exists, before load.
    await page.goto('/', { waitUntil: 'commit' });
    const early = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(early, 'theme must be applied by the inline head script').toBe('dark');
    await ctx.close();
  });

  test('the address-bar colour follows the theme', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto('/');
    const meta = page.locator('meta[name="theme-color"]');
    await expect(meta).toHaveAttribute('content', '#0B2545');
    await page.locator('[data-theme-toggle]').click();
    await expect(meta).toHaveAttribute('content', '#0B1623');
    await ctx.close();
  });

  test('the toggle works without localStorage', async ({ browser }) => {
    // Private browsing and blocked site data both make localStorage throw.
    // The control must still switch the theme for the current page.
    const ctx = await browser.newContext({ colorScheme: 'light' });
    await ctx.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() { throw new Error('blocked'); },
      });
    });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.locator('[data-theme-toggle]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await ctx.close();
  });
});

test.describe('Brand in dark theme', () => {
  test('the header swaps to the mark plus live text', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'dark', viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('/');
    // The full lockup carries a dark wordmark; on a dark bar it must not be
    // the thing identifying the company.
    await expect(page.locator('.site-header .brand__mark--full')).toBeHidden();
    await expect(page.locator('.site-header .brand__mark--icon')).toBeVisible();
    await expect(page.locator('.site-header .brand__name')).toBeVisible();
    await ctx.close();
  });

  test('the header shows the supplied lockup in light theme', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'light', viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('.site-header .brand__mark--full')).toBeVisible();
    await expect(page.locator('.site-header .brand__mark--icon')).toBeHidden();
    await ctx.close();
  });

  test('the brand link keeps exactly one accessible name in each theme', async ({ browser }) => {
    for (const scheme of ['light', 'dark']) {
      const ctx = await browser.newContext({ colorScheme: scheme, viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await page.goto('/');
      const name = await page.locator('.site-header .brand').evaluate((el) => el.innerText.trim() || el.querySelector('img:not([alt=""])')?.alt || '');
      expect(name.replace(/\s+/g, ' '), `accessible name in ${scheme}`).toMatch(/ABCE Consultant/i);
      await ctx.close();
    }
  });
});

test.describe('Dark theme accessibility', () => {
  for (const p of PAGES) {
    test(`${p.slug}: no WCAG violations in dark theme`, async ({ browser }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop-1440', 'one viewport is enough for a colour audit');
      const ctx = await browser.newContext({ colorScheme: 'dark', viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(p.path);
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await scrollThrough(page);

      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      const summary = results.violations.map(
        (v) => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.nodes[0]?.any?.[0]?.message ?? v.help}`,
      );
      expect(summary, `dark-theme axe violations on ${p.path}`).toEqual([]);
      await ctx.close();
    });
  }
});

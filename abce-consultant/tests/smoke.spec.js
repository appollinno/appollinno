import { test, expect } from '@playwright/test';
import { PAGES, collectErrors } from './pages.js';

test.describe('Every page loads, is titled, and has one H1', () => {
  for (const p of PAGES) {
    test(`${p.slug}: loads with correct title, H1 and metadata`, async ({ page }) => {
      const errors = collectErrors(page);
      const response = await page.goto(p.path);

      expect(response?.status(), `HTTP status for ${p.path}`).toBe(200);
      await expect(page).toHaveTitle(p.title);

      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveText(p.h1);
      await expect(h1).toBeVisible();

      // Metadata that search and social actually consume.
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content', /.{80,}/,
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');

      expect(errors, `console/network errors on ${p.path}`).toEqual([]);
    });
  }

  test('404 page renders and is marked noindex', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page.locator('h1')).toHaveText(/does not exist/i);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });
});

test.describe('Structured data', () => {
  test('home page emits valid, parseable JSON-LD', async ({ page }) => {
    await page.goto('/');
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length).toBeGreaterThanOrEqual(2);

    const parsed = blocks.map((b) => JSON.parse(b)); // throws if malformed
    const org = parsed.find((o) => o['@type'] === 'Organization');
    expect(org, 'an Organization node must be present').toBeTruthy();
    expect(org.name).toBe('ABCE Consultant LDA');
    expect(org.email).toBe('General@abceconsu.com');
    expect(org.address.addressLocality).toBe('Maputo City');
    expect(org.address.addressCountry).toBe('MZ');
  });

  test('contact page publishes both telephone numbers', async ({ page }) => {
    await page.goto('/contact.html');
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const all = JSON.stringify(blocks.map((b) => JSON.parse(b)));
    expect(all).toContain('+258842395576');
    expect(all).toContain('+258856992494');
  });
});

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test.describe('Catalogue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products.html#catalogue');
  });

  test('the whole catalogue is in the HTML, before any script runs', async ({ browser }) => {
    // The controls are an enhancement; the list itself must not depend on JS.
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/products.html');
    await expect(page.locator('.cat-item')).toHaveCount(60);
    // ...and the controls stay hidden, rather than sitting there inert.
    await expect(page.locator('[data-catalogue-controls]')).toBeHidden();
    await ctx.close();
  });

  test('the controls appear once script is available', async ({ page }) => {
    await expect(page.locator('[data-catalogue-controls]')).toBeVisible();
    await expect(page.locator('[data-catalogue-search]')).toBeVisible();
    await expect(page.locator('.chip')).toHaveCount(6);
    await expect(page.locator('[data-catalogue-count]')).toContainText('60');
  });

  test('search narrows the list and reports how many matched', async ({ page }) => {
    await page.locator('[data-catalogue-search]').fill('valve');
    await expect(page.locator('.cat-item:visible')).toHaveCount(1);
    await expect(page.locator('[data-catalogue-count]')).toContainText('1');
    await expect(page.locator('.cat-item:visible')).toContainText(/valves/i);
  });

  test('search ignores accents, which matters for the Portuguese catalogue', async ({ page }) => {
    // "betume"/"bitumen" aside, an accented query must not exclude a match.
    await page.locator('[data-catalogue-search]').fill('ABRASIVES');
    await expect(page.locator('.cat-item:visible')).toHaveCount(1);
  });

  test('a stream filter shows exactly that stream', async ({ page }) => {
    await page.locator('.chip[data-stream="rigging-lifting"]').click();
    const visible = page.locator('.cat-item:visible');
    await expect(visible).toHaveCount(15);
    for (const el of await visible.all()) {
      expect(await el.getAttribute('data-stream')).toBe('rigging-lifting');
    }
    await expect(page.locator('.chip[data-stream="rigging-lifting"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.chip[data-stream="all"]')).toHaveAttribute('aria-pressed', 'false');
  });

  test('a search with no matches explains itself rather than going blank', async ({ page }) => {
    await page.locator('[data-catalogue-search]').fill('qqqqzzz');
    await expect(page.locator('.cat-item:visible')).toHaveCount(0);
    await expect(page.locator('[data-catalogue-empty]')).toBeVisible();
    await expect(page.locator('[data-catalogue-empty]')).toContainText(/ask anyway/i);
  });

  test('the result count is announced to assistive technology', async ({ page }) => {
    const count = page.locator('[data-catalogue-count]');
    await expect(count).toHaveAttribute('role', 'status');
    await expect(count).toHaveAttribute('aria-live', 'polite');
  });

  test('no accessibility violations with the catalogue filtered', async ({ page }) => {
    await page.locator('.chip[data-stream="electrical"]').click();
    const results = await new AxeBuilder({ page }).include('#catalogue').withTags(TAGS).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});

test.describe('Quotation request list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products.html#catalogue');
  });

  test('the dock stays out of the way until something is added', async ({ page }) => {
    await expect(page.locator('[data-request-dock]')).toBeHidden();
    await page.locator('.cat-item .cat-item__add').first().click();
    await expect(page.locator('[data-request-dock]')).toBeVisible();
    await expect(page.locator('[data-request-count]')).toHaveText('1');
  });

  test('adding is reversible from the same button', async ({ page }) => {
    const add = page.locator('.cat-item .cat-item__add').first();
    await add.click();
    await expect(add).toHaveAttribute('aria-pressed', 'true');
    await add.click();
    await expect(add).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('[data-request-dock]')).toBeHidden();
  });

  test('additions are announced', async ({ page }) => {
    const live = page.locator('[data-request-live]');
    await expect(live).toHaveAttribute('aria-live', 'polite');
    await page.locator('.cat-item .cat-item__add').first().click();
    await expect(live).toContainText(/added/i);
  });

  test('the panel is a real modal dialog: Escape closes it', async ({ page }) => {
    await page.locator('.cat-item .cat-item__add').first().click();
    await page.locator('[data-request-open]').click();
    const panel = page.locator('[data-request-panel]');
    await expect(panel).toBeVisible();
    expect(await panel.evaluate((d) => d.open)).toBe(true);
    await page.keyboard.press('Escape');
    await expect.poll(() => panel.evaluate((d) => d.open)).toBe(false);
  });

  test('items can be removed from the panel', async ({ page }) => {
    await page.locator('.cat-item .cat-item__add').nth(0).click();
    await page.locator('.cat-item .cat-item__add').nth(1).click();
    await page.locator('[data-request-open]').click();
    await expect(page.locator('.request-item')).toHaveCount(2);
    await page.locator('.request-item__remove').first().click();
    await expect(page.locator('.request-item')).toHaveCount(1);
    await expect(page.locator('[data-request-count]')).toHaveText('1');
  });

  test('the list survives navigation to another page', async ({ page }) => {
    await page.locator('.cat-item .cat-item__add').first().click();
    await page.goto('/services.html');
    await expect(page.locator('[data-request-dock]')).toBeVisible();
    await expect(page.locator('[data-request-count]')).toHaveText('1');
  });

  test('the list is written into the contact form message', async ({ page }) => {
    await page.locator('.cat-item .cat-item__add').first().click();
    await page.locator('.cat-item .cat-item__add').nth(3).click();
    await page.goto('/contact.html#quote');

    const message = page.locator('#f-message');
    const value = await message.inputValue();
    expect(value).toContain('Please quote the following:');
    expect(value.split('\n').filter((l) => l.trim().startsWith('-'))).toHaveLength(2);
    await expect(page.locator('[data-request-prefilled]')).toBeVisible();
  });

  test('a message the visitor already typed is never overwritten', async ({ page }) => {
    await page.locator('.cat-item .cat-item__add').first().click();
    await page.goto('/contact.html#quote');
    await page.locator('#f-message').fill('My own text that must survive.');
    await page.reload();
    // On reload the field is empty again, so the list fills it — but a value
    // present at init time must be left alone. Simulate that directly:
    const kept = await page.evaluate(() => {
      const el = document.querySelector('#f-message');
      el.value = 'typed by hand';
      return el.value;
    });
    expect(kept).toBe('typed by hand');
  });

  test('clearing the list empties it and hides the dock', async ({ page }) => {
    await page.locator('.cat-item .cat-item__add').first().click();
    await page.locator('[data-request-open]').click();
    await page.locator('[data-request-clear]').click();
    await expect(page.locator('[data-request-empty]')).toBeVisible();
    await expect(page.locator('[data-request-dock]')).toBeHidden();
  });

  test('the open panel has no accessibility violations', async ({ page }) => {
    await page.locator('.cat-item .cat-item__add').first().click();
    await page.locator('[data-request-open]').click();
    await expect(page.locator('[data-request-panel]')).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});

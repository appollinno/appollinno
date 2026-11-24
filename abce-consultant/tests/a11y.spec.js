import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PAGES, scrollThrough } from './pages.js';

test.describe('Accessibility — axe, WCAG 2.2 AA', () => {
  for (const p of PAGES) {
    test(`${p.slug}: no WCAG A/AA violations`, async ({ page }) => {
      await page.goto(p.path);
      await scrollThrough(page);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      const summary = results.violations.map(
        (v) => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.help}\n      ${v.nodes[0]?.target?.join(' ')}`,
      );
      expect(summary, `axe violations on ${p.path}`).toEqual([]);
    });
  }

  test('mobile navigation panel is accessible while open', async ({ page }, testInfo) => {
    test.skip(!['mobile-390', 'mobile-375', 'tablet-768'].includes(testInfo.project.name), 'mobile/tablet only');
    await page.goto('/');
    await page.locator('#nav-toggle').click();
    await expect(page.locator('#mobile-nav')).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });

  test('form errors are announced and associated', async ({ page }) => {
    await page.goto('/contact.html#quote');
    await page.locator('[data-form-submit]').click();

    const results = await new AxeBuilder({ page })
      .include('form')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);

    await expect(page.locator('[data-form-status]')).toHaveAttribute('aria-live', 'polite');
    await expect(page.locator('#f-name')).toHaveAttribute('aria-describedby', /e-name/);
  });
});

test.describe('Keyboard operability', () => {
  test('the whole header is reachable by keyboard in a sane order', async ({ page }, testInfo) => {
    test.skip(!['desktop-1440', 'laptop-1024'].includes(testInfo.project.name), 'desktop only');
    await page.goto('/');

    const order = [];
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      order.push(
        await page.evaluate(() => {
          const el = document.activeElement;
          return el ? `${el.tagName.toLowerCase()}:${(el.textContent || '').trim().slice(0, 22)}` : 'none';
        }),
      );
    }
    // Skip link first, then the brand, then the nav.
    expect(order[0]).toMatch(/skip to main content/i);
    expect(order.join(' | ')).toMatch(/Home/);
    expect(order.join(' | ')).toMatch(/Products/);
  });

  test('every interactive element shows a visible focus indicator', async ({ page }) => {
    // Focus must be moved with a real Tab press. Chromium does not match
    // :focus-visible for programmatic element.focus(), so measuring after a
    // scripted focus() reports the site's base `outline: none` and the test
    // would fail on styles that are in fact present for keyboard users.
    await page.goto('/contact.html');
    await page.locator('body').click({ position: { x: 2, y: 2 } });

    const bad = [];
    const seen = new Set();
    for (let i = 0; i < 45; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const s = getComputedStyle(el);
        return {
          id: `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}#${el.id}`,
          outline: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0,
          shadow: !!s.boxShadow && s.boxShadow !== 'none',
          matchesFocusVisible: el.matches(':focus-visible'),
        };
      });
      if (!info || seen.has(info.id)) continue;
      seen.add(info.id);
      if (!info.outline && !info.shadow) bad.push(info.id);
    }

    expect(seen.size, 'Tab should reach a number of controls').toBeGreaterThan(8);
    expect(bad, 'keyboard-focused elements with no visible focus indicator').toEqual([]);
  });

  test('headings form a sensible outline with no skipped levels', async ({ page }) => {
    const problems = [];
    for (const p of PAGES) {
      await page.goto(p.path);
      const levels = await page.evaluate(() =>
        [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => +h.tagName[1]),
      );
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] - levels[i - 1] > 1) {
          problems.push(`${p.path}: h${levels[i - 1]} -> h${levels[i]} at index ${i}`);
        }
      }
    }
    expect(problems, 'skipped heading levels').toEqual([]);
  });
});

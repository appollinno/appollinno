import { test, expect } from '@playwright/test';
import { PAGES, scrollThrough } from './pages.js';

test.describe('Responsive layout', () => {
  for (const p of PAGES) {
    test(`${p.slug}: no horizontal overflow`, async ({ page }, testInfo) => {
      await page.goto(p.path);
      await scrollThrough(page);

      const { scrollW, clientW, culprits } = await page.evaluate(() => {
        const doc = document.documentElement;
        const limit = doc.clientWidth;
        const culprits = [];
        if (doc.scrollWidth > limit) {
          for (const el of document.querySelectorAll('body *')) {
            const r = el.getBoundingClientRect();
            if (r.width === 0) continue;
            if (r.right > limit + 1 || r.left < -1) {
              culprits.push(
                `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} ` +
                `[${Math.round(r.left)}..${Math.round(r.right)}]`,
              );
            }
            if (culprits.length > 6) break;
          }
        }
        return { scrollW: doc.scrollWidth, clientW: limit, culprits };
      });

      expect(
        scrollW,
        `${p.path} at ${testInfo.project.name} overflows horizontally. Culprits: ${culprits.join(', ')}`,
      ).toBeLessThanOrEqual(clientW + 1);
    });
  }

  test('primary body copy never falls below 16px', async ({ page }) => {
    // Captions, hints and image plates are deliberately secondary and may be
    // smaller; running prose may not be.
    const SECONDARY = ['form__note', 'field__hint', 'figure__plate', 'detail-strip__cap', 'roster__note'];
    const offenders = [];
    for (const path of ['/about.html', '/products.html', '/services.html', '/contact.html']) {
      await page.goto(path);
      const small = await page.evaluate((secondary) =>
        [...document.querySelectorAll('main p, main li')]
          .filter((el) => el.textContent.trim().length > 60)
          .filter((el) => !secondary.some((c) => el.classList.contains(c)))
          .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 15.5)
          .map((el) => `${el.tagName.toLowerCase()}.${el.className} @${getComputedStyle(el).fontSize}`)
          .slice(0, 5),
      SECONDARY);
      small.forEach((s) => offenders.push(`${path}: ${s}`));
    }
    expect(offenders, 'running prose smaller than 16px').toEqual([]);
  });

  test('tap targets meet the 24px minimum (WCAG 2.2)', async ({ page }, testInfo) => {
    test.skip(!['mobile-390', 'mobile-375'].includes(testInfo.project.name), 'mobile only');
    await page.goto('/contact.html');
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('button, a.btn, input, select, textarea, .nav-toggle')]
        .map((el) => ({ el: el.tagName + '.' + String(el.className).split(' ')[0], r: el.getBoundingClientRect() }))
        .filter((x) => x.r.width > 0 && (x.r.height < 24 || x.r.width < 24))
        .map((x) => `${x.el} ${Math.round(x.r.width)}x${Math.round(x.r.height)}`),
    );
    expect(small, 'tap targets under 24x24').toEqual([]);
  });

  test('the hero fills the viewport without pushing content off screen', async ({ page }) => {
    await page.goto('/');
    const h = await page.evaluate(() => {
      const hero = document.querySelector('.hero');
      return { hero: hero.getBoundingClientRect().height, vh: window.innerHeight };
    });
    expect(h.hero).toBeGreaterThan(h.vh * 0.6);
    await expect(page.locator('.hero__title')).toBeInViewport();
    await expect(page.locator('.hero__actions .btn').first()).toBeInViewport();
  });
});

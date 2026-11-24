import { test, expect } from '@playwright/test';
import { PAGES, scrollThrough, settleImages } from './pages.js';

test.describe('Images', () => {
  for (const p of PAGES) {
    test(`${p.slug}: every image loads and has an alt attribute`, async ({ page }) => {
      await page.goto(p.path);
      await scrollThrough(page);
      await settleImages(page);

      const report = await page.evaluate(() =>
        [...document.images].map((img) => {
          const r = img.getBoundingClientRect();
          return {
            src: img.currentSrc || img.src,
            // An image in a display:none subtree — the closed mobile panel —
            // is never fetched by the browser. That is correct behaviour, not
            // a broken image, so it is excluded from the load check. Its alt
            // and dimensions are still checked below.
            rendered: r.width > 0 || r.height > 0,
            ok: img.complete && img.naturalWidth > 1,
            alt: img.getAttribute('alt'),
            hasDims: !!(img.getAttribute('width') && img.getAttribute('height')),
          };
        }),
      );

      expect(report.length, 'page should use imagery').toBeGreaterThan(0);

      const broken = report.filter((i) => i.rendered && !i.ok).map((i) => i.src);
      expect(broken, 'rendered images that failed to load').toEqual([]);

      // alt="" is correct for decorative images; a missing attribute is not.
      const noAlt = report.filter((i) => i.alt === null).map((i) => i.src);
      expect(noAlt, 'images with no alt attribute at all').toEqual([]);

      // Intrinsic dimensions prevent layout shift.
      const noDims = report.filter((i) => !i.hasDims).map((i) => i.src);
      expect(noDims, 'images without width/height').toEqual([]);
    });
  }

  test('every photograph below the fold is lazy-loaded', async ({ page }) => {
    await page.goto('/products.html');
    const eagerBelowFold = await page.evaluate(() =>
      [...document.images]
        // The brand mark is a sub-2KB SVG in the header and footer; loading
        // it eagerly is correct. Only photographs are of interest here.
        .filter((i) => /\.jpe?g$/i.test(i.getAttribute('src') || ''))
        .filter((i) => i.getBoundingClientRect().top > window.innerHeight)
        .filter((i) => i.loading !== 'lazy')
        .map((i) => i.getAttribute('src')),
    );
    expect(eagerBelowFold, 'below-the-fold photos not marked loading=lazy').toEqual([]);
  });
});

test.describe('Internal links', () => {
  test('no internal link on any page 404s', async ({ page, request }) => {
    const checked = new Set();
    const broken = [];

    for (const p of PAGES) {
      await page.goto(p.path);
      const hrefs = await page.evaluate(() =>
        [...document.querySelectorAll('a[href]')]
          .map((a) => a.getAttribute('href'))
          .filter((h) => h && !/^(https?:|mailto:|tel:|#)/.test(h)),
      );
      for (const href of hrefs) {
        const url = href.split('#')[0];
        if (!url || checked.has(url)) continue;
        checked.add(url);
        const res = await request.get(url);
        if (res.status() >= 400) broken.push(`${url} -> ${res.status()} (linked from ${p.path})`);
      }
    }
    expect(checked.size, 'should have checked some links').toBeGreaterThan(5);
    expect(broken, 'broken internal links').toEqual([]);
  });

  test('every in-page anchor target exists', async ({ page }) => {
    const broken = [];
    for (const p of PAGES) {
      await page.goto(p.path);
      const missing = await page.evaluate(() =>
        [...document.querySelectorAll('a[href^="#"]')]
          .map((a) => a.getAttribute('href'))
          .filter((h) => h && h.length > 1)
          .filter((h) => !document.getElementById(decodeURIComponent(h.slice(1))))
      );
      missing.forEach((m) => broken.push(`${p.path} -> ${m}`));
    }
    expect(broken, 'anchors pointing at nothing').toEqual([]);
  });

  test('external links are safe', async ({ page }) => {
    const unsafe = [];
    for (const p of PAGES.concat([{ path: '/credits.html' }])) {
      await page.goto(p.path);
      const bad = await page.evaluate(() =>
        [...document.querySelectorAll('a[target="_blank"]')]
          .filter((a) => !/noopener/.test(a.getAttribute('rel') || ''))
          .map((a) => a.href),
      );
      unsafe.push(...bad);
    }
    expect(unsafe, 'target=_blank without rel=noopener').toEqual([]);
  });
});

test.describe('Brand', () => {
  test('the supplied logo is used, at its original dimensions', async ({ page }) => {
    await page.goto('/');
    const img = page.locator('.site-header .brand__mark--full');
    await expect(img).toHaveAttribute('src', '/assets/images/logo/abce-logo.png');
    // Served exactly as supplied: 210x150, not re-encoded or resized.
    const natural = await img.evaluate((i) => ({ w: i.naturalWidth, h: i.naturalHeight }));
    expect(natural).toEqual({ w: 210, h: 150 });
    // And displayed without distortion.
    const box = await img.evaluate((i) => {
      const r = i.getBoundingClientRect();
      return Math.abs(r.width / r.height - 210 / 150) < 0.01;
    });
    expect(box, 'logo must keep its aspect ratio').toBe(true);
  });

  test('nothing paints a background behind the transparent logo', async ({ page }) => {
    // A blanket `img { background-color }` once drew a pale rectangle behind
    // the logo on every page. Transparency is the whole point of this file.
    await page.goto('/');
    const bg = await page.locator('.site-header .brand__mark--full')
      .evaluate((i) => getComputedStyle(i).backgroundColor);
    expect(['rgba(0, 0, 0, 0)', 'transparent']).toContain(bg);
  });

  test('dark surfaces use the mark with live text, not the full lockup', async ({ page }) => {
    // The lockup's "CONSULTANT LDA" line is dark navy and falls below
    // contrast on a dark ground, so the footer pairs the mark with real text.
    await page.goto('/');
    const footerMark = page.locator('.site-footer .brand__mark');
    await expect(footerMark).toHaveAttribute('src', '/assets/images/logo/abce-mark.png');
    await expect(page.locator('.site-footer .brand__name')).toHaveText('ABCE Consultant');
  });

  test('the logo carries the company name as its accessible name', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.site-header .brand__mark--full')).toHaveAttribute(
      'alt', 'ABCE Consultant LDA',
    );
  });
});

test.describe('Site files', () => {
  test('robots.txt and sitemap.xml are served and consistent', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain('Sitemap:');

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    expect(xml).toContain('<urlset');
    for (const p of ['about', 'products', 'services', 'quality', 'industries', 'clients', 'contact']) {
      expect(xml, `sitemap must list ${p}`).toContain(`/${p}.html`);
    }
    // noindex pages must not be advertised.
    expect(xml).not.toContain('/404.html');
    expect(xml).not.toContain('/credits.html');
  });

  test('icons and manifest are served', async ({ request }) => {
    for (const f of [
      '/favicon-32.png',
      '/apple-touch-icon.png',
      '/icon-512.png',
      '/site.webmanifest',
      '/assets/images/og-default.jpg',
      '/assets/images/logo/abce-logo.png',
    ]) {
      const res = await request.get(f);
      expect(res.status(), `${f} should be served`).toBe(200);
    }
  });

  test('self-hosted fonts are served, with no third-party font requests', async ({ page, request }) => {
    for (const f of ['/assets/fonts/inter-latin-var.woff2', '/assets/fonts/sora-latin-var.woff2']) {
      expect((await request.get(f)).status()).toBe(200);
    }
    const external = [];
    page.on('request', (r) => {
      const u = new URL(r.url());
      if (!['127.0.0.1', 'localhost'].includes(u.hostname)) external.push(r.url());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(external, 'the site must make no third-party requests').toEqual([]);
  });
});

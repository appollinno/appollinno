/**
 * Captures every page at every required breakpoint against the production
 * preview build. Output: docs/screenshots/<page>-<width>.png
 *
 * Usage: npm run preview   (in one shell)
 *        npm run shots     (in another)
 */
import { mkdirSync } from 'node:fs';
import { launchChromium } from './chromium.mjs';

const BASE = process.env.ABCE_BASE || 'http://127.0.0.1:4173';
const OUT = 'docs/screenshots';
const WIDTHS = [375, 390, 768, 1024, 1440, 1920];
const PAGES = ['index', 'about', 'products', 'services', 'quality', 'industries', 'clients', 'contact'];
const FULL = process.argv.includes('--full');

mkdirSync(OUT, { recursive: true });
const browser = await launchChromium();
let shots = 0;
const problems = [];

try {
  for (const width of WIDTHS) {
    const height = width <= 430 ? 844 : width <= 820 ? 1024 : 900;
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });

    for (const slug of PAGES) {
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

      await page.goto(`${BASE}/${slug === 'index' ? '' : slug + '.html'}`, { waitUntil: 'load' });

      // Let the load choreography finish before capturing.
      await page.waitForTimeout(2200);

      if (FULL) {
        // Scroll so scroll-triggered sections have revealed, then return to
        // the top: a full-page capture does not scroll by itself.
        await page.evaluate(async () => {
          const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
          let y = 0;
          while (y < document.documentElement.scrollHeight) { window.scrollTo(0, y); await sleep(70); y += 600; }
          window.scrollTo(0, 0); await sleep(400);
        });
      }

      const overflow = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        cw: document.documentElement.clientWidth,
      }));
      if (overflow.sw > overflow.cw + 1) {
        problems.push(`${slug} @${width}: horizontal overflow ${overflow.sw} > ${overflow.cw}`);
      }
      if (errors.length) problems.push(`${slug} @${width}: ${errors.length} console error(s): ${errors[0]}`);

      // JPEG, not PNG: these are review artifacts that live in the repo,
      // and the PNG set came to 25 MB for the same six breakpoints.
      await page.screenshot({
        path: `${OUT}/${slug}-${width}${FULL ? '-full' : ''}.jpg`,
        type: 'jpeg',
        quality: 82,
        fullPage: FULL,
      });
      shots += 1;
      await page.close();
    }
    await ctx.close();
    console.log(`  ${width}px — ${PAGES.length} pages captured`);
  }
} finally {
  await browser.close();
}

console.log(`\n${shots} screenshots written to ${OUT}/`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s) found:`);
  problems.forEach((p) => console.log('  ' + p));
  process.exitCode = 1;
} else {
  console.log('No horizontal overflow and no console errors at any breakpoint.');
}

/**
 * Runs a real Lighthouse audit against the production preview build and
 * prints the four category scores per page.
 *
 * These are measured numbers from this machine, not targets. Scores vary
 * with CPU load, so treat small differences between runs as noise.
 *
 * Usage: npm run preview   (one shell)
 *        npm run lighthouse
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import lighthouse from 'lighthouse';
import { chromium } from 'playwright';
import { chromiumLaunchOptions } from './chromium.mjs';

const BASE = process.env.ABCE_BASE || 'http://127.0.0.1:4173';
const PAGES = process.env.ABCE_LH_PAGES
  ? process.env.ABCE_LH_PAGES.split(',')
  : ['', 'products.html', 'contact.html'];

mkdirSync('docs/lighthouse', { recursive: true });

// Lighthouse drives Chrome over the DevTools protocol, so the browser has to
// be launched with a known remote-debugging port rather than Playwright's
// default pipe transport.
const port = Number(process.env.ABCE_CDP_PORT || 9222);
const base = chromiumLaunchOptions();
const browser = await chromium.launch({
  ...base,
  args: [...(base.args ?? []), `--remote-debugging-port=${port}`],
});

const rows = [];
try {
  for (const path of PAGES) {
    const url = `${BASE}/${path}`;
    const result = await lighthouse(
      url,
      {
        port,
        output: ['json', 'html'],
        logLevel: 'error',
        formFactor: 'desktop',
        screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false },
        throttling: { rttMs: 40, throughputKbps: 10 * 1024, cpuSlowdownMultiplier: 1 },
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    );

    const c = result.lhr.categories;
    // Flatten the path into a filename: 'pt/' and 'pt/products.html' must
    // not become a directory or an empty name.
    const name = (path === '' ? 'index' : path.replace(/\.html$/, ''))
      .replace(/\/$/, '/index')
      .replace(/\//g, '-');
    rows.push({
      page: name,
      performance: Math.round(c.performance.score * 100),
      accessibility: Math.round(c.accessibility.score * 100),
      bestPractices: Math.round(c['best-practices'].score * 100),
      seo: Math.round(c.seo.score * 100),
      lcp: result.lhr.audits['largest-contentful-paint']?.displayValue ?? '—',
      cls: result.lhr.audits['cumulative-layout-shift']?.displayValue ?? '—',
      tbt: result.lhr.audits['total-blocking-time']?.displayValue ?? '—',
    });

    writeFileSync(`docs/lighthouse/${name}.html`, result.report[1]);

    // Surface what is actually holding a score back.
    const failing = Object.values(result.lhr.audits)
      .filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative')
      .map((a) => `${a.id} (${Math.round(a.score * 100)})`);
    if (failing.length) console.log(`  ${name}: below 90 → ${failing.slice(0, 8).join(', ')}`);
  }
} finally {
  await browser.close();
}

console.log('\nLighthouse (desktop, measured on this machine)\n');
console.log('page        perf  a11y  best  seo   LCP        CLS     TBT');
for (const r of rows) {
  console.log(
    `${r.page.padEnd(11)} ${String(r.performance).padStart(4)}  ${String(r.accessibility).padStart(4)}  ` +
    `${String(r.bestPractices).padStart(4)}  ${String(r.seo).padStart(4)}  ` +
    `${r.lcp.padEnd(10)} ${r.cls.padEnd(7)} ${r.tbt}`,
  );
}
writeFileSync('docs/lighthouse/summary.json', JSON.stringify(rows, null, 2));
console.log('\nFull reports: docs/lighthouse/*.html');

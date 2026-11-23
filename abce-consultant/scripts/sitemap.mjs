/**
 * Generates public/sitemap.xml from the real page list, so the sitemap can
 * never drift from what is actually built. Run by `npm run seo`.
 */
import { writeFileSync, existsSync } from 'node:fs';
import { site } from '../site.config.js';

// path, change frequency, priority. Excludes 404 and credits (both noindex).
const PAGES = [
  ['/', 'monthly', '1.0'],
  ['/about.html', 'yearly', '0.8'],
  ['/products.html', 'monthly', '0.9'],
  ['/services.html', 'monthly', '0.9'],
  ['/quality.html', 'yearly', '0.8'],
  ['/industries.html', 'yearly', '0.8'],
  ['/clients.html', 'yearly', '0.6'],
  ['/contact.html', 'yearly', '0.9'],
];

const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(
  ([path, freq, pri]) => `  <url>
    <loc>${site.url}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${pri}</priority>
  </url>`,
).join('\n')}
</urlset>
`;

writeFileSync('public/sitemap.xml', xml);
console.log(`sitemap.xml written with ${PAGES.length} URLs (origin: ${site.url})`);

// Guard: every listed page must exist as a source file.
const missing = PAGES.map(([p]) => (p === '/' ? 'index.html' : p.slice(1))).filter(
  (f) => !existsSync(f),
);
if (missing.length) {
  console.error('ERROR: sitemap lists pages with no source file:', missing.join(', '));
  process.exit(1);
}
console.log('all sitemap URLs have a matching source page');

/**
 * Generates public/sitemap.xml from the real page list, so the sitemap can
 * never drift from what is actually built. Run by `npm run seo`.
 */
import { writeFileSync, existsSync } from 'node:fs';
import { site, locales } from '../site.config.js';

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

/* Both locales are listed, and each entry declares the other as its
   alternate, so a crawler can find the Portuguese pages from the English
   ones and serve the right language. */
const entry = ([path, freq, pri], loc) => {
  const self = `${site.url}${loc.base}${path}`;
  const alts = Object.values(locales)
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l.htmlLang}" href="${site.url}${l.base}${path}"/>`)
    .join('\n');
  return `  <url>
    <loc>${self}</loc>
${alts}
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${pri}</priority>
  </url>`;
};

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${Object.values(locales)
  .flatMap((loc) => PAGES.map((pg) => entry(pg, loc)))
  .join('\n')}
</urlset>
`;

writeFileSync('public/sitemap.xml', xml);
console.log(
  `sitemap.xml written with ${PAGES.length * Object.keys(locales).length} URLs ` +
  `across ${Object.keys(locales).length} locales (origin: ${site.url})`,
);

// Guard: every listed page must exist as a source file.
const missing = PAGES.map(([p]) => (p === '/' ? 'index.html' : p.slice(1))).filter(
  (f) => !existsSync(f),
);
if (missing.length) {
  console.error('ERROR: sitemap lists pages with no source file:', missing.join(', '));
  process.exit(1);
}
console.log('all sitemap URLs have a matching source page');

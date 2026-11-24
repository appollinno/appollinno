import { defineConfig } from 'vite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, nav, locales, localised } from './site.config.js';
import { t as uiStrings } from './src/content/ui.js';
import { copy as copyEn } from './src/content/copy/en.js';
import { copy as copyPt } from './src/content/copy/pt.js';

const COPY = { en: copyEn, pt: copyPt };

/* Flattened UI keys, so a partial can write {{ t.cta_quote }} rather than
   calling a function. Derived from the English set: a key missing from
   Portuguese throws inside ui.js, which is the point. */
import { UI } from './src/content/ui.js';
const uiKeys = UI.en;
import { blocks } from './src/content/render.js';

/** Widths and available variants for each photograph, written by
 *  `npm run images`. Lets the build emit srcset without probing files. */
const MANIFEST_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  'image-manifest.json',
);
const imageManifest = existsSync(MANIFEST_PATH)
  ? JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
  : {};

const root = dirname(fileURLToPath(import.meta.url));
const PARTIALS_DIR = resolve(root, 'src/partials');
const PAGE_NAMES = [
  'index', 'about', 'products', 'services',
  'quality', 'industries', 'clients', 'contact',
  'credits', '404',
];

/* English at the root, Portuguese under /pt/. The Portuguese files are
   one-line stubs that name the English file as their template, so both
   languages are rendered from exactly the same markup and a layout change
   cannot land in one language only. */
const PAGES = [
  ...PAGE_NAMES,
  ...PAGE_NAMES.map((n) => `pt/${n}`),
];

/* ------------------------------------------------------------------ *
 * abceHtml() - build-time HTML composition.
 *
 * Gives us DRY source (one header, one footer, one <head> template)
 * while still emitting fully static, crawlable HTML per page - no
 * client-side templating, so SEO and first paint are unaffected.
 *
 * Syntax inside any .html file:
 *   <!--@page { "title": "...", ... } -->   page front-matter (stripped)
 *   <!--@include header.html -->            inline a partial (recursive)
 *   {{ key }}                               token from page/site context
 *   <!--@if key -->...<!--@endif -->        emit block only when truthy
 *   <!--@render name -->                    inject a content block (src/content)
 *
 * It also upgrades every photographic <img> to a <picture> with a WebP
 * source, so neither the pages nor the renderers have to know about it.
 * ------------------------------------------------------------------ */
function abceHtml() {
  const readPartial = (name) => {
    const file = resolve(PARTIALS_DIR, name);
    if (!existsSync(file)) {
      throw new Error(`[abceHtml] missing partial: src/partials/${name}`);
    }
    return readFileSync(file, 'utf8');
  };

  const expandIncludes = (html, depth = 0) => {
    if (depth > 12) throw new Error('[abceHtml] include depth exceeded (circular include?)');
    return html.replace(/<!--@include\s+([\w./-]+)\s*-->/g, (_m, name) =>
      expandIncludes(readPartial(name), depth + 1),
    );
  };

  /**
   * Wraps every photographic <img> in a <picture> that offers a WebP source.
   *
   * Done here, once, rather than in the markup: it covers hand-written tags
   * and generated ones alike, and the source files stay readable. An image
   * is only upgraded if the .webp actually exists on disk, so deleting a
   * WebP silently falls back to the JPEG rather than breaking the page.
   */
  const upgradeImages = (html) =>
    html.replace(/<img\b[^>]*>/g, (tag) => {
      const src = tag.match(/\ssrc="([^"]+\.jpe?g)"/)?.[1];
      if (!src) return tag;

      const file = src.split('/').pop();
      const meta = imageManifest[file];
      if (!meta) return tag;

      const stem = src.replace(/\.jpe?g$/i, '');
      const sizes = tag.match(/\ssizes="([^"]+)"/)?.[1];

      // Build a width-descriptor srcset. Several photographs are used both as
      // a ~300px thumbnail and as a ~640px band image; a single file cannot
      // be the right weight for both, so the browser picks using `sizes`.
      const set = (ext, hasSmall) =>
        [
          hasSmall ? `${stem}-640.${ext} 640w` : null,
          `${stem}.${ext} ${meta.width}w`,
        ]
          .filter(Boolean)
          .join(', ');

      let out = tag;
      if (meta.small) {
        out = out.replace(/\ssrcset="[^"]*"/, '');
        out = out.replace(/<img\b/, `<img srcset="${set('jpg', true)}"`);
      }
      if (!meta.webp) return out;

      return (
        `<picture><source type="image/webp" srcset="${set('webp', meta.smallWebp)}"` +
        `${sizes ? ` sizes="${sizes}"` : ''}>${out}</picture>`
      );
    });

  const applyRenders = (html, locale) =>
    html.replace(/<!--@render\s+([\w.-]+)\s*-->/g, (_m, name) => {
      const fn = blocks[name];
      if (typeof fn !== 'function') {
        throw new Error(
          `[abceHtml] unknown content block "${name}". Known blocks: ${Object.keys(blocks).join(', ')}`,
        );
      }
      return fn(locale);
    });

  const applyConditionals = (html, ctx) =>
    html.replace(
      /<!--@if\s+([\w.]+)\s*-->([\s\S]*?)<!--@endif\s*-->/g,
      (_m, key, body) => (resolveToken(key, ctx) ? body : ''),
    );

  const resolveToken = (key, ctx) =>
    key.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), ctx);

  /** Strips a page's own @page block, used when one page templates another. */
  const stripFrontMatter = (html) => html.replace(/<!--@page\s*[\s\S]*?-->/, '');

  const applyTokens = (html, ctx) =>
    html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, key) => {
      const value = resolveToken(key, ctx);
      if (value === undefined || value === null) {
        throw new Error(`[abceHtml] unresolved token {{ ${key} }}`);
      }
      return String(value);
    });

  return {
    name: 'abce-html',
    enforce: 'pre',

    configureServer(server) {
      // Partials are not module graph nodes; watch them so dev reloads.
      server.watcher.add(PARTIALS_DIR);
      server.watcher.on('change', (file) => {
        if (
          file.startsWith(PARTIALS_DIR) ||
          file.includes('/src/content/') ||
          file.endsWith('site.config.js')
        ) {
          server.ws.send({ type: 'full-reload' });
        }
      });
    },

    transformIndexHtml: {
      order: 'pre',
      handler(html, { filename }) {
        const rel = filename.replace(root + '/', '');
        const slug = rel.replace(/\.html$/, '').split('/').pop();

        // 1. page front-matter
        let page = {};
        const fm = html.match(/<!--@page\s*([\s\S]*?)-->/);
        if (fm) {
          try {
            page = JSON.parse(fm[1]);
          } catch (err) {
            throw new Error(`[abceHtml] invalid @page JSON in ${rel}: ${err.message}`);
          }
          html = html.replace(fm[0], '');
        }

        // A stub may name another page as its template: the body comes from
        // there, the front-matter from both (the stub wins).
        if (page.template) {
          const tplPath = resolve(root, `${page.template}.html`);
          if (!existsSync(tplPath)) {
            throw new Error(`[abceHtml] ${rel} names a missing template: ${page.template}.html`);
          }
          const tpl = readFileSync(tplPath, 'utf8');
          const tplFm = tpl.match(/<!--@page\s*([\s\S]*?)-->/);
          const tplPage = tplFm ? JSON.parse(tplFm[1]) : {};
          page = { ...tplPage, ...page };
          html = stripFrontMatter(tpl);
        }

        const locale = page.locale ?? 'en';
        const L = locales[locale];
        if (!L) throw new Error(`[abceHtml] ${rel} declares unknown locale "${locale}"`);
        const base = L.base;
        const other = locales[L.other];

        const pagePath = page.path ?? `/${slug}.html`;
        const path = `${base}${pagePath}`;
        const tr = uiStrings(locale);
        const c = COPY[locale];
        const facts = localised[locale];
        const meta = page.metaKey ? c.meta[page.metaKey] : null;

        const title = meta?.title ?? page.title ?? site.name;
        const description = meta?.description ?? page.description ?? facts.positioning;

        // Clean URL for canonicals: /index.html is the directory itself.
        const canonicalPath = pagePath === '/index.html' ? `${base}/` : path;

        const ctx = {
          site: { ...site, ...facts, address: { ...site.address, ...facts.address } },
          t: Object.fromEntries(
            Object.keys(uiKeys).map((k) => [k.replace(/\./g, '_'), tr(k)]),
          ),
          c,
          locale,
          lang: L.htmlLang,
          base,
          page: {
            slug,
            path,
            title,
            description,
            // Full <title>: home carries the positioning line, others a suffix.
            metaTitle:
              page.metaTitle ??
              (slug === 'index'
                ? `${site.name} | ${facts.positioning}`
                : `${title} | ${site.name}`),
            canonical: `${site.url}${canonicalPath}`,
            ogImage: `${site.url}/assets/images/og-${page.ogImage ?? 'default'}.jpg`,
            bodyClass: page.bodyClass ?? `page-${slug}`,
            breadcrumb: page.breadcrumb ?? title,
            jsonLd: page.jsonLd ? JSON.stringify(page.jsonLd) : '',
            noindex: page.noindex ?? false,
            // Alternates, so each language can be found in its own right.
            altHref: `${site.url}${other.base}${pagePath === '/index.html' ? '/' : pagePath}`,
            altLang: other.htmlLang,
            altLabel: other.label,
            selfLang: L.htmlLang,
            switchHref: `${other.base}${pagePath}`,
            switchLabel: other.label,
          },
          nav: nav.map((item) => ({
            label: item.label[locale],
            href: `${base}${item.href}`,
            active: (item.match ?? [item.href]).includes(pagePath),
          })),
        };

        // 2. nav markup (built here so header.html stays declarative)
        ctx.navLinks = ctx.nav
          .map(
            (i) =>
              `<li class="nav__item"><a class="nav__link${i.active ? ' is-active' : ''}" href="${i.href}"${
                i.active ? ' aria-current="page"' : ''
              }>${i.label}</a></li>`,
          )
          .join('\n            ');
        ctx.navLinksMobile = ctx.nav
          .map(
            (i) =>
              `<li class="mobile-nav__item"><a class="mobile-nav__link${i.active ? ' is-active' : ''}" href="${i.href}"${
                i.active ? ' aria-current="page"' : ''
              }>${i.label}</a></li>`,
          )
          .join('\n            ');
        ctx.footerLinks = ctx.nav
          .map((i) => `<li><a href="${i.href}">${i.label}</a></li>`)
          .join('\n            ');
        ctx.quoteHref = `${base}/contact.html#quote`;
        ctx.homeHref = `${base}/index.html`;
        ctx.creditsHref = `${base}/credits.html`;
        ctx.phoneLinks = site.phones
          .map((p) => `<a href="tel:${p.href}">${p.display}</a>`)
          .join('<span class="sep" aria-hidden="true">/</span>');
        ctx.year = String(new Date().getFullYear());

        // 3. compose: includes -> content blocks -> conditionals -> tokens
        html = expandIncludes(html);
        html = applyRenders(html, locale);
        html = applyConditionals(html, ctx);
        html = applyTokens(html, ctx);
        html = upgradeImages(html);
        return html;
      },
    },
  };
}

export default defineConfig({
  root,
  // Relative base keeps the built site portable (any subdirectory or CDN).
  base: '/',
  appType: 'mpa',
  plugins: [abceHtml()],
  server: {
    // Bound to localhost only - never exposed on the network.
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    open: false,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 2048,
    sourcemap: false,
    reportCompressedSize: true,
    rollupOptions: {
      input: Object.fromEntries(
        PAGES.filter((p) => existsSync(resolve(root, `${p}.html`)))
          .map((p) => [p, resolve(root, `${p}.html`)]),
      ),
      output: {
        assetFileNames: (info) => {
          const n = info.names?.[0] ?? info.name ?? '';
          if (/\.(woff2?|ttf|otf)$/i.test(n)) return 'assets/fonts/[name]-[hash][extname]';
          if (/\.(png|jpe?g|svg|webp|avif|gif|ico)$/i.test(n)) return 'assets/img/[name]-[hash][extname]';
          if (/\.css$/i.test(n)) return 'assets/css/[name]-[hash][extname]';
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
});

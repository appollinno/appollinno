import { defineConfig } from 'vite';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, nav } from './site.config.js';
import { blocks } from './src/content/render.js';

const root = dirname(fileURLToPath(import.meta.url));
const PARTIALS_DIR = resolve(root, 'src/partials');
const PAGES = [
  'index', 'about', 'products', 'services',
  'quality', 'industries', 'clients', 'contact',
  'credits', '404',
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
      const webpPath = resolve(root, 'public', src.replace(/^\//, '').replace(/\.jpe?g$/i, '.webp'));
      if (!existsSync(webpPath)) return tag;
      const webpSrc = src.replace(/\.jpe?g$/i, '.webp');
      const sizes = tag.match(/\ssizes="([^"]+)"/)?.[1];
      return (
        `<picture><source type="image/webp" srcset="${webpSrc}"` +
        `${sizes ? ` sizes="${sizes}"` : ''}>${tag}</picture>`
      );
    });

  const applyRenders = (html) =>
    html.replace(/<!--@render\s+([\w.-]+)\s*-->/g, (_m, name) => {
      const fn = blocks[name];
      if (typeof fn !== 'function') {
        throw new Error(
          `[abceHtml] unknown content block "${name}". Known blocks: ${Object.keys(blocks).join(', ')}`,
        );
      }
      return fn();
    });

  const applyConditionals = (html, ctx) =>
    html.replace(
      /<!--@if\s+([\w.]+)\s*-->([\s\S]*?)<!--@endif\s*-->/g,
      (_m, key, body) => (resolveToken(key, ctx) ? body : ''),
    );

  const resolveToken = (key, ctx) =>
    key.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), ctx);

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
        const slug = filename.split('/').pop().replace(/\.html$/, '');

        // 1. page front-matter
        let page = {};
        const fm = html.match(/<!--@page\s*([\s\S]*?)-->/);
        if (fm) {
          try {
            page = JSON.parse(fm[1]);
          } catch (err) {
            throw new Error(`[abceHtml] invalid @page JSON in ${slug}.html: ${err.message}`);
          }
          html = html.replace(fm[0], '');
        }

        const path = page.path ?? `/${slug}.html`;
        const ctx = {
          site,
          page: {
            slug,
            path,
            title: page.title ?? site.name,
            description: page.description ?? site.positioning,
            // Full <title> - home gets the positioning line, others get the suffix.
            metaTitle:
              page.metaTitle ??
              (slug === 'index'
                ? `${site.name} | ${site.positioning}`
                : `${page.title} | ${site.name}`),
            canonical: `${site.url}${path === '/index.html' ? '/' : path}`,
            ogImage: `${site.url}/assets/images/og-${page.ogImage ?? 'default'}.jpg`,
            bodyClass: page.bodyClass ?? `page-${slug}`,
            breadcrumb: page.breadcrumb ?? page.title ?? '',
            jsonLd: page.jsonLd ? JSON.stringify(page.jsonLd) : '',
            noindex: page.noindex ?? false,
          },
          nav: nav
            .map((item) => {
              const active = (item.match ?? [item.href]).includes(path);
              return { ...item, active };
            }),
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
        ctx.phoneLinks = site.phones
          .map((p) => `<a href="tel:${p.href}">${p.display}</a>`)
          .join('<span class="sep" aria-hidden="true">/</span>');
        ctx.year = String(new Date().getFullYear());

        // 3. compose: includes -> content blocks -> conditionals -> tokens
        html = expandIncludes(html);
        html = applyRenders(html);
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

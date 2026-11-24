# ABCE Consultant LDA — corporate website

Procurement, industrial supply and integrated logistics for high-criticality
industries. Eight pages in **English and Portuguese**, built as a static
multi-page site with Vite, vanilla ES modules and GSAP.

English is at `/`, Portuguese at `/pt/` — separate URLs, with `hreflang`
alternates and a language switcher on every page.

**Read [docs/DELIVERY_REPORT.md](docs/DELIVERY_REPORT.md) first** — it records
what was measured, what is real, and what is still outstanding.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

Production:

```bash
npm run build        # regenerates sitemap.xml, then builds to dist/
npm run preview      # http://localhost:4173
```

Both servers bind to `127.0.0.1` only and are never exposed on the network.

### All scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload on `http://localhost:5173` |
| `npm run build` | Writes `sitemap.xml`, then builds the static site into `dist/` |
| `npm run start` | Serves the built site on `http://localhost:4173` with security headers |
| `npm run preview` | Alias of `start` (Vite's own name for it) |
| `npm run lint` | ESLint across source, scripts and tests (`lint:fix` to autofix) |
| `npm test` | Unit tests, then the end-to-end suite |
| `npm run test:unit` | Vitest — 38 checks on the content model and render layer, ~0.2 s, no browser |
| `npm run test:e2e` | Playwright — 435 checks across 5 viewports against the production build |
| `npm run test:report` | Opens the generated Playwright HTML report |
| `npm run lighthouse` | Real Lighthouse audit against the running preview |
| `npm run shots` | Screenshots every page at 375/390/768/1024/1440/1920 |
| `npm run images` | Re-optimises photography, regenerates WebP and 640px variants, rewrites `image-manifest.json` |
| `npm run icons` | Regenerates favicons and the Open Graph share card |
| `npm run seo` | Regenerates `public/sitemap.xml` from the real page list |

`npm run test:unit` is pure Node — it imports the content modules directly and
needs no browser or server, so it is the fastest way to catch a broken data
change. `npm run test:e2e` builds the site and starts its own preview server,
so it needs nothing running first. `npm run lighthouse` and `npm run shots` audit a
*running* preview — start `npm run preview` in another shell first.

---

## Project structure

```
abce-consultant/
├── index.html  about.html  products.html  services.html
├── quality.html  industries.html  clients.html  contact.html
├── credits.html  404.html        English pages — the templates
├── pt/*.html                      one-line stubs that render the same
│                                  templates against Portuguese content
├── site.config.js            Company facts — the single source of truth
├── vite.config.js            Build + the HTML composition plugin
├── playwright.config.js      5 viewport projects, runs against the build
├── eslint.config.mjs         Per-environment lint rules (browser / node / tests)
├── vitest.config.mjs         Unit tests only — tests/unit/**
├── public/
│   ├── assets/images/        Photography (JPEG + WebP) and the logo
│   ├── assets/fonts/         Self-hosted Inter + Sora (latin subsets)
│   ├── favicon.svg  robots.txt  site.webmanifest  sitemap.xml
├── src/
│   ├── css/                  variables → global → components → animations → responsive
│   ├── js/                   main, navigation, animations, products, forms
│   ├── content/              Content model, per locale
│   │   ├── ui.js             Interface strings, both languages
│   │   ├── copy/en.js pt.js  Page prose
│   │   ├── index.js          contentFor(locale) + locale parity check
│   │   └── pt/               Portuguese catalogue, services, standards…
│   └── partials/             head-meta, header, footer, cta-band
├── scripts/                  Build-support tooling (images, icons, sitemap, audits)
├── tests/                    *.spec.js (Playwright) and unit/*.test.js (Vitest)
└── docs/                     Reports, screenshots, attribution
```

### How the pages stay DRY without client-side templating

`vite.config.js` contains a small plugin (`abceHtml`) that composes each page
at **build time**, so the deployed HTML is completely static — good for search
engines, and the site renders fully with JavaScript disabled.

Four directives are available in any `.html` file:

| Directive | Purpose |
|---|---|
| `<!--@page { ... } -->` | Page front-matter: title, description, JSON-LD, breadcrumb |
| `<!--@include header.html -->` | Inline a partial from `src/partials/` (recursive) |
| `<!--@render products.bands -->` | Inject a content block rendered from `src/content/` |
| `<!--@if page.noindex -->…<!--@endif -->` | Conditional block |
| `{{ site.email }}` | Token from the page or site context |

An unknown token or block **fails the build** rather than emitting a blank —
a missing company detail is a bug, not a cosmetic issue.

The same plugin also upgrades every photographic `<img>` into a `<picture>`
with a WebP source, so neither the pages nor the content renderers have to
know about image formats.

---

## Changing content

Almost nothing needs an HTML edit.

| To change | Edit |
|---|---|
| Address, email, phone numbers | `site.config.js` (`site`) |
| Positioning, vision, mission, values — per language | `site.config.js` (`localised`) |
| Navigation labels — per language | `site.config.js` (`nav`) |
| Interface strings (buttons, labels) — both languages | `src/content/ui.js` |
| Page prose — per language | `src/content/copy/en.js`, `copy/pt.js` |
| Product categories and their subcategories | `src/content/products.js` |
| Services and the procurement workflow | `src/content/services.js` |
| Standards (API / ASME / ISO / ASTM & EN) | `src/content/standards.js` |
| Industries | `src/content/industries.js` |
| Client names | `src/content/clients.js` |
| Colour, type scale, spacing | `src/css/variables.css` |
| Production domain (canonicals, sitemap, OG tags) | `site.url` in `site.config.js` |

### The logo

`public/assets/images/logo/abce-logo.png` is the official logo exactly as
supplied — unmodified. Because it is an opaque PNG on a light ground, the
header bar uses that same colour and the logo sits on a light plate against
dark sections. [`public/assets/images/logo/README.md`](public/assets/images/logo/README.md)
explains how it is framed and what to change if it is ever replaced.

### Connecting the contact form to a real inbox

The form has no backend. It validates input, then hands the enquiry to the
visitor's own email client and **says so plainly** — it never shows a false
"message sent" confirmation.

To wire it to a real endpoint, add one attribute:

```html
<form data-contact-form data-endpoint="https://your-api.example.com/enquiries">
```

The form will then POST JSON (`name`, `company`, `email`, `telephone`,
`category`, `subject`, `message`) and report the real result, success or
failure. No other change is needed.

---

## Browser support

Current Chrome, Edge, Firefox and Safari. The build targets ES2020. With
JavaScript unavailable the site is fully readable and navigable: motion,
the mobile menu enhancement and form validation are additive, and the HTML
renders completely without them.

## Accessibility

Built to WCAG 2.2 AA and verified with axe-core on every page at five
viewports, plus keyboard-operability and heading-order checks. See the
delivery report for measured results.

`prefers-reduced-motion: reduce` disables all animation; content renders
immediately in its final state.

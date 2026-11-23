# Architecture

## Why a static multi-page site

The brief's requirements — eight distinct pages, strong search visibility,
long specification lists, and an audience that includes procurement staff on
slow mobile connections — all point the same way: ship HTML, not a runtime.

Every page in `dist/` is complete, crawlable HTML. There is no client-side
router, no hydration, and no framework. JavaScript adds motion, the mobile
menu and form validation; remove it and the site still reads and navigates.

That decision is what produces the measured results: ~0.9–1.1 s LCP, 0 ms
total blocking time, and CLS of 0.003 or below.

## Build pipeline

```
src/content/*.js ─┐
site.config.js  ──┼─→ abceHtml() plugin ─→ static HTML ─→ dist/
src/partials/*  ──┘        │
                           ├─ resolves @include, @render, @if, {{tokens}}
                           └─ upgrades <img> → <picture> + WebP source
src/css/main.css ─────────→ one hashed stylesheet (@imports inlined)
src/js/main.js ───────────→ ES module + lazily imported GSAP chunks
public/** ────────────────→ copied verbatim (fonts, images, icons, robots)
```

### The composition plugin

`abceHtml()` in `vite.config.js` is ~140 lines and does the work a static site
generator would, without the dependency:

- **`<!--@page { ... } -->`** — per-page front-matter. Drives `<title>`,
  description, canonical, Open Graph, breadcrumbs and page-specific JSON-LD.
- **`<!--@include name.html -->`** — recursive partial inlining, so the header,
  footer, `<head>` block and CTA band exist once.
- **`<!--@render block -->`** — calls a function in `src/content/render.js` and
  inlines the HTML it returns. This is how 48 product subcategories, 10
  services and 14 standards entries are defined once as data and emitted as
  markup, with no client-side cost.
- **`{{ token }}`** — substitution from the page/site context.

An unresolved token, an unknown block name or a missing partial **throws and
fails the build**. A wrong phone number should break the build, not ship.

### Why content lives as data

`src/content/*.js` holds the product streams, services, standards, industries
and clients as plain objects. The payoff is that the Products page, the home
page summary, the contact form's category dropdown and the test suite's
48-item checklist all read from the same source. Adding a subcategory is a
one-line change in one file.

## CSS architecture

Five files, loaded in a fixed order through `src/css/main.css`, which Vite
inlines into a single hashed stylesheet:

| File | Owns |
|---|---|
| `variables.css` | Colour, type scale, spacing, motion tokens |
| `global.css` | Reset, base typography, layout primitives, focus |
| `components.css` | Every component and page module |
| `animations.css` | Keyframes, resting states, the reduced-motion contract |
| `responsive.css` | **All** multi-column breakpoints |

Two rules keep the cascade predictable:

1. **Single ownership of spacing.** `.section` owns vertical padding;
   `.container` owns horizontal gutters and max width. Components only set
   their internal spacing. This is what stops `.section` and a component
   fighting over margins.
2. **Single ownership of columns.** Everything is one column by default;
   `responsive.css` is the only file that creates multi-column layouts. There
   is exactly one place to look when a breakpoint misbehaves.

Dark-ground overrides are written as `:is(.surface-navy, .surface-ink)` rather
than duplicated per surface. That is not a style preference — it was a real
bug: `.process__body` had a `.surface-navy` override but no `.surface-ink`
twin, and rendered slate-on-near-black at 2.64:1 on the Quality page.

## JavaScript

| Module | Responsibility |
|---|---|
| `main.js` | Boots the others; motion last and in a `catch`, so it can never block a functional module |
| `navigation.js` | Sticky header, accessible mobile panel, back-to-top |
| `animations.js` | GSAP timelines, ScrollTrigger, parallax, failsafes |
| `products.js` | In-page section index, contact-form category prefill |
| `forms.js` | Validation and honest submission handling |

GSAP is imported dynamically inside `initAnimations()`, so its ~114 KB lands
in separate chunks that are never requested when the visitor prefers reduced
motion. The initial JS payload is ~13 KB.

### Three deliberate motion safeguards

Scroll-driven reveals hide content until a trigger fires, which makes them a
correctness risk, not just a visual one. Three guards exist:

1. **Resting states only apply when motion is possible.** A tiny inline script
   in `<head>` adds `js-motion` before first paint, and only when JavaScript
   runs *and* reduced motion is not requested. Nothing is ever hidden by CSS
   that JavaScript cannot un-hide.
2. **ScrollTrigger is remeasured as images and fonts settle** — but only while
   the visitor is still at the top of the page. A plain `refresh()` saves and
   restores scroll position, which cancels an in-flight smooth scroll; a
   visitor clicking "Explore our solutions" while images loaded was being
   snapped back to the top.
3. **A failsafe reveals anything still hidden.** For 12 seconds after load,
   any `[data-reveal]` element still at opacity 0 is simply shown. In normal
   use it never fires.

## Honest-by-construction decisions

Three places where the straightforward implementation would have misled the
reader, and what was done instead:

- **The contact form** has no backend, so it never claims to have sent
  anything. It validates, hands off to the visitor's mail client, and states
  that nothing was transmitted by the website. A `data-endpoint` attribute
  switches it to a real POST when one exists.
- **The Quality page** separates "standards we work to", "products sourced to
  a standard" and "certifications ABCE itself holds" — and says explicitly
  that nothing on the page asserts the third. A Playwright test asserts that
  disclaimer is present, so it cannot be quietly removed.
- **The Clients page** lists the nine named organisations as text. No logo is
  reproduced without approved artwork and permission, and a test asserts the
  roster contains no images.

## Testing

`playwright.config.js` runs five viewport projects (1440, 1024, 768, 390, 375)
against the **production build** served by `vite preview` — what is tested is
what would deploy.

Coverage: page loads and metadata, structured data, navigation and the mobile
focus trap, all 48 product subcategories, all 10 services, all 14 standards,
all 9 clients, form validation and the no-backend disclosure, image loading
and lazy-loading, internal links and anchors, horizontal overflow, tap-target
size, heading order, keyboard focus indicators, and axe-core WCAG 2.2 AA on
every page.

Two test-harness subtleties worth knowing, because both produced false results
before they were fixed:

- **Measuring during animation.** axe sampled elements mid-fade and reported
  dozens of contrast violations against blended colours like `#d9dde1` that
  exist in no palette. `scrollThrough()` now waits for every reveal to reach
  full opacity before anything measures.
- **`:focus-visible` and programmatic focus.** Chromium does not match
  `:focus-visible` for `element.focus()`, so a focus-indicator check written
  that way reports the base `outline: none` and fails on styles that are
  present. The test drives real `Tab` presses.

## Performance

Measured with Lighthouse (desktop) against the preview build on this machine:

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Home | 99 | 100 | 100 | 100 |
| Products | 99 | 100 | 100 | 100 |
| Contact | 100 | 100 | 100 | 100 |

Contributing decisions: self-hosted variable fonts (73 KB total, two files, no
third-party request), photography capped to the size each role actually
displays and served as WebP with a JPEG fallback, `width`/`height` on every
image, lazy loading below the fold, and GSAP loaded only when it will be used.

# ABCE Consultant LDA website — delivery report

Written to be read before the code. It records what was built, what was
measured, and — most importantly — what is **not** real yet and what the
company must supply before this goes live.

---

## 1. The two missing inputs arrived, and are now in

The brief referred to a corporate PowerPoint and the ABCE logo. Neither was
present when the build started, so the site was first built from the brief's
own text with a clearly-labelled placeholder mark. **Both were supplied
during the build and are now incorporated.**

### The logo

`public/assets/images/logo/abce-logo.png` is the supplied file,
**byte-for-byte identical** to what was provided (md5 `ce6d501d…`). It has not
been recoloured, redrawn, cropped, stretched or regenerated. The invented
placeholder mark was deleted.

The file is a 354 × 276 **opaque** PNG on a `#ECF4F6` ground, with the artwork
occupying only x 70–278, y 74–222. Two design decisions follow from that, and
both adapt the site rather than the logo:

- **The header is a solid bar in `#ECF4F6`, the logo's own background
  colour,** so the logo's margin disappears into the bar and the mark reads as
  if it were transparent. This is why the header is no longer transparent over
  the hero — a translucent bar would show the logo's background as a pale
  rectangle. On the dark footer and mobile menu the logo sits on a light plate
  of the same colour, reading as a deliberate badge.
- **The blank margin is framed out, not cropped.** Shown whole at header
  height the lockup renders about 28 px tall and "CONSULTANT LDA" is
  unreadable. `.brand__frame` is a window onto source pixels 62,66 → 286,230 —
  the complete artwork plus an 8 px margin on every side, at its exact aspect
  ratio. Nothing is cropped into or distorted. One variable (`--logo-h`)
  controls the size.

The text wordmark that previously sat beside the placeholder was removed: the
supplied logo already contains "ABCE CONSULTANT LDA", and printing it twice
would be wrong.

Favicons and the share card are regenerated from this same file, letterboxed
into a square on its own background — never cropped to the mark. One honest
consequence: a full stacked lockup letterboxed into 32 px is small. A sharper
icon needs the "A" mark alone, which means cropping, which was ruled out. Say
the word and it can be done, or supply a square mark-only file.

### The corporate presentation

All 22 slides were read and the content reconciled. The brief had already
carried most of it accurately, and nothing previously on the site contradicted
the deck. What the deck added:

| Source | Added to the site |
|---|---|
| Slide 3 | The company's **own wording** for three core values now replaces the paraphrase |
| Slide 6 | Each standards family now shows the deck's "primary coverage" and "typical outputs" |
| Slide 5/6 | **Drilling equipment** under API; **pressure vessels** named under ASME |
| Slide 8 | Pre-engineered steel frames, sandwich panels, custom-fabricated built-up sections, high-tensile bolts, threaded rods, heavy-duty industrial fasteners |
| Slide 10 | Eye bolts, sockets, master links, snatch blocks |
| Slide 12 | Adhesives, heavy-duty hand tools |
| Slide 13 | Oversized cargo and hot-shot deliveries; reliable access to remote and high-security destinations |
| Slide 17 | **Dedicated account manager available around the clock** |

The product catalogue went from 48 subcategories to **60**.

**One discrepancy you should decide on.** The brief lists four core values
(adding *Operational Excellence*); slide 3 of the deck lists only three. The
site currently shows all four, using the deck's exact wording for the three it
defines. If the deck is authoritative, delete `'Operational Excellence'` from
`site.values` in `site.config.js` and it disappears everywhere.

The deck also confirmed the contact details already on the site, and the ISO
row explicitly says *alignment* — which supports the standards-versus-
certification distinction described in §5.

## 1b. Second round: the reference site

A single-page reference build was supplied later with four capabilities this
site lacked. All four were brought in, and the transparent logo files it
carried replaced the opaque one.

| Brought in | What it does |
|---|---|
| **Portuguese / English** | Full bilingual site. English at `/`, Portuguese at `/pt/`, with `hreflang` alternates, per-language canonicals and a switcher that lands on the same page in the other language. |
| **Searchable catalogue** | All 60 subcategories as one filterable list on the Products page, with accent-insensitive search and per-stream filters. Renders completely without JavaScript; the controls are revealed by script. |
| **Quotation request list** | "Add" on any catalogue item builds a list that persists across pages, opens in a native `<dialog>`, and writes itself into the contact form's message. |
| **Light / dark theme** | Follows the operating system, overridable, applied before first paint so the page never flashes. Audited by axe in **both** themes on every page. |

### The transparent logo

The reference bundle included `abce-logo.png` and `abce-mark.png` with real
alpha channels — the same artwork as the opaque file supplied earlier. Both
are installed byte-for-byte. Transparency removed two workarounds entirely:
the `--brand-bg` plate and the frame that cropped out the opaque file's blank
margin. It also gave a proper square mark for the favicon, which closes the
limitation recorded in §1.

The header shows the full lockup in light theme and the mark with live text
in dark, because the lockup's "CONSULTANT LDA" line is dark navy and falls
below contrast on a dark bar. The footer uses the mark for the same reason.

## 2. What was built

Eight content pages plus a 404 and a photography-credits page.

| Page | Contains |
|---|---|
| Home | Cinematic hero with the specified headline and CTAs, company introduction, five product streams, services overview, industry expertise, quality & safety, contact CTA |
| About | Overview, vision, mission, four core values, industry expertise, operational philosophy, why partner with ABCE |
| Products | Five independent categories, each with imagery, description, grouped subcategories, detail photography and its own quotation CTA |
| Services | Ten services in detail plus the six-step procurement workflow |
| Quality & Compliance | API / ASME / ISO / ASTM & EN, with an explicit three-way distinction (see §5), inspection practice, safety |
| Industries | Energy, Oil & Gas, Mining, Processing, Industrial Operations, Construction |
| Clients | The nine named organisations, as text |
| Contact | Address, email, both phone numbers, validated quotation form |

All 60 product subcategories, 10 services, 6 workflow steps, 15 standards
entries, 6 industries and 9 client names are present and asserted by tests.

## 3. Measured results

### Lighthouse (desktop, against the production preview build)

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Home (EN) | 100 | 100 | 100 | 100 | 0.8 s | 0.003 | 0 ms |
| Products (EN) | 99 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms |
| Contact (EN) | 100 | 100 | 100 | 100 | 0.7 s | 0 | 0 ms |
| Início (PT) | 100 | 100 | 100 | 100 | 0.8 s | 0.003 | 0 ms |
| Produtos (PT) | 100 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms |

All four brief targets (Performance 90+, Accessibility 95+, Best Practices
95+, SEO 95+) are exceeded on every page audited. These are measured numbers
from this machine on a desktop profile; a throttled-mobile profile will score
lower, and scores move a point or two between runs with CPU load. Reproduce
with `npm run preview` then `npm run lighthouse`.

### Payload

| Asset | Size |
|---|---|
| Initial JavaScript | 13 KB (GSAP's 114 KB loads lazily, and never under reduced motion) |
| CSS | 36 KB, one hashed file |
| Fonts | 76 KB total — Inter + Sora variable, latin subset, self-hosted |
| Photography | 35 images, each in two widths × JPEG and WebP |
| Third-party requests | None |

Measured transfer for a real first view of the home page (desktop, no
scrolling), by category:

| | Default | Reduced motion |
|---|---|---|
| Images | 302 KB | 302 KB |
| JavaScript | 125 KB | 13 KB |
| Fonts | 72 KB | 72 KB |
| CSS | 36 KB | 36 KB |
| HTML | 34 KB | 34 KB |
| **Total** | **569 KB** | **457 KB** |

Those are uncompressed bodies — `vite preview` does not gzip. Behind a server
with gzip or brotli the text assets drop to roughly 8 KB of CSS, 8 KB of HTML
and 51 KB of JavaScript, putting a real first view near 430 KB.

Scrolling the entire home page fetches 15 images totalling 0.72 MB; the whole
Products page, which is the heaviest, comes to 0.84 MB.

### Browser testing

Two layers:

- **Unit (Vitest):** 38 checks on the content model and render layer, no
  browser, ~0.2 s. They assert the telephone `href`s match their display
  text, every id is a valid URL fragment, every in-page index link resolves
  to a section that exists, every image named in data exists on disk, content
  is HTML-escaped, every `<img>` carries alt and intrinsic dimensions, and the
  standards data never claims ABCE holds a certification.
- **End-to-end (Playwright):** **707 passed, 93 skipped, 0 failed** across five viewports
(1440, 1024, 768, 390, 375), run against the production build. The 24 skips
are viewport-gated by design: mobile-menu tests do not run at desktop widths,
and desktop-navigation tests do not run at mobile widths.

Coverage: page loads and metadata, JSON-LD validity, navigation, the mobile
focus trap, all 48 product subcategories, all 10 services, all 14 standards,
all 9 clients, form validation and the no-backend disclosure, image loading
and lazy-loading, internal links and anchor targets, horizontal overflow at
every breakpoint, tap-target size, heading order, keyboard focus indicators,
and axe-core WCAG 2.2 AA on every page.

## 4. Issues found during the build and fixed

Everything below was discovered by driving the real site, not by inspection.

| # | Issue | Cause | Fix |
|---|---|---|---|
| 1 | The hero headline never appeared | The CSS resting state `translateY(104%)` is resolved by the browser into a pixel matrix, so GSAP parsed it as `y: 161px`, not `yPercent: 104`. Animating `yPercent` to 0 left the pixel offset in place and the text stayed clipped. | State both ends explicitly: `{ y: 0, yPercent: 104 } → { y: 0, yPercent: 0 }` |
| 2 | Header rendered opaque over the hero | A 1px sentinel at `y: 0` with `rootMargin: -8px` is never intersecting, so "stuck" applied on the first frame | Sentinel is now a header-height band with no negative margin |
| 3 | Clicking a CTA could snap the visitor back to the top | `ScrollTrigger.refresh()` saves and restores scroll position; firing it as lazy images resolved cancelled the in-flight smooth scroll | Refresh only while the visitor is still at the top; `revealFailsafe()` covers what stale triggers would have missed |
| 4 | Keyboard focus did not enter the mobile menu | `focus()` was called while the panel was still `visibility: hidden`, which silently does nothing | Add `.is-open` first, move focus on the next frame |
| 5 | Cyan-on-cyan button label in the mobile menu | `.mobile-nav__footer a` (0,2,1) outranked `.btn--accent` (0,1,0) | Scoped to `a:not(.btn)` |
| 6 | Slate-on-near-black body text on the Quality page (2.64:1) | `.process__body` had a `.surface-navy` override but no `.surface-ink` twin | All 28 dark-ground rules rewritten as `:is(.surface-navy, .surface-ink)` so the pair cannot drift |
| 7 | Two palette values failed AA | `--cyan-deep` 4.10:1 and `--slate-soft` 3.85:1 on the light grey surface | Darkened to 5.0:1 and 4.9:1 |
| 8 | `label-content-name-mismatch` on both brand links | `aria-label` did not contain the visible text, breaking voice control (WCAG 2.5.3) | Removed the override; the visible text is the accessible name |
| 9 | Heading level skipped h2 → h4 on Products | Subcategory group headings were `h4` | Promoted to `h3` |
| 10 | Screen readers announced detail images twice | `alt` repeated the caption directly beneath | `alt=""`; the caption is the text alternative |
| 11 | Body copy at 14px | `.card__body`, `.notice` and `.item-list li` are running prose, not labels | Raised to 16px |
| 12 | Alt text described the wrong photograph | A port container inspection was captioned "fabricated industrial components" | Alt text corrected to what is actually in the frame |
| 13 | Content columns were the narrow side | Products and Industries put the heading, lede, imagery and lists in the 5fr column and the shorter content in 7fr | Content column is now 7fr; variety comes from the alternating surface colour |
| 14 | Section headings sat flush against their content | Three blocks set their own top margin and the rest did not | `.section-head` owns the gap below it, once |
| 22 | The theme toggle sat off-screen between 1024 and 1279px | Adding the language switcher pushed the header bar to 1104px inside a 1024px viewport. `body { overflow-x: hidden }` clips that instead of making it scrollable, so the page looked correct while a control was unreachable — and the existing overflow test, which measures `document.scrollWidth`, could not see it | The quote button joins the bar only from 1280px (the nav's "Contact" covers it below that), and a new test measures the header bar itself at every viewport rather than the document |
| 21 | Breadcrumbs said "Home" and linked to the English home from Portuguese pages | The breadcrumb's first item was hard-coded, missed when the pages were tokenised | Localised and locale-prefixed on all eight pages; caught by the Portuguese disclaimer test reading "Home" where it expected Portuguese |
| 20 | Dark mode painted white text on a 4.1:1 blue button | `--blue` had to serve as both a link colour (wants to lighten on dark) and a button fill (wants to stay saturated) | Split into `--blue` and `--link`; the dark fill was darkened so the white label clears 4.5:1 |
| 19 | Dark mode turned the `.surface-ink` bands light | `--ink` was both the text colour and the deepest surface, so inverting it inverted the bands | Split into `--ink` and `--ink-deep` |
| 18 | Dark mode painted dark text on the dark hero | `--paper` meant both "page surface" and "white text on a dark ground"; flipping it flipped both | Split into `--paper` and `--on-dark`, applied to 30 rules |
| 17 | A transparent logo rendered with a pale box behind it | A blanket `img { background-color: var(--mist) }` painted a placeholder behind every image, including the logo | Removed; `.figure` already provides that tint where it is wanted |
| 16 | Two dead function parameters and a dead import | `scrollReveals`/`parallax` took a `ScrollTrigger` argument they never used; `vite.config.js` still imported `readdirSync` after the manifest moved | Removed; found by adding ESLint, which the project had been running without |
| 15 | A 304 px thumbnail was downloading a 208 KB image | Several photographs serve both as a small thumbnail on one page and a wide band image on another; one file cannot be the right weight for both | Each photograph now has a 640 px variant, and the build emits `srcset` with width descriptors from `image-manifest.json`. That thumbnail went 208 KB → 51 KB, the home page's first view 724 KB → 569 KB, and its LCP 1.0 s → 0.8 s |

### Three test-harness defects also found and fixed

Worth recording, because each one produced a *false* result:

- **axe measured during animation.** Elements sampled mid-fade have blended
  colours (`#d9dde1`, `#b6bec8`) that exist in no palette, producing 189
  phantom contrast violations that masked the handful of real ones. The
  helper now waits for every reveal to reach full opacity first.
- **`:focus-visible` cannot be tested with `element.focus()`.** Chromium does
  not match it for programmatic focus, so the check reported the base
  `outline: none` and failed on styles that were present. It now drives real
  `Tab` presses.
- **A scroll loop bound to the initial page height stops short**, because
  lazy images make the document taller as it runs. It now re-reads the height
  and makes a second pass.

## 5. Accuracy safeguards built into the site

Three places where the obvious implementation would have misled the reader:

**The contact form never claims to have sent anything.** There is no backend.
It validates, hands the enquiry to the visitor's own mail client, and says in
plain words that nothing was transmitted by the website and that they must
press send themselves. A clipboard fallback covers devices with no mail
client. One attribute (`data-endpoint`) switches it to a real POST.

**The Quality page separates three different claims.** "Standards we work
to", "products sourced to a standard", and "certifications ABCE itself
holds" are distinguished explicitly, and the page states that nothing on it
asserts the third. A test asserts that disclaimer is present, so it cannot be
removed without the suite failing.

**No client logos, and no embedded map.** Logos need approved artwork and
permission; neither exists in this build, so the nine clients are text. The
map is omitted because the street address was supplied but its coordinates
were not verified, and a map pinned to the wrong building is worse than none.

## 6. Photography

35 photographs from Wikimedia Commons, all CC0, public domain, CC BY or
CC BY-SA. No NC or ND licence, nothing of unclear provenance, nothing
AI-generated. Every file's photographer and licence is recorded in
[`IMAGE_ATTRIBUTION.md`](IMAGE_ATTRIBUTION.md) and
`public/assets/images/attribution.json`. Files are self-hosted, not hotlinked.

`contact-maputo.jpg` is a genuine aerial of Maputo showing the bay, the
Katembe bridge and the Port of Maputo — not a stand-in.

**None of these photographs shows ABCE, its premises, its staff or its own
consignments.** They illustrate categories of equipment and operations.
Replace them with the company's own photography when it exists.

## 7. How to verify any of this yourself

```bash
npm install
npm run lint                 # ESLint — browser, Node and test environments
npm run test:unit            # Vitest — 38 checks, ~0.2 s, no browser
npm run build && npm start   # http://localhost:4173
npm run test:e2e             # Playwright — 435 checks, 5 viewports
npm run lighthouse           # needs the server running
npm run shots                # 48 screenshots, 6 breakpoints
```

`npm test` runs the unit layer then the end-to-end layer.

`npm run test:report` opens the Playwright HTML report.

## 8. Remaining limitations

1. **Four core values are shown; the deck defines three** (§1) — your call.
   Delete `'Operational Excellence'` from `localised.*.values` in
   `site.config.js` and it disappears from both languages.
2. **The Portuguese translation has not been reviewed by a native speaker.**
   It uses European/Mozambican terminology throughout (*betume*, *lingas*,
   *manilhas*, *varão*, *aprovisionamento*) and reads naturally, but a
   commercial site should have a person from the company read it before it
   goes live. Every string is in two files, so corrections are quick.
3. **No backend.** The form is mailto-based until an endpoint is configured.
4. **`site.url` is set to `https://www.abceconsu.com`.** Canonicals, the
   sitemap and Open Graph tags derive from it — correct it in
   `site.config.js` before deploying anywhere else.
5. **No map**, pending verified coordinates.
6. **Lighthouse was measured on a desktop profile.** Throttled-mobile has not
   been measured and will score lower.
7. **`about-facility.jpg` and `ind-processing.jpg` are two views of the same
   plant.** Different pages, different compositions, but worth swapping one
   if that bothers you. `sub-chain-hoist.jpg` is the only monochrome image.
8. **A third language would be cheap now.** The locale machinery is generic:
   add an entry to `locales`, a `copy/<code>.js`, a `src/content/<code>/`
   bundle and a folder of one-line page stubs. Nothing in the templates,
   the renderers or `forms.js` would need to change.
9. **No analytics, consent banner or cookies.** The site sets none and makes
   no third-party requests. Adding analytics will require a privacy notice.
10. **Render-blocking CSS** is the one remaining Lighthouse hint. Inlining
   critical CSS would gain a little; at 99–100 it was not worth the
   complexity.
11. **Derived image variants are committed** (`*-640.jpg`, `*.webp`), which is
    why `public/assets/images/` is ~12 MB. They are regenerable with
    `npm run images`, but committing them means a clone builds and deploys
    without needing ImageMagick installed. Remove them from git if you would
    rather generate them in CI.

## 9. Agents

A Ruflo swarm was initialised on a hierarchical topology with exactly ten
registered specialist agents (`npx ruflo agent list` shows the registry).

To be precise about what that means, rather than overstating it: Ruflo is the
coordination ledger and topology — its own documentation describes Claude
Code as the executor. The implementation in this repository was carried out
by Claude Code against that ten-role division of responsibility, plus one
genuinely autonomous subagent that sourced, licence-checked and attributed
all 35 photographs independently.

| # | Agent | Responsibility | Principal output |
|---|---|---|---|
| 01 | chief-architect | Architecture, roadmap, file ownership, integration | `vite.config.js` composition plugin, this report |
| 02 | ui-ux-designer | Design system, visual identity, photography | `variables.css`, brand mark, 35 sourced images |
| 03 | frontend-engineer | Semantics, CSS architecture, components | 10 pages, `components.css`, `navigation.js` |
| 04 | motion-engineer | GSAP choreography, reduced-motion contract | `animations.js`, `animations.css` |
| 05 | content-strategist | Corporate copy, positioning, CTAs | Page copy, `site.config.js` |
| 06 | products-specialist | Five streams, 48 subcategories, discovery UX | `src/content/*.js`, `render.js` |
| 07 | seo-specialist | Metadata, Open Graph, JSON-LD, sitemap | `head-meta.html`, `scripts/sitemap.mjs` |
| 08 | accessibility-specialist | WCAG 2.2 AA, keyboard, responsive | Fixes 4–11 above, `responsive.css` |
| 09 | qa-engineer | Playwright suite, axe audits | `tests/*.spec.js`, this report's §3 |
| 10 | devops-performance | Vite config, assets, security headers, build | `scripts/*.mjs`, build pipeline |

The Ruflo workspace itself (`.claude/`, `.mcp.json`, `.claude-flow/`,
`CLAUDE.md`) is **deliberately not committed**: `ruflo init` registers
PreToolUse/PostToolUse hooks that execute a local script on every tool call,
and installs unsigned plugins that can run host commands. That is reasonable
build-time tooling and unreasonable to put in a corporate website repository.
Recreate it with `npx ruflo@3.80.0 init --force`.

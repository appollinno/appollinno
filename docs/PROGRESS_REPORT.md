# Appollo Coffee Shop — Progress Report & Technical Handover

## How this was actually built

The brief asked for a 20-agent "Ruflo" swarm. No such orchestration tool
exists in this environment, and spawning 20 literally-concurrent fresh
agents would have meant re-deriving shared context 20 times over rather
than adding real parallelism — explained to the user at the start, who
chose "I lead, staged phases": one engineer (this session) working through
the brief's own 8 phases in order, writing all code directly. That's the
honest account of how the "20 specialized roles" map onto what happened:
each role's responsibilities were carried out, in the phase order the
brief specified, by one continuous thread of work rather than 20 separate
actors — the role names below are organizational labels for what was
done, not a claim that 20 agents ran.

## What's live in this branch

A working Next.js 16 application — not a mockup — covering every page and
flow in the brief:

- **Storefront**: homepage (cinematic hero, featured/best-seller
  collections, craftsmanship story, brewing guide, testimonials,
  newsletter), shop with search/filter/sort, product detail pages with
  galleries and real brewing/origin data, Our Story, Coffee Journal
  (list + article pages), Contact (working form).
- **Commerce**: Zustand cart with localStorage persistence, coupon codes,
  a three-step checkout that recomputes totals server-side, order
  confirmation.
- **Accounts**: registration/login, account dashboard, order history,
  saved products — session-cookie based, PBKDF2-hashed passwords.
- **Admin dashboard**: sales overview (computed from real orders placed
  this session), order management (status updates), inventory (stock
  adjustments), customer list, products list, content/promo overview —
  role-gated, separate login.
- **Brand system**: a real color/typography system (`app/globals.css`),
  not Tailwind defaults — verified for WCAG AA contrast (see below), with
  a documented reduced-motion path throughout.
- **38 real, licensed photographs** (Wikimedia Commons, CC-attributed —
  see docs/IMAGE_SOURCING.md), self-hosted, zero placeholder or
  AI-generated imagery.
- **Database schema** for the real backend (Postgres/Supabase, with RLS),
  not yet connected — see "What's mocked" below.
- **82 automated tests**: 22 Vitest unit tests, 60 Playwright e2e tests
  (navigation, shop/search, checkout, auth, admin, responsive layout,
  plus two dedicated accessibility suites) — all passing.
- **CI**: `.github/workflows/ci.yml` — lint, typecheck, unit tests, build,
  e2e, on every push/PR.

## What's mocked, and why that's the right call for now

Per the brief's own instructions ("do not make purchases or activate paid
services without approval," "use sandbox payment credentials"), and
because no Supabase project or payment sandbox credentials were provided
in this session:

- **Auth, orders, and inventory are file-backed**, not in a real
  database. This was a deliberate, documented choice (see
  docs/ARCHITECTURE.md) that lets the *entire* app — registration,
  login, checkout, admin — be exercised genuinely end-to-end today,
  rather than stubbing those flows out entirely while waiting on
  credentials. It is explicitly not production-ready, and the real
  schema it stands in for is already written and ready to swap in
  (docs/DEPLOYMENT.md has the exact steps).
- **Payment is mocked** — checkout validates and records a real order,
  but doesn't call Stripe/PayPal, because no sandbox keys were provided.
- **No live deployment** — nothing has been pushed to Vercel or any other
  host. That requires an explicit decision from the user per the brief.

Everything mocked is clearly marked `TODO` in the code, pointing at the
exact file/table that replaces it, so none of this needs to be
rediscovered later.

## Verified results (not claimed without testing)

The brief was explicit that Lighthouse targets are "targets to measure,
not results to claim without testing." Here's what was actually measured,
against the production build, in this sandboxed container:

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Home | 75–79 (ran 3×) | 100 | 100 | 100 |
| Shop | 73 | 100 (after a fix — see below) | 100 | 100 |
| Product detail | 77 | 100 | 100 | 100 |

Accessibility, Best Practices, and SEO hit the 95+/95+ targets everywhere
tested. Performance did not hit 90+ in this environment; docs/SECURITY.md
explains why that's plausibly an artifact of running Lighthouse's
throttling simulation inside a shared sandbox container rather than a
real gap in the app, and what to re-measure once deployed.

**Bugs this process actually found and fixed** (the point of running real
tools instead of asserting compliance):
- A Tailwind CSS specificity conflict made the hero's secondary button
  text nearly invisible (~1.2:1 contrast) on the photo background.
- The caramel accent color measured ~3.1:1 on light backgrounds — fails
  WCAG AA for text. Introduced a darker `--caramel-deep` token, verified
  at ~5:1+.
- `/shop` and `/journal` skipped from `<h1>` straight to `<h3>` — a real
  heading-order violation.
- A `SaveButton`'s `aria-label` didn't include its own visible text (ARIA
  label-content-name-mismatch).
- Next.js 16 silently stopped giving LCP images `fetchPriority="high"`
  automatically under the old `priority` prop — added it explicitly.
- Two separate bugs that only showed up under Playwright's concurrent
  multi-project test runs, not single manual testing: (1) the mock
  auth/orders/inventory stores used plain in-memory `Map`s, which Next.js
  doesn't reliably share across separately-bundled routes — fixed with a
  file-backed store; (2) `router.push()` immediately followed by
  `router.refresh()` after login could hit a stale client Router Cache
  entry for the destination, intermittently bouncing back to the login
  page — fixed with a hard navigation for post-auth redirects.
- An infinite re-render loop (`useSyncExternalStore` returning a new
  object reference every call) on the order confirmation page.

None of these would have been caught by eyeballing the UI once. This is
also the honest reason the build process took the shape it did: finding
and fixing real, reproducible bugs via automated testing, not just
writing code that looked right.

## Acceptance criteria — where things stand

| Criterion | Status |
|---|---|
| Premium visual quality | Built; a human should still look at it before calling this done — see "What a human should still do." |
| Fully responsive | Tested at narrow (390px) and desktop (1280px) viewports via Playwright. |
| Working navigation, catalog, cart, checkout (tested) | Yes — e2e-tested end to end. |
| Working auth | Yes, file-backed (see above). |
| Secure backend | Role checks, server-side total recomputation, hashed passwords, no secrets committed — see docs/SECURITY.md for what's real vs. still needed. |
| Working admin dashboard | Yes, against the same file-backed stores. |
| Cinematic animations | Framer Motion throughout, `prefers-reduced-motion` respected everywhere it's used. |
| Optimized images | `next/image`, self-hosted, explicit `fetchPriority` on LCP candidates, measured CLS of 0. |
| Accessibility | 100 on Lighthouse's axe-based audit on every page tested; also hand-verified contrast with a non-canvas-sampling method (axe-core has a known false-positive class on small uppercase/letter-spaced text — see tests/e2e/accessibility.spec.ts's comment). |
| Automated tests | 82 passing (unit + e2e). |
| Deployment documentation | docs/DEPLOYMENT.md. |
| Architecture diagrams | docs/ARCHITECTURE.md (text-based; no image-format diagram was produced). |
| Security and performance assessment | docs/SECURITY.md. |

## What a human should still do before calling this launch-ready

1. **Look at it.** Open the dev server and click through — no amount of
   automated testing substitutes for a human judging whether the design
   actually feels premium, on-brand, and coherent.
2. **Decide on Supabase + payment provider** and provide credentials via
   the secure credential flow (never pasted in chat) — docs/DEPLOYMENT.md
   has the exact integration steps once they're available.
3. **Re-run Lighthouse against a real deployment**, not this sandbox, to
   get a trustworthy Performance number.
4. **Review docs/SECURITY.md's "not production-ready" list** — rate
   limiting and email verification in particular should land before any
   real user traffic.

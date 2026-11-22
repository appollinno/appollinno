# Architecture

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack, Cache Components) | Single codebase for frontend + API routes; React Server Components keep the catalog/content static-shell fast; Cache Components (PPR) lets auth-gated pages stay dynamic without losing a static shell elsewhere. |
| Language | TypeScript | Shared types across data layer, API routes, and components. |
| Styling | Tailwind CSS v4 | Design tokens live as CSS variables in `app/globals.css`; no separate `tailwind.config.js` in v4 — theme is declared inline via `@theme`. |
| Animation | Framer Motion | Scroll-linked parallax (Hero), staggered reveals, page transitions (`app/template.tsx`), all gated behind `useReducedMotion()`. |
| Client state | Zustand (+ `persist`) | Cart (`lib/store/cart.ts`) and saved products (`lib/store/saved.ts`) — small, no need for a heavier state library. |
| Database (designed, not yet connected) | PostgreSQL via Supabase | Schema in `supabase/migrations/0001_init.sql`: customers, products, variants, orders, reviews, journal, promos, with RLS policies. |
| Testing | Vitest (unit) + Playwright (e2e) + axe-core | See `tests/`. |

No state management library beyond Zustand, no ORM, no CSS-in-JS — kept intentionally minimal per the project's "no unnecessary dependencies" instruction.

## Why there's no separate `frontend/`/`backend/` folder

Next.js App Router already is both: `app/*/page.tsx` renders the UI, `app/api/*/route.ts` is the backend. Splitting them into sibling folders would just add import-path indirection with no real benefit for a single-repo app.

## Directory layout

```
app/              routes: pages (page.tsx), API routes (api/*/route.ts), layout, metadata routes
components/       by domain: home/, shop/, product/, cart/, account/, admin/, layout/, ui/, seo/
lib/              domain logic: data/ (catalog, journal — currently static TS modules),
                  auth/, store/ (Zustand), orders.ts, inventory.ts, server-store.ts, utils.ts, types.ts
public/images/    self-hosted product/content photography (see docs/IMAGE_SOURCING.md)
supabase/         SQL migrations for the real backend, not yet connected
tests/            unit/ (Vitest) and e2e/ (Playwright)
docs/             this file, DEPLOYMENT.md, SECURITY.md, PROGRESS_REPORT.md
```

## What's real vs. mocked right now

This matters for anyone picking up the project, so it's stated plainly rather than left to be discovered:

| Feature | Status |
|---|---|
| Catalog, pricing, images, content | **Real data**, but stored as static TypeScript modules (`lib/data/*.ts`), not a database. |
| Cart | **Real**, client-side (Zustand + localStorage). No server-side cart. |
| Checkout | **Real flow**, server recomputes totals — but payment is **mocked**: `app/api/checkout/route.ts` records the order as paid without calling a payment provider. No sandbox Stripe/PayPal keys have been provided. |
| Auth (customer + admin) | **Functional but file-backed**, not Supabase Auth: `lib/auth/store.ts` hashes passwords with PBKDF2 and persists to a JSON file (`.data/`, gitignored) instead of a database. This exists so the whole app can be exercised end-to-end without credentials; it is explicitly documented in-code as not production-ready. |
| Orders, inventory | **Functional, file-backed** for the same reason (`lib/orders.ts`, `lib/inventory.ts`). The admin dashboard's order-status updates and stock adjustments are real writes, just not to Postgres yet. |
| Database schema | **Written, not connected** — `supabase/migrations/0001_init.sql` models the real tables (with RLS) that the file-backed stores above are standing in for. |
| Admin content/CMS | **Read-only** — journal articles and coupon codes are static data; there's no CMS write UI yet (the `journal_articles`/`promo_banners` tables are ready for one). |

### Why file-backed stores, not module-level state

An early version used plain in-memory `Map`s. Next.js can compile different routes (API route handlers vs. pages) into separate module bundles even within one `next start` process, so a write in one route was sometimes invisible to a read in another — intermittently breaking login immediately after registration. `lib/server-store.ts` fixes this by reading/writing a JSON file on disk (with a simple lock for atomic read-modify-write), which is one real shared resource regardless of how the JS bundles split. This is documented in the code and is itself a mock mechanism — see DEPLOYMENT.md for what replaces it.

## Request flow: a purchase

1. `/shop` → `ShopExplorer` (client component) filters/searches `PRODUCTS` (static data) client-side.
2. `/shop/[slug]` → `AddToCartForm` writes to the Zustand cart store (persisted to `localStorage`).
3. `/checkout` → multi-step form; on submit, `POST /api/checkout` **recomputes the subtotal/discount/shipping/total server-side** (never trusts client totals), validates the payload, and records the order via `lib/orders.ts`.
4. The client stores the returned order in `sessionStorage` and navigates to `/checkout/confirmation`, which reads it back (not a server round-trip, since there's no session tying an anonymous cart to an account yet).
5. `/admin/orders` reads the same file-backed order store and can update fulfillment status.

## Rendering model (Cache Components / PPR)

Next.js 16's Cache Components is enabled (`next.config.ts`). Practical consequences that shaped the code:

- Pages that read `cookies()` (account/admin auth gates) are wrapped in `<Suspense>` with the auth check inside an async child component, so the rest of the layout can still be part of a static shell.
- Any bare `new Date()`/`Date.now()` read during a component's render is flagged at build time as "unstable" (even inside a Client Component, since its SSR pass still executes). Values that differ between server and client (the footer's copyright year, the order-confirmation page's `sessionStorage` read) use `useSyncExternalStore` with a server-safe fallback — the officially recommended pattern — not `useState` + `useEffect`.
- `useSearchParams()` (shop/journal search & filters) is wrapped in `<Suspense>` per Next's requirement.

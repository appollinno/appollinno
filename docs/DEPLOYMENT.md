# Deployment

## Current state

Nothing has been deployed to production. This document describes how to
deploy, and — more importantly — what must change before a deploy is a
real production launch rather than a demo. Per the project brief: **do not
deploy to production or activate paid services without explicit
approval.**

## Quick deploy (demo/staging only)

The app builds and runs as a standard Next.js 16 app. On Vercel:

1. Import the GitHub repo, framework preset "Next.js" (auto-detected).
2. Set the environment variable below.
3. Deploy.

That's enough to get the site live with its current mock backend (file-backed
auth/orders/inventory, no real payments). **It will not survive a redeploy
or scale past one serverless instance** — see "Known limitation" below.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_SEED_PASSWORD` | Recommended | Password for the seeded `admin@appollo.coffee` account (`lib/auth/store.ts`). Defaults to `AppolloAdmin!2026` if unset — **do not leave the default in any deployment someone else can reach.** |
| `NODE_ENV` | Set by the platform | Controls the `Secure` flag on the session cookie (`app/api/auth/*/route.ts`) — must be `production` for HTTPS deployments. |

No other variables exist yet because no real external service (database,
payment provider, email) is connected. The sections below list what each
one needs once it's added.

### Known limitation: the file-backed mock stores

`lib/auth/store.ts`, `lib/orders.ts`, and `lib/inventory.ts` persist to
JSON files under `.data/` (via `lib/server-store.ts`) instead of a real
database. This exists so the whole app — registration, login, checkout,
the admin dashboard — works end-to-end without any credentials. It is
**not** suitable for production:

- Vercel's serverless filesystem is ephemeral and typically read-only
  outside `/tmp` — these writes may fail or vanish between invocations.
- Even where writable, each serverless instance has its own filesystem, so
  one customer's registration might not be visible to the instance that
  handles their next request.
- There's no backup, no migration path, no encryption at rest.

This must be replaced by the real Supabase backend (schema already
written) before any real traffic touches the site. Replacing it is the
single highest-priority item before going live — see below.

## Connecting the real backend (Supabase)

The schema is ready: `supabase/migrations/0001_init.sql` — customers,
products, variants, inventory, orders, order items, reviews, coupons,
journal articles, promo banners, with indexes and Row Level Security
policies (customers can only read/write their own rows; catalog/content
tables are public-read).

To connect it:

1. Create a Supabase project, run the migration (`supabase db push`, or
   paste the SQL into the Supabase SQL editor).
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (plus
   `SUPABASE_SERVICE_ROLE_KEY` for server-side admin writes) as environment
   variables.
3. Install `@supabase/supabase-js` and `@supabase/ssr`.
4. Replace, in order (each is independent, but this order minimizes
   churn):
   - `lib/data/products.ts` → a server-side fetch from the `products`/
     `product_variants`/`product_images` tables (keep the same `Product`
     shape from `lib/types.ts` so components don't change).
   - `lib/auth/store.ts` and `lib/auth/session.ts` → Supabase Auth
     (`auth.users` + the `customers` table, which the migration already
     models as 1:1 with `auth.users` for exactly this swap). Use Supabase's
     session cookie handling instead of the hand-rolled `appollo_session`
     cookie.
   - `lib/orders.ts` → the `orders`/`order_items` tables.
   - `lib/inventory.ts` → the `inventory` table.
5. Delete `lib/server-store.ts` and the `.data/` directory once nothing
   references them.

## Connecting real payments

`app/api/checkout/route.ts` currently marks every order `paymentStatus:
"paid"` without calling a payment provider — clearly marked `TODO` in the
code. To connect Stripe (the more common fit for this stack):

1. Get **sandbox/test** keys first — do not request or use live keys
   without explicit approval.
2. Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` as environment
   variables (ask for these via a secure credential flow, never pasted in
   chat).
3. Install `stripe`; create a Payment Intent (or Checkout Session) in
   `app/api/checkout/route.ts` instead of immediately marking the order
   paid; confirm payment client-side with `@stripe/stripe-js`.
4. Add a webhook route (`app/api/webhooks/stripe/route.ts`) to receive
   `payment_intent.succeeded`/`.payment_failed` and update the order's
   `paymentStatus` accordingly — this is the authoritative source of
   truth for payment state, not the client.
5. Only once sandbox checkout is verified end-to-end should production
   keys be requested, and only with explicit sign-off — per the project
   brief, this step requires approval.

## Email (newsletter, order confirmation, contact form)

`app/api/newsletter/route.ts` and `app/api/contact/route.ts` currently
just log to the server console (`TODO` comments mark this). Connecting a
provider (Resend, Postmark, SES) is a small, isolated change in those two
files plus a transactional "order confirmed" email triggered from
`app/api/checkout/route.ts`.

## CI/CD

`.github/workflows/ci.yml` runs on every push/PR: lint → typecheck → unit
tests → production build → Playwright e2e (against the built app). There
is no deploy step in CI — deployment is a manual decision, consistent with
"do not deploy to production without approval."

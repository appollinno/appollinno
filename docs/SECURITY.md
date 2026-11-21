# Security & Performance Assessment

This is a real assessment of the current state, not a checklist claimed
without verification — see docs/PROGRESS_REPORT.md for the actual test
results (Lighthouse, axe-core, Playwright) this is based on.

## Security

### What's implemented

- **Passwords**: never stored in plaintext. `lib/auth/store.ts` hashes
  with PBKDF2 (100,000 iterations, SHA-256, random 16-byte salt per user) —
  not a production-grade KDF (bcrypt/argon2 would be preferable, and
  Supabase Auth handles this correctly out of the box), but not a toy
  either.
- **Sessions**: an opaque random token (not a JWT encoding user data) in
  an `httpOnly`, `sameSite: lax` cookie, `secure` when `NODE_ENV ===
  "production"`. The token maps server-side to a user id — nothing about
  the session is readable or forgeable from the client.
- **Server-side total recomputation**: `app/api/checkout/route.ts` ignores
  any price/total the client sends and recalculates subtotal, discount,
  shipping, and total from the authoritative product/coupon data. A
  tampered client request cannot buy coffee below its real price.
- **Role-based access**: admin routes (`app/admin/**`, `app/api/admin/**`)
  check `getCurrentAdmin()` — a session whose underlying user has
  `role: "admin"` — not a client-supplied flag. Every `/api/admin/*` route
  independently re-checks this server-side (not just the page), so there's
  no API endpoint reachable by a logged-in customer that a non-admin
  session can reach by calling it directly.
- **Input validation at the boundary**: every API route validates its
  body before acting on it (email format, required fields, known enum
  values for payment method / order status) and returns 400 on failure,
  not a 500 or silent acceptance.
- **No secrets in the repo**: no API keys, connection strings, or
  credentials are committed. `ADMIN_SEED_PASSWORD` has a documented
  development-only default that must be overridden for any reachable
  deployment (see docs/DEPLOYMENT.md).

### OWASP Top 10, specifically

| Risk | Status |
|---|---|
| Injection | No SQL yet (static data + file-backed JSON stores) — N/A for now, but the written Supabase schema uses parameterized access via Supabase's client libraries, not string-built SQL, so this stays true once connected. |
| Broken authentication | Mitigated as above; **not production-grade** — see "What's not" below. |
| Sensitive data exposure | Passwords hashed, never returned by any API (`toPublicUser()` strips `passwordHash`/`salt` from every response). |
| Broken access control | Role checks on every admin route, both page and API. |
| Security misconfiguration | `next.config.ts` has no `dangerouslyAllowSVG` or permissive CORS; no debug endpoints exposed. |
| XSS | React escapes all rendered content by default. The one `dangerouslySetInnerHTML` use (`components/seo/JsonLd.tsx`) only ever receives `JSON.stringify()` of data this app constructs itself — never user input. |
| CSRF | Cookie is `sameSite: lax`, which blocks cross-site POST submission of the session cookie from third-party forms. No CSRF token scheme beyond that yet — acceptable for same-origin fetch-based mutations, worth revisiting once cross-origin integrations exist. |

### What's not production-ready (by design, and documented in-code)

- **The file-backed auth/orders/inventory stores** (`lib/server-store.ts`)
  are plaintext JSON on disk. Fine for a demo on a single machine; not
  fine once real customer data is involved. Replacing them with Supabase
  (schema already written, RLS policies included) is the top priority
  before any real launch — see docs/DEPLOYMENT.md.
- **No rate limiting** on login/register/contact/newsletter — a real
  deployment needs this before launch (even a basic in-memory or
  Vercel-edge-based limiter) to prevent credential-stuffing and spam.
- **No email verification** on registration.
- **No CSP header** configured yet.

## Performance

Measured with Lighthouse against the production build, run in this
sandboxed development container (not the eventual production host) —
see docs/PROGRESS_REPORT.md for the full numbers and what they mean.
Headline: **Accessibility 100, Best Practices 100, SEO 100** on every
page tested; **Performance 73–79**, short of the 90+ target, in this
environment specifically.

What's already in place:
- Every content image goes through `next/image` (automatic responsive
  `srcset`, lazy loading by default, modern format negotiation) and is
  self-hosted (`public/images/commons/`), not fetched from a third party
  at request time.
- True LCP-candidate images (hero, product gallery, journal cover) use
  `fetchPriority="high"` explicitly — Next.js 16 deprecated the old
  `priority` prop's automatic behavior (see docs/ARCHITECTURE.md).
- Fonts load via `next/font` (self-hosted, no render-blocking third-party
  font request).
- Measured Cumulative Layout Shift: **0** on the homepage.
- Cache Components (Partial Prerendering) means most routes ship a static
  HTML shell with only the genuinely dynamic parts (cart, auth-gated
  content) streamed in.

Why Performance likely scores higher on a real deployment: Lighthouse's
default mode simulates a throttled mobile network/CPU on top of an
*observed* trace, and in a shared/virtualized sandbox container, CPU
scheduling jitter in that observed trace gets amplified by the simulation
math — individual asset sizes measured in the same run are small (the
hero image is ~28KB transferred), and main-thread work (0.9–2.2s across
runs) is itself noisy run to run. A dedicated Vercel deployment, with a
real edge CDN and no neighbor contention, is the environment Lighthouse's
simulated-throttling model is actually designed to approximate — this
should be re-measured once deployed rather than assumed.

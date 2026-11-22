# Appollo Coffee Shop

A specialty coffee e-commerce site and brand experience — Next.js 16, TypeScript,
Tailwind CSS v4, Framer Motion. Single-origin coffee, roasted in small
batches, sold through a cinematic, editorial storefront.

**Read [docs/PROGRESS_REPORT.md](docs/PROGRESS_REPORT.md) first** — it's
the honest, current state of the project: what's real, what's mocked and
why, what's actually been measured and tested, and what's left before this
is launch-ready.

## Documentation

| Doc | Covers |
|---|---|
| [docs/PROGRESS_REPORT.md](docs/PROGRESS_REPORT.md) | Project status, verified test/audit results, acceptance criteria, what's next |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack, directory layout, what's real vs. mocked, rendering model |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | How to deploy, and how to connect Supabase/payments/email |
| [docs/SECURITY.md](docs/SECURITY.md) | Security posture (OWASP-mapped) and performance findings |
| [docs/IMAGE_SOURCING.md](docs/IMAGE_SOURCING.md) | Where the photography comes from and its required attribution |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). An admin account is
seeded automatically at `admin@appollo.coffee` — password from
`ADMIN_SEED_PASSWORD` if set, otherwise `AppolloAdmin!2026` (development
only; see docs/DEPLOYMENT.md before deploying anywhere reachable).

## Scripts

```bash
npm run dev         # start the dev server
npm run build        # production build
npm run start        # run the production build
npm run lint          # eslint
npm run test:unit    # Vitest unit tests
npm run test:e2e     # Playwright e2e tests (builds + starts the app first)
```

## Project structure

```
app/              routes: pages, API routes, layout, metadata
components/       by domain: home/, shop/, product/, cart/, account/, admin/, layout/, ui/, seo/
lib/              domain logic: data/, auth/, store/ (Zustand), orders.ts, inventory.ts, types.ts
public/images/    self-hosted, real, CC-licensed coffee photography
supabase/         SQL migrations for the real backend (see docs/ARCHITECTURE.md)
tests/            unit/ (Vitest) and e2e/ (Playwright)
docs/             architecture, deployment, security, image sourcing, progress report
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for why this doesn't
have separate `frontend/`/`backend/` folders.

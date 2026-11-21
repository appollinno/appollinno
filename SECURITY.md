# Security Notes

## Dependency: Next.js version & `npm audit`

**Current pin:** `next@14.2.35` (latest release on the 14.2.x line).

### Status
`npm audit` reports residual advisories (1 critical, 1 high) against Next.js
even on `14.2.35`. This is expected: the Next.js 14 line is end-of-life, and
the only version npm recognises as fully patched is `next@16.4.6` — a
**breaking** major upgrade. The fixes for these specific advisories are not
backported to 14.x.

### Decision
We are **keeping `14.2.35`** for now and documenting the residual risk, rather
than taking the breaking Next 16 upgrade.

### Risk assessment (why this is acceptable here)
This project is a static, pre-rendered marketing site. The outstanding
advisories almost all require framework features this site does **not** use:

| Advisory class | Used here? |
| --- | --- |
| `next/image` Image Optimization API (DoS / RCE via AVIF/SVG) | No — no `next/image` remote patterns |
| Server Actions (DoS, SSRF, payload abuse) | No — no Server Actions |
| Middleware / proxy (SSRF, cache poisoning, auth bypass) | No — no `middleware.ts` |
| `rewrites` (SSRF, request smuggling) | No — none configured |
| Custom server / self-hosted forwarding | No — static output |

The one advisory that touches local use is the **dev-server origin**
information-exposure issue, which only applies while running `npm run dev` on a
developer machine, not in production.

### Remediation path (when ready)
Upgrade to a supported major:

```bash
npm install next@latest react@latest react-dom@latest
npm run build        # fix any App Router breaking changes
npm audit            # expect a clean report
```

This is the correct long-term fix; it is deferred only because the current
runtime exposure is minimal for a static site.

_Last reviewed: 2026-11-21._

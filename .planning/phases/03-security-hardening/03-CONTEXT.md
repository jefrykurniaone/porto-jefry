# Phase 3: Security Hardening - Context

**Gathered:** 2026-06-06T00:00:00.000+08:00
**Status:** Ready for planning

<domain>
## Phase Boundary

Harden two specific security issues identified in Phase 2's architecture review:
1. **SEC-01:** The CV generation API derives the client IP from spoofable request headers (`x-real-ip`, `x-forwarded-for`) — replace with Vercel-injected `req.ip`.
2. **SEC-02:** The Content Security Policy (CSP) permits connections to `fonts.googleapis.com` and `fonts.gstatic.com` even though Inter is self-hosted via `next/font/google` at build time — remove these unnecessary domains.

**SEC-03 (distributed rate limiting via Upstash):** Explicitly skipped. In-memory rate limiter is acceptable for a low-traffic portfolio site. No external services needed for this phase.

</domain>

<decisions>
## Implementation Decisions

### SEC-01 — Trusted IP Source
- **D-01:** Replace the current `req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'` expression with `req.ip ?? '127.0.0.1'` in `src/app/api/generate-cv/route.ts`.
- **D-02:** Local dev fallback remains `'127.0.0.1'` — `req.ip` is `undefined` in the Next.js dev server, so the existing behavior (rate-limit localhost as a single bucket) is preserved.
- **D-03:** No change to rate limiting logic, constants, or eviction strategy — only the IP source changes.

### SEC-02 — CSP Font Domain Cleanup
- **D-04:** Remove `https://fonts.googleapis.com` from `style-src` in **both** the dev and prod CSP branches in `src/middleware.ts`.
- **D-05:** Remove `https://fonts.gstatic.com` from `font-src` in **both** the dev and prod CSP branches.
- **D-06:** Rationale: `Inter` is loaded via `next/font/google` (`src/app/[locale]/layout.tsx` line 9, 15) which downloads and self-hosts font assets at build time — the browser never fetches from Google's servers at runtime.
- **D-07:** Dev CSP is cleaned up too (not left permissive) — `next/font/google` self-hosts in all environments, so the domains are equally unnecessary in development.

### SEC-03 — Skipped
- **D-08:** Upstash / Vercel KV distributed rate limiting is deferred indefinitely. The in-memory Map-based rate limiter is sufficient for portfolio-scale traffic. This item remains in `REQUIREMENTS.md` but will not be implemented in this phase.

### Agent's Discretion
- Test updates for the IP extraction change — mock or assert `req.ip` path.
- Middleware test updates are not required (middleware is excluded from coverage requirements) — but if tests exist for `buildCsp`, update them to not assert font domains.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Roadmap / Requirements
- `.planning/ROADMAP.md` — Phase 3 goal and SEC-01..SEC-03 requirement IDs
- `.planning/REQUIREMENTS.md` — Full SEC requirement descriptions
- `.planning/PROJECT.md` — Project constraints (300-line/40-line limits, test coverage thresholds)

### Relevant source files
- `src/app/api/generate-cv/route.ts` — IP extraction at lines 99-102; `checkRateLimit` function at lines 30-41
- `src/middleware.ts` — `buildCsp` function (lines 9-35); dev CSP `style-src`/`font-src` at lines 17-18; prod CSP at lines 29-30

### Font self-hosting evidence
- `src/app/[locale]/layout.tsx` line 9: `import { Inter } from 'next/font/google'`
- `src/app/[locale]/layout.tsx` line 15: `const inter = Inter({ subsets: ['latin'] })`
- `next/font/google` downloads font CSS and woff2 files at build time, serves them from `/_next/static/` — no runtime connection to Google Fonts

</canonical_refs>

<code_context>
## Existing Code Insights

### Current IP Extraction (SEC-01 target)
```ts
// src/app/api/generate-cv/route.ts lines 99-102
const ip =
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '127.0.0.1';
```
Replace with:
```ts
const ip = req.ip ?? '127.0.0.1';
```

### Current CSP Font Directives (SEC-02 target)
Dev CSP (to be cleaned):
```ts
`style-src 'self' 'unsafe-inline' 'nonce-${nonce}' https://fonts.googleapis.com`,
"font-src 'self' https://fonts.gstatic.com",
```
Prod CSP (to be cleaned):
```ts
`style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
"font-src 'self' https://fonts.gstatic.com",
```
After fix (both environments):
```ts
`style-src 'self' ... <no googleapis>`,
"font-src 'self'",
```

### No Other Google Fonts References
- No `@import url('https://fonts.googleapis.com')` in any CSS file
- No other component imports from `next/font/google`
- Removing the CSP domains is safe — confirmed by grep across all src files

</code_context>

<deferred>
## Deferred Items

- **SEC-03 (Upstash distributed rate limiting):** Skipped by user decision — portfolio-scale traffic makes in-memory store acceptable. Can be revisited if the site experiences unexpected traffic spikes.

</deferred>

---

*Phase: 3-Security Hardening*
*Context gathered: 2026-06-06T00:00:00.000+08:00*

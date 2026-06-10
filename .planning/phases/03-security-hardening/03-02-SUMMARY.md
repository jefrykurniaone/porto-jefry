---
phase: 03-security-hardening
plan: 02
subsystem: api
tags: [rate-limiting, vercel, ip-extraction, security, csp, vitest]

# Dependency graph
requires:
  - phase: 02-ux-polish
    provides: CV-download API route (/api/generate-cv) with in-memory rate limiter
provides:
  - SEC-01 trusted client-IP rate-limit identity via @vercel/functions ipAddress()
  - SEC-03 distributed rate limiting formally closed as accepted-risk (route.ts comment + REQUIREMENTS.md)
  - SEC-01-a/b/c behavioral tests for the CV-download route
affects: [03-03 SEC-02 CSP re-audit, future rate-limit revisits]

# Tech tracking
tech-stack:
  added: ["@vercel/functions (^3.7.0)"]
  patterns:
    - "Trusted IP extraction: ipAddress(req) ?? '127.0.0.1' reads only the Vercel-injected x-real-ip, never a client-supplied header"
    - "Accepted-risk documentation: in-code comment at the risk site + REQUIREMENTS.md entry with rationale and reopen trigger"

key-files:
  created:
    - src/app/api/generate-cv/route.test.ts
  modified:
    - src/app/api/generate-cv/route.ts
    - package.json
    - package-lock.json
    - .planning/REQUIREMENTS.md

key-decisions:
  - "Replaced the spoofable x-real-ip/x-forwarded-for fallback chain with ipAddress(req) ?? '127.0.0.1' (D-01, D-02) — clients can no longer forge the rate-limit bucket key"
  - "No x-forwarded-for fallback added: ipAddress() reads only the infra-injected x-real-ip; '127.0.0.1' covers local dev where the header is absent (D-03)"
  - "Rate-limit logic (checkRateLimit, window, max, Map, 429 + Retry-After) left untouched (D-04)"
  - "SEC-03 distributed rate limiting closed as accepted-risk, not implemented (D-12..D-15) — per-instance Map is adequate at portfolio scale because the expensive render is module-cached per locale (CV_BUFFER_CACHE)"

patterns-established:
  - "Vercel-trusted IP source: import { ipAddress } from '@vercel/functions' for any per-IP gating on Vercel-hosted routes"
  - "Accepted-risk closure recorded in two synchronized locations: the code at the risk site and REQUIREMENTS.md traceability"

requirements-completed: [SEC-01, SEC-03]

# Metrics
duration: ~51min
completed: 2026-06-10
---

# Phase 3 Plan 02: SEC-01 Trusted IP + SEC-03 Accepted-Risk Summary

**Rate-limit identity now derives solely from Vercel's infra-injected x-real-ip via `ipAddress(req)` — a spoofed `x-forwarded-for` can no longer reset the per-IP bucket — and SEC-03 distributed limiting is formally closed as an accepted risk in code and requirements.**

## Performance

- **Duration:** ~51 min (first commit 22:53 → last commit 23:44, 2026-06-10 +07:00)
- **Started:** 2026-06-10T22:53:12+07:00
- **Completed:** 2026-06-10T23:44:29+07:00
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- **SEC-01:** Replaced the three-line, client-spoofable IP fallback chain (`x-real-ip` → `x-forwarded-for` split → `127.0.0.1`) with the single trusted expression `const ip = ipAddress(req) ?? '127.0.0.1';`. `ipAddress()` reads only the Vercel-injected `x-real-ip`, which clients cannot forge.
- **SEC-01 tests:** Added `route.test.ts` with SEC-01-a/b/c behavioral tests (`vi.mock('@vercel/functions')`, distinct mock IP per case to avoid module-level `rateLimitStore` pollution). All three pass.
- **SEC-03:** Documented the in-memory per-instance limiter as a closed accepted-risk — an inline comment above `rateLimitStore` (rationale + reopen trigger) and a `[x] **SEC-03**` accepted-risk entry plus `Closed (accepted-risk)` traceability row in REQUIREMENTS.md. No Upstash/Vercel KV infrastructure introduced (D-14).
- Added `@vercel/functions` (^3.7.0) as a production dependency.

## Task Commits

Each task was committed atomically:

1. **Task 1: Failing SEC-01 route tests + install @vercel/functions** - `797e7b7` (test)
2. **Task 2: Replace spoofable IP chain with ipAddress() + SEC-03 accepted-risk comment** - `08e74b8` (feat)
3. **Task 3: Mark SEC-03 closed/accepted-risk in REQUIREMENTS.md** - `ca294f6` (docs)

_Note: Plan metadata commit was `928c49c` (docs(03): create phase plan)._

## Files Created/Modified
- `src/app/api/generate-cv/route.test.ts` - NEW. SEC-01-a/b/c tests mocking `@vercel/functions` ipAddress.
- `src/app/api/generate-cv/route.ts` - Imports and uses `ipAddress(req) ?? '127.0.0.1'`; SEC-03 accepted-risk comment above `rateLimitStore`; rate-limit logic unchanged.
- `package.json` / `package-lock.json` - `@vercel/functions` (^3.7.0) production dependency.
- `.planning/REQUIREMENTS.md` - SEC-03 marked `[x]` closed/accepted-risk; Traceability row → `Closed (accepted-risk)`.

## Decisions Made
None beyond the plan — followed D-01..D-04 (SEC-01) and D-12..D-15 (SEC-03) as specified.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None during the planned implementation. **Post-hoc closeout note:** this plan's three task commits all landed in a prior session, but that session was interrupted before `03-02-SUMMARY.md` and STATE/ROADMAP tracking were written. The safe-resume gate in the re-run flagged the missing SUMMARY against existing production commits. Verified on disk (all acceptance-criteria greps pass; `npx vitest run src/app/api/generate-cv/route.test.ts` → 3/3 green) that the work is complete and correct, then closed out manually (this SUMMARY + tracking) rather than re-executing.

## User Setup Required
None - no external service configuration required. `@vercel/functions` `ipAddress()` works on Vercel automatically and falls back to `127.0.0.1` in local dev.

## Next Phase Readiness
- SEC-01 and SEC-03 complete. The only remaining Phase 3 work is **03-03 (SEC-02)** — post-SGDS CSP re-audit (remove Google Fonts domains, recompute the theme-init hash) plus middleware tests.
- No blockers for 03-03; it modifies `src/middleware.ts` and `src/middleware.test.ts`, which do not overlap with this plan's files.

---
*Phase: 03-security-hardening*
*Completed: 2026-06-10*

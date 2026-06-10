---
phase: 03-security-hardening
verified: 2026-06-11T00:59:00Z
status: human_needed
score: 3/3 must-haves verified
overrides_applied: 0
gaps: []
human_verification:
  - test: "Post-merge production smoke test: after merging gsd/phase-03-security-hardening to main and Vercel deploys, load https://porto-jefry.vercel.app/en with localStorage['sgds-theme']='night' set, then reload. Open DevTools console and confirm zero CSP script-src violations for the inline theme-init script, and the night theme applies with no flash."
    expected: "No CSP violation for sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc= in the browser console; sgds-night-theme class applied; no theme flash on reload."
    why_human: "The Vercel preview is auth-walled (401 to unauthenticated fetches per 03-03-SUMMARY.md). The authenticated production deploy is the only context where the full CSP + live script hash can be confirmed by eyeball in DevTools. The D-10 programmatic check passed against the live script body; this is a final browser sanity check."
  - test: "REQUIREMENTS.md SEC-01 and SEC-02 checkbox status: the requirement bullets for SEC-01 and SEC-02 remain [ ] (unchecked) and traceability rows show 'Pending', even though the implementations are complete."
    expected: "SEC-01 and SEC-02 are marked [x] and traceability shows Complete (or Closed) — or a team decision documents that requirements closure tracking for these two items is deferred to a later phase."
    why_human: "The PLAN.md tasks explicitly preserved the SEC-01/SEC-02 rows unchanged (Task 3 acceptance criteria: 'Do not alter the SEC-01 or SEC-02 rows/bullets'). This was an intentional scope exclusion — but leaves the requirements document inconsistent with the delivered implementation. A human needs to decide: update REQUIREMENTS.md now as a cleanup commit, or accept the documented scope boundary."
---

# Phase 3: Security Hardening Verification Report

**Phase Goal:** The CV download API trusts only platform-provided IP identity, CSP is tightened to what is actually used, and rate limiting is safe across serverless instances.
**Verified:** 2026-06-11T00:59:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `/api/generate-cv` reads client IP exclusively from `ipAddress(req)` (@vercel/functions); spoofed `x-forwarded-for` has no effect on rate-limit identity | VERIFIED | `route.ts:8` imports `{ ipAddress } from '@vercel/functions'`; `route.ts:106`: `const ip = ipAddress(req) ?? '127.0.0.1';`; grep for `x-forwarded-for` returns no matches; SEC-01-a/b/c tests pass 3/3 |
| 2 | CSP `style-src` no longer lists `https://fonts.googleapis.com`; `font-src` no longer lists `https://fonts.gstatic.com`; prod `script-src` theme-init hash matches `sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc=` | VERIFIED | `middleware.ts`: no match for `fonts.googleapis.com` or `fonts.gstatic.com`; `middleware.ts:28` contains exact new hash; stale hash `sha256-1lsbnEG5y+...` absent; SEC-02-a/b/c/d tests pass 14/14 |
| 3 | SEC-03 (distributed rate limiting) formally closed as accepted-risk — in-memory per-instance limiter stays, documented in route.ts AND REQUIREMENTS.md | VERIFIED | `route.ts:17-22`: multi-line comment above `rateLimitStore` containing `accepted-risk` and `SEC-03`; `REQUIREMENTS.md:28`: `[x] **SEC-03**` with accepted-risk rationale; traceability row `Closed (accepted-risk)` |

**Score:** 3/3 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/app/api/generate-cv/route.ts` | Trusted IP via `ipAddress()` + SEC-03 accepted-risk comment | VERIFIED | `import { ipAddress } from '@vercel/functions'` at line 8; `ipAddress(req) ?? '127.0.0.1'` at line 106; SEC-03 comment at lines 16-22 |
| `src/app/api/generate-cv/route.test.ts` | SEC-01-a/b/c behavioral tests using vi.mock('@vercel/functions') | VERIFIED | 3 tests present; `vi.mock('@vercel/functions')` at line 5; all 3 tests pass |
| `package.json` | `@vercel/functions` production dependency | VERIFIED | `@vercel/functions: "^3.7.0"` in `dependencies` (not devDependencies) |
| `src/middleware.ts` | Google Fonts domains removed, new hash, `buildCsp` exported | VERIFIED | `export function buildCsp(nonce: string)` at line 9; new hash at line 28; no `fonts.googleapis.com` or `fonts.gstatic.com`; stale hash absent |
| `src/middleware.test.ts` | SEC-02-a/b/c/d assertions on both NODE_ENV branches | VERIFIED | 14 tests covering both branches; all 14 pass |
| `.planning/REQUIREMENTS.md` | SEC-03 marked `[x]` closed/accepted-risk; traceability updated | VERIFIED | Line 28: `[x] **SEC-03**` with rationale; traceability line 93: `Closed (accepted-risk)` |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `route.ts` GET handler | `@vercel/functions` | `import { ipAddress } from '@vercel/functions'` | VERIFIED | Exact import string present at route.ts:8; `ipAddress(req)` called at route.ts:106 |
| `route.ts` GET handler | `checkRateLimit(ip)` | `ipAddress(req) ?? '127.0.0.1'` | VERIFIED | Exact pattern present at route.ts:106; rate-limit logic unchanged (RATE_LIMIT_MAX_REQUESTS=5, RATE_LIMIT_WINDOW_MS=60_000, rateLimitStore Map all present) |
| `middleware.ts buildCsp prod branch` | theme-init inline script | `sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc=` in script-src | VERIFIED | Hash present at middleware.ts:28; D-10 programmatic match confirmed in 03-03-SUMMARY.md |
| `middleware.test.ts` | `buildCsp(nonce)` | direct call asserting CSP string | VERIFIED | `buildCsp(` called in test file; 14 assertions pass |

### Data-Flow Trace (Level 4)

Not applicable — this phase modifies security configuration (middleware CSP strings, IP extraction), not data-rendering components. There are no dynamic data flows to trace.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| SEC-01-a/b/c: ipAddress() rate-limit identity | `npx vitest run src/app/api/generate-cv/route.test.ts` | 3/3 passed | PASS |
| SEC-02-a/b/c/d: CSP string assertions on both branches | `npx vitest run src/middleware.test.ts` | 14/14 passed | PASS |
| Full test suite regression | `npx vitest run` | 598/598 passed (32 files) | PASS |
| No `x-forwarded-for` in route.ts | grep pattern | No matches | PASS |
| No `fonts.googleapis.com` in middleware.ts | grep pattern | No matches | PASS |
| No `fonts.gstatic.com` in middleware.ts | grep pattern | No matches | PASS |
| No stale hash in middleware.ts | grep for `1lsbnEG5y` | No matches | PASS |
| New hash in middleware.ts | grep for `UP1BueuQL` | Match at line 28 | PASS |

### Probe Execution

No probes declared in PLAN.md or conventional `scripts/*/tests/probe-*.sh` paths present. Step 7c: SKIPPED (no probes defined for this phase).

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| SEC-01 | 03-02-PLAN.md | Rate limiting uses platform-provided IP identity (ipAddress()) | SATISFIED | `ipAddress(req) ?? '127.0.0.1'` in route.ts:106; x-forwarded-for absent; 3 behavioral tests passing |
| SEC-02 | 03-03-PLAN.md | CSP style-src no longer includes fonts.googleapis.com; font-src no longer includes fonts.gstatic.com; prod hash recomputed | SATISFIED | Both domains absent from middleware.ts; new hash present; 14 tests passing |
| SEC-03 | 03-02-PLAN.md | In-memory rate limiter formally closed as accepted-risk | SATISFIED | Accepted-risk comment in route.ts:16-22; REQUIREMENTS.md line 28 `[x]` with rationale; traceability `Closed (accepted-risk)` |

**NOTE — REQUIREMENTS.md documentation gap (not a blocker):** SEC-01 and SEC-02 requirement bullets remain `[ ]` (unchecked) in REQUIREMENTS.md, and traceability rows still read "Pending". This was an explicit scope exclusion — PLAN 03-02 Task 3 acceptance criteria states "Do not alter the SEC-01 or SEC-02 rows/bullets." The code implementations are complete and all tests pass. This is a requirements-tracking hygiene gap requiring human decision (see Human Verification Required section).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | — | No TBD/FIXME/XXX markers, no placeholder returns, no empty handlers found in modified files | — | — |

Scanned: `src/app/api/generate-cv/route.ts`, `src/app/api/generate-cv/route.test.ts`, `src/middleware.ts`, `src/middleware.test.ts`. No debt markers or stub patterns detected.

### Human Verification Required

### 1. Production CSP + Theme-Init Smoke Test

**Test:** After merging to `main` and the Vercel production deploy completes, load `https://porto-jefry.vercel.app/en` with `localStorage['sgds-theme']='night'` set, then reload. Open DevTools console.

**Expected:** Zero CSP `script-src` violations in the console; the `sgds-night-theme` class is applied to `<html>` with no theme flash on reload; Vercel Analytics still loads (no CSP violation for `va.vercel-scripts.com` or `vitals.vercel-insights.com`); fonts render correctly (Inter self-hosted).

**Why human:** The Vercel preview is auth-walled (returns 401 to unauthenticated fetches). The D-10 programmatic hash check was run against the live source script body and a local `next start` production server — both confirmed the hash matches. The authenticated production deployment is the only context in which browser DevTools can confirm the CSP authorizes the inline script with no violation. The orchestrator's verification note confirms this check was completed against the live site; this is a final post-merge confirmation.

### 2. REQUIREMENTS.md SEC-01 and SEC-02 Traceability Closure

**Test:** Review `.planning/REQUIREMENTS.md` lines 26-27 (SEC-01, SEC-02 bullets) and traceability rows (lines 91-92). Both remain `[ ]` unchecked and "Pending".

**Expected:** Either (a) update SEC-01 and SEC-02 to `[x]` with "Complete" in traceability as a cleanup commit, OR (b) make a documented team decision that requirements-tracking closure for these items is out of scope for this phase and will be addressed in a later phase.

**Why human:** PLAN 03-02 Task 3 explicitly stated "Do not alter the SEC-01 or SEC-02 rows/bullets" — so the executor correctly preserved them. However the implementations ARE complete. Whether to update the requirements document now or leave it is a team/project-management decision, not a code correctness issue. The ROADMAP phase goal and all code success criteria are met regardless.

### Gaps Summary

No technical gaps blocking the phase goal. All three success criteria are met in the codebase:

1. **SEC-01:** `ipAddress(req)` is the exclusive IP source in `route.ts`; `x-forwarded-for` is completely absent; behavioral tests confirm the behavior.
2. **SEC-02:** Both Google Fonts domains removed from `middleware.ts` (both branches); new `sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc=` hash present; stale hash absent; 14 tests confirm all CSP string properties.
3. **SEC-03:** In-memory limiter retained with documented accepted-risk comment in `route.ts` and `[x]` closure in `REQUIREMENTS.md`.

Two human-verification items remain:
- Post-merge production browser smoke test (recommended, not a code blocker)
- REQUIREMENTS.md documentation hygiene for SEC-01/SEC-02 checkboxes (intentional scope exclusion in the plans; requires human decision on cleanup)

---

_Verified: 2026-06-11T00:59:00Z_
_Verifier: Claude (gsd-verifier)_

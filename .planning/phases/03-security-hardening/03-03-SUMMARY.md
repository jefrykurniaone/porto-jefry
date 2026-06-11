---
phase: 03-security-hardening
plan: 03
subsystem: infra
tags: [csp, middleware, security-headers, next-themes, sgds, vitest, vercel]

# Dependency graph
requires:
  - phase: 03-security-hardening
    provides: "03-01 ad-hoc CSP hotfix (unsafe-inline for style-src, ThemeProvider nonce) — this plan completes the formal SEC-02 re-audit on top of it"
provides:
  - SEC-02 post-SGDS CSP re-audit — Google Fonts domains removed, theme-init script hash recomputed to the SGDS-era value
  - buildCsp() exported as a named export for direct unit testing
  - SEC-02-a/b/c/d behavioral tests asserting on buildCsp output (both dev and prod branches)
  - Programmatic D-10 verification that the committed hash matches the live deployed theme-init script
affects: [future CSP changes, any change to the layout.tsx theme-init script (requires hash recompute)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSP hash authorization: the inline theme-init script carries NO nonce at runtime (x-nonce is null on Vercel AND in next start), so the static sha256 hash in script-src is load-bearing"
    - "buildCsp(nonce) is a pure function returning the CSP string — unit-tested directly by toggling NODE_ENV for the dev/prod branches"

key-files:
  created:
    - src/middleware.test.ts
  modified:
    - src/middleware.ts

key-decisions:
  - "Removed https://fonts.googleapis.com (style-src) and https://fonts.gstatic.com (font-src) from BOTH dev and prod branches — fonts are self-hosted via next/font, domains confirmed unused by CF-2 audit (D-05, D-06)"
  - "Replaced stale next-themes-era hash sha256-1lsbnEG5y+... with the recomputed SGDS-era hash sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc= (D-08)"
  - "Preserved the load-bearing security split: 'unsafe-inline' + NO nonce in style-src; 'strict-dynamic' + nonce + static hash in prod script-src; va.vercel-scripts.com + vitals.vercel-insights.com retained (D-07, D-09, D-11)"
  - "Exported buildCsp as a named export (minimal change for testability; default middleware + config exports unchanged)"
  - "D-10 hash verified programmatically against the LIVE deployed HTML — never transcribed from a screenshot"

patterns-established:
  - "Whenever the layout.tsx theme-init inline script changes, recompute its sha256 and update the script-src hash in middleware.ts — the script has no nonce at runtime so the hash is the sole authorization"

requirements-completed: [SEC-02]

# Metrics
duration: ~2min (impl) + D-10 deploy/verify
completed: 2026-06-11
---

# Phase 3 Plan 03: SEC-02 Post-SGDS CSP Re-Audit Summary

**Tightened `buildCsp()` — removed the unused Google Fonts domains from both branches and swapped the stale `next-themes`-era theme-init hash for the recomputed SGDS-era hash — restoring CSP least-privilege and un-blocking the production theme-init script (which the stale hash had silently been blocking).**

## Performance

- **Duration:** ~2 min implementation (00:22 → 00:24, 2026-06-11 +07:00) + D-10 deploy & verification
- **Started:** 2026-06-11T00:22:24+07:00
- **Completed:** 2026-06-11 (after D-10 verification)
- **Tasks:** 3 (2 code + 1 human-verify checkpoint)
- **Files modified:** 2

## Accomplishments
- **SEC-02 (D-05/D-06):** Removed `https://fonts.googleapis.com` from `style-src` and `https://fonts.gstatic.com` from `font-src` in both the dev and prod branches of `buildCsp()`. Confirmed safe by the CF-2 font audit (no `@font-face`/gstatic/googleapis in SGDS CSS; Inter is self-hosted via `next/font`).
- **SEC-02 (D-08):** Replaced the stale `sha256-1lsbnEG5y+jDum9W3sr9rXc9EniVVZtsPUtyiDRfsik=` with the recomputed `sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc=` in the prod `script-src`. The stale hash had been silently blocking the SGDS theme-init script in production (theme-flash prevention was failing).
- **Preserved (D-07/D-09/D-11):** `'unsafe-inline'` + no nonce in `style-src`; `'strict-dynamic'` + `'nonce-${nonce}'` + the static hash in prod `script-src`; `https://va.vercel-scripts.com` (script-src) and `https://vitals.vercel-insights.com` (connect-src); dev-only `ws: wss:`.
- **Testability:** Exported `buildCsp` as a named export and added `src/middleware.test.ts` (14 tests covering SEC-02-a/b/c/d across both NODE_ENV branches). Full suite 598/598 green.

## Task Commits

1. **Task 1: Failing buildCsp tests SEC-02-a/b/c/d (RED scaffold)** - `f5cbeb1` (test)
2. **Task 2: CSP re-audit — remove Google Fonts domains + replace stale hash** - `a5d5c69` (feat)
3. **Task 3: D-10 human-verify checkpoint** - no code commit (verification task; result recorded below)

_Interim: `4110726` (chore) recorded Task 1+2 completion in STATE.md while awaiting the D-10 checkpoint._

## Files Created/Modified
- `src/middleware.ts` - `buildCsp` rewritten per the research Target State: Google Fonts domains removed (both branches), prod script-src hash recomputed, `buildCsp` now exported. Security split preserved.
- `src/middleware.test.ts` - NEW. 14 tests calling `buildCsp(nonce)` directly, asserting SEC-02-a/b/c/d on both the dev and prod branches (NODE_ENV toggled).

## Decisions Made
None beyond the plan — followed D-05..D-11 exactly.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. Tasks 1+2 went RED→GREEN as designed; full suite, tsc, and build all clean.

## D-10 Verification Record (checkpoint:human-verify, gate=blocking)

The D-10 hash re-verification was performed **programmatically (never transcribed)** and the result is recorded here per the plan's `<artifacts_produced>`.

**1. Programmatic hash match against LIVE production HTML** (`https://porto-jefry.vercel.app/en`):
   - The theme-init inline `<script>` body was fetched from the live deployed HTML, and `crypto.createHash('sha256').update(body,'utf8').digest('base64')` computed.
   - Result: `sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc=` — **exact match** to the committed hash.
   - This is valid because this plan changes only the CSP *header* (`middleware.ts`), not the theme-init *script* (`layout.tsx`), so the live script bytes are identical pre/post-deploy.
   - The local source script body hashes to the same value, confirming source ↔ committed hash ↔ live deployed script all agree.

**2. Branch deployed to a Vercel preview** for the exact HEAD commit (`4110726`): deployment state `success`. (Preview is behind Vercel Deployment Protection — 401 to unauthenticated fetches.)

**3. Deployed-CSP + browser behavior verification** (run against a local `next start` production server, which executes the same prod-branch middleware; the Vercel preview is auth-walled):
   - **CSP response header** (production middleware output):
     `script-src 'self' 'nonce-…' 'strict-dynamic' 'sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc=' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; font-src 'self'; … connect-src 'self' https://vitals.vercel-insights.com; frame-ancestors 'none'`
     — new hash present; no `fonts.googleapis.com`/`fonts.gstatic.com`; no stale hash; `strict-dynamic` + both analytics domains + `unsafe-inline` preserved.
   - **No CSP violation** in the browser console on load or after a night-theme reload (only a benign localhost-only `[Vercel Web Analytics] Failed to load /_vercel/insights/script.js` 404 that does not occur on a real Vercel deploy). No page errors.
   - **Theme-init script executed**: the rendered script carries **no nonce** (x-nonce is null in `next start` just as on Vercel), so it was authorized **solely by the sha256 hash** — and it ran, adding the `sgds-night-theme` class on a night-theme reload. This faithfully reproduces the production hash-dependency and confirms D-09 (no flash, script not blocked).
   - **Fonts + layout intact** (screenshot): Inter renders, hero/nav/buttons render correctly in night theme — confirming the Google Fonts domain removal caused no regression (D-11).

**Verdict:** Committed hash equals the live-script hash; the deployed CSP authorizes the script with no violation; fonts and analytics are unaffected. D-10 satisfied.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 3 SEC-01, SEC-02, SEC-03 are all implemented. Ready for phase verification.
- **Recommended post-merge smoke test:** after merging to `main` and the production deploy completes, load the live `/en` once with `localStorage['sgds-theme']='night'` and confirm DevTools shows no CSP `script-src` violation (the authenticated production deploy is the only context the auth-walled preview couldn't be eyeballed in directly).

---
*Phase: 03-security-hardening*
*Completed: 2026-06-11*

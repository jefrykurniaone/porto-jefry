---
phase: 3
slug: security-hardening
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-10
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Derived from `03-RESEARCH.md` § Validation Architecture. Task IDs (`{N}-{plan}-{task}`)
> are assigned by the planner; the Requirement → Test map below is the authoritative
> contract every plan task must satisfy.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.7 + React Testing Library, jsdom env |
| **Config file** | `vitest.config.ts` (setup: `src/test/setup.ts`) |
| **Quick run command** | `npx vitest run src/app/api/generate-cv/route.test.ts` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~5 s (single file) · full suite ≈ existing 583-test baseline |

---

## Sampling Rate

- **After every task commit:** Run the quick command for the file touched
  (`npx vitest run src/app/api/generate-cv/route.test.ts` or `npx vitest run src/middleware.test.ts`).
- **After every plan wave:** Run `npm run test` (full suite must stay green).
- **Before `/gsd-verify-work`:** Full suite green **and** `npx tsc --noEmit` clean **and**
  `npm run build` succeeds.
- **Max feedback latency:** < 10 seconds for the quick command.

---

## Per-Task Verification Map

> Mapped to phase requirements. The planner binds each row to a concrete task ID and plan/wave.

| Test ID | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists |
|---------|-------------|------------|-----------------|-----------|-------------------|-------------|
| SEC-01-a | SEC-01 | T-3-01 (IP spoof) | `ipAddress(req)` return value is the rate-limit bucket key | unit | `npx vitest run src/app/api/generate-cv/route.test.ts` | ❌ W0 |
| SEC-01-b | SEC-01 | T-3-01 | `ipAddress(req) === undefined` → falls back to `'127.0.0.1'` | unit | same | ❌ W0 |
| SEC-01-c | SEC-01 | T-3-01 | 6th request within 60 s window → 429 + `Retry-After` header | unit | same | ❌ W0 |
| SEC-02-a | SEC-02 | T-3-02 (CSP) | `buildCsp(nonce)` output excludes `fonts.googleapis.com` (both branches) | unit | `npx vitest run src/middleware.test.ts` | ❌ W0 |
| SEC-02-b | SEC-02 | T-3-02 | `buildCsp(nonce)` output excludes `fonts.gstatic.com` (both branches) | unit | same | ❌ W0 |
| SEC-02-c | SEC-02 | T-3-02 | `buildCsp(nonce)` prod `script-src` contains `sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc=` and NOT the stale `sha256-1lsbnEG5y+...` | unit | same | ❌ W0 |
| SEC-02-d | SEC-02 | T-3-02 | `buildCsp(nonce)` preserves `va.vercel-scripts.com` (script-src) and `vitals.vercel-insights.com` (connect-src) | unit | same | ❌ W0 |

*Status legend: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

**Coverage note:** `src/app/api/**` and `src/middleware.ts` are excluded from coverage thresholds
in `vitest.config.ts`. These new tests must PASS but do not count toward the 80% line/function/statement
(65% branch) threshold. Global coverage must not regress.

**SEC-03:** Closed as accepted-risk (D-12/D-13) — no automated test. Verified by inspection that the
documenting code comment exists at `rateLimitStore` and that `REQUIREMENTS.md` marks SEC-03 closed.

---

## Wave 0 Requirements

- [ ] `src/app/api/generate-cv/route.test.ts` — covers SEC-01-a/b/c; `vi.mock('@vercel/functions', () => ({ ipAddress: vi.fn() }))` with a distinct IP per case to avoid module-Map state pollution.
- [ ] `src/middleware.test.ts` — covers SEC-02-a/b/c/d; calls `buildCsp(nonce)` directly and asserts on the returned string (both dev and prod branches via `NODE_ENV`).

*(No framework install needed — vitest + testing-library already installed.)*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Candidate CSP hash matches the **live deployed** theme-init script | SEC-02 (D-10) | The authoritative bytes are the production-rendered HTML, not source; whitespace/escaping could differ. Requires the deployed URL. | After deploy: `curl -s <prod-url>` → extract the inline theme-init `<script>` body → `node -e "crypto.createHash('sha256').update(body,'utf8').digest('base64')"` → assert it equals `UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc=`. Prod URL: `BASE_URL` in `src/utils/constants.ts` (likely `https://porto-jefry.vercel.app`). Never transcribe the hash from a screenshot (D-10). |
| Theme-init script executes (no theme flash) on the deployed prod site | SEC-02 (D-09) | `x-nonce` is null on Vercel at runtime; only the static hash authorizes the script. Browser-only check. | Load deployed `/en` in a fresh browser with `localStorage['sgds-theme']='night'`; confirm no CSP `script-src` violation in DevTools console and night theme applies without flash. |

---

## Validation Sign-Off

- [ ] All tasks have an `<automated>` verify command or a Wave 0 test-file dependency
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers both new test files (route + middleware)
- [ ] No watch-mode flags in any verify command
- [ ] Feedback latency < 10 s for the quick command
- [ ] `nyquist_compliant: true` set in frontmatter (after planner binds task IDs)

**Approval:** pending

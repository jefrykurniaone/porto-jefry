# Phase 3: Security Hardening - Context

**Gathered:** 2026-06-10
**Status:** Ready for planning

> **Rewritten 2026-06-10** (was 2026-06-06). The prior version predated the Phase 5 SGDS
> migration (completed 2026-06-08), which removed `next-themes` and rewrote the theme-init
> script, and predated the 03-01/03-02 CSP hotfixes. All decisions below are grounded in the
> current post-SGDS code. See `03-LEARNINGS.md` for the hotfix history.

<domain>
## Phase Boundary

Three security hardenings to the CV-download API and the Content Security Policy. Scope is
fixed by ROADMAP.md — this phase clarifies HOW, not WHAT:

1. **SEC-01** — Rate-limit identity is derived from spoofable request headers
   (`x-real-ip` / `x-forwarded-for`). Replace with a trustworthy platform-provided client IP.
2. **SEC-02** — The CSP still permits `fonts.googleapis.com` (`style-src`) and
   `fonts.gstatic.com` (`font-src`) even though all fonts are self-hosted. Full post-SGDS
   CSP re-audit: remove the unused Google Fonts domains AND fix the stale theme-init script
   hash left behind by the hotfixes.
3. **SEC-03** — Distributed rate limiting. **Decision: formally closed as accepted-risk
   (not implemented)** — the in-memory limiter stays. This resolves the prior env-var blocker.

</domain>

<decisions>
## Implementation Decisions

### SEC-01 — Trusted Client IP Source
- **D-01:** Replace the header-based IP expression in `src/app/api/generate-cv/route.ts:99-102`
  with the official Vercel helper `ipAddress(req)` from `@vercel/functions`, falling back to
  `'127.0.0.1'`.
- **D-02:** Add `@vercel/functions` as a dependency. Chosen over `req.ip` because
  `NextRequest.ip` is **removed in Next.js 15** — `ipAddress()` survives the eventual upgrade.
- **D-03:** Local dev: `ipAddress(req)` returns `undefined` in the Next.js dev server →
  `'127.0.0.1'` fallback preserves the existing single-bucket localhost behavior. No erroring.
- **D-04:** No change to rate-limit logic, constants (`RATE_LIMIT_WINDOW_MS`,
  `RATE_LIMIT_MAX_REQUESTS`), the `Map` store, or eviction (`checkRateLimit` at lines 30-41).
  Only the IP source changes.

### SEC-02 — Full Post-SGDS CSP Re-Audit
- **D-05:** Remove `https://fonts.googleapis.com` from `style-src` in **both** the dev
  (`middleware.ts:17`) and prod (`middleware.ts:29`) CSP branches.
- **D-06:** Remove `https://fonts.gstatic.com` from `font-src` in **both** dev
  (`middleware.ts:18`) and prod (`middleware.ts:30`) — **but only after** verifying the SGDS
  theme CSS (`day.css` / `night.css` / `sgds.css` in node_modules) contains no internal
  `@font-face` / `@import` pointing at `fonts.gstatic.com`. Grep confirmed zero references in
  `src/`; SGDS bundled CSS must be checked in research before removal.
- **D-07:** Keep `'unsafe-inline'` in `style-src`. SGDS web components inject shadow-DOM styles
  and `next/image` emits inline `style="..."` — both need it. Do **not** re-introduce a nonce
  into `style-src` (03-02 CSP trap: a nonce silently disables `'unsafe-inline'`).
- **D-08:** Recompute the `script-src` SHA-256 hash for the **current** theme-init inline script
  (`layout.tsx:65-70`, the `sgds-theme` localStorage reader). The hardcoded
  `'sha256-1lsbnEG5y+jDum9W3sr9rXc9EniVVZtsPUtyiDRfsik='` (`middleware.ts:28`) was computed for
  the old `next-themes`-era script and is almost certainly stale → script blocked in prod →
  theme-flash silently returns.
- **D-09:** The hash is **load-bearing**, not redundant: `(await headers()).get('x-nonce')`
  returns `null` at runtime on Vercel (03-02 surprise), so the `nonce` attribute is effectively
  absent and `'strict-dynamic'` + the static hash is what authorizes the script. Keep the
  `nonce={nonce}` prop (harmless) but the hash MUST match the live script.
- **D-10:** Verify the recomputed hash **programmatically** against deployed production HTML
  (Node `crypto`), never transcribed from a screenshot (03-02 lesson: base64 is OCR-hostile;
  PR #22→#23 shipped a broken fix this way).
- **D-11:** Do not remove `https://va.vercel-scripts.com` (`script-src`) or
  `https://vitals.vercel-insights.com` (`connect-src`) — Vercel Analytics is still mounted
  (`layout.tsx:83`). CSP audit must not break analytics.

### SEC-03 — Distributed Rate Limiting: Closed (Accepted Risk)
- **D-12:** SEC-03 is **formally closed as won't-implement**, not deferred indefinitely.
  Rationale: the in-memory per-instance `Map` is adequate for portfolio-scale traffic, and the
  rendered PDF is module-cached per locale (`CV_BUFFER_CACHE`) so the expensive path
  (sharp + `@react-pdf/renderer`) runs at most once per locale per instance lifetime — the
  per-instance limit guards the only costly operation acceptably.
- **D-13:** Document the trade-off in a code comment at the rate-limiter and in REQUIREMENTS.md
  (mark SEC-03 closed with rationale). This is the showcase-honest choice: a documented,
  reasoned accepted-risk reads better than an unfinished TODO.
- **D-14:** This **resolves the prior STATE.md blocker** — no Upstash Redis / Vercel KV
  provisioning, no new env vars, no external service. Phase 3 is fully unblocked.
- **D-15:** Revisit trigger: if Vercel Analytics shows sustained abusive traffic to
  `/api/generate-cv`, reopen distributed rate limiting as its own new phase.

### Claude's Discretion
- Test updates for SEC-01: mock `ipAddress` / assert the new IP code path in the route tests;
  keep coverage ≥ 80%.
- `buildCsp` tests (if any) — update assertions that reference the removed font domains or the
  old script hash. Middleware is excluded from coverage requirements, but existing tests must
  stay green.
- Exact mechanism for hash recomputation (Node `crypto.createHash('sha256')` over the script
  body) is implementation detail.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Roadmap / Requirements / Constraints
- `.planning/ROADMAP.md` — Phase 3 goal, SEC-01..SEC-03 requirement IDs, success criteria
- `.planning/REQUIREMENTS.md` — full SEC requirement descriptions
- `.planning/PROJECT.md` — constraints: 300-line/40-line limits, 80% coverage thresholds,
  routing rules (`@/i18n/routing`)

### Hotfix history — MUST read before touching CSP
- `.planning/phases/03-security-hardening/03-LEARNINGS.md` — 03-01/03-02 CSP hotfix learnings:
  the hash pattern, the `x-nonce`-null-on-Vercel surprise, the OCR/screenshot lesson, the
  nonce-in-`style-src` trap
- `.planning/phases/03-security-hardening/03-01-SUMMARY.md` — what the merged CSP hotfix (PR #21)
  actually changed

### Source files (current post-SGDS line numbers)
- `src/middleware.ts` — `buildCsp` (lines 9-35); dev `style-src`/`font-src` (17-18); prod
  `script-src` with stale hash (28), `style-src`/`font-src` (29-30)
- `src/app/api/generate-cv/route.ts` — IP extraction (99-102); `checkRateLimit` (30-41);
  in-memory store (16-19); `CV_BUFFER_CACHE` (57)
- `src/app/[locale]/layout.tsx` — theme-init inline script (65-70); `x-nonce` read (60);
  Vercel `<Analytics />` (83); `Inter` self-hosted via `next/font/google` (9, 16, 64)
- `src/app/globals.css` — SGDS theme `@import`s (lines 1-4): `day.css`, `night.css`, `sgds.css`,
  `utility.css` — all local node_modules, build-time

### External
- `@vercel/functions` `ipAddress()` — official API for client IP on Vercel (replaces `req.ip`)
- SGDS bundled theme CSS under `node_modules/@govtechsg/sgds-web-component/themes/` — research
  must inspect for any internal `gstatic`/`googleapis` `@font-face` before SEC-02 `font-src`
  removal (D-06)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `checkRateLimit` / `evictExpiredEntries` (`route.ts:21-41`): unchanged by this phase — only
  the IP feeding into `checkRateLimit(ip)` changes (SEC-01).
- `buildCsp(nonce)` (`middleware.ts:9-35`): single source of truth for CSP; both font-domain
  removal (SEC-02) and hash recompute (SEC-02) edit here.

### Established Patterns
- CSP nonce strategy is split (03-02 pattern): `script-src` = nonce + `'strict-dynamic'` +
  static hash; `style-src` = `'unsafe-inline'` **without** nonce. Preserve this split.
- Server layout reads `x-nonce` once and distributes it (`layout.tsx:60`) — but the value is
  null on Vercel at runtime, hence the load-bearing hash.

### Integration Points
- `/api/generate-cv` is **not** covered by the middleware matcher (`api` excluded,
  `middleware.ts:74`) — rate limiting lives entirely in the route handler. SEC-01 touches only
  the route; SEC-02 touches only middleware. The two fixes are independent.

</code_context>

<specifics>
## Specific Ideas

- The portfolio is an explicit GovTech/SGDS showcase — a documented, reasoned accepted-risk for
  SEC-03 is preferred over an unfinished distributed-rate-limit stub.
- Hash verification must be programmatic against live production HTML (03-02 burned ~10 min and
  an extra PR on a screenshot-transcribed hash).

</specifics>

<deferred>
## Deferred Ideas

- **Distributed rate limiting (SEC-03 / Upstash / Vercel KV):** closed as accepted-risk for this
  milestone (D-12). Reopen as a new phase only if analytics show sustained abuse (D-15).
- **Root-cause of `x-nonce` returning null on Vercel:** left unresolved (03-02). The static-hash
  workaround is sufficient; a real fix (Vercel infra / `next-intl` header forwarding) is its own
  investigation, out of scope here.

</deferred>

---

*Phase: 3-Security Hardening*
*Context gathered: 2026-06-10*

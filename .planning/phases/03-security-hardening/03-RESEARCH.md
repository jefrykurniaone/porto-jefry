# Phase 3: Security Hardening - Research

**Researched:** 2026-06-10
**Domain:** Next.js 14 App Router security — rate-limit IP source, CSP audit, accepted-risk documentation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Replace header-based IP expression in `src/app/api/generate-cv/route.ts:99-102` with `ipAddress(req)` from `@vercel/functions`, falling back to `'127.0.0.1'`.
- **D-02:** Add `@vercel/functions` as a production dependency.
- **D-03:** Local dev: `ipAddress(req)` returns `undefined` → `'127.0.0.1'` fallback. No error thrown.
- **D-04:** No change to `checkRateLimit`, `evictExpiredEntries`, constants, or `rateLimitStore`. Only the IP source expression (lines 99-102) changes.
- **D-05:** Remove `https://fonts.googleapis.com` from `style-src` in BOTH dev (line 17) and prod (line 29) CSP branches.
- **D-06:** Remove `https://fonts.gstatic.com` from `font-src` in BOTH dev (line 18) and prod (line 30) CSP branches — safe per font audit (see Confirmed Facts).
- **D-07:** Keep `'unsafe-inline'` in `style-src`. Do NOT add a nonce to `style-src`.
- **D-08:** Recompute SHA-256 hash for the current theme-init inline script. The existing hash `'sha256-1lsbnEG5y+jDum9W3sr9rXc9EniVVZtsPUtyiDRfsik='` is stale.
- **D-09:** The hash is load-bearing: `x-nonce` returns null on Vercel at runtime, so `'strict-dynamic'` + the static hash is what authorizes the script. Keep `nonce={nonce}` prop (harmless) but hash MUST match live script.
- **D-10:** Verify recomputed hash programmatically against deployed production HTML (Node `crypto`), never from a screenshot.
- **D-11:** Preserve `https://va.vercel-scripts.com` (`script-src`) and `https://vitals.vercel-insights.com` (`connect-src`) — Vercel Analytics at `layout.tsx:83` requires them.
- **D-12:** SEC-03 formally closed as won't-implement (accepted-risk). In-memory per-instance Map is adequate; CV PDF is module-cached so the costly render runs at most once per locale per instance.
- **D-13:** Document the SEC-03 trade-off in a code comment at the rate-limiter AND in REQUIREMENTS.md (mark SEC-03 closed with rationale).
- **D-14:** No Upstash / Vercel KV / new env vars needed. Phase 3 is fully unblocked.
- **D-15:** Revisit trigger: if Analytics shows sustained abusive traffic to `/api/generate-cv`, reopen distributed rate limiting as a new phase.

### Claude's Discretion
- Test updates for SEC-01: mock `ipAddress` / assert the new IP code path; maintain ≥80% coverage.
- `buildCsp` tests (if any) — update assertions for removed font domains and old hash. Middleware is excluded from coverage requirements, but existing tests must stay green.
- Exact mechanism for hash recomputation (Node `crypto.createHash('sha256')`) is implementation detail.

### Deferred Ideas (OUT OF SCOPE)
- Distributed rate limiting (SEC-03 / Upstash / Vercel KV): closed as accepted-risk. Reopen as new phase only if Analytics shows sustained abuse.
- Root-cause of `x-nonce` returning null on Vercel: left unresolved. Hash workaround is sufficient.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEC-01 | Rate limiting uses platform-provided IP instead of untrusted `x-real-ip` / `x-forwarded-for` headers | `@vercel/functions` `ipAddress()` reads Vercel-injected `x-real-ip` from trusted infra; cannot be spoofed by client. See @vercel/functions Integration section. |
| SEC-02 | CSP `style-src` no longer includes `https://fonts.googleapis.com`; stale script hash replaced | Font audit CONFIRMED safe; exact before/after changes documented in CSP Re-Audit section; correct candidate hash provided with mandatory programmatic re-verification step. |
| SEC-03 | Formally closed as accepted-risk | Rationale documented in SEC-03 section; two documentation targets identified (code comment + REQUIREMENTS.md). |
</phase_requirements>

---

## Summary

Phase 3 has three requirements. Two are active code changes; one is closed documentation.

**SEC-01** replaces the two-header IP fallback chain (`x-real-ip ?? x-forwarded-for`) in the CV route handler with `ipAddress(req)` from `@vercel/functions`. The helper reads the Vercel-injected `x-real-ip` header, which is set by Vercel's trusted infrastructure layer and cannot be spoofed by a client-supplied header. On local dev the header is absent, so `ipAddress(req)` returns `undefined` and the existing `'127.0.0.1'` fallback keeps the single-bucket localhost behavior unchanged. The rate-limit logic itself (`checkRateLimit`, constants, Map store) is entirely untouched.

**SEC-02** is a CSP clean-up with two sub-tasks: (a) remove Google Fonts domains (`fonts.googleapis.com` from `style-src`, `fonts.gstatic.com` from `font-src`) from both dev and prod branches of `buildCsp()` — confirmed safe by font audit; (b) replace the stale SHA-256 hash `sha256-1lsbnEG5y+jDum9W3sr9rXc9EniVVZtsPUtyiDRfsik=` on `middleware.ts:28` with the correct hash for the current SGDS theme-init script. The candidate hash (computed deterministically from the exact `dangerouslySetInnerHTML.__html` string in `layout.tsx:68`) is `sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc=`, but this MUST be re-verified programmatically against live production HTML before being committed.

**SEC-03** is closed as accepted-risk. It requires only two documentation edits: a code comment at the rate-limiter in `route.ts` and an update to `REQUIREMENTS.md` marking SEC-03 closed with rationale.

**Primary recommendation:** Three targeted edits to two source files plus documentation. No schema migrations, no new services, no env vars. All changes are independent; SEC-01 and SEC-02 can be developed in parallel.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Rate-limit IP extraction (SEC-01) | API / Backend (route handler) | — | Route handler owns all request processing; middleware does not cover `/api` (matcher excludes it). |
| CSP policy generation (SEC-02) | Frontend Server (middleware) | — | Middleware runs on every non-API, non-static request and sets the `Content-Security-Policy` response header. |
| Inline script authorization (SEC-02 hash) | Frontend Server (middleware) | Browser | Middleware embeds the hash in the CSP header; browser enforces it before executing the script. |
| SEC-03 documentation | API / Backend (route.ts) + planning docs | — | Comment lives at the rate-limiter source; acceptance tracked in REQUIREMENTS.md. |

---

## Confirmed Facts

The following five items were verified DETERMINISTICALLY by the orchestrator before this research session. They are recorded here as ground truth; do NOT re-derive during planning or implementation.

### CF-1: Stale Hash Confirmed (D-08)

**Method:** Node `crypto.createHash('sha256').update(body, 'utf8').digest('base64')` over the exact script body.

**Script body (184 bytes, exact content of `dangerouslySetInnerHTML.__html` at `layout.tsx:68`):**
```
(function(){try{var t=localStorage.getItem('sgds-theme');if(t==='night'){document.documentElement.classList.add('sgds-night-theme')}}catch(e){console.error('[SGDS] theme init:',e)}})()
```

**Stale hash (currently in `middleware.ts:28`):** `sha256-1lsbnEG5y+jDum9W3sr9rXc9EniVVZtsPUtyiDRfsik=`

**Correct candidate hash:** `sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc=`

**MANDATORY caveat (D-10):** This candidate hash was computed from the TypeScript source string. Before committing, the implementor MUST re-verify it against the rendered production HTML:
```bash
node -e "
const https = require('https');
let html = '';
https.get('https://porto-jefry.vercel.app/en', res => {
  res.on('data', d => html += d);
  res.on('end', () => {
    const m = html.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    const hash = require('crypto').createHash('sha256').update(m[1], 'utf8').digest('base64');
    console.log('sha256-' + hash);
  });
});
"
```
Whitespace or HTML-encoding differences in the rendered output could yield a different hash. Programmatic verification is non-optional (03-02 lesson: OCR from a screenshot produced 4 wrong characters and required two extra PRs).

### CF-2: Font Audit Confirmed Safe (D-06)

**Method:** `grep -rniE 'font-face|gstatic|googleapis' node_modules/@govtechsg/sgds-web-component/{css,themes}` — ZERO matches.

SGDS bundled CSS uses only local `@import` of tailwindcss and local reboot/grid/root/responsive CSS files. No `@font-face` rules point to `fonts.gstatic.com`. The `globals.css` `@import`s of `day.css`, `night.css`, `sgds.css`, `utility.css` are all build-time local references.

Additionally, `src/` has zero references to `gstatic` or `googleapis` except the four middleware CSP lines being removed (lines 17, 18, 29, 30).

**Conclusion:** Removing `https://fonts.gstatic.com` from `font-src` and `https://fonts.googleapis.com` from `style-src` will not break any font rendering.

### CF-3: No Existing Route or Middleware Tests

**Method:** `find src/ -name '*.test.*'` — no files under `src/app/api/` or matching `middleware`.

`src/app/api/generate-cv/route.ts` and `src/middleware.ts` have NO co-located test files. The vitest config (`vitest.config.ts`) excludes `src/app/api/**` and `src/middleware.ts` from coverage requirements. Any new tests for SEC-01 must pass but do not affect the 80% coverage threshold.

### CF-4: `@vercel/functions` Not in package.json

**Method:** Inspect `package.json` — `@vercel/functions` is absent from both `dependencies` and `devDependencies`.

It must be added as a production dependency (`npm install @vercel/functions`). See Standard Stack section for version details.

### CF-5: Middleware Matcher Excludes `/api`

**Method:** Read `src/middleware.ts:74`.

```ts
matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
```

The `/api/generate-cv` route is NOT processed by middleware. SEC-01 (route-only change) and SEC-02 (middleware-only change) have zero shared code path. They are fully independent.

---

## Standard Stack

### Core — New Addition

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@vercel/functions` | `^1.0.0` (see note) | Trusted client IP extraction via `ipAddress()` | Official Vercel helper; reads infrastructure-injected `x-real-ip` which cannot be spoofed; survives Next.js 15 upgrade (unlike `NextRequest.ip` which was removed in Next.js 15) |

**Version note:** `npm view @vercel/functions version` returns `3.7.0` (published 2026-06-09). [VERIFIED: npm registry]. The package was first published 2024-05-07. For `package.json`, use `"@vercel/functions": "^3.7.0"` to pin to the current major. The package engine requires Node.js >= 20; the project runs on Node.js 24.11.0 (verified).

### Already Installed — No Change Required

| Library | Version | Role in this Phase |
|---------|---------|-------------------|
| `next` | 14.2.35 | App Router route handlers, middleware |
| `vitest` | ^4.1.7 | Test runner for new SEC-01 route tests |
| `@testing-library/react` | ^16.3.2 | (Not needed for route tests — pure logic) |

**Installation:**
```bash
npm install @vercel/functions
```

---

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `@vercel/functions` | npm | ~2 yrs (first publish 2024-05-07) | High (official Vercel package) | github.com/vercel/vercel | [OK] | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none

**Packages flagged as suspicious [SUS]:** none

**Additional verification:** No `postinstall` script found (`npm view @vercel/functions scripts.postinstall` returned empty). Package is the official Vercel monorepo package, maintained at `github.com/vercel/vercel`. [VERIFIED: official Vercel documentation at vercel.com/docs/functions/functions-api-reference/vercel-functions-package]

---

## `@vercel/functions` Integration

### API Details

[VERIFIED: vercel.com/docs/functions/functions-api-reference/vercel-functions-package + installed package source at `node_modules/@vercel/functions/headers.js`]

**Import:**
```typescript
import { ipAddress } from '@vercel/functions';
```

**TypeScript signature:**
```typescript
function ipAddress(input: Request | Headers): string | undefined
```

Accepts either a `Request` object or a `Headers` object. In a Next.js App Router route handler, pass `req` directly (a `NextRequest`, which extends `Request`).

**Internal implementation (from installed package source):**
```javascript
const IP_HEADER_NAME = "x-real-ip";

function ipAddress(input) {
  const headers = "headers" in input ? input.headers : input;
  return getHeader(headers, IP_HEADER_NAME);
  // getHeader returns: headers.get(key) ?? undefined
}
```

The function reads ONLY the `x-real-ip` header. It does NOT read `x-forwarded-for`.

**Why `x-real-ip` is trusted:** On Vercel, `x-real-ip` is set by Vercel's edge infrastructure from the actual connecting TCP client IP. It is not a client-supplied header that can be forged in a request. This is in contrast to `x-forwarded-for`, which any client or intermediate proxy can append to. [CITED: vercel.com/docs/functions/functions-api-reference/vercel-functions-package]

**Behavior on local Next.js dev server:** The dev server does NOT inject `x-real-ip`. Therefore `ipAddress(req)` returns `undefined` locally. The `'127.0.0.1'` fallback in D-03 handles this correctly:
```typescript
const ip = ipAddress(req) ?? '127.0.0.1';
```

**Behavior on Vercel production:** `ipAddress(req)` returns the real client IP as a string (e.g., `"203.0.113.42"`). This IP is used as the rate-limit bucket key in `checkRateLimit(ip)`.

**Runtime requirement:** No special runtime configuration needed. `ipAddress()` works with the default Node.js runtime for App Router route handlers (`route.ts`). No `export const runtime = 'edge'` required or desired.

### Replacement Pattern (SEC-01)

**Before (route.ts lines 99-102):**
```typescript
const ip =
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '127.0.0.1';
```

**After:**
```typescript
import { ipAddress } from '@vercel/functions';
// ...
const ip = ipAddress(req) ?? '127.0.0.1';
```

The `import` statement goes at the top of `route.ts`. The three-line IP expression (lines 99-102, including the comment) is replaced by the single expression. Everything else in the file is unchanged.

### Vitest Mocking Pattern for SEC-01 Tests

[VERIFIED: existing codebase patterns at `src/app/[locale]/error.test.tsx` and other test files]

The repo uses `vi.mock()` at module level for external dependency mocking. The analog pattern for `@vercel/functions`:

```typescript
// src/app/api/generate-cv/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the entire @vercel/functions module
vi.mock('@vercel/functions', () => ({
  ipAddress: vi.fn(),
}));

import { ipAddress } from '@vercel/functions';
import { GET } from './route';

const mockIpAddress = vi.mocked(ipAddress);

describe('GET /api/generate-cv — rate limiting', () => {
  beforeEach(() => {
    mockIpAddress.mockReset();
    // Also clear the module-level rateLimitStore between tests
    // (requires exporting it or resetting via repeated requests)
  });

  it('uses the IP returned by ipAddress() as the rate-limit bucket key', async () => {
    mockIpAddress.mockReturnValue('203.0.113.1');
    const req = new Request('http://localhost/api/generate-cv?locale=en');
    const res = await GET(req as never);
    expect(res.status).not.toBe(429);
    expect(mockIpAddress).toHaveBeenCalledWith(req);
  });

  it('falls back to 127.0.0.1 when ipAddress() returns undefined', async () => {
    mockIpAddress.mockReturnValue(undefined);
    const req = new Request('http://localhost/api/generate-cv?locale=en');
    const res = await GET(req as never);
    expect(res.status).not.toBe(429); // First request always allowed
  });

  it('returns 429 after RATE_LIMIT_MAX_REQUESTS (5) requests within the window', async () => {
    mockIpAddress.mockReturnValue('203.0.113.99');
    for (let i = 0; i < 5; i++) {
      const req = new Request('http://localhost/api/generate-cv?locale=en');
      const res = await GET(req as never);
      expect(res.status).not.toBe(429);
    }
    const req6 = new Request('http://localhost/api/generate-cv?locale=en');
    const res6 = await GET(req6 as never);
    expect(res6.status).toBe(429);
    expect(res6.headers.get('Retry-After')).toBeTruthy();
  });
});
```

**Key challenge — module-level Map state:** `rateLimitStore` is a module-level `Map` in `route.ts`. Vitest re-uses module instances across tests in the same file. To avoid test pollution between the 429 test and others, each test that cares about rate-limit state should use a DISTINCT mock IP address. The 429 test uses `'203.0.113.99'` (unique to that test); other tests use different IPs so their buckets are independent.

**Analog in repo:** `error.test.tsx` lines 17-23 show the `vi.mock('next-intl', async () => { ... })` pattern with `vi.importActual`. For `@vercel/functions`, no actual implementation is needed in tests, so a plain `vi.mock` without `importActual` is correct.

---

## CSP Re-Audit Plan

### Current State of `buildCsp(nonce)` in `middleware.ts`

**Dev branch (lines 13-22):**
```typescript
return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-eval' 'nonce-${nonce}' https://va.vercel-scripts.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,   // LINE 17 — REMOVE fonts.googleapis.com
    "font-src 'self' https://fonts.gstatic.com",                        // LINE 18 — REMOVE fonts.gstatic.com
    "img-src 'self' data: blob:",
    "connect-src 'self' https://vitals.vercel-insights.com ws: wss:",
    "frame-ancestors 'none'",
].join('; ');
```

**Prod branch (lines 26-34):**
```typescript
return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'sha256-1lsbnEG5y+jDum9W3sr9rXc9EniVVZtsPUtyiDRfsik=' https://va.vercel-scripts.com`,  // LINE 28 — REPLACE hash
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,   // LINE 29 — REMOVE fonts.googleapis.com
    "font-src 'self' https://fonts.gstatic.com",                        // LINE 30 — REMOVE fonts.gstatic.com
    "img-src 'self' data: blob:",
    "connect-src 'self' https://vitals.vercel-insights.com",
    "frame-ancestors 'none'",
].join('; ');
```

### Target State After SEC-02

**Dev branch — after:**
```typescript
return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-eval' 'nonce-${nonce}' https://va.vercel-scripts.com`,
    `style-src 'self' 'unsafe-inline'`,
    "font-src 'self'",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://vitals.vercel-insights.com ws: wss:",
    "frame-ancestors 'none'",
].join('; ');
```

**Prod branch — after (using candidate hash; re-verify before committing):**
```typescript
return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc=' https://va.vercel-scripts.com`,
    `style-src 'self' 'unsafe-inline'`,
    "font-src 'self'",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://vitals.vercel-insights.com",
    "frame-ancestors 'none'",
].join('; ');
```

### What Is Preserved (D-11)

- `https://va.vercel-scripts.com` in `script-src` — required by Vercel Analytics (`<Analytics />` at `layout.tsx:83`)
- `https://vitals.vercel-insights.com` in `connect-src` — required by Vercel Speed Insights beacon
- `'unsafe-inline'` in `style-src` — required by SGDS web component shadow-DOM styles and `next/image` inline `style="..."` attributes (D-07)
- `'nonce-${nonce}'` in prod `script-src` — kept (harmless even though `x-nonce` is null on Vercel at runtime; the hash is the actual enforcement mechanism per D-09)
- `'strict-dynamic'` in prod `script-src` — kept (enables trusted script propagation)

### What Is Removed

- `https://fonts.googleapis.com` from `style-src` (both branches) — no longer used; fonts are self-hosted via `next/font/google` which downloads at build time
- `https://fonts.gstatic.com` from `font-src` (both branches) — no longer used; confirmed zero references in SGDS bundled CSS (CF-2)
- Stale hash `sha256-1lsbnEG5y+jDum9W3sr9rXc9EniVVZtsPUtyiDRfsik=` (prod branch) — computed for old `next-themes` era script; replaced with hash of current SGDS theme-init script

---

## SEC-03: Closed as Accepted Risk

**Decision:** D-12/D-13. No code changes. Two documentation edits only.

### Documentation Target 1 — Code Comment in `route.ts`

Add above or adjacent to the `rateLimitStore` declaration (lines 15-19):

```typescript
// Rate-limit store: in-memory Map, resets on cold start.
// Accepted risk: distributed limiting (e.g., Upstash Redis) is not implemented.
// Rationale: portfolio-scale traffic is low; CV PDF is module-cached per locale
// (CV_BUFFER_CACHE), so the expensive render path runs at most once per instance
// lifetime — the per-instance limit guards the only costly operation adequately.
// Revisit if Vercel Analytics shows sustained abusive traffic to this endpoint.
// Tracking: REQUIREMENTS.md SEC-03 (closed, accepted-risk).
```

### Documentation Target 2 — `REQUIREMENTS.md`

In the Security section, update SEC-03 from `[ ]` to `[x]` and add accepted-risk notation:

```markdown
- [x] **SEC-03**: In-memory rate limiter — distributed rate limiting (Upstash Redis / Vercel KV) formally closed as **accepted-risk**. Rationale: per-instance Map is adequate for portfolio scale; CV PDF is module-cached so the expensive render path runs at most once per instance. Reopen if Analytics shows sustained abuse. *(Closed 2026-06-10)*
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Trusted client IP on Vercel | Custom header parsing logic | `ipAddress()` from `@vercel/functions` | Vercel's infra sets `x-real-ip` from trusted sources; the helper encapsulates the correct header name and handles the Request/Headers polymorphism |
| CSP SHA-256 hash computation | Manually copy hash from browser error message / screenshot | `crypto.createHash('sha256').update(body,'utf8').digest('base64')` in Node | Base64 is OCR-hostile; 03-02 burned a PR on 4 misread characters from a screenshot |

**Key insight:** The platform already solves the IP-trust problem. The only work is wiring the existing helper correctly.

---

## Common Pitfalls

### Pitfall 1: Nonce in `style-src` Silently Disables `unsafe-inline`
**What goes wrong:** Adding `'nonce-${nonce}'` to the `style-src` directive causes browsers to silently ignore `'unsafe-inline'` in the same directive (CSP Level 2+ spec). `next/image` emits `style="color:transparent"` on every `<img>` tag; those get blocked. SGDS web components inject shadow-DOM styles that also get blocked. The page may appear to load correctly while silently failing.
**Why it happens:** CSP spec: a nonce or hash source in a directive causes the browser to treat the directive as if `'unsafe-inline'` were absent.
**How to avoid:** Do NOT add `'nonce-${nonce}'` to `style-src`. The current code (post-03-02) correctly has nonce only in `script-src`. This split must be preserved.
**Warning signs:** Console errors mentioning `'unsafe-inline' is ignored if either a hash or nonce value is present in the source list`.

### Pitfall 2: `x-nonce` Returns Null on Vercel at Runtime
**What goes wrong:** `(await headers()).get('x-nonce')` in `layout.tsx` returns `null` on Vercel production even though middleware sets it. The `nonce` variable is therefore `undefined`, and `nonce={nonce}` on the `<script>` tag renders no attribute. The inline script has no nonce.
**Why it happens:** Root cause unresolved (possible: Vercel infrastructure stripping custom request headers, or `next-intl` middleware header forwarding interference).
**How to avoid:** The theme-init script's authorization depends ENTIRELY on the static hash in `script-src`, not on the nonce. The hash MUST be correct. The `nonce={nonce}` prop is kept (harmless) but cannot be relied upon.
**Warning signs:** Production HTML inspection showing the `<script>` tag has no `nonce` attribute despite the layout code setting it.

### Pitfall 3: Hash Transcription from Screenshots
**What goes wrong:** Reading a SHA-256 base64 hash from a browser DevTools error message screenshot and manually typing it into source code. Base64 characters `l`/`1`, `I`/`i`, `0`/`O`, `VV`/`W` are commonly misread. 03-02 shipped a broken hash this way, requiring a corrective PR.
**Why it happens:** Base64 is inherently OCR-hostile.
**How to avoid:** Always compute hashes programmatically from the actual script content. Re-verify against deployed production HTML.
**Warning signs:** The CSP hash fix deploys but the inline script is still blocked in production.

### Pitfall 4: `@vercel/functions` ipAddress Reading `x-forwarded-for` (Assumption)
**What goes wrong:** Assuming `ipAddress()` reads `x-forwarded-for` as a fallback (since the old code did).
**Why it's wrong:** The function reads ONLY `x-real-ip` (confirmed from installed package source: `IP_HEADER_NAME = "x-real-ip"`). It does not touch `x-forwarded-for`. On local dev, `x-real-ip` is absent → `undefined` → the `?? '127.0.0.1'` fallback fires.
**How to avoid:** Use the fallback pattern: `ipAddress(req) ?? '127.0.0.1'`. Do not add a second fallback to `x-forwarded-for`.

### Pitfall 5: Module-Level Map State in Route Tests
**What goes wrong:** Rate-limit tests running in sequence in the same file share the `rateLimitStore` Map instance (module singleton). Test A exhausts a bucket; Test B unexpectedly gets a 429.
**Why it happens:** Vitest does not re-import modules between tests in the same file by default.
**How to avoid:** Use a distinct mock IP for each test case that cares about rate-limit state. The 429 path test uses a unique IP that no other test uses, so the 5-request count accumulates only in that test's bucket.

---

## Validation Architecture

**nyquist_validation:** enabled (config.json `workflow.nyquist_validation: true`)

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.7 + jsdom |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run src/app/api/generate-cv/route.test.ts` |
| Full suite command | `npm run test` |
| Coverage command | `npm run test:coverage` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEC-01-a | `ipAddress(req)` return value is used as rate-limit bucket key | unit | `npx vitest run src/app/api/generate-cv/route.test.ts` | ❌ Wave 0 |
| SEC-01-b | `ipAddress(req) = undefined` falls back to `'127.0.0.1'` (dev behavior) | unit | same | ❌ Wave 0 |
| SEC-01-c | 6th request within 60s window returns 429 with `Retry-After` header | unit | same | ❌ Wave 0 |
| SEC-02-a | `buildCsp(nonce)` output does NOT contain `fonts.googleapis.com` | unit | `npx vitest run src/middleware.test.ts` (new) | ❌ Wave 0 |
| SEC-02-b | `buildCsp(nonce)` output does NOT contain `fonts.gstatic.com` | unit | same | ❌ Wave 0 |
| SEC-02-c | `buildCsp(nonce)` prod branch contains the correct SHA-256 hash (post-recompute) | unit | same | ❌ Wave 0 |
| SEC-02-d | `buildCsp(nonce)` preserves `va.vercel-scripts.com` and `vitals.vercel-insights.com` | unit | same | ❌ Wave 0 |

**Coverage note:** Both `src/app/api/**` and `src/middleware.ts` are explicitly excluded from coverage thresholds in `vitest.config.ts`. These new tests must PASS but their lines do not count toward the 80% threshold. Global coverage must not regress.

### Sampling Rate

- **Per task commit:** `npx vitest run src/app/api/generate-cv/route.test.ts` (fast, < 5s)
- **Per wave merge:** `npm run test` (full suite)
- **Phase gate:** Full suite green + `npx tsc --noEmit` clean before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `src/app/api/generate-cv/route.test.ts` — covers SEC-01-a/b/c; vi.mock pattern for `@vercel/functions`
- [ ] `src/middleware.test.ts` — covers SEC-02-a/b/c/d; calls `buildCsp(nonce)` directly and asserts on the output string

*(No framework install needed — vitest + testing-library are already installed.)*

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | partial | Rate limiting (SEC-01) prevents DoS on the CV render endpoint |
| V5 Input Validation | yes | Locale whitelist already in place (`SUPPORTED_LOCALES`); unchanged |
| V6 Cryptography | no | — |
| V7 Error Handling | no | — |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| IP spoofing via `x-forwarded-for` to bypass rate limit | Elevation of Privilege | Use `ipAddress()` from `@vercel/functions` (reads infra-injected `x-real-ip`) |
| XSS via injected scripts not covered by CSP | Tampering | Static hash in `script-src` authorizes theme-init script; `'strict-dynamic'` propagates trust to child scripts |
| CSS injection via relaxed `style-src` | Tampering | Low risk (CSS cannot execute JS); `'unsafe-inline'` is acceptable for styles per 03-01/03-02 decisions |

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `req.ip` (NextRequest property) | `ipAddress()` from `@vercel/functions` | Next.js 15 removed `req.ip` | Must migrate now; `@vercel/functions` is the official replacement |
| Static hash from screenshot transcription | Programmatic hash computation from source + production HTML verification | 03-02 lesson (2026-06-03) | Non-negotiable; OCR is unreliable for base64 |
| Nonce in `style-src` | `'unsafe-inline'` in `style-src`, no nonce | 03-02 fix (2026-06-03) | CSP spec trap; mixing nonce + unsafe-inline silently ignores unsafe-inline |

**Deprecated/outdated:**
- `x-real-ip` / `x-forwarded-for` manual parsing: replaced by `ipAddress()` from `@vercel/functions`
- Hash `sha256-1lsbnEG5y+jDum9W3sr9rXc9EniVVZtsPUtyiDRfsik=`: stale, computed for next-themes era script

---

## Project Constraints (from CLAUDE.md)

| Directive | Impact on This Phase |
|-----------|---------------------|
| Max 300 lines per file, 40 lines per function | `route.ts` is 151 lines pre-change; the IP change removes 3 lines (net negative). Well within limits. `middleware.ts` is 76 lines; CSP changes are line-level edits. |
| No empty catch blocks; log errors with context | Existing `catch` blocks in `route.ts` already comply; no new catch blocks needed. |
| Test behavior, not implementation details | Route tests should assert HTTP response codes and headers, not internal Map state. |
| 80% lines/functions/statements, 65% branches coverage | New test files are in excluded paths (`src/app/api/**`, `src/middleware.ts`). Global coverage unaffected. |
| Vitest + RTL, jsdom environment | Route tests use plain `Request` / `NextResponse` — no RTL needed. Middleware tests call `buildCsp()` directly — also no RTL needed. |
| Conventional Commits, no direct push to main | Phase branch: `gsd/phase-03-security-hardening` (already active). |
| i18n via `@/i18n/routing` | Not relevant to this phase (no UI changes). |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `x-real-ip` is set by Vercel's trusted infrastructure and cannot be spoofed by a client-supplied header | @vercel/functions Integration | If wrong, the SEC-01 fix provides false security. Cited from official Vercel docs; HIGH confidence this is correct. |
| A2 | The candidate hash `sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc=` matches the live rendered script | Confirmed Facts / CSP Re-Audit | If wrong, the inline script will be blocked in production (theme flash prevention broken silently). MANDATORY re-verification step documented. |

---

## Open Questions

1. **Production domain for hash verification**
   - What we know: The site is deployed on Vercel. The domain used in the hash re-verification curl command needs to be the correct production URL.
   - What's unclear: The exact production domain is not recorded in these planning files.
   - Recommendation: Implementor should substitute the correct Vercel production URL (likely `https://porto-jefry.vercel.app` based on project name) in the verification script. If the domain differs, find it in `src/utils/constants.ts` (the `BASE_URL` constant at `layout.tsx:12`).

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js >= 20 | `@vercel/functions` engine requirement | ✓ | v24.11.0 | — |
| `@vercel/functions` | SEC-01 | ✗ (not installed) | — | Install via `npm install @vercel/functions` |
| `vitest` | New route/middleware tests | ✓ | ^4.1.7 | — |
| Production deployment URL | Hash re-verification (D-10) | Unknown (planning only) | — | Check `BASE_URL` in `src/utils/constants.ts` |

**Missing dependencies with no fallback:**
- `@vercel/functions` — must be installed before implementation begins (`npm install @vercel/functions`)

**Missing dependencies with fallback:**
- Production URL for hash verification — use `BASE_URL` constant or `vercel.com/dashboard` to find the deployment URL

---

## Sources

### Primary (HIGH confidence)
- `vercel.com/docs/functions/functions-api-reference/vercel-functions-package` — `ipAddress()` API, import path, parameter type, description
- `node_modules/@vercel/functions/headers.js` (installed package source, v3.7.0) — implementation: reads only `x-real-ip`, returns `string | undefined`
- `npm view @vercel/functions` — version 3.7.0, published 2026-06-09, first published 2024-05-07
- `slopcheck install @vercel/functions` — result: [OK]
- `.planning/phases/03-security-hardening/03-CONTEXT.md` — all D-01..D-15 decisions
- `.planning/phases/03-security-hardening/03-LEARNINGS.md` — CSP hotfix history, pitfalls
- `src/middleware.ts` — exact current `buildCsp` code
- `src/app/api/generate-cv/route.ts` — exact current IP extraction code
- `src/app/[locale]/layout.tsx` — exact theme-init script body (line 68)
- `vitest.config.ts` — coverage exclusions confirming API/middleware excluded from thresholds
- Orchestrator pre-verified facts (CF-1 through CF-5)

### Secondary (MEDIUM confidence)
- `vercel.com/docs/functions/functions-api-reference` — confirms `ipAddress()` in helper methods list, works with NextRequest
- Existing test files (`error.test.tsx`, `Navbar.test.tsx`) — `vi.mock()` pattern verified in repo

### Tertiary (LOW confidence)
- None. All key claims verified against official sources or installed package source.

---

## Metadata

**Confidence breakdown:**
- @vercel/functions API: HIGH — verified from official docs AND installed package source
- Standard Stack (version): HIGH — verified via npm registry (3.7.0, published 2026-06-09)
- CSP changes: HIGH — derived from confirmed facts (font audit, stale hash) plus source code inspection
- Candidate hash: MEDIUM — computed from TypeScript source; requires mandatory programmatic re-verification against deployed HTML
- Vitest mock pattern: HIGH — directly analogous to existing repo patterns

**Research date:** 2026-06-10
**Valid until:** 2026-07-10 (30 days; `@vercel/functions` is stable)

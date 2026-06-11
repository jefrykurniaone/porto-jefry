---
phase: 03-security-hardening
reviewed: 2026-06-11T00:00:00Z
depth: standard
files_reviewed: 4
files_reviewed_list:
  - src/app/api/generate-cv/route.ts
  - src/app/api/generate-cv/route.test.ts
  - src/middleware.ts
  - src/middleware.test.ts
findings:
  critical: 0
  warning: 2
  info: 1
  total: 3
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-06-11T00:00:00Z
**Depth:** standard
**Files Reviewed:** 4
**Status:** issues_found

## Summary

Phase 03 delivered three security fixes: SEC-01 (replace spoofable IP header chain with
`ipAddress()` from `@vercel/functions`), SEC-02 (CSP re-audit: remove Google Fonts domains,
recompute theme-init script hash), and SEC-03 (document in-memory rate limiter as accepted-risk).

The core security intent is correctly implemented. The SHA-256 hash in the production CSP was
verified programmatically against the live script content in `layout.tsx:68` and matches exactly.
Font domain removal is correct — `next/font/google` self-hosts Inter at build time, making the
removed Google Fonts domains genuinely unnecessary. The `ipAddress()` substitution is correct and
removes the spoofable `x-forwarded-for` fallback path. The SEC-03 accepted-risk comment and
documentation are present and substantive.

Two issues require attention: a non-null assertion that bypasses TypeScript null safety (minor but
violates the defensive coding spirit of CLAUDE.md), and a `base-uri` CSP directive that was not
added during the SEC-02 re-audit despite the comment in the code claiming "strict CSP".

---

## Warnings

### WR-01: Non-null assertion on `rateLimitStore.get(ip)` bypasses TypeScript null safety

**File:** `src/app/api/generate-cv/route.ts:108`
**Issue:** After `checkRateLimit(ip)` returns `false`, the code immediately fetches
`rateLimitStore.get(ip)!` with a non-null assertion. While this is provably safe today — the entry
cannot be absent at this point because `checkRateLimit` only returns `false` when
`entry.count >= RATE_LIMIT_MAX_REQUESTS`, which requires the entry to be present and un-evicted
— the `!` operator silently discards TypeScript's null-safety guarantee. If `checkRateLimit` is
ever refactored (e.g., to support early return on a new code path), the assertion becomes a latent
crash. CLAUDE.md calls for no empty catch blocks and logging errors with context, reflecting a
defensive coding standard; the same defensiveness applies here.

**Fix:**
```typescript
// Replace line 108:
const entry = rateLimitStore.get(ip)!;

// With a null-safe fallback that preserves the Retry-After behavior:
const entry = rateLimitStore.get(ip);
const retryAfterSeconds = entry
    ? Math.max(
          1,
          Math.ceil((entry.windowStart + RATE_LIMIT_WINDOW_MS - Date.now()) / 1000),
      )
    : 1;
return new NextResponse('Too Many Requests', {
    status: 429,
    headers: { 'Retry-After': String(retryAfterSeconds) },
});
```

This removes the `!` assertion, collapses the two-step compute into one, and keeps the fallback
of `1` second when the entry is unexpectedly absent.

---

### WR-02: Production CSP is missing `base-uri` directive — not addressed by SEC-02 re-audit

**File:** `src/middleware.ts:26-34`
**Issue:** The production (and development) CSP in `buildCsp` does not include a `base-uri`
directive. Per the CSP Level 2 specification, `base-uri` does **not** fall back to `default-src`;
it must be declared explicitly. Without it, an attacker who achieves any script execution (however
unlikely on this static site) can inject `<base href="https://attacker.example/">` and redirect all
relative URLs (navigation links, API calls, asset paths) to an attacker-controlled origin.

The comment on line 25 explicitly labels this the "strict CSP" branch. Phase 03 performed a
full CSP re-audit under SEC-02 (removing Google Fonts domains, recomputing the hash), but did not
add `base-uri` despite this being the correct moment to do so. The omission persists in both the
dev and prod branches.

**Fix:**

Add `"base-uri 'self'"` to both CSP branches. For the production branch (lines 26-34):
```typescript
return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc=' https://va.vercel-scripts.com`,
    `style-src 'self' 'unsafe-inline'`,
    "font-src 'self'",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://vitals.vercel-insights.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",   // <-- add this
].join('; ');
```

Apply the same addition to the development branch (lines 14-23). The corresponding middleware
test `SEC-02-d` should add assertions that both branches contain `base-uri 'self'`.

---

## Info

### IN-01: SEC-01 rate-limit tests do not assert `200` on success — a `500` also satisfies `not 429`

**File:** `src/app/api/generate-cv/route.test.ts:23,31,39-41`
**Issue:** All three SEC-01 tests assert `expect(res.status).not.toBe(429)` to verify allowed
requests. In the test environment `@react-pdf/renderer` and `sharp` are not mocked, so the render
path likely throws and the route returns `500`. A `500` satisfies `not.toBe(429)`, meaning the
tests pass even if the rate-limit gate is never reached because an earlier error short-circuits the
handler. This is acceptable for pure rate-limit behavioral tests (the guard logic is
unconditionally before the render), but it means the tests do not distinguish between "correctly
allowed" and "errored before rate-limiting could ever block".

For SEC-01-a, the test does additionally assert `mockIpAddress` was called with `req`, which
confirms the correct IP extraction path was exercised. That partially offsets the concern.
No immediate fix is required for SEC-01 correctness, but the intent of each assertion could be
clarified with a comment noting that the test environment will return 500 rather than 200.

**Suggested comment addition (route.test.ts:22-24):**
```typescript
// The render path throws in the test environment (no sharp/react-pdf mocks),
// so the route returns 500. We assert 'not 429' rather than '200' because this
// test targets the rate-limit guard, which runs before the render.
expect(res.status).not.toBe(429);
```

---

_Reviewed: 2026-06-11T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_

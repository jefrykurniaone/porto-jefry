# Phase 01 Code Review

**Date:** 2026-05-25  
**Depth:** Standard  
**Files Reviewed:** 20  
**Verdict:** PASS WITH WARNINGS

---

## Summary

All 20 files were read in full. The codebase is well-structured, consistently follows Next.js 14 App Router patterns, and shows solid security awareness (CSP nonce pipeline, rate limiting, input validation). No production crashes or data-loss risks were found. Six findings warrant attention before shipping: one accessibility regression in the Navbar, two security-header issues, one type-safety gap with a potential runtime throw, one rate-limiter design weakness, and one SEO omission for multilingual sites.

---

## Findings

### Warnings
- WR-01 — Navbar mobile: focus stolen on initial page load (wrong effect deps)
- WR-02 — CSP `style-src 'unsafe-inline'` weakens XSS policy
- WR-03 — Deprecated `X-XSS-Protection: 1; mode=block` (OWASP recommends `0`)
- WR-04 — Rate limiter: `x-forwarded-for` spoofable + `'unknown'` bucket shared
- WR-05 — `Experience.tsx`: unchecked double-cast can throw at runtime
- WR-06 — `sitemap.ts`: missing `x-default` hreflang causes duplicate-content risk

### Info
- IN-01 — `BASE_URL` magic string duplicated across two files
- IN-02 — `new Date()` in sitemap triggers cache invalidation on every deploy
- IN-03 — `package.json` has no `engines` field
- IN-04 — `Projects.tsx` uses `project.name` as React key instead of a stable id
- IN-05 — `Hero.tsx` fetch URL uses unencoded template literal for query param
- IN-06 — `Navbar.tsx` indentation inconsistency in focus-trap `useEffect`

---

## Finding Details

---

### WR-01: Navbar Focuses Hamburger Button on Initial Page Load (Mobile)

**File:** `src/components/layout/Navbar.tsx`  
**Line:** 113–121  
**Issue:**  
The `useEffect` whose comment says *"Return focus to toggle button when menu closes"* has an **empty dependency array `[]`**. On initial render `isOpen` is `false`, so the condition `if (!isOpen)` is immediately true and `toggleRef.current?.focus()` is called on mount. Because `md:hidden` only applies `display:none` at `≥ md` breakpoints, the hamburger button *is* visible on mobile — and receives focus the moment the page loads, stealing keyboard focus from wherever the user actually is.

The `// eslint-disable-next-line react-hooks/exhaustive-deps` comment suppresses the lint warning about `isOpen` being missing from deps, masking the bug entirely.

**Impact:** WCAG 2.4.3 (Focus Order) violation. Mobile keyboard and screen-reader users lose their intended focus position on page load every time.

**Fix:**  
Track first-mount to avoid firing on initial render:

```tsx
const didMountRef = useRef(false);

useEffect(() => {
    if (!didMountRef.current) {
        didMountRef.current = true;
        return;
    }
    if (!isOpen) {
        toggleRef.current?.focus();
    }
}, [isOpen]); // no eslint-disable needed
```

---

### WR-02: CSP `style-src 'unsafe-inline'` Weakens XSS Protection

**File:** `src/middleware.ts`  
**Line:** 12  
**Issue:**  
The CSP directive `"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com"` allows any inline `style` attribute or `<style>` block to execute, which eliminates style-based XSS protection. A `script-src` nonce policy loses much of its value when `unsafe-inline` styles are permitted, because CSS injection can exfiltrate data (e.g., CSS attribute selectors + external resource requests) and the overall security posture is weakened.

**Impact:** Reduced defence-in-depth against injection attacks; CSS exfiltration vectors remain open.

**Fix:**  
`next-themes` requires `unsafe-inline` for its initial theme flash prevention script, but styles can often be moved to class-based utilities (Tailwind). If `unsafe-inline` cannot be dropped entirely, consider adding a hash of the specific `next-themes` inline style instead:

```ts
// Replace 'unsafe-inline' with the sha256 hash of the exact inline style
"style-src 'self' 'sha256-<hash>' https://fonts.googleapis.com",
```

At minimum, document the rationale in a code comment so future maintainers don't assume it can be tightened freely.

---

### WR-03: Deprecated `X-XSS-Protection` Header

**File:** `next.config.mjs`  
**Line:** 13  
**Issue:**  
`X-XSS-Protection: 1; mode=block` is deprecated by all major browsers and explicitly flagged by OWASP as potentially harmful. In legacy Internet Explorer, the built-in XSS filter could itself be abused to perform cross-site scripting attacks through its blocking and reporting mechanism. Modern browsers (Chrome 78+, Firefox, Safari) have removed support entirely.

**Impact:** No protection benefit; introduces a theoretical exploit surface for IE users; misleads automated security scanners into thinking an active XSS policy is in place.

**Fix:**

```js
// next.config.mjs – replace the X-XSS-Protection entry with:
{ key: 'X-XSS-Protection', value: '0' },
```

Setting it to `0` explicitly disables the legacy filter and signals awareness of the deprecation.

---

### WR-04: Rate Limiter `'unknown'` Fallback Shares a Single Bucket

**File:** `src/app/api/generate-cv/route.ts`  
**Line:** 81  
**Issue:**  
When `x-forwarded-for` is absent, all such requests are keyed to the string `'unknown'`. On Vercel this header is always present, but in local development or behind a misconfigured reverse proxy it will be missing — meaning all callers share a single rate-limit window, so one user exhausting the limit blocks everyone else.

Additionally, `x-forwarded-for` is a client-controlled header in generic deployments. Vercel's infrastructure overrides it, but using `req.ip` (the Vercel-injected real IP) is more robust:

**Impact:** In non-Vercel environments, rate limiting collapses to a shared global limit; a single client can deny service to all others.

**Fix:**

```ts
// Prefer Vercel's injected real IP; fall back gracefully
const ip =
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';
```

Optionally, reject requests with `ip === 'unknown'` rather than sharing the bucket, to avoid accidental cross-user interference in dev.

---

### WR-05: Double-Cast Bypasses Null Safety in `Experience.tsx`

**File:** `src/components/sections/Experience.tsx`  
**Line:** 61–65  
**Issue:**  
```tsx
const expItems = (messages.experience as unknown as ExperienceMessages).items;
```
The double cast `as unknown as ExperienceMessages` completely bypasses TypeScript's type checker. If `messages.experience` is `undefined` at runtime (e.g., a future message key rename, a missing namespace, or a partial hydration issue), accessing `.items` throws:

```
TypeError: Cannot read properties of undefined (reading 'items')
```

TypeScript cannot catch this because the cast hides the actual type. There is no optional-chaining guard after the cast.

Additionally, `interface ExperienceMessages` is defined *inside* the component function body (line 61), which re-creates the type on every render and violates the project's max-40-line function guideline.

**Impact:** Potential uncaught `TypeError` in production if message structure drifts; TypeScript safety lost entirely for this code path.

**Fix:**  
Move the interface to module scope, add optional chaining and a fallback:

```tsx
// Module scope
interface ExperienceMessages {
    items: Record<string, { bullets: string[] }>;
}

// Inside component
const expItems =
    (messages.experience as unknown as ExperienceMessages | undefined)?.items ?? {};
```

---

### WR-06: Sitemap Missing `x-default` Hreflang Entry

**File:** `src/app/sitemap.ts`  
**Line:** 7–16  
**Issue:**  
The sitemap has `en` ↔ `id` cross-references but no `x-default` hreflang variant. Google's multilingual guidelines require `x-default` to identify the canonical fallback URL for unmatched locales. Without it, Google may treat the two locale URLs as competing duplicate pages and apply a ranking penalty.

**Impact:** Potential duplicate-content SEO penalty; international search ranking degraded.

**Fix:**

```ts
{
    url: `${BASE_URL}/en`,
    lastModified: new Date(),
    alternates: {
        languages: {
            en: `${BASE_URL}/en`,
            id: `${BASE_URL}/id`,
            'x-default': `${BASE_URL}/en`,
        },
    },
},
{
    url: `${BASE_URL}/id`,
    lastModified: new Date(),
    alternates: {
        languages: {
            en: `${BASE_URL}/en`,
            id: `${BASE_URL}/id`,
            'x-default': `${BASE_URL}/en`,
        },
    },
},
```

---

### IN-01: `BASE_URL` Magic String Duplicated in Two Files

**File:** `src/app/[locale]/layout.tsx` line 29 · `src/app/sitemap.ts` line 3  
**Issue:** `'https://porto-jefry.vercel.app'` is hardcoded in both files independently. A domain change requires two edits and risks the two values diverging.  
**Fix:** Extract to a shared constant, e.g. `src/lib/constants.ts`:

```ts
export const BASE_URL = 'https://porto-jefry.vercel.app';
```

---

### IN-02: `new Date()` in Sitemap Invalidates Cache on Every Build

**File:** `src/app/sitemap.ts`  
**Line:** 8, 13  
**Issue:** `lastModified: new Date()` evaluates to the build timestamp, so the sitemap changes on every deploy even when content has not changed. This wastes crawl budget by signaling a modification on every CI run.  
**Fix:** Use a fixed date or derive it from the latest content modification date:

```ts
lastModified: new Date('2026-05-25'),
```

---

### IN-03: `package.json` Has No `engines` Field

**File:** `package.json`  
**Issue:** No `engines.node` constraint is declared. Vercel, local dev, and CI may run different Node.js versions, which can produce subtly different `sharp` builds or TypeScript output.  
**Fix:**

```json
"engines": { "node": ">=20.0.0" }
```

---

### IN-04: `Projects.tsx` Uses `project.name` as React `key`

**File:** `src/components/sections/Projects.tsx`  
**Line:** 21  
**Issue:** `key={project.name}` is fragile — project names contain spaces, special characters, and are not guaranteed unique if the data file grows. React keys should be stable, unique identifiers.  
**Fix:** Add an `id` field to `ProjectItem` in `src/data/projects.ts` and use `key={project.id}`.

---

### IN-05: Fetch URL Uses Unencoded Template Literal for Query Parameter

**File:** `src/components/sections/Hero.tsx`  
**Line:** 31  
**Issue:**

```ts
const res = await fetch(`/api/generate-cv?locale=${locale}`);
```

`locale` is controlled by next-intl routing (`'en'` | `'id'`) so there is no injection risk today. However, the pattern is not idiomatic and would be unsafe if `locale` ever sourced from user input.  
**Fix:**

```ts
const params = new URLSearchParams({ locale });
const res = await fetch(`/api/generate-cv?${params}`);
```

---

### IN-06: Indentation Inconsistency in Navbar Focus-Trap `useEffect`

**File:** `src/components/layout/Navbar.tsx`  
**Line:** 92–93  
**Issue:** Mixed indentation (8 spaces vs 10 spaces) for two consecutive variable declarations in the same block:

```ts
            const first = focusable[0];
        const last = focusable.at(-1);   // ← 2 fewer spaces
```

**Fix:** Align both to the same indentation level.

---

## Verdict Rationale

No production crashes, data-loss paths, or directly exploitable security vulnerabilities were found. The six warnings are real issues that degrade accessibility (WR-01), security posture (WR-02, WR-03, WR-04), runtime stability (WR-05), and SEO (WR-06) — none of which block the site from functioning, but all of which should be addressed before the codebase is considered production-hardened. The verdict is **PASS WITH WARNINGS**: the code can ship but the warnings, particularly WR-01 (accessibility) and WR-05 (potential runtime throw), should be resolved promptly.

---

_Reviewed: 2026-05-25_  
_Reviewer: gsd-code-reviewer (GitHub Copilot — Claude Sonnet 4.6)_  
_Depth: Standard_

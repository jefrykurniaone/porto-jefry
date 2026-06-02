# Concerns & Technical Debt
_Last mapped: 2026-06-02_

---

## High Priority

### Silent CV Download Failure — No User Feedback
- **Issue:** `handleDownload` in `src/components/sections/Hero.tsx` (lines 27–46) catches fetch/render errors but only calls `console.error`. The button resets to its default state with no error message shown to the user.
- **Impact:** User clicks "Download CV", something fails (rate limit, 500, network error), and they see nothing — no toast, no inline message, no retry hint.
- **Fix:** Add user-visible error state (e.g., inline error text or toast) in the `catch` block. The `isDownloading` state already exists; add an `isError` state alongside it.

### Missing `type="button"` on Two Interactive Buttons
- **Files:** `src/components/layout/LanguageToggle.tsx` (line 18), `src/components/layout/ThemeToggle.tsx` (line 18)
- **Impact:** Without `type="button"`, a `<button>` inside a `<form>` defaults to `type="submit"`. These components are currently used outside forms, so the bug is latent — but adding them to any form context would trigger an accidental submit. Also violates the project's own lint baseline (`next/core-web-vitals` includes this rule).
- **Fix:** Add `type='button'` to both elements.

### No Custom Error or Not-Found Pages
- **Files:** Missing `src/app/[locale]/error.tsx`, `src/app/[locale]/not-found.tsx`, `src/app/global-error.tsx`
- **Impact:** `notFound()` is called in `src/app/[locale]/layout.tsx` (line 56) for invalid locales, but there is no custom 404 page. Any unhandled render error falls through to Next.js's bare default error UI. Users on invalid locale paths or during component crashes see no branded experience.
- **Fix:** Create `src/app/[locale]/not-found.tsx` and `src/app/[locale]/error.tsx` with localized, styled fallback UI.

---

## Tech Debt

### `as unknown as ExperienceMessages` Type Bypass in Experience
- **File:** `src/components/sections/Experience.tsx` (line 87)
- **Issue:** `messages.experience as unknown as ExperienceMessages` is a double-cast to work around `useMessages()` returning an untyped `AbstractIntlMessages`. The local interface `ExperienceMessages` is defined inline inside a function body (line 84–86), which is non-standard.
- **Impact:** TypeScript cannot catch shape mismatches between the cast type and the actual JSON. If `en.json`/`id.json` restructure the `experience.items` keys, this silently fails at runtime (bullets render as empty array).
- **Fix:** Define `ExperienceMessages` as a top-level exported interface. Consider using `next-intl`'s typed messages via `useTranslations` with namespace drilling instead of `useMessages()`.

### `LAST_MODIFIED_DATE` Is Manually Maintained
- **File:** `src/utils/constants.ts` (line 3)
- **Issue:** `LAST_MODIFIED_DATE = '2026-05-25'` is a hardcoded string that feeds `src/app/sitemap.ts`. It requires a manual update on each deployment and is already stale (current date: 2026-06-02).
- **Impact:** Sitemap reports an incorrect `lastModified`, signalling to crawlers that the site has not changed since May 25.
- **Fix:** Drive this date from `git log` at build time (via `next.config.mjs`) or replace with `new Date()` if always-fresh is acceptable.

### `cv-styles.ts` Approaching File-Length Limit
- **File:** `src/components/cv/cv-styles.ts` (262 lines)
- **Issue:** The project convention enforces a 300-line maximum. At 262 lines, this file will exceed the limit with any non-trivial style addition.
- **Fix:** Split into logical groups: `cv-header-styles.ts`, `cv-experience-styles.ts`, etc., re-exported from an index.

### `projects.ts` Is Large Static Data
- **File:** `src/data/projects.ts` (231 lines)
- **Issue:** 14 project entries inline with repeated `tech` arrays (many are identical across projects). No deduplication.
- **Impact:** Adding 2–3 more projects pushes past 300 lines and makes diffs hard to read.
- **Fix:** Extract shared tech stacks as named constants (e.g., `SITEFINITY_STACK`, `VBNET_STACK`) and reference them.

### `ThemeToggle` Layout-Shift Placeholder
- **File:** `src/components/layout/ThemeToggle.tsx` (line 15)
- **Issue:** Returns `<div className='w-9 h-9' />` (an empty div) until after hydration. This causes a Cumulative Layout Shift (CLS) because the actual button and the placeholder have the same dimensions but differ in content.
- **Impact:** CLS score degradation; Lighthouse will flag it on slow connections.
- **Fix:** Use `next-themes`'s `suppressHydrationWarning` strategy or render the button with a fixed placeholder icon rather than an empty div.

### ESLint Config Is Minimal — No SonarQube Rule Coverage
- **File:** `.eslintrc.json`
- **Issue:** Only extends `next/core-web-vitals` and `next/typescript`. The project standards call for SonarQube compliance (max function length, no magic numbers, max nesting depth), but these are not enforced at lint time.
- **Impact:** Code quality invariants are checked only in CI via manual SonarQube scans (if any), not on commit.
- **Fix:** Add `eslint-plugin-sonarjs` or equivalent rules for: `max-lines`, `max-lines-per-function`, `no-nested-template-literals`, `no-duplicate-string`.

---

## Security

### In-Memory Rate Limiter Is Ineffective on Serverless
- **File:** `src/app/api/generate-cv/route.ts` (lines 16–41)
- **Risk:** The `rateLimitStore` (`Map`) is module-level. On Vercel's serverless infrastructure, each function instance has its own memory. Concurrent cold starts or multiple warm instances each have independent counters — a client can exceed 5 requests/minute by simply hitting different instances.
- **Current mitigation:** Rate limit is present but provides only weak protection in production.
- **Fix:** Replace with a distributed store (e.g., Vercel KV / Upstash Redis) for true per-IP rate limiting across instances.

### `x-real-ip` / `x-forwarded-for` Is Trusted Without Validation
- **File:** `src/app/api/generate-cv/route.ts` (lines 99–102)
- **Risk:** The rate-limit key is derived from `x-real-ip` or the first element of `x-forwarded-for`. These headers are attacker-controlled unless the hosting platform strips or overrides them. A client can spoof their IP by setting `x-real-ip: 1.2.3.4` on every request to bypass the rate limiter.
- **Current mitigation:** None. Falls back to `127.0.0.1` for local dev, but does not validate header trustworthiness.
- **Fix:** On Vercel, use `req.ip` (populated by the platform's edge layer) instead of reading headers directly. Alternatively, validate that the IP is only read from `x-forwarded-for` when behind a trusted proxy.

### CSP `style-src` Allows Google Fonts
- **File:** `src/middleware.ts` (line 14)
- **Issue:** `style-src` includes `https://fonts.googleapis.com`. The site uses `next/font/google` (Inter, loaded at build time), which downloads and self-hosts font CSS automatically. There is no runtime request to `fonts.googleapis.com` from the browser.
- **Impact:** The CSP grants an unnecessarily broad permission for an external style host that is never actually used at runtime.
- **Fix:** Remove `https://fonts.googleapis.com` from `style-src` and verify via CSP report-only mode that no violations occur.

---

## Performance

### Navbar Scroll Listener Missing `passive: true`
- **File:** `src/components/layout/Navbar.tsx` (line 77)
- **Issue:** `globalThis.addEventListener('scroll', handleScroll)` is registered without `{ passive: true }`. Compare with `BackToTop.tsx` line 20 which correctly uses `{ passive: true }`.
- **Impact:** The browser cannot optimise scroll handling — it must wait to check if `preventDefault()` is called, causing potential scroll jank on lower-end devices.
- **Fix:** Change to `globalThis.addEventListener('scroll', handleScroll, { passive: true })`.

### In-Memory CV PDF Cache — No Invalidation Strategy
- **File:** `src/app/api/generate-cv/route.ts` (lines 57–58, 115–121)
- **Issue:** `CV_BUFFER_CACHE` (Map) and `cachedPhotoSrc` are cached for the entire process lifetime with no TTL or invalidation. On a long-lived server (e.g., `next start`), an updated CV photo or content would not be reflected until the process restarts.
- **Impact:** On Vercel's serverless this resets on every cold start (acceptable). On self-hosted `next start` this becomes stale indefinitely.
- **Fix:** Add a TTL (e.g., `CACHE_MAX_AGE_SECONDS`) to the in-memory store, or document that the route is serverless-only with a code comment.

---

## Fragile Areas

### Experience Bullets Sourced via `useMessages()` Double-Cast
- **File:** `src/components/sections/Experience.tsx` (lines 82–88)
- **Why fragile:** Bullets are accessed as `messages.experience.items[id].bullets` via an `as unknown as` cast. There is no compile-time guarantee that the JSON shape matches. Renaming an experience ID in `src/data/experience.ts` without updating `en.json`/`id.json` renders silently with empty bullets (`?? []` on line 105).
- **Safe modification:** Any change to `id` in `src/data/experience.ts` must be mirrored in both `src/i18n/messages/en.json` and `id.json` under `experience.items`. There are no TypeScript guards to catch this.
- **Test coverage:** `Experience.test.tsx` exists but tests rendered output with fixture data; the mismatch scenario (id exists in data but not in messages) is not tested.

### Certifications Section: ID Is Both Data Key and i18n Namespace
- **File:** `src/data/certifications.ts`, `src/components/sections/Certifications.tsx` (line 30)
- **Why fragile:** `certifications.map(cert => t(`${cert.id}.name`))` couples the data `id` field directly to i18n message keys. If an `id` contains characters invalid in a translation key path, `next-intl` will throw or return the key. There is no validation layer.
- **Safe modification:** `cert.id` values must match exactly the keys in `en.json`/`id.json` under `certifications.*`. Adding a new certification requires touching three files in sync: `certifications.ts`, `en.json`, `id.json`.

### `translatePeriod` Uses Unanchored Regex Replacement
- **File:** `src/utils/translate-period.ts` (lines 10–13)
- **Why fragile:** `new RegExp(en, 'g')` is not anchored (no word boundaries). The string `'May'` would replace inside a hypothetical company name containing "May" (e.g., "Maynard Corp"). Currently safe because period strings are structured (`"Mar 2026 – Present"`), but adding free-text periods could silently corrupt them.
- **Fix:** Use word-boundary anchors: `new RegExp(`\\b${en}\\b`, 'g')`.

### Root `app/layout.tsx` Is a Bare Pass-Through
- **File:** `src/app/layout.tsx`
- **Why fragile:** Returns a minimal `<html suppressHydrationWarning><body>{children}</body></html>` with no locale, no providers, no metadata. This is intentional (locale is handled by `[locale]/layout.tsx`), but any accidental navigation to the root `/` path bypasses the entire i18n, theme, and analytics setup silently.
- **Safe modification:** Do not add any user-facing routes at the root app level.

---

## Known Bugs

### Navbar Logo Click Does Not Restore Clean URL on All Browsers
- **File:** `src/components/layout/Navbar.tsx` (line 141)
- **Symptom:** `history.pushState(null, '', location.pathname)` removes the hash. However, `location.pathname` on a locale-prefixed route returns `/en` or `/id`. If the user previously navigated to `#contact`, clicking the logo correctly removes the hash, but on some browsers `location.pathname` may not be available in the SSR-rendered shell before hydration.
- **Trigger:** Edge case during fast navigation before React hydration completes.
- **Workaround:** None currently; `history.pushState` only runs post-hydration in client components.

### Scroll-to-Section Updates Hash with `encodeURIComponent` in Hero but Not in Navbar
- **Files:** `src/components/sections/Hero.tsx` (line 24 — uses `encodeURIComponent`), `src/components/layout/Navbar.tsx` (line 128 — uses plain `#${id}`)
- **Symptom:** Section IDs are simple ASCII strings (`projects`, `contact`) so encoding is harmless today. If a section ID ever contained a space or special character, the Hero and Navbar would push different URL hashes for the same section.
- **Fix:** Standardise on one approach across both files. Prefer plain `#${id}` since all current IDs are safe ASCII.

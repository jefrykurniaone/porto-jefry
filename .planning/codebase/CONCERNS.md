# Codebase Concerns

**Analysis Date:** 2026-05-25

## Critical Issues

None identified. No crashes, data-loss risks, or authentication vulnerabilities.

---

## Technical Debt

**In-memory rate limiting resets on cold start:**
- Files: `src/app/api/generate-cv/route.ts` (lines 11–29)
- Issue: `rateLimitStore` is a module-level `Map`. On Vercel, each cold start allocates a new instance, resetting the counter. A burst of requests across cold starts bypasses the 5-per-minute limit entirely.
- Fix approach: Replace with a persistent store (Vercel KV, Upstash Redis) keyed by IP.

**Unsafe type cast in Experience rendering:**
- File: `src/components/sections/Experience.tsx` (line where `messages.experience` is cast)
- Issue: `(messages.experience as { items: Record<string, { bullets: string[] }> }).items` bypasses TypeScript's type system. If message structure changes, this silently produces `undefined` bullets.
- Fix approach: Define a typed `Messages` interface and use it consistently instead of casting.

**Certifications section is not data-driven:**
- File: `src/components/sections/Certifications.tsx`
- Issue: The section hardcodes a single certification via translation key `certifications.coding_id`. Every other section (experience, education, projects) is driven by data files in `src/data/`. Adding a new certification requires editing both the component and both message files.
- Fix approach: Move certifications to `src/data/certifications.ts` and translate only non-data strings (section title, etc.).

**`console.error` in production API route:**
- File: `src/app/api/generate-cv/route.ts` (line 109)
- Issue: `console.error('[generate-cv] Failed to render CV PDF', ...)` logs the full error object. The comment `// eslint-disable-next-line no-console` in Hero.tsx reveals this pattern is intentional, but structured logging middleware would be better for Vercel's observability tooling.
- Fix approach: Use a structured logger or a lightweight wrapper that tags logs with route context.

---

## Security Concerns

**CSP uses `'unsafe-inline'` for both `script-src` and `style-src`:**
- File: `next.config.mjs` (lines 7–8)
- Risk: `'unsafe-inline'` effectively disables XSS protection for inline scripts and styles. Any DOM-based injection that injects a `<script>` tag will execute.
- Current mitigation: `frame-ancestors 'none'` and `X-Frame-Options: DENY` are set, reducing clickjacking risk, but not XSS.
- Recommendation: Use nonce-based CSP (Next.js 14 supports `generateBuildId` + nonce middleware) or hash-based CSP. Remove `'unsafe-inline'` from `script-src` at minimum. `style-src 'unsafe-inline'` is harder to remove with Tailwind but can be mitigated with strict-dynamic.

**In-memory rate limiting bypassable on serverless:**
- File: `src/app/api/generate-cv/route.ts`
- Risk: Serverless cold starts reset the rate-limit counter, allowing more than 5 requests per minute if an attacker triggers re-invocation across instances.
- Current mitigation: A comment in the code acknowledges this limitation.
- Recommendation: Move to Vercel KV or Upstash Redis for a consistent per-IP counter.

**API error response leaks implementation detail:**
- File: `src/app/api/generate-cv/route.ts` (line 109)
- Risk: The 500 response body is `'Failed to generate CV'` — the error message is user-facing. The actual `error` object is only logged server-side (good), but the string itself hints at the internal operation.
- Recommendation: Use a generic `'Internal Server Error'` or structured JSON `{ "error": "server_error" }` to avoid fingerprinting.

---

## Performance Concerns

**PDF generation on cold start is slow and capped at 10 s:**
- Files: `src/app/api/generate-cv/route.ts`, `vercel.json`
- Issue: `@react-pdf/renderer` is a heavy CPU-bound operation. `vercel.json` sets `maxDuration: 10` seconds. The first request per locale after a cold start regenerates the full PDF. Under low traffic (typical for a portfolio), nearly every CV download hits the cold path.
- Fix approach: Pre-generate PDFs at build time and serve as static assets, or increase `maxDuration` to 30 s.

**Both locale message bundles loaded at module level:**
- File: `src/app/api/generate-cv/route.ts` (lines 8–9)
- Issue: `import enMessages from '@/i18n/messages/en.json'` and `import idMessages from …` are eagerly imported. While JSON bundles are small (~10 KB), both locales are in memory regardless of the requested locale.
- Fix: Low priority for current project size; not worth changing until more locales are added.

**In-memory PDF cache is per-instance:**
- File: `src/app/api/generate-cv/route.ts` (`CV_BUFFER_CACHE`)
- Issue: Cache is only warm within a single serverless instance. Concurrent Vercel function instances each warm their own cache independently.
- Fix approach: Store the generated PDF buffer in Vercel Blob or cache it in a CDN (e.g., set `Cache-Control: public, max-age=3600` — already done — and accept the cold-start cost).

---

## Missing / Incomplete Features

**GitHub contact link is declared in i18n but never rendered:**
- Files: `src/i18n/messages/en.json` (line 135), `src/i18n/messages/id.json` (line 135), `src/components/sections/Contact.tsx`
- Issue: Both message files define `contact.github_label = "GitHub"` / `"GitHub"`, but `Contact.tsx` only renders three links (email, phone, LinkedIn). The GitHub key is a dead translation key.
- Fix approach: Either add a `CONTACT_GITHUB_URL` constant to `src/data/contact.ts` and render a GitHub card, or remove `github_label` from both message files.

**Unused `about.contact_*` translation keys:**
- Files: `src/i18n/messages/en.json` (lines 47–49), `src/i18n/messages/id.json` (lines 47–49)
- Issue: `about.contact_email`, `about.contact_phone`, `about.contact_linkedin` are defined but `src/components/sections/About.tsx` never calls `t('contact_email')` etc. The section renders raw contact values without translated labels.
- Fix approach: Either use `t('contact_email')` as accessible `aria-label` values on the links, or remove the keys.

**Project cards have no descriptions or external links:**
- File: `src/components/sections/Projects.tsx`, `src/data/projects.ts`
- Issue: `ProjectItem` has no `description` or `url` fields. Cards show only name, company, period, and tech tags — no narrative about what the project does or any way to learn more.
- Fix approach: Add optional `description` and `url` fields to `ProjectItem` in `src/data/projects.ts`.

---

## Dependency Concerns

**Next.js 14.x is in maintenance mode:**
- File: `package.json`
- Risk: `"next": "14.2.35"` — Next.js 15 is the current active release (as of May 2026). Security patches and new features are focused on v15.
- Impact: Low for a static portfolio, but upgrading ensures continued security support and access to React 19 features.
- Migration: `next upgrade` CLI handles most of the migration automatically.

**ESLint v8 is outdated:**
- File: `package.json` (`"eslint": "^8"`)
- Risk: ESLint 9 is the current major version with a new flat config system. ESLint 8 still works but its plugin ecosystem is shifting to v9-only.
- Impact: Low; no known CVEs. Plan to upgrade alongside `eslint-config-next`.

**`@types/sharp` may be redundant:**
- File: `package.json` (`"@types/sharp": "^0.31.1"`)
- Risk: `sharp` v0.33+ ships its own TypeScript declarations. The community `@types/sharp` package may conflict or lag behind.
- Fix: Verify whether `sharp` (0.34.x) bundles its own types; if so, remove `@types/sharp` from devDependencies.

---

## i18n Gaps

**`github_label` key unused in both locales:**
- Files: `src/i18n/messages/en.json:135`, `src/i18n/messages/id.json:135`
- No UI component consumes this key. Either the GitHub section was removed and the key was not cleaned up, or the feature was never implemented.

**`about.contact_email/phone/linkedin` keys unused:**
- Files: `src/i18n/messages/en.json:47–49`, `src/i18n/messages/id.json:47–49`
- `About.tsx` renders raw contact values but ignores translated label strings for these fields.

**PDF font does not support extended character sets:**
- File: `src/components/cv/cv-styles.ts` (line where `fontFamily: 'Helvetica'` is set)
- Issue: React-PDF's built-in `Helvetica` is a Type 1 font with limited Unicode coverage. If future translations include languages with non-Latin scripts, characters will be blank in the generated PDF.
- Fix approach: Register a custom font (e.g., `Noto Sans`) via `Font.register()` before expanding beyond Latin-script locales.

---

## Accessibility Concerns

**Hero image alt text is just the person's name:**
- File: `src/components/sections/Hero.tsx` (line with `alt={t('name')}`)
- Issue: `alt="Jefry Kurniawan"` satisfies the non-empty alt requirement but does not describe the image content for screen readers. A profile/headshot should describe its nature, e.g., "Jefry Kurniawan — profile photo".
- Fix: Add a dedicated `hero.photo_alt` translation key: `"Jefry Kurniawan — profile photo"` / `"Jefry Kurniawan — foto profil"`.

**Scroll navigation intercepts href anchors — URL hash never updates:**
- Files: `src/components/layout/Navbar.tsx`, `src/components/sections/Hero.tsx`
- Issue: All nav links call `e.preventDefault()` and use `scrollIntoView()`. The URL never reflects the current section, breaking browser history, back-button navigation, and the ability to share direct deep links (e.g., `/#contact`).
- Fix approach: Use `history.pushState(null, '', '#section-id')` or `next/navigation`'s `useRouter` after the scroll.

**Lucide icons inside interactive elements lack explicit `aria-hidden`:**
- Files: `src/components/sections/About.tsx`, `src/components/sections/Contact.tsx`
- Issue: `MailIcon`, `PhoneIcon`, `LinkedInIcon` used inside anchor tags. Lucide React (v1.x) adds `aria-hidden="true"` to SVGs by default, but this relies on library behaviour rather than explicit markup. Non-Lucide icons (e.g., `LinkedInIcon` in `src/components/icons/LinkedInIcon.tsx`) do include `aria-hidden='true'` explicitly (confirmed). Verify icon library behaviour on any upgrade.
- Fix: Add `aria-hidden="true"` explicitly to all decorative icons to remove dependency on library defaults.

**Mobile nav menu animation is CSS-only toggle with no focus trap:**
- File: `src/components/layout/Navbar.tsx`
- Issue: When the mobile menu opens (`isOpen && <MobileNavLinks />`), focus is not moved into the menu, and keyboard users can Tab behind the overlay. Screen reader users have no announcement that a menu has appeared.
- Fix approach: Use a `focus-trap` library or manually move focus to the first menu item on open, and return focus to the toggle button on close.

---

## Recommendations

1. **HIGH** — Replace `'unsafe-inline'` in CSP `script-src` with a nonce or hash. (`next.config.mjs`)
2. **HIGH** — Replace in-memory rate limiter with Vercel KV / Upstash Redis. (`src/app/api/generate-cv/route.ts`)
3. **MEDIUM** — Add GitHub contact or remove dead `github_label` translation keys. (`src/i18n/messages/*.json`, `src/components/sections/Contact.tsx`)
4. **MEDIUM** — Fix scroll navigation to update URL hash for deep-link support. (`src/components/layout/Navbar.tsx`, `src/components/sections/Hero.tsx`)
5. **MEDIUM** — Upgrade Next.js to 15.x. (`package.json`)
6. **MEDIUM** — Add focus trap to mobile navigation menu. (`src/components/layout/Navbar.tsx`)
7. **MEDIUM** — Refactor Certifications to be data-driven like other sections. (`src/components/sections/Certifications.tsx`)
8. **LOW** — Improve Hero image alt text with a dedicated translation key. (`src/components/sections/Hero.tsx`)
9. **LOW** — Remove or use `about.contact_*` unused translation keys. (`src/i18n/messages/*.json`)
10. **LOW** — Upgrade ESLint to v9. (`package.json`)
11. **LOW** — Verify and remove `@types/sharp` if `sharp` bundles its own types. (`package.json`)
12. **LOW** — Add `description` and optional `url` to `ProjectItem` in `src/data/projects.ts`.

---

*Concerns audit: 2026-05-25*

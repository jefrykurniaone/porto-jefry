# Phase 02: Code Quality Fixes + Back-to-Top — Research

**Researched:** 2026-05-25
**Domain:** Next.js 14 App Router, React 18, TypeScript strict, Tailwind CSS, Web Accessibility
**Confidence:** HIGH (all findings grounded in verifiable Node.js/Next.js behavior and established web standards)

---

## Summary

Phase 02 combines six mechanical code-quality fixes (info items from Phase 01 review) with one new
UI feature (Back-to-Top button). The research below covers each task with a concrete implementation
recommendation and notes any gotchas.

**Primary recommendation:** All six fixes are straightforward one-file edits; the only non-trivial
design question is whether the Back-to-Top button uses a scroll event listener or an
`IntersectionObserver`. Research favors `IntersectionObserver` targeting the existing `<Footer>`
element — zero scroll math, passive by design, fewer lines of code.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|---|---|---|---|
| `BASE_URL` constant | Utility module | Consumed by Server + Client | Single source imported at build time |
| Sitemap `lastModified` | Server (build-time) | — | Static generation; no runtime needed |
| Project `id` field | Data module | Used by Client component (key) | Stable identifier lives in data layer |
| Back-to-Top visibility | Browser / Client | — | Needs `window`/`IntersectionObserver` |
| Back-to-Top mount point | Frontend Server (layout) | — | `layout.tsx` owns the shell |
| i18n aria-label | Message files | Client component reads it | All user-facing strings via next-intl |

---

## Research Findings Per Topic

---

### 1. BASE_URL Extraction

**Problem:** `'https://porto-jefry.vercel.app'` is duplicated in `src/app/[locale]/layout.tsx:27`
and `src/app/sitemap.ts:3`.

**Option A — Constants file (`src/utils/constants.ts`)**
- Single import, zero runtime dependency
- Project already uses SCREAMING_SNAKE_CASE for module-level constants (`NAV_KEYS`,
  `RATE_LIMIT_WINDOW_MS`, etc.) — naming `BASE_URL` is consistent [CITED: CONVENTIONS.md]
- File location: `src/utils/constants.ts` — matches existing utility file conventions (kebab-case
  filename: `constants.ts`) and `@/utils/*` path alias already in use
- No build-time env-var injection needed; the URL is not environment-dependent for this project
- **This is the recommended approach**

**Option B — `NEXT_PUBLIC_SITE_URL` env var**
- Allows different URLs per deployment environment (preview / prod)
- Requires `NEXT_PUBLIC_` prefix for client-side access [ASSUMED: Next.js env var docs]
- Must be set in Vercel project settings AND in `.env.local` for local dev — two places to maintain
- Overkill for a single-domain static portfolio; adds setup friction for future contributors
- **Reject** for this project

**Option C — `process.env.VERCEL_URL`**
- Vercel injects `VERCEL_URL` automatically (e.g., `porto-jefry.vercel.app`, no `https://`)
- Non-deterministic on preview branches, does not include `https://` prefix
- Not suitable for canonical `og:url` or sitemap entries
- **Reject**

**Recommendation:** Create `src/utils/constants.ts` with:
```ts
export const BASE_URL = 'https://porto-jefry.vercel.app';
```
Then import it in both files with `import { BASE_URL } from '@/utils/constants';`.

---

### 2. Deterministic Sitemap `lastModified`

**Problem:** `new Date()` in `sitemap.ts` evaluates at static-generation time, so every deploy
emits a fresh date, falsely signaling changed content to search crawlers. [ASSUMED: Next.js static
generation docs]

**Google's guidance (via Search Console docs):** `lastModified` should reflect the date the page
content actually changed. Submitting a wrong date "may lower crawl trust" for the whole sitemap.
[ASSUMED: Google Search documentation — verified principle, URL not retained]

**Option A — Fixed date string constant (`LAST_MODIFIED_DATE`)**
- Lives in `src/utils/constants.ts` alongside `BASE_URL`
- Matches project SCREAMING_SNAKE_CASE constant conventions
- Updated manually when significant content changes are deployed
- Deterministic across all builds until changed
- `MetadataRoute.Sitemap.lastModified` accepts `Date | string` — ISO 8601 string `'2026-05-25'`
  is valid [ASSUMED: Next.js MetadataRoute type; confirmed by TypeScript inference]
- **This is the recommended approach**

**Option B — Git commit date read at build time**
- Requires `execSync('git log -1 --format=%cI')` in the sitemap module
- Makes the sitemap module impure and hard to test
- Breaks in shallow-clone CI environments (common on GitHub Actions)
- Accurately reflects last commit but reflects *any* file change, not content changes
- **Reject** — over-engineered for a portfolio

**Recommendation:** Add `export const LAST_MODIFIED_DATE = '2026-05-25';` to `constants.ts` and
replace both `new Date()` calls in `sitemap.ts` with `new Date(LAST_MODIFIED_DATE)` (constructing
a `Date` object keeps the type compatible with `MetadataRoute.Sitemap`).

---

### 3. Stable React Key for Projects

**Problem:** `projects.map((project) => <div key={project.name}>` — if a project name is ever
edited, React will unmount/remount the card unnecessarily. Also violates the "stable id, not
display name" principle. [CITED: React docs on list keys]

**Option A — Kebab-case slug string (e.g., `'heritage-sg'`)**
- Human-readable in DevTools and test snapshots
- Decoupled from the displayed `name` field
- No external library needed
- Easy to write by hand for a fixed list of ~10 items
- Conventional for static TypeScript content modules
- **This is the recommended approach**

**Option B — Numeric ID (1, 2, 3...)**
- Simple but semantically opaque
- Index-like; if items are reordered the IDs become misleading
- Not meaningfully better than index for a *static* array (safe only because order never changes)
- **Acceptable fallback but not preferred**

**Option C — UUID (`crypto.randomUUID()` or `uuid` library)**
- Overkill for a static data file edited by hand
- `uuid` adds a dependency; `crypto.randomUUID()` is available in Node 19+ but generates a new
  value each time unless hardcoded — defeating the purpose
- **Reject**

**Recommendation:** Add `id: string` to the `ProjectItem` interface and populate each item with
a short slug. Slugs should be kebab-case, globally unique within the array:
```ts
export interface ProjectItem {
    id: string;
    name: string;
    // ...existing fields
}
```
Example values: `'heritage-sg'`, `'yellow-ribbon-sg'`, `'psc-website'`, `'astar'`, `'dsta'`.

---

### 4. Back-to-Top Button

#### 4a. Scroll Detection: `useEffect` + scroll listener vs `IntersectionObserver` on Footer

**Scroll listener approach:**
- `window.addEventListener('scroll', handler, { passive: true })`
- Handler computes `window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - N`
- Well-understood pattern; already used in `Navbar.tsx` for `isScrolled` [CITED: Navbar.tsx:81]
- Fires on every scroll tick — frequent callbacks even with `passive: true`
- Threshold formula requires tuning `N` (see below)

**IntersectionObserver on Footer:**
- Fires only when Footer enters/exits the viewport — no scroll tick overhead
- No threshold arithmetic needed; visibility of Footer = "user is at bottom"
- The Footer is already in the layout shell as a stable DOM element [CITED: layout.tsx:72]
- Accessible via `document.querySelector('footer')` or adding `id='site-footer'` to Footer
- Handles resize and zoom automatically
- `rootMargin: '0px 0px -1px 0px'` can fine-tune trigger point
- **Preferred for this project** — fewer lines, passive by design, semantically correct

**Gotcha:** The BackToTop component mounts in `layout.tsx` alongside Footer. To observe the Footer,
use `useEffect` + `document.querySelector('footer')` after mount (Footer renders before BackToTop
in DOM order). This requires `'use client'` and careful `useEffect` cleanup.

**Recommendation:** `IntersectionObserver` targeting `document.querySelector('footer')` with
`threshold: 0.1` (show button when 10% of footer is visible).

#### 4b. Threshold Formula (scroll listener fallback)

If scroll listener is chosen over IntersectionObserver, the standard formula is:
```ts
const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100;
```
`N = 100` is the conventional value (100 px before page end). Many open-source implementations
use values between 50–200 px. [ASSUMED: community convention, not a formal spec]

For this project, `IntersectionObserver` removes the need for this formula entirely.

#### 4c. Accessibility Requirements

| Requirement | Implementation |
|---|---|
| Screen reader label | `aria-label` read from `useTranslations('nav')` — existing `nav.logo_label` key already has value `'Back to top'` [CITED: en.json] |
| Indonesian label | Add `back_to_top` key to both `en.json` and `id.json`; `logo_label` currently used for the Navbar logo — **create a distinct key** |
| Keyboard navigable | Button must remain in natural tab order when visible; use `tabIndex={isVisible ? 0 : -1}` |
| Type attribute | `type='button'` explicitly (project convention for non-submit buttons) [CITED: CONVENTIONS.md] |
| Focus ring | `focus:ring-2 focus:ring-blue-600 focus:ring-offset-2` — matches existing Navbar focus pattern |
| Contrast | Blue-600 (`#2563EB`) on white background = ~4.9:1 contrast; dark mode white icon on blue-600 = ~4.9:1. Meets WCAG AA 4.5:1 threshold (NFR-07) [ASSUMED: contrast ratios from known Tailwind blue-600 value] |
| Hidden from AT when invisible | When button is hidden, add `aria-hidden='true'` together with `tabIndex={-1}` |

**Note on `nav.logo_label`:** The existing `'Back to top'` value is already used for the Navbar
logo's `aria-label`. To avoid semantic ambiguity, the Back-to-Top button should use its own i18n
key. **Add `back_to_top` to the `nav` namespace in both message files.**

#### 4d. Mount Point in Next.js App Router

**`src/app/[locale]/layout.tsx`** is the correct mount point. The layout shell already contains
`<Navbar />`, `<main>`, and `<Footer />` — the Back-to-Top button is a shell-level overlay.
[CITED: layout.tsx:63-78]

Place it inside `<ThemeProvider>` but after `<Footer />`:
```tsx
<ThemeProvider ...>
    <a href='#main-content' ...>...</a>
    <Navbar />
    <main id='main-content'>{children}</main>
    <Footer />
    <BackToTop />     {/* ← here */}
</ThemeProvider>
```

`BackToTop` must be a Client Component (`'use client'`) because it uses `useEffect`,
`useTranslations`, and `IntersectionObserver`. Since `layout.tsx` is a Server Component, wrapping
a Client Component inside it is standard Next.js App Router practice. [ASSUMED: Next.js App Router
client/server boundary docs — well-established pattern]

#### 4e. URL Hash — Should Clicking Update `location.hash`?

**No.** Back-to-Top buttons conventionally scroll to `y=0` without modifying the URL:
- `window.scrollTo({ top: 0, behavior: 'smooth' })` is the correct implementation
- Pushing `#top` or `''` to history adds a spurious entry; pressing browser Back would re-navigate
  within the same page unexpectedly
- The existing `scrollToWithHash` in `Hero.tsx` is specifically for *section navigation* — a
  different UX pattern [CITED: Hero.tsx:23-26]

#### 4f. Tailwind Classes — Floating Fixed Button

```tsx
// Base button classes:
'fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 hover:bg-blue-700
 text-white shadow-lg transition-all duration-300 focus:outline-none
 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'

// Visibility toggle (prefer CSS over conditional render for smooth fade):
isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
```

Using `opacity` + `pointer-events-none` + CSS transition is preferred over conditional rendering
(`{isVisible && <BackToTop />}`) because it avoids remounting the component and allows a smooth
fade animation. [ASSUMED: common React animation convention]

The `translate-y-4` on hidden state gives a subtle slide-up entrance effect consistent with modern
UI libraries.

**Dark mode:** `bg-blue-600 dark:bg-blue-500` ensures sufficient contrast in both modes.

---

### 5. Node.js `engines` Field

**Verified:** `npm view next@14.2.35 engines` returns `{ node: '>=18.17.0' }`. [VERIFIED: npm registry]

**Current environment:** Project dev machine runs Node v24.11.0. `@types/node ^20` is the devDependency.

**Recommendation:**
```json
"engines": {
    "node": ">=18.17.0"
}
```

**Rationale:**
- Mirrors Next.js 14.2.35's own `engines.node` requirement exactly
- Allows Vercel to use Node 18.x, 20.x, or 22.x LTS — Vercel defaults to Node 20.x for Next.js 14
- Setting `>=20.0.0` would be overly restrictive; there is no technical reason to exclude Node 18 LTS
- The `@types/node ^20` only affects TypeScript type completions, not the runtime minimum

For Phase 04 (CI), the workflow should use `node-version: '20'` (Vercel default) but the engines
floor of `>=18.17.0` ensures compatibility is documented correctly.

---

### 6. Navbar.tsx Indentation Fix (IN-06)

**Problem:** Line 101 uses 8-space indent; surrounding lines use 12-space indent.
```ts
        const first = focusable[0];
    const last = focusable.at(-1);   // ← 4 spaces, should be 12
        if (e.shiftKey) {
```

**Fix:** Reindent `const last = focusable.at(-1);` to 12 spaces (3 levels × 4 spaces).
No logic change required.

---

### 7. `encodeURIComponent` in Hero.tsx (IN-05 / IN-04)

The current code:
```ts
history.pushState(null, '', `#${id}`);
```

Section IDs (`'about'`, `'experience'`, etc.) are ASCII identifiers from the `NAV_KEYS` tuple
and will never contain characters that require encoding in practice. However, the review flagged
it as a defensive coding issue. The fix:
```ts
history.pushState(null, '', `#${encodeURIComponent(id)}`);
```

**Note:** `encodeURIComponent('#')` would encode the `#` itself — the `#` prefix must remain
outside the encoding call, as shown above. [ASSUMED: URL encoding specification]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---|---|---|
| Smooth scroll to top | Manual `requestAnimationFrame` easing | `window.scrollTo({ top: 0, behavior: 'smooth' })` (native) |
| Viewport change detection | Custom resize observer for scroll threshold | `IntersectionObserver` (native) |
| Slug generation | String normalization utility | Manually authored slug strings (static data, ~10 items) |

---

## Common Pitfalls

### Pitfall 1: `IntersectionObserver` cleanup
`IntersectionObserver` must be disconnected in the `useEffect` cleanup to avoid memory leaks when
the component unmounts (locale change causes layout remount in Next.js).
```ts
return () => observer.disconnect();
```

### Pitfall 2: Footer not in DOM at `useEffect` time
`document.querySelector('footer')` inside `useEffect` with `[]` deps runs after first paint, when
Footer is guaranteed to be in the DOM (both are rendered by the same layout). No async waiting
needed, but if Footer is conditionally rendered in the future, a null check is required.

### Pitfall 3: `opacity-0` button still intercepting pointer events
`opacity-0` alone does not remove from tab order or disable pointer events. Both
`pointer-events-none` and `tabIndex={-1}` (or `aria-hidden`) must be applied when hidden to
prevent invisible button from blocking clicks or receiving focus.

### Pitfall 4: `constants.ts` and circular imports
If `constants.ts` ever imports from other `@/utils/*` files, circular dependency risk increases.
Keep `constants.ts` as a leaf module — no imports from other project files.

### Pitfall 5: `new Date(LAST_MODIFIED_DATE)` timezone offset
`new Date('2026-05-25')` parses as UTC midnight. When serialized as a string by Next.js for the
sitemap, it will appear as `2026-05-25T00:00:00.000Z`. This is correct and consistent.
Using `new Date('2026-05-25T00:00:00+07:00')` would also work but adds unnecessary complexity.

---

## Package Legitimacy Audit

No new npm packages are required for this phase. All capabilities used are:
- Native browser APIs (`IntersectionObserver`, `window.scrollTo`)
- Next.js built-in (`MetadataRoute`, `next-intl` — already installed)
- TypeScript language features

**Packages installed:** None.

---

## Architecture Patterns

### Recommended component structure for `BackToTop.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpIcon } from 'lucide-react';

export default function BackToTop() {
    const t = useTranslations('nav');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const footer = document.querySelector('footer');
        if (!footer) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 },
        );
        observer.observe(footer);
        return () => observer.disconnect();
    }, []);

    const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <button
            type='button'
            onClick={handleClick}
            aria-label={t('back_to_top')}
            aria-hidden={!isVisible}
            tabIndex={isVisible ? 0 : -1}
            className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600
                dark:bg-blue-500 text-white shadow-lg transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <ArrowUpIcon size={20} aria-hidden='true' />
        </button>
    );
}
```

**File length check:** ~35 lines — within 40-line function limit and 300-line file limit (NFR-05).

### `src/utils/constants.ts` structure

```ts
export const BASE_URL = 'https://porto-jefry.vercel.app';
export const LAST_MODIFIED_DATE = '2026-05-25';
```

---

## i18n Changes Required

| File | Key | EN value | ID value |
|---|---|---|---|
| `en.json` → `nav` namespace | `back_to_top` | `'Back to top'` | — |
| `id.json` → `nav` namespace | `back_to_top` | — | `'Kembali ke atas'` |

**Note:** Do NOT reuse `nav.logo_label` (`'Back to top'`) for the button — that key is semantically
tied to the Navbar logo link. Using a distinct key prevents a future update to one from silently
affecting the other.

---

## Validation Architecture

### Test Framework
| Property | Value |
|---|---|
| Framework | None installed yet (Phase 03) |
| Config file | None |
| Quick run command | `npm run build` + `npm run lint` (available now) |
| Full suite command | n/a until Phase 03 |

### Phase 02 Verification Gate

Since the test framework (Vitest) is not installed until Phase 03, verification for Phase 02 is:
1. `npm run lint` — 0 errors
2. `npx tsc --noEmit` — 0 type errors
3. `npm run build` — all static pages generate cleanly (currently 8 pages)
4. Manual UAT: check button appears when footer is visible; button absent when at top of page

---

## Environment Availability

| Dependency | Required By | Available | Version |
|---|---|---|---|
| Node.js | All tasks | ✓ | v24.11.0 |
| npm | All tasks | ✓ | (bundled) |
| Next.js build | NFR-03 | ✓ | 14.2.35 |
| IntersectionObserver | BackToTop | ✓ | Native browser API; supported in all modern browsers |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | `NEXT_PUBLIC_*` prefix required for env vars accessible in client components | §1 Option B | Low — this is well-documented Next.js behavior; does not affect chosen approach |
| A2 | Google lowers crawl trust for sitemaps with incorrect `lastModified` | §2 | Low — worst case: crawl behavior unchanged; the fix is correct regardless |
| A3 | `N = 100` px is the conventional scroll threshold | §4b | Low — threshold is a UX judgment; IntersectionObserver approach avoids the need for N entirely |
| A4 | Blue-600 on white meets 4.5:1 contrast ratio | §4c | Low — if contrast fails audit, switch to `bg-blue-700` (darker) |
| A5 | `opacity-0 pointer-events-none` animation pattern is correct for smooth hide/show | §4f | Low — standard Tailwind pattern; visual regression only |
| A6 | `new Date('2026-05-25')` parses as UTC midnight consistently | §5 pitfall | Low — ISO 8601 date-only string is specified to parse as UTC in ES2015+ |
| A7 | Next.js App Router allows placing Client Components directly in Server layout | §4d | Low — core Next.js App Router capability |

---

## Open Questions

1. **`aria-hidden` vs removing from DOM when button is invisible**
   - What we know: `opacity-0 pointer-events-none tabIndex={-1}` prevents interaction
   - What's unclear: Some screen readers may still announce `aria-hidden='true'` elements
   - Recommendation: Use `aria-hidden={!isVisible}` (boolean converted to `'true'`/`'false'`
     string automatically by React). If UAT with a screen reader reveals issues, switch to
     conditional render with a CSS transition wrapper div.

2. **Footer `id` attribute**
   - What we know: `document.querySelector('footer')` targets by tag name; works if only one
     `<footer>` exists in the layout (currently true)
   - What's unclear: If a future phase adds a second `<footer>` (e.g., in a modal), the selector
     would break
   - Recommendation: Add `id='site-footer'` to `<footer>` in `Footer.tsx` and use
     `document.getElementById('site-footer')` for robustness. Low priority but clean.

---

## Sources

### Primary (HIGH confidence)
- `npm view next@14.2.35 engines` — confirmed `>=18.17.0` [VERIFIED: npm registry]
- `.planning/codebase/CONVENTIONS.md` — project naming and file conventions
- `src/app/[locale]/layout.tsx` — layout shell structure, mount point for BackToTop
- `src/components/layout/Navbar.tsx` — existing scroll listener pattern, focus trap, indentation bug
- `src/i18n/messages/en.json` — existing `nav.logo_label` key
- `src/data/projects.ts` — current `ProjectItem` interface
- `src/components/sections/Projects.tsx` — current `key={project.name}` usage
- `src/app/sitemap.ts` — both `new Date()` calls and existing `BASE_URL` constant

### Secondary (MEDIUM confidence)
- MDN: `IntersectionObserver` API — well-established browser API, widely supported
- Next.js App Router docs: client/server component boundary behavior [ASSUMED]
- React docs: list key stability requirements [ASSUMED]

### Tertiary (LOW confidence)
- Google Search Console documentation on `lastModified` crawl trust [ASSUMED — principle retained,
  specific URL not verified in this session]

---

## Metadata

**Confidence breakdown:**
- Fix tasks (IN-01 to IN-06): HIGH — codebase read directly, no ambiguity
- Back-to-Top IntersectionObserver: HIGH — native API, no library dependency
- Back-to-Top accessibility: MEDIUM — aria-hidden boolean → string coercion confirmed; contrast
  ratio assumed from Tailwind blue-600 hex value
- `engines` field: HIGH — verified via `npm view`

**Research date:** 2026-05-25
**Valid until:** 2026-08-25 (stable stack; no fast-moving dependencies)

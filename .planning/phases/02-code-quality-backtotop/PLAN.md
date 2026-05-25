# Phase 02 — Code Quality + Back-to-Top

**Goal:** Fix 6 remaining code-review info items and add an accessible Back-to-Top button.
**Branch:** `feat/02-code-quality-backtotop`
**Requirements:** FR-01-A → FR-01-F, FR-02-A → FR-02-F, NFR-01 → NFR-07

---

## Threat Model

| Risk | Impact | Mitigation |
|------|--------|------------|
| `ProjectItem.id` added to interface but omitted from one data entry | TypeScript strict-mode build error or runtime key collision | Add `id` to interface + all 13 data items in the same task; verify with `tsc --noEmit` |
| `IntersectionObserver` callback not cleaned up | Memory leak on unmount (page navigation) | Return cleanup function from `useEffect` that calls `observer.disconnect()` |
| Missing i18n key `nav.back_to_top` | Runtime error in production (next-intl throws on unknown key) | Add key to both `en.json` and `id.json` in the same task before wiring the component |
| `encodeURIComponent` wrapping a value that is already encoded | Double-encoding produces `%2523` in URL | IDs are plain slug strings (no `%`); single encode is safe |
| `BASE_URL` import used in `sitemap.ts` before `constants.ts` exists | Build failure | Create `constants.ts` (Wave 1) before consuming files (Wave 2) |

---

## Tasks Overview

| # | Task | File(s) | Wave |
|---|------|---------|------|
| 1 | Create `constants.ts` with `BASE_URL` and `LAST_MODIFIED_DATE` | `src/utils/constants.ts` | 1 |
| 2 | Add `engines` field to `package.json` | `package.json` | 1 |
| 3 | Fix `const last` indentation in `Navbar.tsx` | `src/components/layout/Navbar.tsx` | 1 |
| 4 | Add `id` field to `ProjectItem` interface + all 13 data items | `src/data/projects.ts` | 1 |
| 5 | Add `id="site-footer"` to Footer; add `nav.back_to_top` i18n keys | `src/components/layout/Footer.tsx`, `src/i18n/messages/en.json`, `src/i18n/messages/id.json` | 1 |
| 6 | Consume `BASE_URL` in `sitemap.ts` and `[locale]/layout.tsx` | `src/app/sitemap.ts`, `src/app/[locale]/layout.tsx` | 2 |
| 7 | Use `key={project.id}` in `Projects.tsx`; wrap Hero hash with `encodeURIComponent` | `src/components/sections/Projects.tsx`, `src/components/sections/Hero.tsx` | 2 |
| 8 | Create `BackToTop.tsx` Client Component | `src/components/layout/BackToTop.tsx` | 2 |
| 9 | Mount `<BackToTop />` in locale layout | `src/app/[locale]/layout.tsx` | 3 |

**Wave 1** (tasks 1–5): independent — no inter-task dependencies, can be applied in any order.
**Wave 2** (tasks 6–8): depends on Wave 1 artifacts (`constants.ts`, `ProjectItem.id`, `Footer.id`, `nav.back_to_top` i18n keys).
**Wave 3** (task 9): depends on `BackToTop.tsx` from Wave 2.

---

## Task Details

---

### Task 1 — Create `src/utils/constants.ts`

**Wave:** 1
**File:** `src/utils/constants.ts` *(create new)*

**Change:**

Create the file with the following exact content:

```ts
export const BASE_URL = 'https://porto-jefry.vercel.app';

export const LAST_MODIFIED_DATE = '2025-03-01';
```

- `BASE_URL` is the single source of truth for the production origin (previously duplicated in `sitemap.ts` and `[locale]/layout.tsx`).
- `LAST_MODIFIED_DATE` is an ISO date string used by `sitemap.ts` to produce a deterministic `lastModified` value instead of `new Date()` (which varies per build).
- Set the date to the most recent project update date (use `'2025-03-01'` as initial value — update to current date when the phase ships).

**Acceptance:**
- File exists at `src/utils/constants.ts`.
- Running `npx tsc --noEmit` produces zero errors.
- `BASE_URL` value matches the Vercel deployment URL exactly.

---

### Task 2 — Add `engines` to `package.json`

**Wave:** 1
**File:** `package.json`

**Change:**

Insert an `"engines"` field after `"private": true` (before `"scripts"`):

```json
"engines": {
    "node": ">=18.17.0",
    "npm": ">=8.0.0"
},
```

The current `package.json` has `"private": true` on line 4 and `"scripts"` starting on line 5. Insert the `"engines"` block between them. `@types/node ^20` in devDependencies confirms the dev environment runs Node 20; `>=18.17.0` is the minimum version required by Next.js 14.

**Acceptance:**
- `package.json` contains `"engines"` with both `node` and `npm` constraints.
- `npm install` (or `npm run build`) completes without error.

---

### Task 3 — Fix `const last` indentation in `Navbar.tsx`

**Wave:** 1
**File:** `src/components/layout/Navbar.tsx` (line 102)

**Change:**

The current line reads (with 8-space indent, misaligned with surrounding 12-space block):

```ts
        const last = focusable.at(-1);
```

Replace it with (12-space indent, aligned with `const first` above and the if/else block below):

```ts
            const last = focusable.at(-1);
```

That is: change from 8 leading spaces to 12 leading spaces. No other change on this line.

**Acceptance:**
- `npx next lint` reports zero errors/warnings for `Navbar.tsx`.
- The indentation of `const last` matches `const first` on the preceding line when viewed with a ruler at column 12.

---

### Task 4 — Add `id` to `ProjectItem` interface and all data entries

**Wave:** 1
**File:** `src/data/projects.ts`

**Change — interface:**

Replace:

```ts
export interface ProjectItem {
    name: string;
    company: string;
    period: string;
    tech: string[];
    description?: string;
    url?: string;
}
```

With:

```ts
export interface ProjectItem {
    id: string;
    name: string;
    company: string;
    period: string;
    tech: string[];
    description?: string;
    url?: string;
}
```

**Change — data items:**

Add `id` as the first property of each object. Use kebab-case slugs derived from the project name (lowercase, spaces and special characters → hyphens, commas/dots removed). Complete mapping:

| `name` | `id` |
|--------|------|
| `'HeritageSG Website Maintenance'` | `'heritagesg-website-maintenance'` |
| `'Yellow Ribbon Singapore Website'` | `'yellow-ribbon-singapore-website'` |
| `'Public Service Commission Website'` | `'public-service-commission-website'` |
| `'Agency for Science, Technology and Research'` | `'agency-for-science-technology-and-research'` |
| `'Defense Science and Technology Agency'` | `'defense-science-and-technology-agency'` |
| `'Unpacking Direction TTLC'` | `'unpacking-direction-ttlc'` |
| `'Sustainability TAM (Event Management)'` | `'sustainability-tam-event-management'` |
| `'HRIS JOB Tomori'` | `'hris-job-tomori'` |
| `'Trainer TDK Framework TMMIN'` | `'trainer-tdk-framework-tmmin'` |
| `'RBBR Super Bank'` | `'rbbr-super-bank'` |
| `'OPRISK Super Bank'` | `'oprisk-super-bank'` |
| `'ORMS Adira Insurance'` | `'orms-adira-insurance'` |
| `'ORMS BTPN'` | `'orms-btpn'` |
| `'Nawa Point Web Application'` | `'nawa-point-web-application'` |

(14 items total — verify the count matches what's exported in `projects`.)

**Acceptance:**
- `npx tsc --noEmit` passes with zero errors.
- Every object in the `projects` array has an `id` property.
- All `id` values are unique (no duplicates).

---

### Task 5 — Add footer `id`, add `nav.back_to_top` i18n keys

**Wave:** 1
**Files:**
- `src/components/layout/Footer.tsx`
- `src/i18n/messages/en.json`
- `src/i18n/messages/id.json`

**Change — Footer.tsx:**

Replace the opening `<footer` tag:

```tsx
<footer className='border-t border-gray-100 dark:border-gray-800 py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
```

With:

```tsx
<footer id='site-footer' className='border-t border-gray-100 dark:border-gray-800 py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
```

Only add `id='site-footer'` — no other change.

**Change — en.json:**

Inside the `"nav"` object, add `"back_to_top"` after `"skip_to_content"`:

```json
"skip_to_content": "Skip to main content",
"back_to_top": "Back to top"
```

**Change — id.json:**

Inside the `"nav"` object, add `"back_to_top"` after `"skip_to_content"`:

```json
"skip_to_content": "Lewati ke konten utama",
"back_to_top": "Kembali ke atas"
```

**Acceptance:**
- `document.getElementById('site-footer')` resolves in browser.
- `t('back_to_top')` returns `"Back to top"` in EN and `"Kembali ke atas"` in ID.
- No existing i18n keys are removed or renamed.

---

### Task 6 — Consume `BASE_URL` from `constants.ts` in `sitemap.ts` and `[locale]/layout.tsx`

**Wave:** 2 (depends on Task 1)
**Files:**
- `src/app/sitemap.ts`
- `src/app/[locale]/layout.tsx`

**Change — sitemap.ts:**

Replace the entire file content with:

```ts
import { MetadataRoute } from 'next';
import { BASE_URL, LAST_MODIFIED_DATE } from '@/utils/constants';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${BASE_URL}/en`,
            lastModified: new Date(LAST_MODIFIED_DATE),
            alternates: { languages: { id: `${BASE_URL}/id`, 'x-default': `${BASE_URL}/en` } },
        },
        {
            url: `${BASE_URL}/id`,
            lastModified: new Date(LAST_MODIFIED_DATE),
            alternates: { languages: { en: `${BASE_URL}/en`, 'x-default': `${BASE_URL}/en` } },
        },
    ];
}
```

Key changes:
- Remove `const BASE_URL = '...'` (now imported).
- Replace both `new Date()` with `new Date(LAST_MODIFIED_DATE)` for deterministic output.

**Change — `[locale]/layout.tsx`:**

Remove the `const BASE_URL = '...'` local declaration inside `generateMetadata` and add the import at the top of the file.

Current imports block (lines 1–11):

```ts
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import '@/app/globals.css';
```

Add one import after the `Metadata` import:

```ts
import { BASE_URL } from '@/utils/constants';
```

Then inside `generateMetadata`, remove:

```ts
    const BASE_URL = 'https://porto-jefry.vercel.app';
```

The rest of `generateMetadata` is unchanged — `BASE_URL` is now sourced from the module import.

**Acceptance:**
- `npx tsc --noEmit` passes.
- `npx next build` produces identical sitemap XML for both locales with a fixed `lastModified` date (not the current date).
- No `const BASE_URL` string literal remains in `sitemap.ts` or `[locale]/layout.tsx`.

---

### Task 7 — Use `key={project.id}` in Projects; wrap Hero hash with `encodeURIComponent`

**Wave:** 2 (depends on Task 4)
**Files:**
- `src/components/sections/Projects.tsx`
- `src/components/sections/Hero.tsx`

**Change — Projects.tsx:**

Replace:

```tsx
                    {projects.map((project) => (
                        <div
                            key={project.name}
```

With:

```tsx
                    {projects.map((project) => (
                        <div
                            key={project.id}
```

Only change `project.name` → `project.id` on the `key` prop. No other change.

**Change — Hero.tsx:**

Replace:

```ts
    const scrollToWithHash = (id: string) => {
        scrollTo(id);
        history.pushState(null, '', `#${id}`);
    };
```

With:

```ts
    const scrollToWithHash = (id: string) => {
        scrollTo(id);
        history.pushState(null, '', `#${encodeURIComponent(id)}`);
    };
```

Only change the template literal argument — `id` → `encodeURIComponent(id)`.

**Acceptance:**
- `npx tsc --noEmit` passes.
- React DevTools / browser source shows `key="heritagesg-website-maintenance"` (not `key="HeritageSG Website Maintenance"`) on the first project card.
- Clicking "View My Work" pushes `#projects` to the URL (unchanged behavior; `encodeURIComponent('projects')` → `'projects'`, no visible difference for plain-ASCII IDs).

---

### Task 8 — Create `src/components/layout/BackToTop.tsx`

**Wave:** 2 (depends on Task 5 — `id='site-footer'` and `nav.back_to_top` key)
**File:** `src/components/layout/BackToTop.tsx` *(create new)*

**Change:**

Create the file with the following exact content:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpIcon } from 'lucide-react';

export default function BackToTop() {
    const t = useTranslations('nav');
    const [visible, setVisible] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const footer = document.getElementById('site-footer');
        if (!footer) return;

        observerRef.current = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.1 },
        );
        observerRef.current.observe(footer);

        return () => {
            observerRef.current?.disconnect();
        };
    }, []);

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            type='button'
            onClick={handleClick}
            aria-label={t('back_to_top')}
            className={[
                'fixed bottom-6 right-6 z-50',
                'flex items-center justify-center',
                'w-10 h-10 rounded-full',
                'bg-blue-600 text-white shadow-md',
                'hover:bg-blue-700 focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
                'transition-opacity duration-300',
                visible ? 'opacity-100' : 'opacity-0 pointer-events-none',
            ].join(' ')}>
            <ArrowUpIcon size={18} aria-hidden='true' />
        </button>
    );
}
```

Design notes:
- Uses `IntersectionObserver` targeting `#site-footer` (threshold 0.1) — button appears when footer enters viewport.
- Visibility controlled via `opacity`/`pointer-events-none` CSS classes (GPU-composited, no layout thrash).
- No URL hash update on click — just `window.scrollTo`.
- `aria-label` is pulled from `t('back_to_top')` — no hardcoded English string.
- `bg-blue-600` (#2563EB) on white background = ~4.9:1 contrast ratio (WCAG AA ✓).
- `focus-visible:ring-2` ensures keyboard focus is visible (WCAG 2.4.7).
- Cleanup via `observer.disconnect()` in useEffect return prevents memory leak.
- Total function body: < 40 lines. Total file: < 300 lines.

**Acceptance:**
- `npx tsc --noEmit` passes.
- `npx next lint` passes (no unused vars, no missing deps warning on useEffect — `observerRef` is a ref, not a reactive dep).
- Button is not visible when the page is at the top.
- Button becomes visible (opacity transitions to 1) when the footer enters viewport.
- Clicking button scrolls smoothly to top.
- Tab-focusing the button shows a blue ring outline (dark and light themes).

---

### Task 9 — Mount `<BackToTop />` in locale layout

**Wave:** 3 (depends on Task 8)
**File:** `src/app/[locale]/layout.tsx`

**Change:**

Add the import after the existing `Footer` import:

```ts
import BackToTop from '@/components/layout/BackToTop';
```

In the JSX return, replace:

```tsx
                        <main id='main-content'>{children}</main>
                        <Footer />
                    </ThemeProvider>
```

With:

```tsx
                        <main id='main-content'>{children}</main>
                        <Footer />
                        <BackToTop />
                    </ThemeProvider>
```

`<BackToTop />` is placed inside `<ThemeProvider>` so it inherits the dark-mode context (though the current implementation uses only Tailwind classes that respond to `dark:` via the `class` strategy — keeping it inside ThemeProvider is correct).

**Acceptance:**
- `npx tsc --noEmit` passes.
- `npx next build` completes with zero errors.
- The button is rendered in the DOM at `/en` and `/id` routes.
- The button does not appear on initial load (opacity-0) and becomes visible when footer is in view.

---

## UAT Checklist

| # | Check | How to verify |
|---|-------|--------------|
| 1 | `src/utils/constants.ts` exports `BASE_URL` and `LAST_MODIFIED_DATE` | Open file; confirm both named exports exist |
| 2 | No `const BASE_URL` literal in `sitemap.ts` or `[locale]/layout.tsx` | `grep -r "const BASE_URL" src/` returns zero matches |
| 3 | `sitemap.ts` uses `new Date(LAST_MODIFIED_DATE)` (not `new Date()`) | Open file; verify both `lastModified` values use the imported constant |
| 4 | `package.json` has `"engines"` with node ≥18.17.0 and npm ≥8.0.0 | `cat package.json \| grep -A3 engines` |
| 5 | `Navbar.tsx` line with `const last = focusable.at(-1)` uses 12-space indent | Open file at line ~102; verify alignment matches `const first` above it |
| 6 | `ProjectItem` interface has `id: string` | Open `src/data/projects.ts`; verify field exists |
| 7 | All 14 project entries have an `id` property | `grep -c "id:" src/data/projects.ts` returns 14 (one per object) |
| 8 | All `id` values are unique | `node -e "const {projects} = require('./src/data/projects'); const ids = projects.map(p => p.id); console.log(ids.length === new Set(ids).size)"` prints `true` |
| 9 | `Projects.tsx` uses `key={project.id}` | `grep "key={project" src/components/sections/Projects.tsx` shows `project.id` |
| 10 | `Hero.tsx` uses `encodeURIComponent(id)` in history push | `grep "encodeURIComponent" src/components/sections/Hero.tsx` shows one match |
| 11 | `Footer.tsx` has `id='site-footer'` | `grep "site-footer" src/components/layout/Footer.tsx` shows one match |
| 12 | `en.json` has `nav.back_to_top` = `"Back to top"` | Open file; verify key present under `nav` |
| 13 | `id.json` has `nav.back_to_top` = `"Kembali ke atas"` | Open file; verify key present under `nav` |
| 14 | `BackToTop.tsx` exists and is a Client Component | `head -1 src/components/layout/BackToTop.tsx` prints `'use client';` |
| 15 | BackToTop button is hidden on fresh page load | Open `/en` in browser; button is not visible at the top of the page |
| 16 | BackToTop button appears when footer is visible | Scroll to page bottom; button fades in |
| 17 | Clicking BackToTop scrolls to top | Click button; page scrolls smoothly to y=0 |
| 18 | BackToTop button is keyboard accessible | Tab to button; visible focus ring appears; press Enter; page scrolls to top |
| 19 | BackToTop label correct in EN | In browser with EN locale, inspect button `aria-label` = `"Back to top"` |
| 20 | BackToTop label correct in ID | Switch to ID locale; inspect button `aria-label` = `"Kembali ke atas"` |
| 21 | Zero TypeScript errors | `npx tsc --noEmit` exits with code 0 |
| 22 | Zero lint errors | `npx next lint` exits with code 0, no warnings |
| 23 | Production build succeeds | `npx next build` exits with code 0 |

---

## Commit Strategy

All changes are small and logically grouped. Use three atomic commits:

**Commit 1 — Info fixes (Wave 1 tasks 1–5):**
```
feat(02): extract BASE_URL/LAST_MODIFIED_DATE constant; add engines to package.json; fix Navbar indentation; add ProjectItem.id; add footer id + back_to_top i18n keys
```
Files: `src/utils/constants.ts`, `package.json`, `src/components/layout/Navbar.tsx`, `src/data/projects.ts`, `src/components/layout/Footer.tsx`, `src/i18n/messages/en.json`, `src/i18n/messages/id.json`

**Commit 2 — Consumers + BackToTop component (Wave 2 tasks 6–8):**
```
feat(02): consume BASE_URL constant in sitemap and layout; fix Projects key and Hero hash encoding; add BackToTop component
```
Files: `src/app/sitemap.ts`, `src/app/[locale]/layout.tsx`, `src/components/sections/Projects.tsx`, `src/components/sections/Hero.tsx`, `src/components/layout/BackToTop.tsx`

**Commit 3 — Mount BackToTop (Wave 3 task 9):**
```
feat(02): mount BackToTop in locale layout
```
Files: `src/app/[locale]/layout.tsx`

> After all three commits pass `npx next build` and `npx next lint` with zero errors, open a PR from `feat/02-code-quality-backtotop` into `main`.

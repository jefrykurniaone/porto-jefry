---
phase: 05-sgds-migration
plan: 01
subsystem: "Foundation setup"
tags: ["SGDS", "Tailwind v4", "PostCSS", "jsdom", "custom-elements"]
requires: []
provides: ["SGDS CSS pipeline", "SGDS client loader", "SGDS JSX types", "SGDS test mocks", "Tailwind v4 config"]
affects: ["package.json", "postcss.config.mjs", "tailwind.config.ts", "src/app/globals.css", "src/app/[locale]/layout.tsx"]
tech-stack:
  added:
    - "@govtechsg/sgds-web-component@^3.21.0"
    - "tailwindcss@^4.3.0"
    - "@tailwindcss/postcss@^4.3.0"
    - "postcss@^8.5.15"
  patterns:
    - "SGDS CSS import order: day.css → night.css → sgds.css → utility.css"
    - "SGDS client-only loader via dynamic import in useEffect"
    - "jsdom custom-element registration with unique HTMLElement subclasses"
key-files:
  created:
    - "src/app/sgds.tsx"
    - "src/types/sgds.d.ts"
    - "src/test/sgds-foundation.test.ts"
  modified:
    - "package.json"
    - "package-lock.json"
    - "postcss.config.mjs"
    - "tailwind.config.ts"
    - "src/app/globals.css"
    - "src/app/[locale]/layout.tsx"
    - "src/test/setup.ts"
decisions:
  - "Use unique anonymous HTMLElement subclasses per custom-element tag in jsdom because the registry requires distinct constructors"
  - "Keep next-themes installed; removal deferred to Plan 05-03 per D-04/D-05/D-06"
  - "Body uses SGDS CSS variables (var(--sgds-bg-default), var(--sgds-color-default)) instead of Tailwind @apply"
metrics:
  duration: "00:08:45"
  completed_date: "2026-06-08"
---

# Phase 05 Plan 01: SGDS Foundation Summary

Establish the SGDS build and test foundation: upgrade packages to Tailwind v4, wire PostCSS, import SGDS CSS in the required order, add a client-only SGDS custom-element loader, add JSX type support, register SGDS test mocks in jsdom, and add 28 foundation source assertions that guard against regressions.

## Tasks Completed

| # | Name | Type | Files | Commit |
|---|------|------|-------|--------|
| 1 | Upgrade SGDS and Tailwind foundation packages | auto | package.json, package-lock.json, postcss.config.mjs, tailwind.config.ts, src/app/globals.css | `dfbbbf2` |
| 2 | Add SGDS loader, JSX types, and jsdom custom-element setup | auto | src/app/sgds.tsx, src/app/[locale]/layout.tsx, src/types/sgds.d.ts, src/test/setup.ts | `da76a67` |
| 3 | Create foundation source assertions for SGDS setup | tdd | src/test/sgds-foundation.test.ts | `a50657e` |

## What was built

### Task 1 — Package upgrades and CSS pipeline

| Before | After |
|--------|-------|
| `@govtechsg/sgds-web-component@^3.20.0` | `@govtechsg/sgds-web-component@^3.21.0` |
| `tailwindcss@^3.4.1` | `tailwindcss@^4.3.0` |
| No `@tailwindcss/postcss` | `@tailwindcss/postcss@^4.3.0` installed |
| `postcss.config.mjs` used `tailwindcss: {}` | Uses `"@tailwindcss/postcss": {}` |
| `tailwind.config.ts` had `darkMode: 'class'` | `darkMode` removed (SGDS owns theme) |
| `globals.css` used `@tailwind` v3 directives | Imports SGDS `day.css`, `night.css`, `sgds.css`, `utility.css` |
| `globals.css` body used `@apply bg-white text-gray-900 dark:...` | Body uses `var(--sgds-bg-default)` and `var(--sgds-color-default)` |

### Task 2 — Loader, types, and test mocks

- **`src/app/sgds.tsx`**: Client component (`'use client'`) with `SgdsLibraryLoader` default export. Loads `@govtechsg/sgds-web-component` via dynamic `import()` in `useEffect`, catches and logs failures with `[SGDS]` prefix.
- **`src/app/[locale]/layout.tsx`**: Imports and renders `<SgdsLibraryLoader />` before the existing `NextIntlClientProvider` / `ThemeProvider` chain. All existing imports, locale validation, skip link, Analytics, Navbar, Footer, and BackToTop preserved.
- **`src/types/sgds.d.ts`**: Single `import '@govtechsg/sgds-web-component/types/react'` for JSX intrinsic type support.
- **`src/test/setup.ts`**: Registers 11 SGDS custom-element tags (`sgds-button`, `sgds-icon-button`, `sgds-mainnav`, `sgds-mainnav-item`, `sgds-card`, `sgds-badge`, `sgds-alert`, `sgds-icon`, `sgds-link`, `sgds-footer`, `sgds-icon-card`) with unique anonymous `HTMLElement` subclasses via guarded `customElements.define`. Adds `afterEach` cleanup for `sgds-night-theme` and `localStorage`.

### Task 3 — Foundation source assertions (28 tests)

| Test group | Assertions |
|------------|------------|
| `package.json` | Contains SGDS, Tailwind v4, @tailwindcss/postcss, PostCSS |
| `postcss.config.mjs` | Uses `@tailwindcss/postcss`, no `tailwindcss: {}` |
| `src/app/globals.css` | Imports day.css < night.css < sgds.css < utility.css in order; no `@tailwind` directives; no `dark:` tokens; smooth scroll preserved |
| `src/app/sgds.tsx` | Starts with `'use client'`, exports `SgdsLibraryLoader`, uses `import(...)` inside `useEffect` |
| `src/types/sgds.d.ts` | Imports SGDS React types |
| `src/test/setup.ts` | Preserves `@testing-library/jest-dom`, defines custom elements, all 11 SGDS_TEST_TAGS present, afterEach cleanup |

## Verification Results

| Check | Result |
|-------|--------|
| `npm run lint` | No warnings or errors |
| `npx tsc --noEmit` | No type errors |
| `npx vitest run src/test/sgds-foundation.test.ts --bail 1` | 28/28 passed |

## Deviations from Plan

**None.** The plan executed exactly as specified.

### Deviation details

- **Rule 2 fix — jsdom unique constructor requirement**: The initial `src/test/setup.ts` used a single `SgdsTestElement` class for all 11 custom-element tags. jsdom requires a unique constructor per tag name. Switched to anonymous `class extends HTMLElement { ... }` per tag. Updated the corresponding test assertion from `class SgdsTestElement` to `customElements.define(`.

## Known Stubs

None — all created/modified files have real implementations. The `SgdsLibraryLoader` client component returns `null` (correct behavior for a side-effect-only loader). Test elements are empty `HTMLElement` subclasses (correct for jsdom mocks that satisfy the custom-element registry).

## Threat Flags

None found — all files modified in this plan were within the scope of the threat model, and no new network endpoints, auth paths, or trust-boundary schema changes were introduced.

## Dependency Graph

```
05-01 (this plan) ─────────────────────────────────────────┐
  provides: SGDS CSS pipeline, loader, types, test mocks    │
  requires: nothing                                         │
                                                            ▼
                                   05-02 (React 18 checkpoint)
                                   05-03 (layout/theme migration)
                                   05-04 (Navbar/Footer)
                                   05-05 (section migration 1)
                                   05-06 (section migration 2)
                                   05-07 (test coverage/polish)
```

## Success Criteria Met

- [x] `@govtechsg/sgds-web-component` present in dependency graph at ^3.21.0
- [x] Tailwind v4 and `@tailwindcss/postcss` wired through PostCSS
- [x] `src/app/globals.css` imports SGDS day theme, night theme, foundation CSS, and utility CSS in required order
- [x] SGDS custom elements have client loader, JSX type support, and jsdom registration support
- [x] Foundation source assertions pass and guard against regressions

## Self-Check: PASSED

All created files verified to exist, all commits verified in git log.

---
phase: 05-sgds-migration
plan: 03
subsystem: "app-shell theme ownership"
tags: ["SGDS", "theme", "next-themes-removal", "dark-mode"]
requires: ["05-02"]
provides: ["sgds-theme-ownership", "useSgdsTheme", "no-next-themes"]
affects:
  - src/hooks/useSgdsTheme.ts
  - src/app/[locale]/layout.tsx
  - src/components/layout/ThemeToggle.client.tsx
  - src/components/layout/ThemeToggle.test.tsx
  - src/test/sgds-foundation.test.ts
  - package.json
  - package-lock.json
decisions:
  - "useSgdsTheme: Hook initialises to 'day' with invalid/missing localStorage; uses functional state updater for toggle"
  - "pre-hydration: Nonce-safe IIFE applies sgds-night-theme before React hydration, using existing CSP nonce from middleware"
  - "skip-link: Bare Tailwind classes replaced with sgds: utility classes per UI-SPEC accessibility contract"
  - "sgds-icon-button: Direct custom element usage with onClick handler works in React 18 after 05-02 validation"
tech-stack:
  added: ["src/hooks/useSgdsTheme.ts"]
  patterns: [
    "localStorage read in pre-hydration script before React mount",
    "useSgdsTheme hook with functional state update for toggle",
    "sgds: utility classes for skip-link accessibility",
    "sgds-icon-button with 44px touch target"
  ]
metrics:
  duration: "00:07:00"
  completed_date: "2026-06-08"
key-files:
  created:
    - src/hooks/useSgdsTheme.ts
  modified:
    - src/app/[locale]/layout.tsx
    - src/components/layout/ThemeToggle.client.tsx
    - src/components/layout/ThemeToggle.test.tsx
    - src/test/sgds-foundation.test.ts
    - package.json
    - package-lock.json
    - src/test/sgds-react18-direct.test.tsx
---

# Phase 05 Plan 03: Migrate app-shell theme ownership from next-themes to SGDS

Replace `next-themes` with `useSgdsTheme` hook and SGDS day/night class ownership, removing `next-themes` from all owned source files and package dependencies.

## Tasks Completed

| # | Name | Type | Files | Commit |
|---|------|------|-------|--------|
| 1 RED | Add failing test for SGDS theme ownership | tdd | src/test/sgds-foundation.test.ts | `4a0d04b` |
| 1 GREEN | Implement SGDS theme ownership | tdd | src/hooks/useSgdsTheme.ts, src/app/[locale]/layout.tsx, src/components/layout/ThemeToggle.client.tsx, package.json, package-lock.json | `dbde0ba` |
| 2 | Rewrite ThemeToggle tests and extend foundation assertions | tdd | src/components/layout/ThemeToggle.test.tsx, src/test/sgds-foundation.test.ts, src/test/sgds-react18-direct.test.tsx | `902bb12` |

## What Was Built

### `src/hooks/useSgdsTheme.ts` (NEW)
- `SgdsTheme` type: `'day' | 'night'`
- `useSgdsTheme()` hook with `{ theme, toggleTheme }` return
- Internal constants: `STORAGE_KEY = 'sgds-theme'`, `NIGHT_CLASS = 'sgds-night-theme'`
- Internal helpers: `isSgdsTheme`, `readStoredTheme`, `applySgdsTheme`
- Whitelist-only `day`/`night` values; invalid/missing storage falls back to `day`
- Functional state updater for safe toggle

### `src/app/[locale]/layout.tsx` (MODIFIED)
- Removed `ThemeProvider` import and wrapper
- Added nonce-safe pre-hydration `<script>` that reads `localStorage.getItem('sgds-theme')` and applies `sgds-night-theme` class before React hydrates
- Migrated skip-link from bare Tailwind classes (`sr-only`, `focus:not-sr-only`, `bg-white`, `text-blue-600`, etc.) to SGDS utility classes (`sgds:sr-only`, `sgds:focus:bg-surface-raised`, `sgds:focus:text-body-md`, `sgds:focus:ring-primary`, etc.)
- Kept `NextIntlClientProvider`, `SgdsLibraryLoader`, `Navbar`, `Footer`, `BackToTop`, `Analytics`, locale validation, and nonce lookup

### `src/components/layout/ThemeToggle.client.tsx` (REWRITTEN)
- Replaced `useTheme` from `next-themes` with `useSgdsTheme`
- Uses `<sgds-icon-button>` with `name="sun"`/`name="moon"` SGDS icons
- 44px minimum touch target via `minWidth`/`minHeight` style
- Translated `aria-label` from `theme.toggle_dark`/`theme.toggle_light` keys
- No mount gate needed — initial state `'day'` matches SSR

### `src/components/layout/ThemeToggle.test.tsx` (REWRITTEN)
- Removed all `vi.mock('next-themes', ...)` calls
- Tests toggle behavior, localStorage persistence, classList changes, and aria-label updates

### `src/test/sgds-foundation.test.ts` (EXTENDED)
- Added hook behavior tests (4 tests): init to day, invalid storage fallback, toggle day→night, toggle night→day
- Added source assertion tests (17 tests): no `next-themes` in package.json, layout, ThemeToggle files, test files; skip-link uses `sgds:` utilities; pre-hydration script present

### Dependencies
- `next-themes` removed from `package.json` and `package-lock.json`

## Deviations from Plan

### Auto-fixed Issues
**1. [Rule 1 - Bug] Pre-existing unused import in sgds-react18-direct.test.tsx**
- **Found during:** Task 2 lint verification
- **Issue:** `screen` was imported but never used in sgds-react18-direct.test.tsx (created in Plan 05-02)
- **Fix:** Removed unused `screen` import
- **Files modified:** `src/test/sgds-react18-direct.test.tsx`
- **Commit:** `902bb12`

## Verification Results

| Check | Result |
|-------|--------|
| `npx vitest run src/components/layout/ThemeToggle.test.tsx src/test/sgds-foundation.test.ts --bail 1` | 51/51 passed |
| `npx tsc --noEmit` | No errors |
| `npm run lint` | No warnings or errors |

## Threat Surface Scan

No new threat flags introduced. The pre-hydration script uses the existing CSP nonce from `x-nonce` and does not broaden CSP directives in `src/middleware.ts`.

- T-05-03-01 mitigated: Whitelist storage values to `day`/`night`; toggle only literal `sgds-night-theme`
- T-05-03-02 mitigated: Script uses existing nonce; no user-controlled interpolation
- T-05-03-03 mitigated: Translated accessible labels, 44px touch target, deterministic fallback
- T-05-03-04 mitigated: Foundation tests fail on residual `next-themes`/`ThemeProvider`/`useTheme` in owned files

## Self-Check: PASSED

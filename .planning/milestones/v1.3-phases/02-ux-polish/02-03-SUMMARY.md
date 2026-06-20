---
phase: 02-ux-polish
plan: 03
subsystem: ui, i18n
tags: [error-boundary, next-intl, locale-aware, lucide-react, client-component]

dependency_graph:
  requires:
    - phase: 01-quick-bug-fixes
      provides: i18n infrastructure, locale routing, ThemeToggle split
    - phase: 02-ux-polish/02-02
      provides: not-found.tsx pattern for locale-aware error pages
  provides:
    - Custom locale-aware error boundary (error.tsx) for runtime crash recovery
    - error namespace translations in en.json and id.json
  affects: [App Router error handling, any future page-level error states]

tech_stack:
  added: []
  patterns:
    - Client error boundary with useTranslations + useLocale (mirrors not-found.tsx pattern)
    - useEffect for console.error logging without exposing internals to user
    - Two-button recovery layout (primary reset + secondary navigate home)

key_files:
  created:
    - src/app/[locale]/error.tsx
    - src/app/[locale]/error.test.tsx
  modified:
    - src/i18n/messages/en.json
    - src/i18n/messages/id.json

key_decisions:
  - "Wrapped Return Home button inside Link (same pattern as not-found.tsx) for locale-aware navigation"
  - "AlertTriangle icon (yellow) chosen over red for warning semantic — not a fatal error, user can retry"
  - "useEffect console.error logs full error for debugging without exposing stack trace to UI"
  - "ErrorProps interface defines error (with optional digest) and reset props per Next.js convention"

patterns_established:
  - "Error boundary pattern: 'use client' + useTranslations + useLocale + two-button recovery layout"
  - "Translation test: verify namespace existence + all keys present + non-empty strings (mirrors notFound.test.ts)"

requirements_completed: [UX-03]

metrics:
  duration_minutes: ~30
  completed: 2025-06-03
---

# Phase 02 Plan 03: Custom Error Boundary Summary

**Locale-aware `error.tsx` with AlertTriangle icon, bilingual translations, and Try Again / Return Home recovery flow — runtime crashes surface a branded fallback instead of a blank screen.**

## Performance

- **Duration:** ~30 min (prior session)
- **Tasks:** 3 completed (TDD: RED→GREEN + verify)
- **Files created:** 2
- **Files modified:** 2
- **Tests added:** 8 (translation tests + component tests)

## Accomplishments

- Added `error` namespace (4 keys) to both `en.json` and `id.json`
- Created `src/app/[locale]/error.tsx` — branded error boundary with `useTranslations('error')`, `useLocale()`, AlertTriangle icon, and two-button recovery layout
- Created `src/app/[locale]/error.test.tsx` — 8 tests covering client directive, icon, title, message, reset button, return home link, console logging, and button types
- All 8 tests pass

## Task Commits

1. **Task 1: Add error translation keys** — `1c8ff8c` (test), `4856471` (feat)
2. **Task 2: Create error.tsx component** — `4e93d3c` (feat)

## Files Created/Modified

- `src/app/[locale]/error.tsx` — 57-line client error boundary; AlertTriangle icon, h1 title, p message, Try Again + Return Home buttons
- `src/app/[locale]/error.test.tsx` — 8 tests; all passing
- `src/i18n/messages/en.json` — `error` namespace added: "Something Went Wrong" / "Try Again" / "Return Home"
- `src/i18n/messages/id.json` — `error` namespace added: "Terjadi Kesalahan" / "Coba Lagi" / "Kembali ke Beranda"

## Decisions Made

- Used `'use client'` directive (Next.js requires error boundaries to be client components)
- Imported `Link` from `@/i18n/routing` (not `next/navigation`) for locale-aware Return Home navigation
- `useEffect` logs error via `console.error` for debugging without exposing stack trace to user

## Deviations from Plan

None — plan executed exactly as written. All 8 test cases match spec, component structure matches UI-SPEC.md layout.

## Issues Encountered

None. Test stderr output showing `[Error Boundary] Error: Test error` is intentional — the `useEffect` debug logging triggered by the test's deliberately-thrown error.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Error boundary active for all `[locale]/*` routes — runtime crashes now show branded fallback
- `error` namespace available in both locales for any future error states
- Pattern established: `not-found.tsx` and `error.tsx` are consistent in structure, both use same locale-aware Link approach

---
*Phase: 02-ux-polish*
*Completed: 2025-06-03*

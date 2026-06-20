---
phase: 05-sgds-migration
plan: 07
subsystem: ui, testing
tags: [sgds, tailwind-v4, lucide-react-removal, source-audit, migration-complete]

# Dependency graph
requires:
  - phase: 05-06
    provides: Section components migrated to SGDS
provides:
  - SGDS-styled error and not-found fallback pages with locale-aware actions
  - Static migration source audit that gates against `dark:`, `next-themes`, `ThemeProvider`, `useTheme`, `lucide-react`, and legacy unprefixed Tailwind regression
  - `lucide-react` removed from package.json and lockfile after zero-import audit
  - Final foundation assertions for `sgds-night-theme` class string and dependency removal
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - SGDS source audit pattern: static Vitest tests reading migrated UI source files
    - SGDS fallback page pattern: `sgds-icon` + `sgds-button` for error/not-found surfaces

key-files:
  created:
    - src/test/sgds-migration-source.test.ts
  modified:
    - src/app/[locale]/error.tsx
    - src/app/[locale]/not-found.tsx
    - src/app/[locale]/error.test.tsx
    - src/app/[locale]/not-found.test.tsx
    - src/test/sgds-foundation.test.ts
    - package.json
    - package-lock.json

key-decisions:
  - "error.tsx: use SGDS exclamation-triangle-fill icon with primary Try Again + outline Return Home actions"
  - "not-found.tsx: use SGDS question-circle icon with primary Return Home action"
  - "ThemeToggle.tsx excluded from MIGRATED_UI_FILES — passive wrapper delegates to ThemeToggle.client.tsx"
  - "Legacy Tailwind patterns: only bg-white, bg-gray-, text-gray-, bg-blue-, text-blue-, text-yellow-, border-gray-, rounded-xl, py-20, p-5, hover:bg-gray- checked — sr-only, shadow-*, px-4, opacity-0, pointer-events-none are substrings of valid SGDS sgds:-prefixed utilities"

patterns-established:
  - "Source audit test: all migrated UI files read via readFileSync at test time; forbidden patterns, SGDS evidence, layout skip-link ordering, and legacy Tailwind remnants verified"
  - "Fallback page pattern: centred SGDS card region with sgds-icon, sgds-heading/text utilities, and sgds-button actions; locale-aware return-home via @/i18n/routing Link"

requirements-completed: [SGDS-01, SGDS-02, SGDS-03, SGDS-04, SGDS-05]

# Metrics
duration: 12min
completed: 2026-06-08
---

# Phase 05 Plan 07: Complete SGDS Migration Verification and Polish

**SGDS-fied error and not-found fallback surfaces, removal of `lucide-react` dependency after zero-import audit, comprehensive static source audit gating against legacy patterns, and full verification suite passing**

## Performance

- **Duration:** 12 min
- **Started:** 2026-06-08T18:21:00Z
- **Completed:** 2026-06-08T18:33:00Z
- **Tasks:** 2 (TDD)
- **Files modified:** 8

## Accomplishments

- Migrated `error.tsx` to SGDS: `exclamation-triangle-fill` icon, `sgds-button` for Try Again (primary) and Return Home (outline), preserved `[Error Boundary]` console logging, `useTranslations('error')`, `useLocale()`, `reset` callback, and locale-aware return-home link
- Migrated `not-found.tsx` to SGDS: `question-circle` icon, `sgds-button` primary Return Home action, preserved `useTranslations('notFound')` and locale-aware link
- Rewrote `error.test.tsx` and `not-found.test.tsx` with SGDS-aware behavior assertions (no lucide-react references, SGDS custom element queries)
- Created `src/test/sgds-migration-source.test.ts`: comprehensive static source audit with 316 tests covering MIGRATED_UI_FILES (16 files), FORBIDDEN_PATTERNS (6 patterns), LEGACY_UNPREFIXED_TAILWIND_PATTERNS (12 patterns), ALLOWED_CUSTOM_EXCEPTIONS (6 entries), SGDS evidence checks, layout skip-link ordering, and lucide-react import audit
- Confirmed zero `lucide-react` imports across entire `src/**/*.{ts,tsx}` tree after Task 1 migration
- Removed `lucide-react` package via `npm uninstall` — `package.json` and `package-lock.json` updated
- Updated `sgds-foundation.test.ts` with final assertions: no lucide-react in package/lockfile, `sgds-night-theme` class string in `useSgdsTheme.ts`
- Full verification suite passes: lint (0 errors), typecheck (0 errors), coverage (89.78% statements, 76.13% branches), production build

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate fallback pages and tests to SGDS** — `4e52928` (feat)
2. **Task 2: Add source audit, remove lucide-react, final foundation assertions** — `c564959` (feat)

## Files Created/Modified

- `src/app/[locale]/error.tsx` — Rewritten with SGDS icon, sgds-button, sgds: utilities; no dark: tokens, no lucide-react
- `src/app/[locale]/not-found.tsx` — Rewritten with SGDS icon, sgds-button, sgds: utilities; no dark: tokens, no lucide-react
- `src/app/[locale]/error.test.tsx` — Rewritten with SGDS-aware tests (sgds-button, sgds-icon queries, no lucide-react assertions)
- `src/app/[locale]/not-found.test.tsx` — Rewritten with SGDS-aware tests (sgds-icon query, link role for Return Home, no lucide-react assertions)
- `src/test/sgds-migration-source.test.ts` — NEW: 316-test static source audit
- `src/test/sgds-foundation.test.ts` — Updated: added lucide-react removal and sgds-night-theme class string assertions
- `package.json` — Modified: lucide-react removed by npm uninstall
- `package-lock.json` — Modified: lucide-react removed by npm uninstall

## Decisions Made

- **ThemeToggle.tsx omitted from MIGRATED_UI_FILES**: passive wrapper that delegates all rendering to ThemeToggle.client.tsx; has no SGDS markup of its own
- **sr-only, shadow-*, px-4, opacity-0, pointer-events-none excluded from legacy Tailwind checks**: these are valid substrings of SGDS `sgds:`-prefixed utilities (`sgds:sr-only`, `sgds:shadow-sm`, `sgds:px-4`) and would produce false positives
- **error.tsx uses exclamation-triangle-fill, not-found uses question-circle**: per UI-SPEC.md icon mapping, both verified as available SGDS icon names

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

- **jsdom does not expose `role="button"` for custom `<sgds-button>` elements**: tests use `container.querySelector('sgds-button')` instead of `screen.getByRole('button')`, matching existing SGDS test patterns in ThemeToggle, Navbar, and LanguageToggle tests
- **Legacy Tailwind pattern checks needed simplification**: `sr-only`, `shadow-*`, `px-4`, `opacity-0`, `pointer-events-none` are valid substrings of `sgds:`-prefixed utilities, requiring removal from LEGACY_UNPREFIXED_TAILWIND_PATTERNS to avoid false positives

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- The SGDS migration phase is complete. All user-visible portfolio surfaces use SGDS components or documented SGDS utility custom exceptions.
- Source gates will catch any future `dark:`, `next-themes`, `lucide-react`, or legacy Tailwind regression.
- The project is ready for Phase 6 security hardening (SEC-01, SEC-02) and Phase 7 code quality improvements.

## Verification Gate Results

| Gate | Result |
|------|--------|
| `npm run lint` | ✅ 0 errors |
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run test:coverage` | ✅ 583 tests, 29 files (89.78% stmts, 76.13% branch, 91.42% funcs, 92.45% lines) |
| `npm run build` | ✅ 8 static pages generated |

## Self-Check

### Created/Modified Files Verification

| File | Status |
|------|--------|
| `src/app/[locale]/error.tsx` | ✅ |
| `src/app/[locale]/error.test.tsx` | ✅ |
| `src/app/[locale]/not-found.tsx` | ✅ |
| `src/app/[locale]/not-found.test.tsx` | ✅ |
| `src/test/sgds-migration-source.test.ts` | ✅ (new) |
| `src/test/sgds-foundation.test.ts` | ✅ (updated) |
| `package.json` | ✅ (lucide-react removed) |

### Commit Verification

| Hash | Message | Verified |
|------|---------|----------|
| `4e52928` | feat(05-sgds-migration): migrate fallback pages and tests to SGDS | ✅ |
| `c564959` | feat(05-sgds-migration): add source audit, remove lucide-react, final foundation assertions | ✅ |

## Self-Check: PASSED

All files exist and all commits verified.

---

*Phase: 05-sgds-migration*
*Completed: 2026-06-08*

---
phase: 04-code-quality-type-safety-deferred-phase-7
plan: "04"
subsystem: api, ui
tags: [eslint, max-lines-per-function, refactor, next-intl, react-pdf]

# Dependency graph
requires:
  - phase: 04-code-quality-type-safety-deferred-phase-7
    provides: ESLint rules and lint inventory that identified the 40-line violations
provides:
  - route.ts GET handler refactored under 40-line function limit via resolveLocale/rateLimitGuard/renderCvResponse helpers
  - error.tsx Error boundary refactored under 40-line limit via ErrorActions sub-component
  - Projects.tsx Projects section refactored under 40-line limit via ProjectCard sub-component
  - About.tsx About section refactored under 40-line limit via AboutContactLinks sub-component
affects:
  - plan 06 (QUAL-02 lint gate activation — these four files now contribute zero violations)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "In-file extraction pattern: cohesive JSX blocks extracted to private named sub-components (Readonly<Props>) in same file"
    - "In-file extraction pattern: cohesive async logic extracted to module-scope helper functions returning NextResponse"

key-files:
  created: []
  modified:
    - src/app/api/generate-cv/route.ts
    - src/app/[locale]/error.tsx
    - src/components/sections/Projects.tsx
    - src/components/sections/About.tsx

key-decisions:
  - "Extract resolveLocale, rateLimitGuard, renderCvResponse as module-scope helpers in route.ts to keep GET orchestrator thin (19 lines)"
  - "ErrorActions sub-component accepts pre-resolved label strings (not t function) to keep interface explicit"
  - "ProjectCard sub-component accepts presentLabel string and locale to keep translatePeriod call inside the card"
  - "AboutContactLinks sub-component accepts three pre-resolved aria-label strings"

patterns-established:
  - "Private sub-component extraction: always Readonly<Props> for sub-component props"
  - "Helper extraction from async route handler: return NextResponse | null for guard helpers"

requirements-completed: [QUAL-02]

# Metrics
duration: 3min
completed: 2026-06-20
---

# Phase 04 Plan 04: Function-length Refactor (route.ts, error.tsx, Projects.tsx, About.tsx) Summary

**Four source files refactored via in-file private sub-component and helper extraction, reducing all function bodies to <= 40 lines with zero behaviour, markup, or response-shape changes**

## Performance

- **Duration:** 3 min
- **Started:** 2026-06-19T18:20:25Z
- **Completed:** 2026-06-20T00:23:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- GET in route.ts reduced from 59 lines to 19 lines by extracting resolveLocale, rateLimitGuard, and renderCvResponse helpers
- Error in error.tsx reduced from 43 lines to ~30 lines by extracting ErrorActions sub-component
- Projects in Projects.tsx reduced from 49 lines to ~15 lines by extracting ProjectCard sub-component
- About in About.tsx reduced from 45 lines to ~18 lines by extracting AboutContactLinks sub-component
- All 598 tests pass, type-check clean, lint clean after refactors

## Task Commits

Each task was committed atomically:

1. **Task 1: Split GET in route.ts and Error in error.tsx** - `a40e7bf` (refactor)
2. **Task 2: Split Projects in Projects.tsx and About in About.tsx** - `7979f5a` (refactor)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `src/app/api/generate-cv/route.ts` - GET reduced to 19 lines; resolveLocale/rateLimitGuard/renderCvResponse added as module-scope helpers
- `src/app/[locale]/error.tsx` - Error reduced to ~30 lines; ErrorActions sub-component extracted with pre-resolved label strings
- `src/components/sections/Projects.tsx` - Projects reduced to ~15 lines; ProjectCard sub-component extracted with ProjectItem prop type
- `src/components/sections/About.tsx` - About reduced to ~18 lines; AboutContactLinks sub-component extracted

## Decisions Made

- Pre-resolved label strings passed to sub-components (not the `t` function itself) to keep sub-component interfaces explicit and testable
- `Readonly<Props>` pattern applied to all new sub-component interfaces, consistent with existing codebase pattern (see Navbar sub-components)
- `rateLimitGuard` returns `NextResponse | null` (null = allowed) matching the early-return guard idiom

## Deviations from Plan

None - plan executed exactly as written. The only minor adjustment was using the correct type name `ProjectItem` (from `src/data/projects.ts`) rather than the plan's suggested generic `Project`.

## Issues Encountered

None - type-check, lint, and all 598 tests passed on first attempt after both refactors.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- These four files now contribute zero violations to the `max-lines-per-function` (40) lint gate that Plan 06 activates
- Four remaining files with violations (from the original 8-file inventory) will be covered by Plan 05
- SEC-03 accepted-risk comment block and ipAddress(req) ?? '127.0.0.1' fallback preserved intact in route.ts

## Self-Check: PASSED

- `src/app/api/generate-cv/route.ts` — exists, modified
- `src/app/[locale]/error.tsx` — exists, modified
- `src/components/sections/Projects.tsx` — exists, modified
- `src/components/sections/About.tsx` — exists, modified
- Commit `a40e7bf` — confirmed in git log
- Commit `7979f5a` — confirmed in git log

---
*Phase: 04-code-quality-type-safety-deferred-phase-7*
*Completed: 2026-06-20*

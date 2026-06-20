---
phase: 04-code-quality-type-safety-deferred-phase-7
plan: 03
subsystem: data
tags: [typescript, refactor, constants, projects, tech-stacks]

# Dependency graph
requires:
  - phase: 04-code-quality-type-safety-deferred-phase-7
    provides: ESLint max-lines enforcement and QUAL-01/02 foundations
provides:
  - TECH_SITEFINITY_DOTNET and TECH_VBNET_WEBFORMS constants in src/data/projects.ts
  - Deduplicated tech arrays — single source of truth for shared stacks
affects: [04-code-quality-type-safety-deferred-phase-7]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "TECH_* constants at module scope in data files for shared string arrays"

key-files:
  created: []
  modified:
    - src/data/projects.ts

key-decisions:
  - "Extract only verbatim-duplicate arrays (D-05); near-duplicates stay inline (D-05a)"
  - "Constants typed as string[] (not as const) so no spread needed at reference sites"
  - "Constants live in projects.ts top-level — file stays at 182 lines, well under 300 (D-05b)"

patterns-established:
  - "TECH_* prefix for tech-stack constants in data modules"

requirements-completed: [QUAL-03]

# Metrics
duration: 5min
completed: 2026-06-20
---

# Phase 04 Plan 03: Tech Stack Deduplication Summary

**Two shared tech arrays (`TECH_SITEFINITY_DOTNET` and `TECH_VBNET_WEBFORMS`) extracted as module-scope string[] constants, eliminating 8 duplicated inline `tech: [...]` blocks in `src/data/projects.ts`**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-06-19T18:12:00Z
- **Completed:** 2026-06-19T18:17:29Z
- **Tasks:** 1 of 1
- **Files modified:** 1

## Accomplishments

- Declared `TECH_SITEFINITY_DOTNET` constant (7 tech strings) — referenced by 4 Sitefinity project entries
- Declared `TECH_VBNET_WEBFORMS` constant (9 tech strings) — referenced by 4 VB.NET/Web Forms project entries
- File reduced from 232 lines to 182 lines (50-line reduction, 22% smaller)
- Heritagesg Sitecore array and all C#/ASP.NET MVC arrays left inline per D-05a (near-duplicates)

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract verbatim-duplicate tech arrays into TECH_* constants (QUAL-03)** - `bb3e2ef` (refactor)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/data/projects.ts` - Added 2 TECH_* constants at module scope; replaced 8 inline tech arrays with constant references

## Decisions Made

- Typed constants as `string[]` directly (not `as const`) so project entries can reference them without spread — `tech: TECH_SITEFINITY_DOTNET` assigns cleanly to `string[]`
- Constants placed after the `ProjectItem` interface, before the `projects` array — readable, co-located, no separate file needed

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- QUAL-03 complete; `src/data/projects.ts` is under 300 lines and lint-ready for Plan 04 (QUAL-02 ESLint enforcement)
- No blockers for subsequent plans

---
*Phase: 04-code-quality-type-safety-deferred-phase-7*
*Completed: 2026-06-20*

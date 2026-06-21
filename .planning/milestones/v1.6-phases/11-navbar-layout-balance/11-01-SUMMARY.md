---
phase: 11-navbar-layout-balance
plan: 01
subsystem: ui
tags: [navbar, layout, flexbox, tailwind, sgds, overflow-x, centering]

# Dependency graph
requires:
  - phase: 10-hero-overflow-fix
    provides: NAV-05 overflow-x-auto fallback on InlineNav wrapper (established in 09-02)
provides:
  - InlineNav wrapper with flex-grow (sgds:flex-1) and link centering (sgds:justify-center)
  - Regression test asserting grow + overflow-x-auto coexist (NAV-05 preserved)
affects: [navbar, responsive-layout, desktop-nav]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "slotted-flex-grow: apply flex-1 + justify-center on a slotted wrapper to fill the
      middle space in a shadow-DOM flex row without touching shadow-DOM internals"

key-files:
  created: []
  modified:
    - src/components/layout/Navbar.tsx
    - src/components/layout/Navbar.test.tsx

key-decisions:
  - "Primary approach (flex-1 + justify-center on the InlineNav wrapper) used — the wrapper
    itself controls its own flex properties even when slotted into sgds-mainnav. No inner
    mx-auto group needed; no globals.css fallback needed."
  - "Chose flex-1 (not grow alone) to match the sgds: Tailwind variant namespace and
    because flex-1 also sets flex-shrink:1 and flex-basis:0, giving cleaner middle-fill
    behavior than grow (flex-grow:1 only)."

patterns-established:
  - "SGDS slot centering: add flex-1 + justify-center to the slotted child wrapper — the
    child's own flex props apply even inside a shadow-DOM slot; no shadow piercing needed."

requirements-completed: [NAVBAL-01, NAVBAL-02, NAVBAL-03, NAVBAL-04]

# Metrics
duration: 6min
completed: 2026-06-21
---

# Phase 11 Plan 01: Navbar Layout Balance Summary

**InlineNav wrapper gains sgds:flex-1 + sgds:justify-center to center 7 desktop links between the JK brand and theme/language controls, with a regression test locking in the grow + overflow-x-auto contract**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-06-21T16:53:00Z
- **Completed:** 2026-06-21T16:59:57Z
- **Tasks:** 2 of 3 (Task 3 is the blocking human-verify checkpoint)
- **Files modified:** 2

## Accomplishments

- InlineNav wrapper (data-testid="inline-nav-wrapper") gains `sgds:flex-1` and `sgds:justify-center` alongside existing `sgds:flex-nowrap` and `sgds:overflow-x-auto`
- 7 desktop links now centered between the JK brand and the slot-end controls (NAVBAL-01, NAVBAL-02)
- NAV-05 horizontal-scroll fallback preserved — `overflow-x-auto` and `flex-nowrap` retained (NAVBAL-03)
- New regression test asserts wrapper contains `flex-1`, `justify-center`, AND `overflow-x-auto` (grow coexists with scroll fallback)
- Full CI gate passes: lint (0 issues), typecheck (0 errors), test (628 passed), build (clean)

## Centering Approach

**Winner: Primary approach — `flex-1 + justify-center` on the InlineNav wrapper**

No inner `mx-auto` group was needed and no `globals.css` fallback was needed. The slotted wrapper controls its own flex properties even when placed inside `sgds-mainnav`'s default slot.

**Final className on the InlineNav wrapper:**
```
sgds:hidden sgds:md:flex sgds:flex-1 sgds:justify-center sgds:flex-nowrap sgds:overflow-x-auto
```

## Task Commits

Each task was committed atomically:

1. **Task 1: Make the InlineNav wrapper fill the middle space and center its links** — `1e74624` (feat)
2. **Task 2: Add regression-guarding test for grow + scroll-fallback; run full CI gates** — `96cfe45` (test)
3. **Task 3: Human verification (checkpoint)** — awaiting human verification

## Files Created/Modified

- `src/components/layout/Navbar.tsx` — InlineNav wrapper className updated with flex-1 + justify-center
- `src/components/layout/Navbar.test.tsx` — New test: "inline-nav wrapper grows into middle space and centers links while preserving overflow-x scroll fallback"

## Decisions Made

- **Primary approach wins:** Used `flex-1 + justify-center` directly on the InlineNav wrapper. The SGDS slot does not override the slotted child's own flex properties, so `flex-1` successfully grows the wrapper into the dead gap. No inner `mx-auto` group and no globals.css selector needed.
- **flex-1 over grow:** `flex-1` sets `flex-grow:1`, `flex-shrink:1`, `flex-basis:0` — cleaner middle-fill vs `grow` (`flex-grow:1` only). Both would work, but `flex-1` is canonical for "fill available space" in Tailwind.
- **No globals.css change:** The last-resort `[data-testid="inline-nav-wrapper"] { flex: 1 1 auto; }` in `@layer base` was not needed; the Tailwind utility reached the slotted element correctly.

## Deviations from Plan

None — plan executed exactly as written. The primary approach (Task 1) worked on the first attempt. No inner mx-auto group required, no globals.css fallback required.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Automated CI checks (lint, typecheck, test, build) all pass
- Task 3 (human-verify checkpoint) is the only remaining step — visual browser verification at 1280px width
- After checkpoint approval, the phase is complete and the v1.6 milestone can be closed

---
*Phase: 11-navbar-layout-balance*
*Completed: 2026-06-21 (pending checkpoint)*

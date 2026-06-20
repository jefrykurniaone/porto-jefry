---
phase: 04-code-quality-type-safety-deferred-phase-7
plan: 05
subsystem: ui
tags: [react, typescript, hooks, refactor, accessibility, next-intl]

# Dependency graph
requires:
  - phase: 04-code-quality-type-safety-deferred-phase-7
    provides: Plan 04 completed function-length fixes for generate-cv route, Projects, and About
provides:
  - Navbar refactored under 40-line function limit via useFocusTrap and useScrolled hooks
  - HeroCtaButtons and Hero refactored under 40-line limit via useCvDownload hook and sub-components
  - Contact refactored under 40-line limit via buildContactLinks helper function
  - src/hooks/use-focus-trap.ts - reusable mobile-menu focus-trap hook
  - src/hooks/use-scrolled.ts - reusable passive-scroll-state hook
  - src/hooks/use-cv-download.ts - reusable CV download state + fetch logic hook
affects: [04-06-PLAN, code-quality-gate]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Custom hooks with kebab-case filenames (use-*.ts) for extracting effect/state logic from components"
    - "Private named sub-components (function X({ ... }: Readonly<XProps>)) for splitting JSX under 40-line limit"
    - "Module-level helper functions (buildContactLinks) for splitting data construction out of render functions"

key-files:
  created:
    - src/hooks/use-focus-trap.ts
    - src/hooks/use-scrolled.ts
    - src/hooks/use-cv-download.ts
  modified:
    - src/components/layout/Navbar.tsx
    - src/components/sections/Hero.tsx
    - src/components/sections/Contact.tsx
    - src/components/sections/Hero.test.tsx

key-decisions:
  - "Extract both focus-trap and scroll effects from Navbar into hooks (not just focus-trap) to bring Navbar under 40 lines"
  - "Extract HamburgerButton as private sub-component in Navbar.tsx to fit return JSX under 40 lines"
  - "HeroCtaLinks private sub-component extracts the three CTA link+button group so HeroCtaButtons body stays under 40 lines"
  - "HeroPhotoHeading private sub-component extracts photo+heading block so Hero body stays under 40 lines"
  - "buildContactLinks(t) module function (not a hook) suffices for Contact — no state or effects needed"
  - "Hero.test.tsx cv-filename source-check updated to point to use-cv-download.ts after refactor"

patterns-established:
  - "useScrolled(threshold): passive rAF-debounced scroll hook returning boolean — reuse for any scroll-based UI"
  - "useFocusTrap(isOpen, menuRef, toggleRef, onClose): focus-trap hook accepting refs — reuse for any modal/drawer"
  - "useCvDownload(locale, t): encapsulates fetch/blob/anchor/revoke + error state — reuse if CV download appears elsewhere"

requirements-completed: [QUAL-02]

# Metrics
duration: 7min
completed: 2026-06-20
---

# Phase 04 Plan 05: Function-Length Refactor — Navbar, Hero, Contact Summary

**Extracted useFocusTrap, useScrolled, and useCvDownload hooks plus private sub-components to bring Navbar (105 lines), HeroCtaButtons (81 lines), Hero (43 lines), and Contact (54 lines) each under the 40-line function limit with zero behaviour changes.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-06-20T13:26:52Z
- **Completed:** 2026-06-20T13:33:33Z
- **Tasks:** 3
- **Files modified:** 7 (3 created, 4 modified)

## Accomplishments

- Created `use-focus-trap.ts` and `use-scrolled.ts` hooks; Navbar function body reduced from 105 to ~35 lines
- Created `use-cv-download.ts` hook; HeroCtaButtons reduced from 81 to ~25 lines; Hero reduced from 43 to ~15 lines via HeroPhotoHeading sub-component
- Contact function body reduced from 54 to 24 lines by extracting `buildContactLinks(t)` helper
- All 598 tests pass; `npx tsc --noEmit` exits 0

## Task Commits

1. **Task 1: Extract Navbar effects into hooks and split Navbar** - `0cf3813` (refactor)
2. **Task 2: Extract CV download hook, split HeroCtaButtons + Hero** - `5a14181` (refactor)
3. **Task 3: Split Contact under 40 lines** - `eeb107b` (refactor)

## Files Created/Modified

- `src/hooks/use-focus-trap.ts` - useFocusTrap(isOpen, menuRef, toggleRef, onClose) — mobile menu focus trap
- `src/hooks/use-scrolled.ts` - useScrolled(threshold) — passive rAF-debounced scroll state
- `src/hooks/use-cv-download.ts` - useCvDownload(locale, t) — CV fetch/blob/anchor/revoke + error state
- `src/components/layout/Navbar.tsx` - HamburgerButton sub-component added; uses useFocusTrap + useScrolled
- `src/components/sections/Hero.tsx` - HeroCtaLinks + HeroPhotoHeading sub-components added; uses useCvDownload
- `src/components/sections/Contact.tsx` - buildContactLinks(t) module function extracted
- `src/components/sections/Hero.test.tsx` - cv-filename source-check updated to read use-cv-download.ts

## Decisions Made

- Extracted scroll effect into `useScrolled` hook (not kept inline) because Navbar still exceeded 40 lines after focus-trap extraction alone
- Used `buildContactLinks` as a plain function (not a hook) since it has no state or effects
- `HeroPhotoHeading` sub-component added to bring Hero under 40 lines (photo+heading block was ~20 lines of JSX)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Hero.test.tsx cv-filename source check pointed to wrong file after refactor**
- **Found during:** Task 2 (Extract CV download hook, split HeroCtaButtons + Hero)
- **Issue:** Test `source uses Jefry_Kurniawan_CV.pdf download filename` read `Hero.tsx` for the filename, but after extracting the download logic to `use-cv-download.ts`, the filename lives in the hook, not the component
- **Fix:** Updated test to read `src/hooks/use-cv-download.ts` instead
- **Files modified:** `src/components/sections/Hero.test.tsx`
- **Verification:** All 15 Hero tests pass (was 14 passing, 1 failing before fix)
- **Committed in:** `5a14181` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug in test after refactor)
**Impact on plan:** Necessary to keep the test suite green; no scope creep.

## Issues Encountered

None — refactoring was purely structural with no logic changes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All four target functions (Navbar, HeroCtaButtons, Hero, Contact) are at or under 40 lines
- src/hooks/ now has 4 custom hooks (useSgdsTheme, use-focus-trap, use-scrolled, use-cv-download)
- Plan 06 can safely activate the error-level lint gate — these files contribute zero violations
- No blockers

---
*Phase: 04-code-quality-type-safety-deferred-phase-7*
*Completed: 2026-06-20*

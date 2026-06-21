---
phase: 09-responsive-navbar
plan: "02"
subsystem: navigation
tags: [mobile, responsive, drawer, a11y, overflow]
dependency_graph:
  requires:
    - src/hooks/use-scroll-lock.ts (useScrollLock — Plan 01)
    - src/components/layout/MobileDrawer.tsx (Plan 01)
    - src/components/layout/Navbar.tsx (NAV_KEYS exported — Plan 01)
  provides:
    - src/components/layout/Navbar.tsx (responsive: brand+hamburger below md, scrollable inline nav at md+, MobileDrawer wired)
  affects:
    - src/components/layout/Navbar.test.tsx (updated for drawer integration)
tech_stack:
  added: []
  patterns:
    - MobileDrawer integration pattern (isOpen/onClose/onNavClick/toggleRef props)
    - InlineNav sub-component wrapping DesktopNavLinks in overflow-x-auto container
    - Single focus-trap owner (MobileDrawer) — Navbar removed duplicate useFocusTrap
    - sgds:hidden sgds:md:flex gate for ThemeToggle/LanguageToggle in phone bar
key_files:
  created: []
  modified:
    - src/components/layout/Navbar.tsx (MobileDrawer integration, expand="always" removed, overflow-x-auto added)
    - src/components/layout/Navbar.test.tsx (updated for drawer integration, overflow-x-auto, Esc focus-return)
decisions:
  - Removed expand="always" from sgds-mainnav so SGDS web component no longer forces desktop layout at every width
  - MobileDrawer owns the focus trap (useFocusTrap) and scroll lock — Navbar removed its duplicate useFocusTrap call and menuRef
  - hasMountedRef + focus-restore useEffect removed from Navbar — MobileDrawer's useFocusTrap already calls toggleRef.current?.focus() on Escape and close
  - ThemeToggle/LanguageToggle gated with sgds:hidden sgds:md:flex so they never show in the phone bar (they live in the drawer instead)
  - InlineNav sub-component extracted to wrap DesktopNavLinks in overflow-x-auto container, keeping Navbar under 40 lines per function
  - nav.nav_scroll i18n key omitted — the scroll container relies on native overflow-x: auto (keyboard reachable, drag/scroll-wheel/swipe reachable) without a separate accessible label; documented here per plan instructions
  - Tests use within(dialog) to disambiguate drawer links from inline nav links (both render the same text labels)
metrics:
  duration: 18m
  completed: "2026-06-21"
  tasks_completed: 2
  files_created: 0
  files_modified: 2
requirements: [NAV-01, NAV-03, NAV-05, A11Y-04]
---

# Phase 09 Plan 02: Responsive Navbar — MobileDrawer Integration Summary

**One-liner:** Navbar integration wave — removed `expand="always"` root cause, wired MobileDrawer from Plan 01, collapsed phone bar to brand+hamburger, and added `overflow-x-auto` horizontal-scroll fallback for the md+ inline nav.

## What Was Built

### Task 1: Navbar.tsx integration

Updated `src/components/layout/Navbar.tsx` (109 lines, all functions ≤40 lines):

- **Removed `expand="always"`** from `<sgds-mainnav>` — root cause of the overflow bug fixed.
- **Removed `MobileNavLinks`** component (7-link dropdown below bar) — replaced by `<MobileDrawer>`.
- **Removed `useFocusTrap`** and `menuRef` from Navbar — MobileDrawer owns the focus trap; having two traps was causing competing keyboard-focus behavior.
- **Removed `hasMountedRef` + focus-restore `useEffect`** — MobileDrawer's `useFocusTrap` already calls `toggleRef.current?.focus()` on Escape and close button.
- **Added `<MobileDrawer isOpen={isOpen} onClose={closeMenu} onNavClick={scrollTo} toggleRef={toggleRef} />`** — wired the Plan 01 drawer with the existing `scrollTo` callback (scrollIntoView + pushState + setIsOpen(false)).
- **Added `InlineNav` sub-component** wrapping `DesktopNavLinks` in `<div data-testid="inline-nav-wrapper" className="sgds:hidden sgds:md:flex sgds:flex-nowrap sgds:overflow-x-auto">` — provides horizontal-scroll fallback when 7 items exceed available width at tablet or zoom.
- **Gated ThemeToggle/LanguageToggle** with `sgds:hidden sgds:md:flex` — phone bar shows only brand + hamburger; md+ bar shows toggles inline.
- **`scrollTo` callback** unchanged in behavior: calls `scrollIntoView({behavior:'smooth'})`, `history.pushState(null, '', '#<id>')`, and `setIsOpen(false)`.
- **Imports** trimmed: removed `useRef`+`useEffect` (no longer needed for focus trap), removed `useFocusTrap` import.

### Task 2: Navbar.test.tsx updates

Updated `src/components/layout/Navbar.test.tsx` (14 tests, all passing):

New/updated assertions:
- `sgds-mainnav does not have expand="always" attribute` — regression guard on root-cause fix.
- `inline-nav wrapper has overflow-x-auto class` — asserts NAV-05 overflow affordance (queries `[data-testid="inline-nav-wrapper"]`).
- `renders inline nav links with translated text` — uses `within(inlineWrapper)` to target the md+ nav specifically.
- `hamburger click opens drawer with all 7 section labels and close button` — uses `within(dialog)` to disambiguate from inline nav links.
- `close button inside drawer closes the drawer` — asserts dialog unmounts.
- `clicking a drawer link calls scrollIntoView, pushState, and closes drawer` — full integration: scrollSpy + pushSpy + dialog gone.
- `pressing Escape closes the drawer and returns focus to the hamburger` — A11Y focus-return assertion at integration level.
- `hamburger button exists with aria-label` — asserts `md:hidden` gate on the button.
- `drawer is absent from DOM when closed` — asserts no `role="dialog"` before open.

Existing tests retained: scroll-class behavior, brand JK, sgds-mainnav renders, desktop nav items, dark: utilities check.

## Test Results

- `src/components/layout/Navbar.test.tsx`: 14/14 PASS
- `src/components/layout/MobileDrawer.test.tsx`: 12/12 PASS (unchanged, still green)
- All 34 test files / 623 tests: PASS
- `npx tsc --noEmit`: 0 errors
- `npm run lint`: no issues
- `npm run build`: success

## Acceptance Criteria Verification

| Criterion | Status |
|-----------|--------|
| Navbar.tsx has no expand="always" on sgds-mainnav | PASS |
| Navbar.tsx imports and renders MobileDrawer with onNavClick=scrollTo | PASS |
| InlineNav wrapper className includes sgds:overflow-x-auto | PASS |
| Hamburger gated sgds:md:hidden, labelled via t('toggle_menu'), 44px target | PASS |
| ThemeToggle/LanguageToggle not unconditionally in phone bar (gated sgds:md:flex) | PASS |
| Single focus-trap owner — no duplicate useFocusTrap across Navbar + MobileDrawer | PASS |
| Navbar.tsx ≤300 lines (109 lines); no function exceeds 40 lines | PASS |
| npx tsc --noEmit exits 0 | PASS |
| Test: hamburger opens drawer with all 7 labels + close button | PASS |
| Test: drawer link click scrollIntoView + pushState + closes | PASS |
| Test: inline-nav wrapper has overflow-x-auto class | PASS |
| Test: Esc closes drawer and focus returns to hamburger | PASS |
| vitest run Navbar.test.tsx + MobileDrawer.test.tsx exits 0 | PASS |
| npm run build exits 0 (lint + typecheck + build) | PASS |

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Intentional Omissions

**nav.nav_scroll i18n key omitted (as permitted by plan):**
- The plan permitted omitting `nav.nav_scroll` if relying on native keyboard/scroll reachability without an explicit aria label.
- The `InlineNav` wrapper uses `overflow-x: auto` which is natively keyboard-reachable (arrow keys, Tab) and pointer-reachable (scroll wheel, drag, swipe on touch).
- No `role="region"` or `aria-label` was added to the container, so the key is not needed.
- Documented here per plan instruction.

## Threat Model Coverage

| Threat ID | Disposition | Status |
|-----------|-------------|--------|
| T-09-04 (Tampering: scrollTo hash) | accept | Hash derived from hardcoded NAV_KEYS allowlist; no user input reaches pushState |
| T-09-05 (DoS: scroll lock) | mitigate | useScrollLock in MobileDrawer (Plan 01) restores overflow; onClose reachable via Esc, close button, and backdrop |
| T-09-06 (EoP: focus trap) | mitigate | Single owner: MobileDrawer's useFocusTrap; Navbar's duplicate useFocusTrap removed in this plan |
| T-09-SC (npm installs) | N/A | No new dependencies added |

## Known Stubs

None. All data wired: NAV_KEYS from hardcoded allowlist, labels from next-intl, MobileDrawer from Plan 01, scrollTo writes real pushState and scrollIntoView.

## Threat Flags

None — no new network endpoints, auth paths, or trust-boundary changes in this plan.

## Self-Check: PASSED

| Check | Result |
|-------|--------|
| src/components/layout/Navbar.tsx (modified) | FOUND |
| src/components/layout/Navbar.test.tsx (modified) | FOUND |
| a66425c (Task 1: feat Navbar integration) | FOUND |
| 8d73dbd (Task 2: test Navbar tests) | FOUND |
| npm run build exits 0 | PASS |
| 623 tests all pass | PASS |

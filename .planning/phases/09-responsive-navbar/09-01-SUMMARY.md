---
phase: 09-responsive-navbar
plan: "01"
subsystem: navigation
tags: [mobile, a11y, i18n, hooks, drawer]
dependency_graph:
  requires: []
  provides:
    - src/hooks/use-scroll-lock.ts (useScrollLock hook)
    - src/components/layout/MobileDrawer.tsx (accessible drawer component)
  affects:
    - src/components/layout/Navbar.tsx (NAV_KEYS now exported)
tech_stack:
  added: []
  patterns:
    - TDD (RED/GREEN) for all new files
    - useFocusTrap + useScrollLock composition in drawer
    - Conditional render (return null when closed) for DOM-based focus trap
key_files:
  created:
    - src/hooks/use-scroll-lock.ts
    - src/hooks/use-scroll-lock.test.ts
    - src/components/layout/MobileDrawer.tsx
    - src/components/layout/MobileDrawer.test.tsx
  modified:
    - src/i18n/messages/en.json (added nav.close_menu)
    - src/i18n/messages/id.json (added nav.close_menu)
    - src/components/layout/Navbar.tsx (exported NAV_KEYS)
decisions:
  - Custom React drawer used (not sgds-drawer) — jsdom stubs sgds-* elements, making a11y assertions impossible under Vitest; React-owned panel reuses proven use-focus-trap hook
  - NAV_KEYS exported from Navbar.tsx to avoid duplication drift in MobileDrawer
  - Drawer returns null when closed (matches existing MobileNavLinks pattern; required for useFocusTrap DOM queries)
  - useScrollLock captures prior overflow before locking, restores on unlock or unmount (T-09-03 mitigation)
  - data-testid="drawer-backdrop" on overlay for reliable test selection without coupling to CSS class names
metrics:
  duration: 4m 29s
  completed: "2026-06-21"
  tasks_completed: 2
  files_created: 4
  files_modified: 3
requirements: [NAV-02, NAV-04, A11Y-01, A11Y-02, A11Y-03, A11Y-04]
---

# Phase 09 Plan 01: Responsive Navbar - MobileDrawer Foundation Summary

**One-liner:** Right-side accessible React drawer with 7 nav links, ThemeToggle, LanguageToggle, focus trap, and scroll lock — built TDD.

## What Was Built

### Task 1: i18n keys + useScrollLock hook (TDD)

Added `nav.close_menu` to both locale files (EN: "Close menu"; ID: "Tutup menu"). The `nav` objects in `en.json` and `id.json` remain key-for-key identical.

Created `src/hooks/use-scroll-lock.ts` — a `'use client'` hook that captures `document.body.style.overflow` before locking, sets it to `'hidden'` while `isLocked` is true, and restores the captured value on unlock or unmount. SSR-guarded (`typeof document === 'undefined'` check). Under 40 lines. Tested with 4 unit tests (lock, no-op when false, restore on rerender, restore on unmount).

### Task 2: MobileDrawer component (TDD)

Created `src/components/layout/MobileDrawer.tsx` with:
- Props: `isOpen`, `onClose`, `onNavClick`, `toggleRef`
- Full-screen fixed backdrop (`data-testid="drawer-backdrop"`) that calls `onClose` on click
- Right-side panel (`role="dialog"`, `aria-modal="true"`) that stops click propagation
- `DrawerLinks` sub-component rendering 7 `NAV_KEYS` anchors (`href="#<key>"`) with `onNavClick` callback and `e.preventDefault()`
- Close button with `aria-label={t('close_menu')}` and `style={{ minWidth: '44px', minHeight: '44px' }}`
- `ThemeToggle` and `LanguageToggle` in the drawer footer
- `useFocusTrap(isOpen, panelRef, toggleRef, onClose)` for focus management and Esc handling
- `useScrollLock(isOpen)` for background scroll lock
- Returns `null` when `isOpen` is false (panel absent from DOM)

Exported `NAV_KEYS` from `Navbar.tsx` (added `export` keyword) so `MobileDrawer` imports it — avoids duplication drift.

Created `src/components/layout/MobileDrawer.test.tsx` with 12 tests covering all acceptance criteria.

## Test Results

- `src/hooks/use-scroll-lock.test.ts`: 4/4 PASS
- `src/components/layout/MobileDrawer.test.tsx`: 12/12 PASS
- `npx tsc --noEmit`: 0 errors

## TDD Gate Compliance

Both tasks followed RED/GREEN:
- `cc38991` — `test(09-01): add failing test for useScrollLock hook` (RED)
- `17eaf93` — `feat(09-01): add nav.close_menu i18n keys and useScrollLock hook` (GREEN)
- `7eb7582` — `test(09-01): add failing tests for MobileDrawer component` (RED)
- `2b3b877` — `feat(09-01): add MobileDrawer component with focus trap, scroll lock, backdrop` (GREEN)

## Acceptance Criteria Verification

| Criterion | Status |
|-----------|--------|
| en.json nav.close_menu = "Close menu" | PASS |
| id.json nav.close_menu = "Tutup menu" | PASS |
| nav key parity between en.json and id.json | PASS |
| useScrollLock exists and exports correctly | PASS |
| useScrollLock restores prior overflow on release/unmount | PASS |
| All 7 EN labels render when open | PASS |
| ThemeToggle + LanguageToggle present in drawer | PASS |
| Close button aria-label="Close menu" calls onClose | PASS |
| Backdrop click calls onClose | PASS |
| Panel click does NOT call onClose | PASS |
| Projects link calls onNavClick('projects'), href="#projects" | PASS |
| Escape calls onClose | PASS |
| isOpen=false: panel absent from DOM | PASS |
| Close button 44px touch target | PASS |
| npx tsc --noEmit exits 0 | PASS |
| Navbar.tsx untouched (except NAV_KEYS export) | PASS |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Export] Export NAV_KEYS from Navbar.tsx**
- **Found during:** Task 2 implementation
- **Issue:** Plan requires importing `NAV_KEYS` from Navbar.tsx but it was not exported
- **Fix:** Added `export` keyword to the `NAV_KEYS` const in Navbar.tsx
- **Files modified:** `src/components/layout/Navbar.tsx`
- **Commit:** `2b3b877`
- **Impact:** Zero functional change; just adds the export for MobileDrawer to consume

None other — plan executed as written.

## Threat Model Coverage

| Threat ID | Status |
|-----------|--------|
| T-09-01 (Tampering: link targets) | Accepted — NAV_KEYS is a hardcoded allowlist, no user input in hrefs |
| T-09-02 (Info Disclosure: i18n labels) | Accepted — static translation strings, no PII |
| T-09-03 (DoS: scroll lock) | Mitigated — useScrollLock captures+restores prior overflow; tested |
| T-09-SC (Tampering: npm installs) | N/A — no new dependencies added |

## Known Stubs

None. All data is wired: NAV_KEYS comes from a hardcoded allowlist, labels from next-intl, and the component is ready for wiring in Plan 02.

## Self-Check: PASSED

All created files verified on disk. All 4 task commits verified in git log.

| Check | Result |
|-------|--------|
| src/hooks/use-scroll-lock.ts | FOUND |
| src/hooks/use-scroll-lock.test.ts | FOUND |
| src/components/layout/MobileDrawer.tsx | FOUND |
| src/components/layout/MobileDrawer.test.tsx | FOUND |
| .planning/phases/09-responsive-navbar/09-01-SUMMARY.md | FOUND |
| cc38991 (RED: useScrollLock) | FOUND |
| 17eaf93 (GREEN: useScrollLock + i18n) | FOUND |
| 7eb7582 (RED: MobileDrawer) | FOUND |
| 2b3b877 (GREEN: MobileDrawer) | FOUND |

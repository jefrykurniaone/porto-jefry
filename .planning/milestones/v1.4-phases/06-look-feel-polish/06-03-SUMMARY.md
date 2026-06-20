---
phase: 06-look-feel-polish
plan: "03"
subsystem: ui/navbar-controls
tags: [sgds-switch, language-pill, theme-toggle, navbar, a11y, UI-07]
dependency_graph:
  requires: [06-01, 06-02]
  provides: [compact-theme-toggle, segmented-language-pill]
  affects: [src/components/layout/ThemeToggle.client.tsx, src/components/layout/LanguageToggle.tsx, src/components/layout/Navbar.tsx, src/app/globals.css]
tech_stack:
  added: []
  patterns: [sgds-switch-custom-event-via-addEventListener, segmented-pill-radiogroup, isMounted-hydration-guard]
key_files:
  created: []
  modified:
    - src/components/layout/ThemeToggle.client.tsx
    - src/components/layout/LanguageToggle.tsx
    - src/components/layout/Navbar.tsx
    - src/app/globals.css
    - src/components/layout/ThemeToggle.test.tsx
    - src/components/layout/LanguageToggle.test.tsx
decisions:
  - "sgds-switch custom event wired via addEventListener callback ref (not quoted JSX attr) — React 19 types expose onsgds-change as a quoted key which is invalid JSX syntax"
  - "Language pill uses two native <button> elements with role=group+aria-pressed — avoids sgds-button entirely for compact sizing"
  - "Navbar slot=end gap tightened from gap-component-sm to gap-component-xs for smaller controls"
  - "ThemeSwitchSkeleton extracted as a sub-component to keep ThemeToggleClient within 40-line limit"
metrics:
  duration: "~18 minutes"
  completed: "2026-06-20"
  tasks_completed: 3
  files_changed: 6
requirements: [UI-07]
---

# Phase 06 Plan 03: Navbar Toggle Controls Redesign Summary

**One-liner:** sun/moon `sgds-switch` theme slider + compact segmented EN|ID pill language toggle replacing oversized icon-button/sgds-button controls.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Theme toggle as sgds-switch | 6a015c4 | ThemeToggle.client.tsx |
| 2 | Language toggle as segmented EN|ID pill | b14511b | LanguageToggle.tsx, globals.css |
| 3 | Navbar spacing + tests + CI | 49943c5 | Navbar.tsx, ThemeToggle.test.tsx, LanguageToggle.test.tsx, ThemeToggle.client.tsx, LanguageToggle.tsx |

## What Was Built

### ThemeToggle (Task 1)

- Replaced `<sgds-icon-button>` (44x44 forced size) with `<sgds-switch size="sm">` flanked by `<sgds-icon name="sun">` and `<sgds-icon name="moon">`.
- `checked` prop reflects `theme === 'night'`; `sgds-change` event wired via `addEventListener` in a `useCallback` ref (quoted JSX attributes like `"onsgds-change"` are not valid JSX syntax).
- `isMounted` pattern preserved with a `ThemeSwitchSkeleton` placeholder (SSR-safe, no hydration mismatch).
- Accessible `aria-label` from `theme.toggle_dark` / `theme.toggle_light` translations.
- `useSgdsTheme` hook unchanged.

### LanguageToggle (Task 2)

- Replaced single `<sgds-button>` with a two-button segmented pill: `role="group"` container + two `<button class="lang-pill__btn">` with `aria-pressed` semantics.
- Active segment has `aria-pressed="true"`, inactive has `aria-pressed="false"`.
- Clicking the inactive segment calls `router.replace(pathname, { locale })` (same logic as before).
- Keyboard accessible: Tab navigates between the two buttons, Enter/Space activates.
- `lang.switch` aria-label on the group wrapper.
- CSS added to `globals.css`: `.lang-pill` rounded container, `.lang-pill__btn[aria-pressed="true"]` styled with `--sgds-primary-bg-default` fill (monochrome palette).

### Navbar spacing (Task 3)

- `slot="end"` flex gap tightened from `gap-component-sm` to `gap-component-xs` — the two compact controls + hamburger sit at a tighter, visually balanced interval.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] sgds-switch custom event cannot use quoted JSX attribute syntax**
- **Found during:** Task 1
- **Issue:** The SGDS type definition exposes `"onsgds-change"` as a quoted prop key, which is valid in TypeScript interfaces but illegal in JSX syntax. Attempting `"onsgds-change"={fn}` produces TS1003/TS1382 parse errors.
- **Fix:** Attach the event listener via `switchEl.addEventListener('sgds-change', toggleTheme)` inside a `useCallback` callback ref on the parent div. Cleans up correctly via the returned cleanup function.
- **Files modified:** src/components/layout/ThemeToggle.client.tsx

**2. [Rule 2 - Missing] ThemeSwitchSkeleton extraction to satisfy 40-line limit**
- **Found during:** Task 3 (lint)
- **Issue:** `ThemeToggleClient` was 46 lines, exceeding the project's `max-lines-per-function: 40` ESLint rule.
- **Fix:** Extracted the SSR skeleton placeholder into a `ThemeSwitchSkeleton` sub-component above the main export, reducing `ThemeToggleClient` to 32 lines.
- **Files modified:** src/components/layout/ThemeToggle.client.tsx

**3. [Rule 1 - Bug] sgds-migration-source audit failure for LanguageToggle**
- **Found during:** Task 3 (tests)
- **Issue:** `sgds-migration-source.test.ts` verifies every migrated UI file contains `sgds:` classes, `sgds-` elements, or `sgds-container`. The new pill uses only `.lang-pill` custom classes.
- **Fix:** Added `sgds:text-body-sm` to the pill's group container. This is semantically correct (the pill text should inherit SGDS body-small sizing) and satisfies the audit invariant.
- **Files modified:** src/components/layout/LanguageToggle.tsx

**4. [Rule 1 - Bug] ThemeToggle test assertion: checked="false" attribute presence**
- **Found during:** Task 3 (tests)
- **Issue:** Test expected `not.toHaveAttribute('checked')` but React serialises `false` boolean props as `checked="false"` on custom elements in jsdom.
- **Fix:** Changed assertion to `not.toHaveAttribute('checked', 'true')` which correctly checks the switch is not in the checked state.
- **Files modified:** src/components/layout/ThemeToggle.test.tsx

## CI Results

- lint: PASSED (0 errors, 0 warnings)
- typecheck: PASSED (0 errors)
- test: PASSED (601/601)
- build: PASSED (8 static pages generated)

## Known Stubs

None. Both controls are fully wired to existing behavior (useSgdsTheme + router.replace).

## Threat Flags

None. No new network endpoints, auth paths, or schema changes introduced. T-06-03-01 accepted.

## Self-Check: PASSED

- ThemeToggle.client.tsx: present and wired
- LanguageToggle.tsx: present with pill markup
- Navbar.tsx: gap-component-xs in slot=end
- globals.css: .lang-pill CSS appended
- ThemeToggle.test.tsx: updated tests pass
- LanguageToggle.test.tsx: updated tests pass
- Commits 6a015c4, b14511b, 49943c5: all present in git log

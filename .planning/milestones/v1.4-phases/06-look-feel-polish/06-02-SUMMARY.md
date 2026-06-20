---
phase: 06-look-feel-polish
plan: "02"
subsystem: hero-cta
tags: [ui, hero, cta, accessibility, css]
dependency_graph:
  requires: []
  provides: [equal-height-width-hero-cta, no-wrap-cta-labels, outline-secondary-cta]
  affects: [src/app/globals.css, src/components/sections/Hero.tsx]
tech_stack:
  added: []
  patterns: [css-custom-properties, sgds-button-variants]
key_files:
  created: []
  modified:
    - src/app/globals.css
    - src/components/sections/Hero.tsx
decisions:
  - "min-width: 11.5rem + width: auto chosen over fixed width to accommodate all three labels without restricting flex growth"
  - "white-space: nowrap applied to .hero-cta-link to guarantee single-line label rendering at all desktop widths"
  - "variant='outline' added to both loading and idle sgds-button states so hierarchy is consistent during download"
metrics:
  duration: "5m"
  completed: "2026-06-20T09:05:37Z"
  tasks_completed: 3
  files_modified: 2
---

# Phase 06 Plan 02: Hero CTA Rebalance Summary

**One-liner:** Unified hero CTA sizing with min-width + nowrap and 1-primary + 2-outline visual hierarchy via sgds-button variant="outline".

## Tasks Completed

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | Unify CTA sizing + prevent wrap in globals.css (UI-06) | 18afb2e | src/app/globals.css |
| 2 | Consistent variants in Hero.tsx + tests (UI-06) | 44e45d4 | src/components/sections/Hero.tsx |
| 3 | Full CI | — (no source change) | — |

## What Was Built

Resolved the two root causes behind the unbalanced hero CTA row:

1. **Sizing mismatch** — `.hero-cta-link` previously had a fixed `width: 9.25rem` with no `white-space: nowrap`, causing "View My Work" to wrap. `.hero-download-button sgds-button::part(button)` was `2.75rem` tall vs the anchors' `3rem`. Now both use `height: 3rem` and `min-width: 11.5rem` with `width: auto`, ensuring a common floor while allowing natural label fit.

2. **Visual hierarchy mismatch** — The CV download `<sgds-button>` previously rendered as a filled button (default variant), giving it the same visual weight as the primary "View My Work" anchor. Adding `variant="outline"` to both the loading and idle states makes the hierarchy read as 1 filled primary + 2 outline secondary actions.

The `<512px` full-width stacking rules in `globals.css` were left entirely untouched.

## Deviations from Plan

None — plan executed exactly as written.

## Verification

- TypeScript: no errors (`npx tsc --noEmit`)
- Hero tests: 15/15 passed (`npm run test -- src/components/sections/Hero.test.tsx`)
- Full CI: lint OK, typecheck OK, 598/598 tests passed (32 test files), build succeeded

## Known Stubs

None.

## Threat Flags

No new threat surface introduced — changes are purely presentational (CSS sizing + sgds-button attribute). Same handlers, same href targets, same event wiring.

## Self-Check: PASSED

- `src/app/globals.css` — modified and committed at 18afb2e
- `src/components/sections/Hero.tsx` — modified and committed at 44e45d4
- Commits 18afb2e and 44e45d4 confirmed in git log

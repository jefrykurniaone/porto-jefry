---
phase: 06-look-feel-polish
plan: "01"
subsystem: css-tokens
tags: [accessibility, wcag, contrast, css, sgds]
dependency_graph:
  requires: []
  provides: [wcag-aa-muted-text]
  affects: [Hero, Contact, Projects, Education, Certifications, not-found, error]
tech_stack:
  added: []
  patterns: [css-token-override]
key_files:
  created: []
  modified:
    - src/app/globals.css
decisions:
  - "Override --sgds-color-muted token at :root level rather than per-component (D-06-02)"
  - "Day value #5f5f5f (~7.95:1 on #ffffff); night value #b0b0b0 (~9.78:1 on #0e0e0e)"
  - ".readable-muted helper left byte-identical — it already passes AA via color-mix"
metrics:
  duration: "~10 minutes"
  completed: "2026-06-20"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 1
---

# Phase 6 Plan 01: Muted Text Contrast Fix (UI-05) Summary

Single-token CSS override raising `--sgds-color-muted` from ~1.6:1 to >=7.95:1 in both light and dark SGDS themes, fixing WCAG AA compliance at all `sgds:text-muted` sites with zero component changes.

## What Was Built

The SGDS token `--sgds-color-muted` defaulted to `#c6c6c6` (day) / `#3b3b3b` (night), both measuring approximately 1.6:1 contrast on their respective page backgrounds — far below WCAG AA (4.5:1). This caused hard-to-read muted gray text throughout the site, most visibly in the hero "Backend Developer & .NET Specialist" subtitle line flagged by the owner.

**Fix:** Added `--sgds-color-muted` overrides to the existing `:root` and `:root.sgds-night-theme` blocks in `src/app/globals.css`:
- Day: `#5f5f5f` — contrast ~7.95:1 against `#ffffff`, visibly lighter than body text `#1a1a1a`
- Night: `#b0b0b0` — contrast ~9.78:1 against `#0e0e0e`, visibly subordinate to body text `#f3f3f3`

Both values are in the "lighter gray" range (not black), preserving the visual hierarchy between body text and muted/secondary text, while meeting WCAG AA with significant margin.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Override --sgds-color-muted in both theme scopes | 1d5dedd | src/app/globals.css |
| 2 | Spot-verify all muted sites + run CI | (verification only) | — |

## CI Results (Task 2)

- `npm run lint` — 0 issues
- `npx tsc --noEmit` — 0 errors
- `npm run test` — 598 tests passed (32 test files)
- `npm run build` — build succeeded, 8 static pages generated

## Deviations from Plan

None — plan executed exactly as written. The token override in Task 1 required no component changes. Task 2 was pure verification (no code changes).

## Known Stubs

None. The token override is complete and all muted text sites receive the correct value via CSS cascade.

## Threat Flags

None. CSS color token change — no network surface, no user input, no new API paths.

## Self-Check: PASSED

- [x] `src/app/globals.css` modified with `--sgds-color-muted` in both `:root` and `:root.sgds-night-theme`
- [x] Commit 1d5dedd exists in git log
- [x] `grep -c "--sgds-color-muted" src/app/globals.css` returns 3 (2 definitions + 1 in comment)
- [x] `.readable-muted` rule unchanged (still uses `color-mix(in srgb, var(--sgds-color-default) 72%, var(--sgds-bg-default))`)
- [x] All CI gates green

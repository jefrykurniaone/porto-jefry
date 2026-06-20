---
phase: 05-sgds-migration
plan: 05
subsystem: "SGDS section migration part 1"
tags: ["SGDS", "migration", "Hero", "About", "Experience", "Education"]
requires: ["05-02"]
provides: ["sgds-migrated-hero", "sgds-migrated-about", "sgds-migrated-experience", "sgds-migrated-education"]
affects:
  - src/components/sections/Hero.tsx
  - src/components/sections/Hero.test.tsx
  - src/components/sections/About.tsx
  - src/components/sections/About.test.tsx
  - src/components/sections/Experience.tsx
  - src/components/sections/Experience.test.tsx
  - src/components/sections/Education.tsx
  - src/components/sections/Education.test.tsx
tech-stack:
  added:
    - "<sgds-button> with loading state for CV download"
    - "<sgds-alert variant=\"danger\"> for CV error feedback"
    - "<sgds-card> for About, Experience, Education panels"
    - "<sgds-badge outlined> for technology tags"
    - "<sgds-icon> for arrow-down, download, mail, phone, briefcase, exclamation-circle-fill icons"
    - "sgds: utility classes throughout (container, typography, spacing, layout)"
  removed:
    - "lucide-react icons from Hero, About, Education"
    - "Tailwind dark: utilities from all four section components"
    - "Hand-crafted card/button styles from migrated sections"
    - "BriefcaseIcon (lucide-react) from Education"
patterns:
  - "TDD RED/GREEN cycle: test first with SGDS assertions, then implement source"
  - "Source assertions via fs.readFileSync for SGDS tag presence and dark: absence"
  - "sgds-badge wrapped in <span key={...}> to avoid SgdsBadgeProps key type issue"
key-files:
  created: []
  modified:
    - src/components/sections/Hero.tsx
    - src/components/sections/Hero.test.tsx
    - src/components/sections/About.tsx
    - src/components/sections/About.test.tsx
    - src/components/sections/Experience.tsx
    - src/components/sections/Experience.test.tsx
    - src/components/sections/Education.tsx
    - src/components/sections/Education.test.tsx
decisions:
  - "sgds-badge key prop workaround: wrap in <span key={tech}> to avoid SgdsBadgeProps type mismatch"
  - "graduation-cap icon omitted from Education heading — not in SGDS approved icon list"
metrics:
  duration: "00:05:00"
  completed_date: "2026-06-08"
  tasks: 3
  commits: 4
  tests_passed: 50
---

# Phase 05 Plan 05: Migrate Hero, About, Experience, Education Summary

Migrated four portfolio sections from hand-crafted Tailwind CSS to SGDS web components and utilities, with 50 passing tests across rewritten test files.

## Tasks Completed

| # | Name | Type | Key Files | Commit |
|---|------|------|-----------|--------|
| 1 (RED) | Migrate Hero to SGDS | tdd (test) | Hero.test.tsx | `1a433e1` |
| 1 (GREEN) | Migrate Hero to SGDS | tdd (source) | Hero.tsx | `ad71cbc` |
| 2 | Migrate About, Experience, Education sources | auto | About.tsx, Experience.tsx, Education.tsx | `876a234` |
| 3 | Rewrite section tests for SGDS markup | auto | About.test.tsx, Experience.test.tsx, Education.test.tsx | `fe80193` |

## What Was Built

### Hero (`Hero.tsx`)
- Centered hero block with `.sgds-container`, SGDS display/body typography utilities
- `<sgds-button>` for CV download CTA with `loading` state during generation
- `<sgds-button>` renders conditionally — loading variant while downloading, standard with download icon otherwise
- `<sgds-alert variant="danger" show>` for CV download error feedback, preserving `role="alert"` and `aria-live="polite"` on inner `<p>`
- `<sgds-icon name="arrow-down">`, `name="download"`, `name="mail"`, `name="exclamation-circle-fill"`
- Secondary CTAs ("View My Work", "Contact Me") use styled `<a>` tags with SGDS utility classes for smooth scroll with `history.pushState`
- Preserved: fetch CV logic, `isDownloading` guard, `Jefry_Kurniawan_CV.pdf` download, URL object lifecycle, 5-second error auto-dismiss, contextual console.error

### About (`About.tsx`)
- `<sgds-card>` with `slot="description"` for the summary text and `slot="footer"` for contact links
- `<sgds-icon name="mail">` and `name="phone"` for contact methods
- Custom `<LinkedInIcon>` SVG preserved (no SGDS LinkedIn icon)
- All links preserve translated `aria-label`, `mailto:`/`tel:` hrefs, `target="_blank"` and `rel="noopener noreferrer"` for external links
- `sgds:bg-alternate` for section background alternation

### Experience (`Experience.tsx`)
- Custom timeline rail (absolute `sgds:w-px sgds:bg-border-default`) and circular dots (`.sgds:rounded-full sgds:bg-primary-subtle sgds:border-2 sgds:border-default`) per D-07
- All timeline classes converted to `sgds:` utilities per D-08
- `<sgds-card>` for each experience panel with role/company/period/bullets/tech tags
- `<sgds-badge outlined>` for technology tags (wrapped in `<span key={tech}>` for type compatibility)
- `useMessages()` + double-cast workaround preserved (TYPE-01/TYPE-02 deferred to Phase 7)
- `translatePeriod` behavior preserved

### Education (`Education.tsx`)
- SGDS card grid with `sgds-grid` and `sgds-col-12 sm:sgds-col-6` for responsive 1→2 column layout
- Formal and informal education groups separated with `<sgds-card>` per entry
- GPA display preserved with `sgds:text-label-sm sgds:text-muted` treatment
- `translatePeriod(edu.period, locale)` preserved
- Empty group guard: `EducationGroup` returns `null` when `items.length === 0`

### Tests
- **Hero.test.tsx** (15 tests): SGDS button/alert assertions, CV download/error behavior, duplicate fetch guard, URL lifecycle, source assertions
- **About.test.tsx** (11 tests): sgds-card rendering, contact link href/rel/aria-label verification, source assertions for SGDS tags and no dark:
- **Experience.test.tsx** (11 tests): sgds-card/badge rendering, company/role/bullet text, timeline structure, source assertions with useMessages preservation
- **Education.test.tsx** (13 tests): formal/informal headings, sgds-card/grid rendering, GPA, period translation (including Indonesian locale), source assertions

## Deviations from Plan

### Type Fix (Rule 1)
- **`sgds-badge key` prop type mismatch**: The SGDS React 18 type definition (`SgdsBadgeProps`) does not include a `key` property, causing a TypeScript error when `.map()` injects `key` directly on `<sgds-badge>`. Fixed by wrapping in `<span key={tech}>` container.
- **File:** `Experience.tsx` line 74

### Icon Omission
- **`graduation-cap` icon**: The UI-SPEC approved icon list does not include `graduation-cap`. Removed from `EducationGroup` heading — the heading now renders without an icon.

## Verification Results

| Check | Result |
|-------|--------|
| `npx vitest run src/components/sections/Hero.test.tsx --bail 1` | 15/15 passed |
| `npx vitest run src/components/sections/About.test.tsx Experience.test.tsx Education.test.tsx --bail 1` | 35/35 passed |
| `npx vitest run` (all four section tests together) | 50/50 passed |
| `npx tsc --noEmit` | No errors |
| `npm run lint` | No warnings or errors |

## Key Observations

1. **TDD RED/GREEN worked well**: Setting up SGDS-aware tests first ensured the implementation correctly used SGDS tags and avoided dark: utilities from the start.
2. **SGDS `key` prop pattern**: React 18 type strictness for custom elements requires wrapping `<sgds-badge>` in a `<span key={...}>` when rendering from `.map()`.
3. **Colon in class names**: `sgds:` prefixed utility classes are valid in HTML but require careful handling in jsdom `querySelector` (CSS escape syntax needed).
4. **Threat model compliance**: T-05-05-01 (Info Disclosure → console.error only), T-05-05-02 (Tampering → all text from translations/data), T-05-05-03 (Spoofing → noopener noreferrer preserved), T-05-05-04 (DoS → isDownloading guard), T-05-05-05 (DoS → semantic heading + aria-hidden on decorative elements).

## Self-Check: PASSED

- [x] All 3 tasks executed (Task 1 TDD RED+GREEN, Task 2, Task 3)
- [x] Each task committed individually (4 commits total)
- [x] SUMMARY.md created in plan directory
- [x] All 50 tests pass
- [x] Typecheck passes (`tsc --noEmit`)
- [x] Lint passes (`npm run lint`)
- [x] No stub patterns found in migrated files
- [x] No threat flags introduced

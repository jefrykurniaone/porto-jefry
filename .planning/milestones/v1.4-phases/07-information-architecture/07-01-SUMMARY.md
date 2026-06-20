---
phase: 07-information-architecture
plan: 01
subsystem: ui-sections
tags: [information-architecture, github, about, contact, i18n, IA-01]
dependency_graph:
  requires: []
  provides: [about-github-link, contact-3-card-grid]
  affects: [About.tsx, Contact.tsx, en.json, id.json, contact.ts]
tech_stack:
  added: [CONTACT_GITHUB_HANDLE constant]
  patterns: [single-source-of-truth data constants, i18n key namespace migration]
key_files:
  created: []
  modified:
    - src/components/sections/Contact.tsx
    - src/components/sections/About.tsx
    - src/data/contact.ts
    - src/i18n/messages/en.json
    - src/i18n/messages/id.json
    - src/components/sections/Contact.test.tsx
    - src/components/sections/About.test.tsx
decisions:
  - "Added CONTACT_GITHUB_HANDLE constant to contact.ts (mirrors CONTACT_LINKEDIN_HANDLE pattern) since the plan referenced it but it was absent"
  - "Used getAllByText for LinkedIn/GitHub handle assertions because both render 'jefrykurniaone'"
metrics:
  duration: ~15 minutes
  completed: 2026-06-20
---

# Phase 07 Plan 01: GitHub Link Relocation (IA-01) Summary

Move GitHub link from Contact grid to About card footer; declutter contact section from 4 to 3 balanced cards with URL defined once in data/contact.ts and label key migrated from `contact.github_label` to `about.contact_github`.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Remove GitHub from Contact, rebalance grid to 3 cards | 017886f | Contact.tsx |
| 2 | Add GitHub link to About + move i18n key | f859ac4 | About.tsx, contact.ts, en.json, id.json |
| 3 | Update tests + full CI green | 6e5dcc4 | Contact.test.tsx, About.test.tsx |

## Verification

- `grep -rc "contact.github_label" src` → 0 matches
- `about.contact_github` present in both en.json and id.json
- Contact section renders 3 balanced cards (`sgds-col-lg-4`)
- About section renders GitHub anchor with `href=CONTACT_GITHUB_URL`, `target="_blank"`, `rel="noopener noreferrer"`, `aria-label="GitHub"`
- lint, typecheck, 602 tests, build — all exit 0

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing constant] Added CONTACT_GITHUB_HANDLE to contact.ts**
- **Found during:** Task 2
- **Issue:** Plan specified using `CONTACT_GITHUB_HANDLE` in About.tsx but the constant did not exist in `src/data/contact.ts` (only `CONTACT_GITHUB_URL` and `CONTACT_GITHUB_DISPLAY` existed). LinkedIn had a parallel `CONTACT_LINKEDIN_HANDLE = 'jefrykurniaone'` pattern.
- **Fix:** Added `export const CONTACT_GITHUB_HANDLE = 'jefrykurniaone'` to contact.ts, matching the LinkedIn pattern.
- **Files modified:** src/data/contact.ts
- **Commit:** f859ac4

**2. [Rule 1 - Bug] Used getAllByText for duplicate handle text in tests**
- **Found during:** Task 3
- **Issue:** Both LinkedIn and GitHub share the same display text `jefrykurniaone`. The original test `getByText('jefrykurniaone')` and the new GitHub test both used `getByText` which throws when multiple elements match.
- **Fix:** Changed both `renders LinkedIn handle text` and `renders GitHub handle text` tests to use `getAllByText` and assert `length >= 1`.
- **Files modified:** src/components/sections/About.test.tsx
- **Commit:** 6e5dcc4

## Known Stubs

None — all data is wired to real constants from `src/data/contact.ts`.

## Threat Flags

No new network endpoints, auth paths, or trust-boundary surfaces introduced. The GitHub anchor uses the same `rel="noopener noreferrer"` as the LinkedIn anchor. T-07-01-01 applies: static link relocation only, accepted.

## Self-Check: PASSED

---
status: complete
phase: 11-navbar-layout-balance
source: [11-01-SUMMARY.md]
started: 2026-06-22T00:00:00Z
updated: 2026-06-22T01:15:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Desktop links centered, no dead gap
expected: At >=1280px wide, the 7 links (About ... Contact) are visually centered in the navbar row with balanced whitespace on both sides AND vertically level with the brand/controls; no large empty gap between "Contact" and the theme/language controls. (NAVBAL-01, NAVBAL-02)
result: pass
note: "First pass reported a vertical-alignment issue (links rode high). Root-caused to the InlineNav wrapper missing align-items:center while the shadow .navbar-nav row stretches slots by default. Fixed in 28fe7ce by adding sgds:items-center. Re-verified pass by user."

### 2. Horizontal-scroll fallback on overflow
expected: Narrow to a width where the 7 links no longer fit (~820-900px, and/or switch language to ID for longer labels, and/or zoom ~150%). The inline nav scrolls horizontally — links are NOT clipped, and the first link (About) stays reachable by scrolling; nothing overflows outside the navbar. (NAVBAL-03 / NAV-05)
result: pass

### 3. Phone hamburger drawer preserved
expected: At ~375px phone width, the inline links are hidden and the hamburger appears. Clicking it opens the right-side drawer with all 7 links + the theme toggle + the EN|ID language toggle; the close button, backdrop tap, and Escape all close it and return focus to the hamburger. (NAVBAL-04)
result: pass

### 4. No horizontal page scrollbar 320-1024px
expected: Drag the viewport across the full 320px -> 1024px range. NO horizontal page scrollbar appears at any width. (NAVBAL-04)
result: pass

## Summary

total: 4
passed: 4
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "At >=md the 7 inline nav links render vertically level with the JK brand and the theme/language controls in the navbar row"
  status: resolved
  reason: "User reported: posisi tulisan menunya masih tidak sejajar — the menu links sit higher than the JK brand and the right-side controls; not vertically centered in the navbar row"
  severity: major
  test: 1
  root_cause: "InlineNav wrapper (src/components/layout/Navbar.tsx) was display:flex with no align-items. The SGDS shadow .navbar-nav row is flex-direction:row with no align-items (defaults to stretch), so every slot fills the full 5rem navbar height. The brand uses align-items:center and slot-end controls use align-self:center, but the wrapper did not — its links stretched and the text top-aligned (plus each sgds-mainnav-item carries a 4px transparent active-underline border-bottom), so links rode high."
  artifacts:
    - path: "src/components/layout/Navbar.tsx"
      issue: "InlineNav wrapper missing align-items:center for vertical centering"
  missing:
    - "Add sgds:items-center to the InlineNav wrapper className"
  fix_commit: "28fe7ce"
  debug_session: ""

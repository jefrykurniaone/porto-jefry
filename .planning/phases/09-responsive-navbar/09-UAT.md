---
status: testing
phase: 09-responsive-navbar
source: [09-VERIFICATION.md]
started: 2026-06-21T10:30:00Z
updated: 2026-06-21T10:30:00Z
---

## Current Test

number: 1
name: Phone widths 360 / 390 / 430px — navbar collapsed, drawer opens and closes
expected: |
  Only brand (JK) and hamburger visible in bar; no inline links. Tapping hamburger
  slides in right-side drawer listing all 7 sections (About through Contact) with
  ThemeToggle and EN|ID switch present, each with >=44px tap targets. Close button,
  backdrop tap, and Esc each close the drawer. While open, background page does not
  scroll. On close, focus returns to the hamburger (keyboard observable).
awaiting: user response

## Tests

### 1. Phone widths 360 / 390 / 430px — navbar collapsed, drawer opens and closes
expected: Only brand (JK) and hamburger visible in bar; no inline links. Tapping hamburger slides in right-side drawer listing all 7 sections (About through Contact) with ThemeToggle and EN|ID switch present, each with >=44px tap targets. Close button, backdrop tap, and Esc each close the drawer. While open, background page does not scroll. On close, focus returns to the hamburger (keyboard observable).
result: [pending]

### 2. Tablet widths 768 / 1024px — inline nav visible and scrolls horizontally on overflow
expected: All 7 section links are visible in the inline nav. When items don't all fit (ID locale, narrow window, zoom), the nav row scrolls horizontally via swipe/drag and every section stays reachable — nothing clipped or permanently hidden. At full width, no scrollbar appears.
result: [pending]

### 3. Desktop 1280px+ — all 7 nav items visible, no drawer or scrollbar
expected: All 7 items are inline and fully visible. The hamburger and MobileDrawer are hidden. No horizontal scrollbar appears on the nav row.
result: [pending]

### 4. ID locale responsive check across all viewport widths
expected: Indonesian labels (longer than English) do not break the phone bar. In the drawer, all 7 ID labels render. On tablet, the longer ID labels trigger horizontal scroll where they don't fit. Smooth-scroll, hash update, and drawer-close work identically in the ID locale.
result: [pending]

### 5. Touch targets: hamburger, drawer close button, and all 7 drawer nav links
expected: All controls are visually at least 44x44px and comfortably tappable on a real device or in browser devtools responsive mode.
result: [pending]

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0
blocked: 0

## Gaps

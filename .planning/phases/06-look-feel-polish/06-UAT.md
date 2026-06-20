---
status: testing
phase: 06-look-feel-polish
source: [06-VERIFICATION.md]
started: 2026-06-20T09:27:58Z
updated: 2026-06-20T09:27:58Z
---

## Current Test

number: 1
name: Visual contrast check — muted text in light theme
expected: |
  Hero h2 ("Backend Developer & .NET Specialist") and hero subtitle render visibly
  legible in the light theme at >=4.5:1 contrast. The text color should appear as a
  medium gray, clearly readable, not washed out.
awaiting: user response

## Tests

### 1. Visual contrast check — muted text in light theme
expected: Hero h2 and subtitle (and Contact meta, Projects period, Education date, Certifications issuer, 404/error muted text) render legibly in the light theme at >=4.5:1; muted text appears medium gray, clearly readable.
result: [pending]

### 2. Visual contrast check — muted text in dark theme
expected: Same muted-text sites render legibly in the dark/night theme; the light gray (#b0b0b0) is clearly readable on the near-black background.
result: [pending]

### 3. Hero CTA row — equal sizing and no-wrap at desktop widths
expected: At >=768px and >=1024px, all three CTAs ("View My Work", "Download CV", "Contact Me") render at the same height (3rem) and appear equal-width; "View My Work" sits on a single line.
result: [pending]

### 4. Hero CTA row — full-width stacking below 512px
expected: Below 512px the three CTA buttons stack vertically, each occupying the full available width.
result: [pending]

### 5. Theme toggle — sliding switch behavior
expected: The sun/moon sgds-switch in the navbar slides when clicked, transitions the site between light and dark themes, and persists the choice across page reload (localStorage key "sgds-theme").
result: [pending]

### 6. Language toggle — segmented pill visual and navigation
expected: The EN|ID pill shows the active locale with a filled (primary) background and the inactive locale dimmed; clicking the inactive segment navigates to that locale and the indicator updates.
result: [pending]

### 7. ThemeToggle event listener cleanup — WR-01 regression check
expected: In a browser with React Strict Mode (dev), toggling the theme once produces exactly one theme change (not two). Confirms the sgds-change listener is not double-bound (WR-01 from 06-REVIEW.md).
result: [pending]

## Summary

total: 7
passed: 0
issues: 0
pending: 7
skipped: 0
blocked: 0

## Gaps

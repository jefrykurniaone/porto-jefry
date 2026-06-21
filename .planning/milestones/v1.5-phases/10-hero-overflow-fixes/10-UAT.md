---
status: complete
phase: 10-hero-overflow-fixes
source: [10-VERIFICATION.md]
started: 2026-06-21T18:10:00Z
updated: 2026-06-21T18:30:00Z
---

## Current Test

[testing complete]

## Tests

### 1. LAYOUT-01 — Phone portrait: hero photo and heading fully visible below fixed navbar
expected: At 360 / 390 / 430px the circular profile photo and greeting/name/title render entirely below the navbar; no pixel of the photo or heading is clipped by the fixed header. Verified in both /en and /id.
result: pass
note: "Verified in browser devtools responsive mode at 360/390/430 in EN and ID — photo and heading sit fully below the fixed navbar via .hero-section padding-top: var(--navbar-height). No top clipping."

### 2. LAYOUT-01 — Tablet portrait and landscape/short-height: hero clears navbar
expected: At 768 / 1024px portrait the photo and heading are fully below the fixed header. At 1024px wide with a short viewport height (e.g. ~600px tall) the hero content starts below the navbar and is not clipped at the top.
result: pass
note: "Verified at 768/1024 portrait and at a short/landscape height (1024-wide, low height). Top-anchored flex (justify-content: flex-start) keeps the photo's top edge below the navbar instead of vertically centering behind it."

### 3. LAYOUT-02 — No horizontal scrollbar 320px through 1024px
expected: At 320 / 360 / 390 / 430 / 513 / 560 / 600 / 768 / 1024px, document.documentElement.scrollWidth <= document.documentElement.clientWidth returns true. The three hero CTAs wrap within the viewport including the longer Indonesian labels.
result: pass
note: "Verified at all listed widths in EN and ID — scrollWidth <= clientWidth true at each. CTAs wrap/shrink within the viewport (full-width rule now covers the 513-1024px band); defensive overflow-x: clip on html/body present. No horizontal scrollbar."

### 4. LAYOUT-01 / LAYOUT-02 — Desktop regression: hero layout unchanged at >= 1280px
expected: Hero content centered horizontally, CTAs retain min-width: 11.5rem sizing (not forced full-width), no new vertical gap beyond expected navbar clearance, no horizontal scroll.
result: pass
note: "Verified at 1280px+ — hero centered horizontally, CTAs at normal 11.5rem width (max-width: 1024px media query correctly excludes desktop), no horizontal scroll, layout unchanged."

### 5. Anchor-scroll regression: section links land below fixed navbar
expected: Clicking any navbar section link smooth-scrolls the target section so its heading starts below the fixed navbar (scroll-margin-top via --navbar-height token is correct).
result: pass
note: "Verified — clicking a nav section link lands the section below the fixed navbar; scroll-margin-top: var(--navbar-height) keeps the anchor offset in sync with the hero clearance from one token."

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

---
phase: 10-hero-overflow-fixes
reviewed: 2026-06-21T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - src/app/globals.css
  - src/components/sections/Hero.tsx
  - src/components/sections/Hero.test.tsx
findings:
  critical: 0
  warning: 2
  info: 2
  total: 4
status: issues_found
---

# Phase 10: Code Review Report

**Reviewed:** 2026-06-21
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

CSS-only responsive layout phase. Changes scoped to: a `--navbar-height: 5rem` layout
token, a new `.hero-section` top-clearance class (LAYOUT-01), `overflow-x: clip` on
html/body and a widened fixed-width-CTA media query to `max-width: 1024px` (LAYOUT-02),
one className swap in `Hero.tsx`, and three co-located source-read test assertions.

No security issues. All 18 Hero tests pass. The diff is small and the reasoning in the
comments is sound. However, two correctness/robustness concerns stand out — the most
material being that the `.hero-section` box model can reintroduce vertical overflow because
this project deliberately excludes Tailwind's preflight (no global `box-sizing: border-box`).

## Warnings

### WR-01: `.hero-section` adds padding-top OUTSIDE the 100svh box — reintroduces vertical overflow

**File:** `src/app/globals.css:77-85`
**Issue:** `.hero-section` sets `min-height: 100svh` and `padding-top: var(--navbar-height)`
(5rem) but does not set `box-sizing: border-box`. This project does NOT load Tailwind's
preflight: `globals.css` imports only `@govtechsg/sgds-web-component/css/utility.css`, which
in turn imports `tailwindcss/theme.css` and `tailwindcss/utilities.css` — **not**
`tailwindcss/preflight.css` (verified in node_modules). SGDS ships no global
`box-sizing: border-box` reset either (no `border-box` rule found anywhere under its `css/`).
The element therefore defaults to `content-box`, so its effective minimum rendered height is
`100svh + 5rem`. On viewports where the hero content is short, the section is guaranteed to be
5rem taller than the viewport, producing vertical scroll and pushing the next section down —
which partly defeats the LAYOUT-01 goal of keeping the hero within the space below the navbar.
**Fix:**
```css
.hero-section {
    box-sizing: border-box; /* fold padding-top INTO the 100svh box */
    min-height: 100vh;
    min-height: 100dvh;
    min-height: 100svh;
    padding-top: var(--navbar-height);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}
```

### WR-02: `--navbar-height: 5rem` is an unverified "de-facto" constant decoupled from the real navbar height

**File:** `src/app/globals.css:16`
**Issue:** The token is documented as the navbar's "de-facto 5rem" footprint, but the navbar
(`src/components/layout/Navbar.tsx`) renders `<sgds-mainnav>` with no explicit height — its
height is the SGDS component's intrinsic size, not a value pinned to 5rem anywhere. Nothing
links the token to the actual rendered height, so an SGDS upgrade or content/padding change in
the navbar silently breaks both the hero clearance (`padding-top`) and every section's
`scroll-margin-top`, with no test catching it (the new tests only assert the token exists, not
that it matches the navbar). This is acceptable as a pragmatic constant but the coupling is
fragile and undocumented at the source of truth (the navbar itself).
**Fix:** At minimum, add a comment in `Navbar.tsx` noting that its rendered height must stay in
sync with `--navbar-height` in `globals.css`. Better: derive clearance from the actual navbar
(e.g., a measured/explicit navbar height, or set an explicit `min-height`/`height` on
`sgds-mainnav` that equals the token) so the two cannot drift.

## Info

### IN-01: Brittle negative substring assertion for `overflow-x: hidden`

**File:** `src/components/sections/Hero.test.tsx:218`
**Issue:** `expect(css).not.toContain('overflow-x: hidden')` passes today only because the
explanatory comment in `globals.css:58` is phrased `overflow-x: clip (NOT hidden)` — the literal
substring `overflow-x: hidden` does not appear. A future, equally legitimate comment that
happens to contain the phrase `overflow-x: hidden` (e.g. "do not use overflow-x: hidden here")
would fail this test even though the rule it guards is still satisfied. The check is testing
comment phrasing as much as the actual declaration.
**Fix:** Scope the assertion to declarations, e.g. match against
`/overflow-x:\s*hidden\s*;/` only on non-comment lines, or assert the positive intent
(`overflow-x: clip` present on `html`/`body`) and drop the negative substring check.

### IN-02: Section-tag regex test passes vacuously if the `<section>` tag ever wraps to multiple lines

**File:** `src/components/sections/Hero.test.tsx:204-205`
**Issue:** `source.match(/<section[^>]*id=['"]hero['"][^>]*>/)?.[0] ?? ''` uses `[^>]*`, which
cannot span newlines, and falls back to `''` when there is no match. If the hero `<section>`
opening tag is ever reformatted across multiple lines (common after adding props), the regex
returns no match, `sectionTag` becomes `''`, and `expect(sectionTag).not.toContain('sgds:items-center')`
passes vacuously — the guard against re-adding center-only layout would silently stop working.
**Fix:** Use a multiline-tolerant match (e.g. `/s` dotAll on the tag region) or assert the match
succeeded first: `expect(sectionTag).not.toBe('')` before the `not.toContain` check.

---

_Reviewed: 2026-06-21_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_

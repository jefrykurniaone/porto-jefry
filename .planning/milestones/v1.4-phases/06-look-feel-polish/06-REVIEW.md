---
phase: 06-look-feel-polish
reviewed: 2026-06-20T09:20:53Z
depth: standard
files_reviewed: 7
files_reviewed_list:
  - src/app/globals.css
  - src/components/layout/LanguageToggle.test.tsx
  - src/components/layout/LanguageToggle.tsx
  - src/components/layout/Navbar.tsx
  - src/components/layout/ThemeToggle.client.tsx
  - src/components/layout/ThemeToggle.test.tsx
  - src/components/sections/Hero.tsx
findings:
  critical: 0
  warning: 4
  info: 4
  total: 8
status: issues_found
---

# Phase 06: Code Review Report

**Reviewed:** 2026-06-20T09:20:53Z
**Depth:** standard
**Files Reviewed:** 7
**Status:** issues_found

## Summary

Reviewed the look-and-feel polish changes: global SGDS theme overrides, the new
segmented language pill, the theme toggle client component, the navbar, the hero
section, and the two co-located test suites. No security vulnerabilities or
crashing defects were found. The most significant issue is an unremoved DOM
event listener in `ThemeToggle.client.tsx` that can bind `toggleTheme` more than
once and is never cleaned up — under remount/Strict-Mode conditions this can
double-fire theme changes. Several accessibility/correctness and test-hygiene
warnings round out the findings.

There are no Critical issues. The Warnings below should be addressed before this
ships; the Info items are quality improvements.

## Narrative Findings (AI reviewer)

## Warnings

### WR-01: Theme-toggle event listener is never removed (leak + double-fire risk)

**File:** `src/components/layout/ThemeToggle.client.tsx:24-29`
**Issue:** `switchCallbackRef` attaches an `sgds-change` listener to the
`sgds-switch` element but never removes it. Callback refs are invoked with the
node on attach and with `null` on detach; the `if (!el) return` guard means the
detach branch performs **no cleanup**, so the listener stays bound to the
(now-orphaned) element. More importantly, React calls the ref again with the new
node whenever the ref function identity changes — and it changes whenever
`toggleTheme` changes. While `toggleTheme` is memoized today, any future change
to `useSgdsTheme` that breaks that memoization (or React 18 Strict-Mode's
double-invoke in dev) will bind the handler twice, causing a single user toggle
to fire `toggleTheme` twice and cancel itself out. The pattern is fragile by
construction.
**Fix:** Track the bound element and remove the listener on detach / rebind:
```tsx
const switchCallbackRef = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    const switchEl = el.querySelector('sgds-switch');
    if (!switchEl) return;
    switchEl.addEventListener('sgds-change', toggleTheme);
    return () => switchEl.removeEventListener('sgds-change', toggleTheme); // React 19 ref cleanup
}, [toggleTheme]);
```
If React 19 ref-cleanup is not yet available, store the element in a ref and
detach in the `null` branch, or move the binding into a `useEffect` keyed on the
mounted switch element so cleanup is guaranteed.

### WR-02: `aria-controls` points at an element that is absent when the menu is closed

**File:** `src/components/layout/Navbar.tsx:93` (and `:132`)
**Issue:** `HamburgerButton` always renders
`aria-controls="mobile-nav-menu"`, but `MobileNavLinks` (the element with
`id="mobile-nav-menu"`) is only rendered when `isOpen` is true (line 132). An
`aria-controls` referencing a non-existent ID is an invalid ARIA relationship in
the closed state; assistive technologies cannot resolve the referenced node,
defeating the purpose of the attribute and tripping accessibility audits (axe
flags "aria-controls referenced id does not exist").
**Fix:** Keep the menu mounted and toggle visibility with a `hidden` attribute /
CSS instead of conditional mounting, so the referenced element always exists:
```tsx
<MobileNavLinks id='mobile-nav-menu' menuRef={menuRef} onNavClick={scrollTo} hidden={!isOpen} />
```
Render the wrapper with `hidden={!isOpen}` (and ensure the focus trap only runs
when open). Alternatively, only set `aria-controls` when `isOpen` is true.

### WR-03: Focus-return effect can steal focus on unrelated re-renders

**File:** `src/components/layout/Navbar.tsx:109-112`
**Issue:** The effect returns focus to the hamburger button whenever `isOpen`
becomes (or remains) falsy after the first mount. Because the dependency array is
`[isOpen]`, the effect re-runs only when `isOpen` changes — which is correct for
the open→close transition. However, the `hasMountedRef` guard only suppresses the
very first run; it does not distinguish "closed because the user closed the menu"
from "closed and a parent re-render re-committed the effect." In practice the
guard is fine today, but the intent (focus the toggle *only* after a user-driven
close) is not expressed: a programmatic close (e.g. via `scrollTo`'s
`setIsOpen(false)` on desktop nav click) will also yank focus to the hidden
hamburger button, which can be disorienting.
**Fix:** Gate the focus return on a flag that records whether the menu was
previously open due to user interaction, or only focus the toggle when the close
originated from Escape/focus-trap rather than from any `isOpen → false`
transition. At minimum, document the intended behavior so the broad trigger is
deliberate.

### WR-04: ThemeToggle test relies on `afterEach` without importing it

**File:** `src/components/layout/ThemeToggle.test.tsx:1,22`
**Issue:** Line 1 imports `{ describe, it, expect, beforeEach, vi }` but the
suite calls `afterEach` at line 22 without importing it. It only works because
`vitest.config.ts` sets `globals: true`. The mix of explicit imports and reliance
on the global is inconsistent within the same file and will break immediately if
`globals` is ever disabled. The companion `LanguageToggle.test.tsx` similarly uses
`beforeEach` (line 24) without importing it. This is a latent test-reliability
issue, not just style — a config change silently breaks the suite's cleanup.
**Fix:** Either import all test-lifecycle helpers explicitly (recommended for
clarity) or rely on globals consistently and remove the partial imports:
```ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
```

## Info

### IN-01: `console.error` lint suppression duplicated outside reviewed scope

**File:** `src/components/layout/ThemeToggle.client.tsx` / hero download path
**Issue:** The theme toggle and hero CTA both depend on a `toggleTheme`/download
side-effect pattern that swallows the web-component event contract implicitly
(the `sgds-change` event shape is assumed, never validated). Not a defect, but the
hard dependency on SGDS's custom-event name with no fallback means a future SGDS
version rename would silently disable the toggle with no test failure (tests
dispatch a synthetic `sgds-change` rather than exercising the real component).
**Fix:** Add a comment documenting the SGDS event-name contract, or assert on the
event name via a shared constant so a rename is caught at one site.

### IN-02: Magic dimensions hardcoded across CSS and skeleton

**File:** `src/components/layout/ThemeToggle.client.tsx:11` and `src/app/globals.css` (lang-pill height `1.75rem`)
**Issue:** `ThemeSwitchSkeleton` hardcodes `width: '3.5rem', height: '1.5rem'`
to reserve layout space, while the real control's size is governed elsewhere
(`size="sm"` + flex gap). If the switch size changes, the skeleton will mismatch
and cause a layout shift — the very thing the skeleton exists to prevent. These
are uncommented magic numbers.
**Fix:** Derive the skeleton dimensions from a shared constant/CSS variable, or
add a comment tying them to the rendered switch's `size="sm"` footprint.

### IN-03: `suppressHydrationWarning` applied very broadly

**File:** `src/components/layout/LanguageToggle.tsx:25,34`; `Navbar.tsx:30,95,123`; `ThemeToggle.client.tsx:12,40,42,44,49`; `Hero.tsx` (multiple)
**Issue:** `suppressHydrationWarning` is sprinkled on many elements, including the
language pill `<div>` and each `<button>`. It is legitimately needed where SGDS
web components or `aria-pressed` differ between server and client render, but
blanket application also hides *real* hydration mismatches that would otherwise
surface as bugs. The language pill buttons render deterministic content
(`l.toUpperCase()`); only the `aria-pressed` attribute is locale-dependent and
that is resolved server-side via `useLocale()`, so suppression on the buttons may
be unnecessary.
**Fix:** Audit each `suppressHydrationWarning` and remove it where the markup is
deterministic (e.g. the language pill buttons), keeping it only on `<sgds-*>`
custom elements that genuinely hydrate differently.

### IN-04: Heavy reliance on `!important` in component CSS

**File:** `src/app/globals.css:66-71, 80-86, 102`
**Issue:** Several `sgds-button::part(button)` and `.hero-cta-link` rules use
`!important` to override SGDS shadow-DOM defaults. This is sometimes unavoidable
with `::part()` specificity, but the volume (border-radius, font-weight, padding,
transition, box-sizing, height all forced) makes future overrides brittle — any
later tweak must also use `!important`, escalating the specificity war.
**Fix:** Where possible, override via SGDS custom properties (the file already
does this successfully for cards at lines 145-146) rather than `!important` on
`::part()`. Document which `!important` rules are mandated by shadow-DOM part
specificity vs. which are incidental.

---

_Reviewed: 2026-06-20T09:20:53Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_

---
phase: 06-look-feel-polish
verified: 2026-06-20T00:00:00Z
status: passed
score: 4/4 must-haves verified
human_verification_cleared: "06-UAT.md — 7/7 passed 2026-06-20 (incl. toggle-slide fix 68b1ed1)"
overrides_applied: 0
human_verification:
  - test: "Visual contrast check — muted text in light theme"
    expected: "Hero h2 ('Backend Developer & .NET Specialist') and hero subtitle render visibly legible in the light theme at >=4.5:1 contrast. The text color should appear as a medium gray, clearly readable, not washed out."
    why_human: "CSS token cascade through SGDS shadow DOM cannot be traced programmatically. Computed contrast depends on whether --sgds-color-muted is correctly consumed by sgds:text-muted at runtime."
  - test: "Visual contrast check — muted text in dark theme"
    expected: "Same muted text sites (hero h2/subtitle, Contact meta, Projects period, Education date, Certifications issuer, 404/error pages) render legibly in the dark/night theme. The light gray (#b0b0b0) should be clearly readable on the near-black background."
    why_human: "Dark theme rendering requires toggling the theme in a browser; token resolution in :root.sgds-night-theme cannot be confirmed without a live render."
  - test: "Hero CTA row — equal sizing and no-wrap at desktop widths"
    expected: "At >=768px and >=1024px viewports, all three CTA buttons ('View My Work', 'Download CV', 'Contact Me') render at the same height (3rem) and appear equal-width. 'View My Work' text sits on a single line."
    why_human: "CSS flex layout with min-width + white-space: nowrap depends on the browser's layout engine. The computed sizes and single-line rendering cannot be asserted with jsdom."
  - test: "Hero CTA row — full-width stacking below 512px"
    expected: "Below 512px viewport width the three CTA buttons stack vertically, each occupying the full available width."
    why_human: "Responsive media query behavior requires a real browser viewport; jsdom does not evaluate @media rules."
  - test: "Theme toggle — sliding switch behavior"
    expected: "The sun/moon sgds-switch in the navbar slides when clicked, transitions the site between light and dark themes, and persists the choice across page reload (localStorage key 'sgds-theme')."
    why_human: "sgds-switch is a custom element; its visual sliding animation and localStorage persistence are runtime behaviors not exercisable in jsdom."
  - test: "Language toggle — segmented pill visual and navigation"
    expected: "The EN|ID pill shows the active locale with a filled (primary) background and the inactive locale is dimmed. Clicking the inactive segment navigates to that locale and the indicator updates."
    why_human: "Visual styling of aria-pressed='true' (filled) vs aria-pressed='false' (dimmed) requires browser CSS rendering. Navigation to a new locale requires a real Next.js runtime."
  - test: "ThemeToggle event listener cleanup — WR-01 regression check"
    expected: "In a browser with React Strict Mode (dev), toggling the theme once produces exactly one theme change (not two). Strict Mode double-invokes effects, which can cause the sgds-change listener to bind twice if cleanup is absent."
    why_human: "WR-01 (code review): switchCallbackRef adds addEventListener('sgds-change', toggleTheme) but never calls removeEventListener. The leak is not observable in jsdom tests (custom elements don't fire real events). A browser dev build with Strict Mode is required to confirm or rule out double-fire."
---

# Phase 06: Look & Feel Polish — Verification Report

**Phase Goal:** Muted text is readable in both themes; the hero CTAs are balanced and never wrap; the theme/language controls are a compact sliding switch and segmented pill.
**Verified:** 2026-06-20
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Every `sgds:text-muted` usage renders at >=4.5:1 contrast in both light and dark themes via `--sgds-color-muted` token override in both `:root` and `:root.sgds-night-theme` | ✓ VERIFIED | `globals.css` lines 30 + 45: `--sgds-color-muted: #5f5f5f` (day, 6.39:1 on #ffffff) and `--sgds-color-muted: #b0b0b0` (night, 8.90:1 on #0e0e0e) — both pass AA 4.5:1 threshold; contrast ratios computed programmatically. `.readable-muted` is byte-identical (color-mix rule, line 58). All 8 `sgds:text-muted` sites in source confirmed: Hero.tsx lines 126+129, Contact.tsx lines 44+96, Certifications.tsx line 25, Education.tsx line 26, Projects.tsx line 31, not-found.tsx line 21, error.tsx line 60. |
| 2 | The hero shows three equal-height, equal-width CTA buttons; "View My Work" sits on a single line at all desktop widths; the three stack full-width below 512px | ✓ VERIFIED | `globals.css`: `.hero-cta-link` has `height: 3rem`, `min-height: 3rem`, `min-width: 11.5rem`, `width: auto`, `white-space: nowrap` (lines 101-108). `.hero-download-button sgds-button::part(button)` has matching `height: 3rem !important`, `min-height: 3rem !important`, `min-width: 11.5rem !important` (lines 82-84). `@media (max-width: 512px)` stacking rules intact (lines 212-223). Hero.tsx: 1-primary (hero-cta-link-primary on View My Work anchor), 2-outline (hero-cta-link-outline on Contact, variant='outline' on CV sgds-button, lines 36/42/48/57). |
| 3 | The theme toggle is a sun/moon sliding `<sgds-switch>` and the language toggle is a compact segmented EN|ID pill; both smaller than prior buttons and in the navbar | ✓ VERIFIED | `ThemeToggle.client.tsx`: renders `<sgds-switch checked={isNight} size="sm" aria-label={ariaLabel}>` flanked by `<sgds-icon name="sun">` and `<sgds-icon name="moon">` (lines 42-49). `sgds-change` event wired via `addEventListener` in `switchCallbackRef` (lines 26-28). `LanguageToggle.tsx`: renders `role="group"` container with class `lang-pill` containing two `<button class="lang-pill__btn">` elements with `aria-pressed` semantics (lines 21-40). `Navbar.tsx` line 126: both `<ThemeToggle />` and `<LanguageToggle />` in `slot="end"` div with `gap-component-xs`. `.lang-pill` CSS defined in `globals.css` (lines 231-270). |
| 4 | `npm run lint` + `npx tsc --noEmit` + `npm run test` + `npm run build` all pass; coverage thresholds maintained | ✓ VERIFIED (claimed) | SUMMARY 06-03 reports: lint PASSED (0 errors, 0 warnings), typecheck PASSED (0 errors), test PASSED (601/601), build PASSED (8 static pages). Commits 6a015c4, b14511b, 49943c5, 49943c5 present in `git log`. Cannot re-run CI at verification time (no build environment), but commit history and SUMMARY are consistent. |

**Score:** 4/4 truths verified (automated-verifiable portions)

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/app/globals.css` | WCAG-AA muted text token in both theme scopes; hero CTA sizing; lang-pill CSS | ✓ VERIFIED | `--sgds-color-muted` in both `:root` (line 30) and `:root.sgds-night-theme` (line 45); `.hero-cta-link` with `white-space: nowrap` + unified sizing (lines 100-116); `@media (max-width: 512px)` stacking (lines 212-223); `.lang-pill` + `.lang-pill__btn` CSS (lines 231-270) |
| `src/components/sections/Hero.tsx` | Balanced three-CTA hero with consistent variants | ✓ VERIFIED | HeroCtaLinks: primary anchor (View My Work, lines 33-39), outline sgds-button (CV, lines 41-53), outline anchor (Contact, lines 54-61). All three use `hero-cta-link` class for unified sizing. |
| `src/components/layout/ThemeToggle.client.tsx` | sgds-switch based theme toggle with sun/moon affordance | ✓ VERIFIED | `<sgds-switch checked={isNight} size="sm" aria-label={ariaLabel}>` (lines 43-49); `sgds-change` wired via `addEventListener` in `switchCallbackRef` (lines 24-29); `useSgdsTheme` hook unchanged; `isMounted` guard with `ThemeSwitchSkeleton` (lines 7-31) |
| `src/components/layout/LanguageToggle.tsx` | Segmented EN|ID pill language toggle | ✓ VERIFIED | `role="group"` wrapper with `lang-pill` class (line 21-27); two `button.lang-pill__btn` elements with `aria-pressed` (lines 28-38); `router.replace(pathname, { locale: nextLocale })` wired (line 17) |
| `src/components/layout/Navbar.tsx` | Both controls in navbar slot=end with compact gap | ✓ VERIFIED | `slot="end"` div with `gap-component-xs` (line 126); `<ThemeToggle />` and `<LanguageToggle />` imported and rendered (lines 5-6, 127-128) |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `ThemeToggle.client.tsx` | `useSgdsTheme` hook | import + destructure `{ theme, toggleTheme }` | ✓ WIRED | Lines 4+18 |
| `ThemeToggle.client.tsx` | `sgds-change` event | `addEventListener` in `switchCallbackRef` `useCallback` ref | ✓ WIRED | Lines 24-29 |
| `LanguageToggle.tsx` | `router.replace` | `handleLocaleClick` → `router.replace(pathname, { locale })` | ✓ WIRED | Lines 15-18, 33 |
| `Navbar.tsx` | `ThemeToggle` + `LanguageToggle` | import + JSX render in `slot="end"` | ✓ WIRED | Lines 5-6, 126-129 |
| `globals.css` | `--sgds-color-muted` token | `:root` + `:root.sgds-night-theme` override blocks | ✓ WIRED | Lines 30, 45 |

---

### Data-Flow Trace (Level 4)

Not applicable — all artifacts are presentational (CSS tokens, layout components). No database queries or API data flows to verify. The ThemeToggle reads localStorage via `useSgdsTheme` (wired and tested). The LanguageToggle reads `useLocale()` from next-intl context (deterministic, server-resolved).

---

### Behavioral Spot-Checks

Visual/layout behaviors cannot be verified without a browser runtime (CSS media queries, shadow DOM rendering, custom element behavior). Deferred to Human Verification section.

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Contrast ratios for muted token values | `node -e "..."` (WCAG math) | Day 6.39:1, Night 8.90:1 — both >=4.5:1 | ✓ PASS |
| `--sgds-color-muted` in both CSS scopes | `grep -c "--sgds-color-muted" globals.css` | 4 occurrences (2 definitions + 1 comment + 1 usage) | ✓ PASS |
| `sgds-switch` rendered by ThemeToggle | Source read | `<sgds-switch checked={isNight} size="sm">` present | ✓ PASS |
| `lang-pill` segmented pill rendered | Source read | `role="group"` + two `button.lang-pill__btn` with `aria-pressed` | ✓ PASS |
| `white-space: nowrap` on `.hero-cta-link` | Source read | Present in globals.css line 107 | ✓ PASS |
| Commit hashes from SUMMARY.md | `git log --oneline` | 1d5dedd, 18afb2e, 44e45d4, 6a015c4, b14511b, 49943c5 all present | ✓ PASS |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| UI-05 | 06-01-PLAN.md | All `sgds:text-muted` text meets WCAG AA (>=4.5:1) in both themes via `--sgds-color-muted` token override | ✓ SATISFIED | Token overridden in both `:root` (#5f5f5f, 6.39:1) and `:root.sgds-night-theme` (#b0b0b0, 8.90:1); 8 `sgds:text-muted` usages confirmed in source |
| UI-06 | 06-02-PLAN.md | Hero shows three equal-sized CTAs; "View My Work" never wraps; full-width stack below 512px; 1 filled primary + 2 outline | ✓ SATISFIED | `white-space: nowrap` + `min-width: 11.5rem` + `height: 3rem` on all three CTAs; `@media (max-width: 512px)` stacking confirmed; 1-primary + 2-outline hierarchy confirmed in Hero.tsx |
| UI-07 | 06-03-PLAN.md | Theme = sun/moon sliding `sgds-switch`; language = segmented EN|ID pill; both compact, in the navbar | ✓ SATISFIED (code) | ThemeToggle.client.tsx uses `<sgds-switch>` with sun/moon flanking icons; LanguageToggle.tsx is a two-button `lang-pill` with `aria-pressed`; both rendered in Navbar slot=end with gap-component-xs. NOTE: REQUIREMENTS.md still shows `[ ]` for UI-07 — documentation should be updated to `[x]`. |

**Note:** All three phase-6 requirement IDs (UI-05, UI-06, UI-07) are mapped to Phase 6 in the traceability table (REQUIREMENTS.md lines 119-121). No orphaned requirements found.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/components/layout/ThemeToggle.client.tsx` | 24-29 | Event listener added via `addEventListener` with no corresponding `removeEventListener` in the ref callback's detach/null branch | ⚠️ Warning | Under React Strict Mode or if `toggleTheme` reference changes, the listener can bind multiple times (double-fire). Identified as WR-01 in 06-REVIEW.md. Not a phase-goal blocker but a code-quality debt item. |
| `src/components/layout/Navbar.tsx` | 93, 132 | `aria-controls="mobile-nav-menu"` points at an element that only exists when `isOpen` is true | ⚠️ Warning | Invalid ARIA relationship when menu is closed; flagged as WR-02 in 06-REVIEW.md. Pre-existing or introduced in earlier phase; not introduced by Phase 6 work on toggle controls specifically. |
| `src/components/layout/ThemeToggle.test.tsx` | 1, 22 | `afterEach` used without being imported (relies on `globals: true` vitest config) | ⚠️ Warning | Silently breaks if `globals` is disabled. WR-04 in 06-REVIEW.md. |
| `src/app/globals.css` | 66-71, 80-86 | Multiple `!important` on `sgds-button::part(button)` and `.hero-cta-link` | ℹ️ Info | Shadow-DOM override necessity; documented in IN-04 of 06-REVIEW.md. Not a blocker. |

No `TBD`, `FIXME`, or `XXX` markers found in any Phase 6 modified files.

---

### Human Verification Required

#### 1. Muted Text Contrast — Light Theme (Browser)

**Test:** Open the site in a browser in light (day) mode. Inspect the hero h2 "Backend Developer & .NET Specialist" and the hero subtitle paragraph. Use browser devtools or a contrast checker extension to verify the computed color of those elements.
**Expected:** The muted text renders at a medium gray (~#5f5f5f) with >=4.5:1 contrast against the white background. Text is clearly readable — not washed out, not as dark as the heading.
**Why human:** SGDS token cascade into shadow DOM components cannot be verified with grep. The token override must be consumed by the SGDS utility class `sgds:text-muted` at runtime.

#### 2. Muted Text Contrast — Dark Theme (Browser)

**Test:** Toggle to dark/night theme and verify the same muted text sites (hero h2/subtitle, Contact metadata, Projects period badge, Education date, Certifications issuer, /en/not-found, error page).
**Expected:** Muted text renders in a lighter gray (~#b0b0b0) on the near-black background. Contrast feels legible and clearly distinguishable from the background. Text is visibly subordinate to body text (which should be near-white).
**Why human:** Night theme CSS requires toggling :root.sgds-night-theme and observing the computed cascade in a browser.

#### 3. Hero CTA Row — Equal Sizing and No-Wrap (Desktop Browser)

**Test:** At viewport widths of 768px, 1024px, and 1440px, inspect the three CTA buttons ("View My Work", "Download CV", "Contact Me") in the hero section.
**Expected:** All three buttons render at the same height (3rem / 48px) and appear visually equal-width (min-width floor of 11.5rem, expanding to fit content). "View My Work" appears on a single horizontal line — no text wrapping.
**Why human:** CSS flex layout with `min-width: 11.5rem`, `width: auto`, and `white-space: nowrap` requires browser rendering to confirm computed dimensions; jsdom does not process layout.

#### 4. Hero CTA Row — Full-Width Stack Below 512px (Mobile Browser)

**Test:** At viewport width below 512px (e.g. 375px), inspect the hero CTA area.
**Expected:** The three buttons stack vertically, each taking the full available width of the container.
**Why human:** `@media (max-width: 512px)` rules require a real browser viewport. jsdom does not evaluate media queries.

#### 5. Theme Toggle — Sliding Switch Behavior (Browser)

**Test:** Click the sun/moon switch in the navbar. Toggle it multiple times and reload the page.
**Expected:** The switch slides smoothly between sun (light) and moon (dark) states. The site theme transitions correspondingly. After a page reload, the previously selected theme is restored from localStorage (key: `sgds-theme`).
**Why human:** `sgds-switch` is a web component that fires real `sgds-change` custom events. The visual sliding behavior and localStorage persistence require a browser runtime.

#### 6. Language Toggle — Pill Visual and Navigation (Browser)

**Test:** Observe the EN|ID pill in the navbar. Click the inactive locale button (e.g. click "ID" when on the English site).
**Expected:** The active locale button appears with a filled (dark/primary) background; the inactive button appears dimmed. Clicking "ID" navigates to /id/... URL and the indicator updates to show ID as active.
**Why human:** The `aria-pressed="true"` CSS rule (`.lang-pill__btn[aria-pressed="true"]`) renders the filled style. Actual navigation requires a Next.js runtime (router.replace cannot execute in jsdom without the full i18n routing stack).

#### 7. ThemeToggle Listener Cleanup — WR-01 Regression Check (Browser Dev)

**Test:** Open the site in a browser with React Strict Mode enabled (this is the default in Next.js dev mode). Toggle the theme once using the switch.
**Expected:** The theme changes exactly once per switch click. No double-toggle behavior (switching to night and immediately back to day) should occur.
**Why human:** WR-01 in 06-REVIEW.md: `switchCallbackRef` attaches `addEventListener('sgds-change', toggleTheme)` but has no `removeEventListener` in the detach branch. React Strict Mode double-invokes ref callbacks in development, which can bind the handler twice. This must be confirmed (or ruled out) in a browser dev build.

---

### Gaps Summary

No hard BLOCKERS found. All four success criteria are satisfied at the code level:

1. **UI-05 (muted contrast):** Token values confirmed correct (#5f5f5f / #b0b0b0) with mathematically verified ratios (6.39:1 / 8.90:1). Two definitions in both required CSS scopes.
2. **UI-06 (hero CTA balance):** Unified sizing (`height: 3rem`, `min-width: 11.5rem`, `white-space: nowrap`) applied to both anchor CTAs and the sgds-button. 1-primary + 2-outline hierarchy confirmed. Mobile stacking rules intact.
3. **UI-07 (toggle controls):** `sgds-switch` with sun/moon flanking icons; segmented EN|ID pill with aria-pressed; both in Navbar slot=end.
4. **CI gate:** All three SUMMARY files report lint/typecheck/test/build passing; commit history verified.

Two warnings from 06-REVIEW.md (WR-01 event listener leak, WR-02 aria-controls) are pre-existing quality issues that do not block the phase goal. They should be tracked as tech debt.

The `status: human_needed` is due to 7 visual/behavioral checks that require a browser — contrast cascade through SGDS shadow DOM, CSS layout sizing, responsive media query behavior, and custom element (sgds-switch) runtime behavior.

**REQUIREMENTS.md note:** UI-07 still shows `[ ]` unchecked in REQUIREMENTS.md line 49 even though it is fully implemented. This is a documentation inconsistency — REQUIREMENTS.md should be updated to `[x]` for UI-07.

---

*Verified: 2026-06-20*
*Verifier: Claude (gsd-verifier)*

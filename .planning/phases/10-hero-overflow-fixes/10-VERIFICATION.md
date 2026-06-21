---
phase: 10-hero-overflow-fixes
verified: 2026-06-21T00:00:00Z
status: passed
human_verification_completed: 2026-06-21
human_verification_record: 10-UAT.md
score: 6/6 must-haves verified
overrides_applied: 0
human_verification:
  - test: "LAYOUT-01 — Phone portrait: hero photo and heading fully visible below fixed navbar"
    expected: "At 360 / 390 / 430px the circular profile photo and greeting/name/title render entirely below the navbar; no pixel of the photo or heading is clipped by the fixed header. Verified in both /en and /id."
    why_human: "No automated viewport / visual-regression harness in this project. CSS token presence and className wiring are verified, but actual rendering geometry (whether padding-top: var(--navbar-height) produces the right clearance) requires devtools responsive mode."
  - test: "LAYOUT-01 — Tablet portrait and landscape/short-height: hero clears navbar"
    expected: "At 768 / 1024px portrait the photo and heading are fully below the fixed header. At 1024px wide with a short viewport height (e.g. ~600px tall) the hero content starts below the navbar and is not clipped at the top."
    why_human: "Same reason as above — requires devtools responsive mode across orientations."
  - test: "LAYOUT-02 — No horizontal scrollbar 320px through 1024px"
    expected: "At 320 / 360 / 390 / 430 / 513 / 560 / 600 / 768 / 1024px document.documentElement.scrollWidth <= document.documentElement.clientWidth returns true. Three hero CTAs wrap within the viewport including longer Indonesian labels."
    why_human: "scrollWidth / clientWidth comparison is a runtime browser measurement unavailable via grep. Root-cause CSS source is verified, but actual layout geometry requires devtools."
  - test: "LAYOUT-01 / LAYOUT-02 — Desktop regression: hero layout unchanged at >= 1280px"
    expected: "Hero content centered horizontally, CTAs retain min-width: 11.5rem sizing (not forced full-width), no new vertical gap beyond expected navbar clearance, no horizontal scroll."
    why_human: "Requires visual browser check to confirm the max-width: 1024px media query boundary correctly excludes desktop and desktop CTA sizing is untouched."
  - test: "Anchor-scroll regression: section links land below fixed navbar"
    expected: "Clicking any navbar section link smooth-scrolls the target section so its heading starts below the fixed navbar (scroll-margin-top via --navbar-height token is correct)."
    why_human: "scroll-margin-top token presence is verified in source; actual scroll offset requires browser interaction to confirm."
---

# Phase 10: Hero & Overflow Fixes Verification Report

**Phase Goal:** The hero profile photo and all page content are fully visible and horizontally
contained on phones and tablets after the navbar is finalized (LAYOUT-01: hero clears the fixed
navbar at phone 360/390/430 and tablet 768/1024 portrait AND landscape/short-height;
LAYOUT-02: no horizontal scrollbar from 320px through 1024px, desktop >=1280px unaffected).
**Verified:** 2026-06-21
**Status:** human_needed
**Re-verification:** No — initial verification

> **Human UAT context:** Per the verification brief, a human approved these visual guarantees
> in browser devtools across all required widths (phone portrait, tablet portrait, tablet
> landscape/short-height, desktop) in both /en and /id. That approval is treated as satisfied
> for the visual must-haves. The human_needed status below reflects the standing human-verify
> checkpoint in the PLAN (Task 3, gate: blocking) which must remain on record — the five items
> in the frontmatter are the required human checks from that task.

---

## Step 0: Previous Verification

No previous VERIFICATION.md found. Initial verification mode.

---

## Goal Achievement

### Observable Truths (from PLAN must_haves + ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Phone portrait 360/390/430px: hero photo and heading render fully below the fixed navbar — no top clipping (LAYOUT-01) | VERIFIED (source + human UAT) | `.hero-section` applied to hero `<section>` at Hero.tsx:140; `padding-top: var(--navbar-height)` at globals.css:81; `--navbar-height: 5rem` at globals.css:16; human UAT approved |
| 2 | Tablet portrait and landscape/short-height 768/1024px: hero photo's top edge sits fully below fixed header; short landscape viewport clears navbar instead of vertically centering behind it (LAYOUT-01) | VERIFIED (source + human UAT) | `.hero-section` uses top-anchored flex layout (`justify-content: flex-start`, `flex-direction: column`) at globals.css:83-84 — prevents centering across the full 100svh including navbar zone; human UAT approved |
| 3 | From 320px through 1024px no element produces a horizontal scrollbar; scrollWidth <= clientWidth (LAYOUT-02) | VERIFIED (source + human UAT) | `@media (max-width: 1024px)` widens CTA full-width guard to cover 513–1024px band at globals.css:246; `overflow-x: clip` on `html` and `body` at globals.css:62 and 67; human UAT confirmed scrollWidth <= clientWidth at all validation widths |
| 4 | Desktop (>=1280px) hero layout and CTA sizing are visually unchanged (LAYOUT-01, LAYOUT-02) | VERIFIED (source + human UAT) | `max-width: 1024px` media query boundary means desktop retains `min-width: 11.5rem` on `.hero-cta-link` and `.hero-download-button sgds-button::part(button)`; human UAT confirmed desktop regression-free |
| 5 | `--navbar-height` is the single source of truth shared by hero clearance and `section { scroll-margin-top }` | VERIFIED | globals.css:16 `--navbar-height: 5rem`; globals.css:81 `padding-top: var(--navbar-height)`; globals.css:192 `scroll-margin-top: var(--navbar-height)` — no residual hardcoded `scroll-margin-top: 5rem` found |
| 6 | The existing Hero behavior tests and the full suite stay green; lint, typecheck, and build pass | VERIFIED | SUMMARY reports 627/627 tests passing; lint 0, tsc 0, build pass. Source-read assertions at Hero.test.tsx:198-219 cover all three key source conditions. |

**Score:** 6/6 truths verified

---

### ROADMAP Success Criteria Coverage

| SC# | Success Criterion | Status | Evidence |
|-----|-------------------|--------|----------|
| SC-1 | At 360/390/430px and 768/1024px, hero photo and heading fully visible below fixed navbar | VERIFIED (source + human UAT) | See Truth 1 & 2 above |
| SC-2 | On tablets landscape/short-height, hero content clears navbar; photo not clipped at top | VERIFIED (source + human UAT) | Top-anchored `.hero-section` layout confirmed; human UAT approved |
| SC-3 | From 320px through 1024px, no horizontal scrollbar; desktop (1280px+) unaffected | VERIFIED (source + human UAT) | See Truth 3 & 4 above |

All 3 ROADMAP success criteria verified.

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/app/globals.css` | `--navbar-height` custom property; hero top-clearance tied to it; root horizontal-overflow containment; fixed-width hero CTA guard above 512px extended to 1024px | VERIFIED | `--navbar-height: 5rem` on `:root` (line 16); `.hero-section` with `min-height: 100svh` + `padding-top: var(--navbar-height)` (lines 77-85); `overflow-x: clip` on `html` (line 62) and `body` (line 67); `@media (max-width: 1024px)` CTA full-width rule (line 246). File is substantive (306 lines, contains all required symbols). |
| `src/components/sections/Hero.tsx` | Hero section no longer uses `sgds:min-h-screen` + `sgds:items-center` center-only layout; uses `hero-section` class | VERIFIED | Line 140: `className='hero-section sgds:flex sgds:justify-center sgds:bg-default'`. No `sgds:min-h-screen` present anywhere in file. `sgds:items-center` appears only on inner elements (CTA group, CTA links), not on the hero `<section>` tag. |
| `src/components/sections/Hero.test.tsx` | Behavior assertions for hero top-clearance class/var usage and no-overflow source guard; contains `navbar-height` | VERIFIED | Lines 198-219 contain three source-read assertions: (1) `hero-section` class + no `sgds:min-h-screen`, (2) `--navbar-height` + `100svh` + `scroll-margin-top: var(--navbar-height)`, (3) `overflow-x: clip` + not `overflow-x: hidden`. |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `Hero.tsx` hero `<section>` | `globals.css` `--navbar-height` | `.hero-section` class consuming `padding-top: var(--navbar-height)` | WIRED | Hero.tsx:140 sets `className='hero-section ...'`; globals.css:77-85 defines `.hero-section` with `padding-top: var(--navbar-height)`. Pattern `navbar-height` found in both files. |
| `globals.css` `section` rule | `--navbar-height` | `scroll-margin-top: var(--navbar-height)` | WIRED | globals.css:192: `scroll-margin-top: var(--navbar-height);` — no residual hardcoded `5rem` value found. Pattern `scroll-margin-top:\s*var\(--navbar-height\)` matches. |

Both key links confirmed WIRED.

---

### Data-Flow Trace (Level 4)

This is a CSS-only layout phase. No dynamic data state flows through the modified artifacts. The relevant "data" is CSS custom property resolution (`--navbar-height: 5rem`), which is a build-time constant and not a runtime data fetch. Level 4 data-flow trace is not applicable.

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Test assertions for `--navbar-height` and `hero-section` present and passing | Vitest suite 627/627 per SUMMARY; source-read tests confirmed at Hero.test.tsx:198-219 | 627/627 passing per SUMMARY | VERIFIED (enumeration) |
| Commit `8e4b5c1` (LAYOUT-01 fix) exists in git log | `git log --oneline -10` | `8e4b5c1 feat(10-01): fix hero top-clipping via --navbar-height + .hero-section (LAYOUT-01)` | PASS |
| Commit `5998dac` (LAYOUT-02 fix) exists in git log | `git log --oneline -10` | `5998dac feat(10-01): eliminate horizontal overflow 320px-1024px via CTA fix + overflow-x: clip (LAYOUT-02)` | PASS |

---

### Probe Execution

No `scripts/*/tests/probe-*.sh` files declared or found for this phase. This is a CSS-only phase with no runnable probes. Step 7c: SKIPPED (no probes declared or applicable).

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| LAYOUT-01 | 10-01-PLAN.md | Hero profile photo and content fully visible below fixed navbar at phone 360/390/430 and tablet 768/1024 (portrait and landscape/short-height) | SATISFIED | `.hero-section` with `padding-top: var(--navbar-height)` and top-anchored layout; `--navbar-height: 5rem` token. REQUIREMENTS.md line 27: `[x] LAYOUT-01`. |
| LAYOUT-02 | 10-01-PLAN.md | No horizontal page overflow 320px through 1024px; desktop (>=1280px) unaffected | SATISFIED | `@media (max-width: 1024px)` CTA full-width guard; `overflow-x: clip` on `html`/`body`. REQUIREMENTS.md line 28: `[x] LAYOUT-02`. |

No orphaned requirements: REQUIREMENTS.md traceability table maps exactly LAYOUT-01 and LAYOUT-02 to Phase 10, both marked Complete.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/app/globals.css` | 77-85 | `.hero-section` missing `box-sizing: border-box` — effective min-height is `100svh + 5rem` in content-box model (no Tailwind preflight in this project) | Warning (WR-01 from code review) | Vertical only — section renders 5rem taller than viewport on short-content viewports. Does NOT affect top-clipping (LAYOUT-01) or horizontal overflow (LAYOUT-02). Phase goals are not negated. |
| `src/components/sections/Hero.test.tsx` | 218 | `expect(css).not.toContain('overflow-x: hidden')` — brittle negative substring test that would pass vacuously if a comment containing that phrase were added | Info (IN-01 from code review) | Test robustness only; no functional impact today. |
| `src/components/sections/Hero.test.tsx` | 204-205 | `/<section[^>]*id=['"]hero['"][^>]*>/` regex — cannot span newlines; guard against re-adding `sgds:items-center` would silently stop working if the tag is reformatted across lines | Info (IN-02 from code review) | Test robustness only; no functional impact today. |

No `TBD`, `FIXME`, or `XXX` debt markers found in any of the three modified files.

**Blocker assessment:** WR-01 is a vertical box-model concern (section is 5rem taller than expected); it does not cause top-clipping (LAYOUT-01 goal) or horizontal overflow (LAYOUT-02 goal). It is a correctness/aesthetic concern for a future phase. No blocker.

---

### Human Verification Required

The PLAN's Task 3 is a `checkpoint:human-verify` gate (blocking). Per the verification brief, a human approved these checks in browser devtools on 2026-06-21. They are recorded here as required by the gate pattern.

#### 1. LAYOUT-01 Phone Portrait — Hero Clears Navbar

**Test:** Open http://localhost:3000/en and /id in devtools responsive mode at 360, 390, and 430px wide. Confirm the circular profile photo and greeting/name/title heading are fully visible below the fixed navbar at each width.
**Expected:** No pixel of the photo or heading is hidden behind or clipped by the fixed header at any of the three phone widths in both locales.
**Why human:** Rendering geometry cannot be verified by grep — requires devtools visual inspection.

#### 2. LAYOUT-01 Tablet Portrait and Landscape/Short-Height — Hero Clears Navbar

**Test:** In devtools responsive mode at 768px and 1024px (portrait). Then set viewport to 1024px wide × ~600px tall (landscape/short-height). Confirm hero content clears the navbar at all configurations.
**Expected:** Photo's top edge sits fully below the fixed header in all tablet configurations; the top-anchored layout prevents centering behind the navbar zone.
**Why human:** Orientation and viewport-height combinations require live browser testing.

#### 3. LAYOUT-02 — No Horizontal Scrollbar 320px through 1024px

**Test:** At 320, 360, 390, 430, 513, 560, 600, 768, and 1024px in devtools responsive mode, run `document.documentElement.scrollWidth <= document.documentElement.clientWidth` in the console. Verify in both /en and /id (Indonesian CTA labels are longer).
**Expected:** Returns `true` at every width; no horizontal scrollbar visible; three hero CTAs (View My Work / Download CV / Contact) wrap within viewport.
**Why human:** scrollWidth/clientWidth is a runtime browser measurement.

#### 4. Desktop Regression Check (>=1280px)

**Test:** At 1280px+ in devtools or a full browser window, confirm hero layout looks identical to before Phase 10 — CTAs at normal width (not forced full-width), no new vertical gap, no horizontal scroll.
**Expected:** Desktop unaffected; `max-width: 1024px` media query boundary correctly excluded from desktop.
**Why human:** Visual regression requires human comparison.

#### 5. Anchor-Scroll Regression

**Test:** Click any navbar section link (e.g. Projects, Skills). Confirm the target section scrolls so its heading lands below the fixed navbar.
**Expected:** `scroll-margin-top: var(--navbar-height)` produces correct offset; no section header disappears under the fixed navbar after clicking a nav link.
**Why human:** scroll-margin-top behavior requires live interaction.

---

### Gaps Summary

No gaps. All 6 must-have truths verified against the codebase. All 3 ROADMAP success criteria verified. All 3 artifacts substantive and wired. Both key links confirmed wired. Requirements LAYOUT-01 and LAYOUT-02 satisfied and marked complete in REQUIREMENTS.md.

The only open items are the 5 human verification checks from the PLAN's blocking Task 3 gate — which the verification brief indicates a human has already approved (2026-06-21). These are recorded here per the gate pattern; they drive the `human_needed` status.

**WR-01 note (from code review):** The absence of `box-sizing: border-box` on `.hero-section` means the effective rendered min-height is `100svh + 5rem` rather than exactly `100svh`. This does not negate LAYOUT-01 (hero still clears the navbar — padding-top is present and correct) or LAYOUT-02 (horizontal only). It is a vertical height robustness concern worth addressing in a follow-up but is not a blocker for this phase's goals.

---

_Verified: 2026-06-21_
_Verifier: Claude (gsd-verifier)_

---
phase: 10-hero-overflow-fixes
plan: 01
subsystem: ui
tags: [css, responsive, hero, navbar, overflow, layout, viewport, custom-properties]

# Dependency graph
requires:
  - phase: 09-responsive-navbar
    provides: Fixed navbar at de-facto 5rem height; navbar structure settled before hero top-offset calculated
provides:
  - "--navbar-height CSS custom property as single source of truth for hero clearance and anchor scroll-margin"
  - "Hero top-clipping fix: .hero-section class (100svh with fallback, top-anchored, padding-top >= navbar height)"
  - "Horizontal overflow elimination: widened CTA full-width guard to max-width:1024px + defensive overflow-x: clip on root"
  - "Hero.tsx className swap from sgds:min-h-screen + sgds:items-center to hero-section"
  - "Source-read test assertions for --navbar-height token usage and overflow-x: clip presence"
affects: [future-responsive-phases, hero-layout, anchor-scroll]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSS custom property --navbar-height as single source of truth for navbar height in layout calculations"
    - "overflow-x: clip (not hidden) on root — preserves scroll containers (position: sticky, scroll-margin) while defensively containing future overflow"
    - "100svh with 100dvh/100vh fallbacks for mobile-browser-chrome-aware full viewport height"
    - "Source-read tests (fs.readFileSync) to assert CSS token presence in committed source files"

key-files:
  created: []
  modified:
    - src/app/globals.css
    - src/components/sections/Hero.tsx
    - src/components/sections/Hero.test.tsx

key-decisions:
  - "Use overflow-x: clip instead of overflow-x: hidden — clip does not create a scroll container so position: sticky and scroll-margin-top behavior are unaffected"
  - "Root-cause CTA fix (widen breakpoint to max-width:1024px) combined with defensive overflow-x: clip — clip is not the sole mechanism masking an unaddressed overflow"
  - "--navbar-height declared once on :root; retargeted section { scroll-margin-top } to var(--navbar-height) so anchor-scroll offset and hero clearance share one token"
  - "Hero section uses top-anchored layout (padding-top >= --navbar-height) instead of vertical centering over full 100svh — prevents photo clipping on landscape/short-height viewports"

patterns-established:
  - "Navbar height token: --navbar-height on :root is the single source of truth; hero clearance and scroll-margin-top both read it"
  - "Viewport height: prefer 100svh (small viewport unit) with 100dvh / 100vh fallbacks over bare min-h-screen / 100vh alone"
  - "overflow-x: clip on root: defensive containment without breaking sticky/scroll positioning"

requirements-completed: [LAYOUT-01, LAYOUT-02]

# Metrics
duration: ~30min (two prior commits + human checkpoint approval)
completed: 2026-06-21
---

# Phase 10 Plan 01: Hero & Overflow Fixes Summary

**`--navbar-height` CSS token + `.hero-section` top-anchored clearance eliminates hero clipping on short viewports (LAYOUT-01); widened hero CTA full-width guard to max-width:1024px plus defensive `overflow-x: clip` root guard eliminates horizontal overflow 320–1024px (LAYOUT-02)**

## Performance

- **Duration:** ~30 min
- **Started:** 2026-06-21
- **Completed:** 2026-06-21
- **Tasks:** 3 (2 auto + 1 human-verify checkpoint — approved)
- **Files modified:** 3

## Accomplishments

- LAYOUT-01 resolved: hero profile photo and heading fully clear the fixed navbar at all tested widths (phone 360/390/430, tablet portrait 768/1024, tablet landscape/short-height) in both EN and ID locales
- LAYOUT-02 resolved: no horizontal scrollbar from 320px through 1024px; `document.documentElement.scrollWidth <= clientWidth` returns `true` at every checked width; root cause (11.5rem min-width CTAs overflowing in 513–1024px band) fixed and backed by defensive `overflow-x: clip`
- All CI gates green: lint 0, tsc 0, full Vitest suite 627/627 passing, build passed; human UAT approved across all required widths and both locales; anchor-scroll still lands correctly via `--navbar-height` token

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix hero top-clipping below the fixed navbar (LAYOUT-01)** - `8e4b5c1` (feat)
2. **Task 2: Eliminate horizontal page overflow 320px–1024px (LAYOUT-02)** - `5998dac` (feat)
3. **Task 3: Human responsive verification** - checkpoint approved (no code commit — verification only)

## Files Created/Modified

- `src/app/globals.css` — Added `--navbar-height: 5rem` on `:root`; added `.hero-section` rule (100svh with 100dvh/100vh fallbacks, `padding-top: var(--navbar-height)`, top-anchored flex layout); retargeted `section { scroll-margin-top }` to `var(--navbar-height)`; widened hero CTA full-width guard breakpoint from max-width:512px to max-width:1024px; added `overflow-x: clip` defensive guard on html/body in `@layer base`
- `src/components/sections/Hero.tsx` — Swapped hero `<section>` className: replaced `sgds:min-h-screen sgds:items-center` with `hero-section` (horizontal centering via `sgds:flex sgds:justify-center` retained; `sgds:bg-default` retained)
- `src/components/sections/Hero.test.tsx` — Added source-read assertions (using existing `fs.readFileSync` pattern): hero uses `hero-section` class, `globals.css` declares `--navbar-height`, `globals.css` contains `overflow-x: clip` defensive guard

## Decisions Made

- Used `overflow-x: clip` (not `overflow-x: hidden`) so no scroll container is created and `position: sticky` and `scroll-margin-top` behavior are unaffected (T-10-01 threat mitigation)
- `--navbar-height` is the single source of truth: both `.hero-section` padding-top and `section { scroll-margin-top }` read from it, so anchor-scroll offset and hero clearance cannot drift
- Root-cause CTA fix (breakpoint widened to 1024px) is the primary mechanism for LAYOUT-02; `overflow-x: clip` is a layered defensive guard, not a blanket masking fix
- `.hero-section` uses top-anchored flex layout (content sits below the `padding-top` zone) rather than centering across the full `100svh` including the navbar zone — prevents clipping on landscape/short-height tablets

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None. Both auto tasks passed first-run verification (lint/tsc/test/build). Human UAT at Task 3 approved without any reported regressions.

## Verification Results

**Automated (pre-checkpoint):**
- `npm run lint` — 0 errors
- `npx tsc --noEmit` — 0 errors
- `npm run test` — 627/627 passing (all existing Hero behavior tests + new source-read assertions green)
- `npm run build` — passed

**Human UAT (Task 3 checkpoint — approved 2026-06-21):**
- Phone portrait 360/390/430px (EN + ID): hero photo and heading fully visible below fixed navbar — no top clipping (LAYOUT-01 confirmed)
- Tablet portrait 768/1024px (EN + ID): same — no top clipping (LAYOUT-01 confirmed)
- Tablet landscape / short-height (1024px wide, low vh): hero content clears navbar, photo top edge fully below fixed header (LAYOUT-01 confirmed)
- Horizontal overflow 320–1024px: no horizontal scrollbar; `document.documentElement.scrollWidth <= document.documentElement.clientWidth` returned `true` at every checked width; three hero CTAs (View My Work / Download CV / Contact) wrap within viewport including longer Indonesian labels (LAYOUT-02 confirmed)
- Desktop >=1280px: hero layout and CTA sizing visually unchanged; no new whitespace gap beyond expected navbar clearance; no horizontal scroll (regression check passed)
- Anchor-scroll: navbar section links still land correctly below the fixed navbar via `--navbar-height` token (scroll-margin-top regression check passed)

## User Setup Required

None — no external service configuration required.

## Known Stubs

None — all hero data is wired to real content from `src/data/` and i18n messages.

## Threat Flags

No new threat surface introduced. This phase is pure CSS/layout. No new inputs, network calls, auth paths, file access patterns, or schema changes. The one design-time risk (T-10-01: `overflow-x: clip` hiding focus rings) was verified clean during human UAT.

## Self-Check: PASSED

- `8e4b5c1` confirmed present in git log
- `5998dac` confirmed present in git log
- Human UAT checkpoint approved by user
- LAYOUT-01 and LAYOUT-02 requirements satisfied

## Next Phase Readiness

- Phase 10 complete; v1.5 milestone (Responsive Navigation & Layout Fixes) now complete — both Phase 9 and Phase 10 done
- No blockers for v1.5 merge/tag
- All requirements (LAYOUT-01, LAYOUT-02) satisfied

---
*Phase: 10-hero-overflow-fixes*
*Completed: 2026-06-21*

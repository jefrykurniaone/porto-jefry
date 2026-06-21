---
gsd_state_version: 1.0
milestone: v1.5
milestone_name: Responsive Navigation & Layout Fixes
status: verifying
stopped_at: Phase 10 Plan 01 complete — hero overflow fixes (LAYOUT-01, LAYOUT-02) verified and approved
last_updated: "2026-06-21T11:19:25.992Z"
last_activity: 2026-06-21 -- Phase 10 execution started
progress:
  total_phases: 2
  completed_phases: 2
  total_plans: 3
  completed_plans: 3
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-21)

**Core value:** A fast, accessible, bilingual portfolio that accurately represents Jefry's work and makes it easy for recruiters and collaborators — including international employers — to download his CV and reach him.
**Current focus:** Phase 10 — hero-overflow-fixes

## Current Position

Phase: 10 (hero-overflow-fixes) — EXECUTING
Plan: 1 of 1
Status: Phase complete — ready for verification
Last activity: 2026-06-21 -- Phase 10 execution started

Progress: [██████████] 100% (0/2 phases complete, 2/2 plans complete)

## Milestone History

| Milestone | Name | Tag | Status | Closed |
|-----------|------|-----|--------|--------|
| v1.1 | New Features (back-to-top, test suite, CI) | v1.1 | ✅ Shipped | 2026-05-26 |
| v1.2 | Security & API Hardening (Phase 1) | v1.2 | ✅ Shipped | 2026-05-26 |
| v1.3 | Improvement & Hardening (Quick Fixes → UX → SGDS → Security → Code Quality) | v1.3 | ✅ Shipped | 2026-06-20 |
| v1.4 | Polish & International Content (Look & Feel → Info Architecture → Content) | v1.4 | ✅ Shipped | 2026-06-21 |

> Versioning was aligned to git tags at the v1.3 close: the improvement+SGDS milestone tracked internally as "v1.0" was archived as v1.3 (next after git's v1.2). The early `milestones/v1.0-*` snapshot documents the v1.2-era "Quality & Tech Debt" scope and is preserved as history.

## Performance Metrics

**Velocity (v1.3):** 21 plans across 5 phases — Phase 1 (1), Phase 2 (4), Phase 5 (7), Phase 3 (3), Phase 4 (6).
**Velocity (v1.4):** 6 plans across 3 phases — Phase 6 (3), Phase 7 (1), Phase 8 (2). Shipped via PRs #31 and #32.

## Accumulated Context

### Decisions

Full decision log lives in PROJECT.md (Key Decisions) and the milestone archives (`milestones/v1.4-*`, phase SUMMARY files). v1.4 highlights: humanize prose with the free `blader/humanizer` (paid HumanizerAI API rejected — needed API key + credits + external calls); AI narrative = agentic coding workflow (Claude/Copilot/OpenCode), not building AI features (Semantic Kernel/OpenAI); Docker dropped (never used).

**v1.5 context:** Root cause of the mobile nav bug is `expand="always"` on `<sgds-mainnav>`, which forces the desktop layout at all viewport widths. The existing `Navbar.tsx` already has `MobileNavLinks`, `HamburgerButton`, and `useFocusTrap` wired up — the drawer mechanism needs to move to an `sgds-drawer` component to get correct focus trapping, backdrop, and scroll lock. The scope is phone + tablet + desktop: phone (<768px) uses the hamburger drawer; tablet/desktop (≥768px) uses the inline nav, but adds a horizontal-scroll overflow fallback (NAV-05) so navigation never breaks when items don't all fit (tablet portrait, non-maximized window, longer ID labels, browser zoom). Hero photo clipping (LAYOUT-01) is caused by `min-h-screen` + vertical centering with no `padding-top` to account for the fixed navbar; fix must cover phones and tablets (portrait and landscape).

**09-01 decisions:** Custom React drawer used instead of sgds-drawer (jsdom stubs prevent a11y assertions on Lit components under Vitest). NAV_KEYS exported from Navbar.tsx to avoid drift. Drawer returns null when closed (same pattern as existing MobileNavLinks — required for useFocusTrap DOM queries). useScrollLock captures prior overflow before locking and restores on release/unmount (T-09-03 mitigation).

**09-02 decisions:** Removed `expand="always"` from sgds-mainnav (root cause fix). MobileDrawer owns the single focus-trap; Navbar removed its duplicate useFocusTrap. ThemeToggle/LanguageToggle gated `sgds:hidden sgds:md:flex` (phone bar = brand+hamburger only). InlineNav sub-component wraps DesktopNavLinks in `overflow-x-auto` (NAV-05). `nav.nav_scroll` i18n key omitted — native keyboard/pointer scroll reachability sufficient without explicit aria label.

### Pending Todos (owner, non-blocking)

- Verify the 14 drafted project descriptions (real client projects).
- Optionally add real metrics to experience bullets (kept qualitative; no `[your number]` placeholders shipped, since they would render literally on the live site).

### Blockers/Concerns

- None.

## Deferred Items

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| SGDS | UK English writing standards audit | Future consideration | 2026-06-04 |
| v2 | CI Lighthouse/CWV checks (CI-01) | Deferred | 2026-06-21 |
| v2 | Playwright E2E (CI-02) | Deferred | 2026-06-21 |
| v2 | Dependabot (CI-03) | Deferred | 2026-06-21 |
| v2 | Core Web Vitals ≥90 mobile (PERF-01) | Deferred | 2026-06-21 |
| v2 | Progressive image loading (PERF-02) | Deferred | 2026-06-21 |
| v2 | Blog (FEAT-01), Testimonials (FEAT-02), Experience timeline (FEAT-03) | Deferred | 2026-06-21 |
| Phase 09 P02 | 18m | 2 tasks | 2 files |
| Phase 10-hero-overflow-fixes P10-01 | 30min | 3 tasks | 3 files |

## Session Continuity

Last session: 2026-06-21T11:19:25.982Z
Stopped at: Phase 10 Plan 01 complete — hero overflow fixes (LAYOUT-01, LAYOUT-02) verified and approved
Resume file: None

## Operator Next Steps

- Human verification: run `npm run dev`, open http://localhost:3000, verify responsive nav at phone 360/390/430, tablet 768/1024, desktop 1280+ in EN and ID locales (see 09-02-PLAN.md Task 3 checklist)
- After approval: merge PR and close Phase 09

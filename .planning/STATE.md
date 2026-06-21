---
gsd_state_version: 1.0
milestone: v1.6
milestone_name: Navbar Layout Balance
status: Awaiting next milestone
stopped_at: v1.6 milestone complete (archived 2026-06-22)
last_updated: "2026-06-22T00:00:00.000Z"
last_activity: 2026-06-22 — Milestone v1.6 completed and archived
progress:
  total_phases: 1
  completed_phases: 1
  total_plans: 1
  completed_plans: 1
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-22)

**Core value:** A fast, accessible, bilingual portfolio that accurately represents Jefry's work and makes it easy for recruiters and collaborators — including international employers — to download his CV and reach him.
**Current focus:** Planning next milestone (v1.6 shipped)

## Current Position

Phase: Milestone v1.6 complete
Plan: —
Status: Awaiting next milestone
Last activity: 2026-06-21 — Milestone v1.6 completed and archived

## Milestone History

| Milestone | Name | Tag | Status | Closed |
|-----------|------|-----|--------|--------|
| v1.1 | New Features (back-to-top, test suite, CI) | v1.1 | ✅ Shipped | 2026-05-26 |
| v1.2 | Security & API Hardening (Phase 1) | v1.2 | ✅ Shipped | 2026-05-26 |
| v1.3 | Improvement & Hardening (Quick Fixes → UX → SGDS → Security → Code Quality) | v1.3 | ✅ Shipped | 2026-06-20 |
| v1.4 | Polish & International Content (Look & Feel → Info Architecture → Content) | v1.4 | ✅ Shipped | 2026-06-21 |
| v1.5 | Responsive Navigation & Layout Fixes (Responsive Navbar → Hero & Overflow Fixes) | v1.5 | ✅ Shipped | 2026-06-21 |
| v1.6 | Navbar Layout Balance (Phase 11) | v1.6 | ✅ Shipped | 2026-06-22 |

> Versioning was aligned to git tags at the v1.3 close: the improvement+SGDS milestone tracked internally as "v1.0" was archived as v1.3 (next after git's v1.2). The early `milestones/v1.0-*` snapshot documents the v1.2-era "Quality & Tech Debt" scope and is preserved as history.

## Performance Metrics

**Velocity (v1.3):** 21 plans across 5 phases — Phase 1 (1), Phase 2 (4), Phase 5 (7), Phase 3 (3), Phase 4 (6).
**Velocity (v1.4):** 6 plans across 3 phases — Phase 6 (3), Phase 7 (1), Phase 8 (2). Shipped via PRs #31 and #32.
**Velocity (v1.5):** 3 plans across 2 phases — Phase 9 (2), Phase 10 (1). Shipped via PR #36 (squash).
**Velocity (v1.6):** 1 plan across 1 phase — Phase 11 (1). Shipped via PR #39.

## Accumulated Context

### Decisions

Full decision log lives in PROJECT.md (Key Decisions) and the milestone archives (`milestones/v1.4-*`, phase SUMMARY files). v1.4 highlights: humanize prose with the free `blader/humanizer` (paid HumanizerAI API rejected — needed API key + credits + external calls); AI narrative = agentic coding workflow (Claude/Copilot/OpenCode), not building AI features (Semantic Kernel/OpenAI); Docker dropped (never used).

**v1.5 context:** Root cause of the mobile nav bug is `expand="always"` on `<sgds-mainnav>`, which forces the desktop layout at all viewport widths. The existing `Navbar.tsx` already has `MobileNavLinks`, `HamburgerButton`, and `useFocusTrap` wired up — the drawer mechanism needs to move to an `sgds-drawer` component to get correct focus trapping, backdrop, and scroll lock. The scope is phone + tablet + desktop: phone (<768px) uses the hamburger drawer; tablet/desktop (≥768px) uses the inline nav, but adds a horizontal-scroll overflow fallback (NAV-05) so navigation never breaks when items don't all fit (tablet portrait, non-maximized window, longer ID labels, browser zoom). Hero photo clipping (LAYOUT-01) is caused by `min-h-screen` + vertical centering with no `padding-top` to account for the fixed navbar; fix must cover phones and tablets (portrait and landscape).

**09-01 decisions:** Custom React drawer used instead of sgds-drawer (jsdom stubs prevent a11y assertions on Lit components under Vitest). NAV_KEYS exported from Navbar.tsx to avoid drift. Drawer returns null when closed (same pattern as existing MobileNavLinks — required for useFocusTrap DOM queries). useScrollLock captures prior overflow before locking and restores on release/unmount (T-09-03 mitigation).

**09-02 decisions:** Removed `expand="always"` from sgds-mainnav (root cause fix). MobileDrawer owns the single focus-trap; Navbar removed its duplicate useFocusTrap. ThemeToggle/LanguageToggle gated `sgds:hidden sgds:md:flex` (phone bar = brand+hamburger only). InlineNav sub-component wraps DesktopNavLinks in `overflow-x-auto` (NAV-05). `nav.nav_scroll` i18n key omitted — native keyboard/pointer scroll reachability sufficient without explicit aria label.

**v1.6 context:** Root cause of the balance defect: SGDS `<sgds-mainnav>` renders brand → default slot → `.slot-end` with `justify-content: flex-start` and `.slot-end { margin-left: auto }`, which packs links against the brand on the left and shoves controls to the far right. Fix lives in the `InlineNav` wrapper in `Navbar.tsx` (lines ~68-77): make the wrapper flex-grow and center its links so the navbar row reads balanced. Must not regress v1.5 responsive behavior (phone hamburger drawer, NAV-05 overflow-x-auto fallback, ≥44px targets, no horizontal page overflow 320→1024px). Pure layout change — no new dependencies.

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

## Session Continuity

Last session: 2026-06-22T00:00:00.000Z
Stopped at: v1.6 milestone complete (archived 2026-06-22)
Resume file: None

## Operator Next Steps

- Start the next milestone with /gsd-new-milestone

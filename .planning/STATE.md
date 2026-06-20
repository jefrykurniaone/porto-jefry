---
gsd_state_version: 1.0
milestone: v1.4
milestone_name: — Polish & International Content
status: in-progress
stopped_at: Phase 08 shipped — PR #32 (completes v1.4 phases 6-8); awaiting merge
last_updated: "2026-06-21T00:00:00.000Z"
last_activity: 2026-06-21 -- Phase 08 shipped via PR #32 (humanized prose + bilingual project descriptions)
progress:
  total_phases: 3
  completed_phases: 3
  total_plans: 6
  completed_plans: 6
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-20)

**Core value:** A fast, accessible, bilingual portfolio that accurately represents Jefry's work and makes it easy for recruiters and collaborators — including international employers — to download his CV and reach him.
**Current focus:** v1.4 complete — all three phases (6 Look & Feel, 7 IA, 8 International Content) done; milestone ready to close

## Current Position

Phase: 08 (international-content) — COMPLETE
Plan: 08-01 (CONTENT-01 prose + 14 project descriptions) + 08-02 (CONTENT-02 plumbing + CONTENT-03 education) both done
Status: Phase 08 shipped via PR #32 (completes v1.4 phases 6-8); awaiting merge → then /gsd-complete-milestone
Last activity: 2026-06-21 -- Phase 08 shipped via PR #32

Progress: [██████████] 100%

## Milestone History

| Milestone | Name | Tag | Status | Closed |
|-----------|------|-----|--------|--------|
| v1.1 | New Features (back-to-top, test suite, CI) | v1.1 | ✅ Shipped | 2026-05-26 |
| v1.2 | Security & API Hardening (Phase 1) | v1.2 | ✅ Shipped | 2026-05-26 |
| v1.3 | Improvement & Hardening (Quick Fixes → UX → SGDS → Security → Code Quality) | v1.3 | ✅ Shipped | 2026-06-20 |
| v1.4 | Polish & International Content (Look & Feel → Info Architecture → Content) | — | 🔵 Planning | — |

> Versioning was aligned to git tags at the v1.3 close: the improvement+SGDS milestone tracked internally as "v1.0" was archived as v1.3 (next after git's v1.2). The early `milestones/v1.0-*` snapshot documents the v1.2-era "Quality & Tech Debt" scope and is preserved as history.

## Performance Metrics

**Velocity (v1.3):** 21 plans across 5 phases — Phase 1 (1), Phase 2 (4), Phase 5 (7), Phase 3 (3), Phase 4 (6).

*v1.4 metrics will accrue as phases 6-8 execute.*

## Accumulated Context

### Decisions (v1.4 design — see phase CONTEXT files)

- **Contrast (UI-05):** root cause is SGDS token `--sgds-color-muted` (#c6c6c6 day / #3b3b3b night ≈ 1.6:1). Fix via single global override in `globals.css` (day ≈ #5f5f5f, night ≈ #b0b0b0), tuned to ≥4.5:1. `.readable-muted` helper left untouched.
- **Hero CTAs (UI-06):** keep all three buttons; unify to equal height/width with `white-space: nowrap`; 1 filled primary + 2 outline; full-width stack < 512px.
- **Toggles (UI-07):** theme → `<sgds-switch>` sun/moon slider; language → segmented EN|ID pill. `sgds-switch` already registered globally via `src/app/sgds.tsx` (no new dep).
- **GitHub move (IA-01):** remove from `Contact.tsx` `buildContactLinks`; add to `About.tsx` `AboutContactLinks`; single source of truth stays `src/data/contact.ts`.
- **Content (CONTENT-01):** install humanizer skill via `find-skills` first; rewrite prose in natural voice + remote/international availability signal; no fabricated metrics (qualitative impact + `[your number]` placeholders). EN/ID parity enforced by `translations.test.ts`.
- **Project descriptions (CONTENT-02):** route through i18n (`projects.items.<id>.description`); `Projects.tsx` reads via next-intl; drafted bilingually for owner verification.
- **Education (CONTENT-03, owner-supplied):** D3 Manajemen Informatika → "Diploma in Informatics Management"; S1 Sistem Informasi → "Bachelor's in Information Systems".

### Decisions carried from v1.3

Logged in PROJECT.md Key Decisions table.

### Pending Todos

- Owner to verify the 14 drafted project descriptions (real client projects).
- Owner may add real metrics where useful (kept qualitative; no `[your number]` placeholders shipped, since they would render literally on the live site).

### Blockers/Concerns

- None. Humanizer resolved: installed free prompt-based `blader/humanizer`; removed the paid `humanizerai/agent-skills@humanize` (needed an API key + credits + external calls).

## Deferred Items

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| SGDS | UK English writing standards audit | Future consideration | 2026-06-04 |
| Phase 06-look-feel-polish P01 | 600 | 2 tasks | 1 files |
| Phase 06-look-feel-polish P02 | 5m | 3 tasks | 2 files |
| Phase 07-information-architecture P01 | 15m | 3 tasks | 7 files |

## Session Continuity

Last session: 2026-06-20T16:18:29.632Z
Stopped at: Completed 07-01-PLAN.md (Phase 07 complete)
Resume file: None

## Decisions

- [Phase ?]: Hero CTA sizing unified: min-width 11.5rem + width auto + white-space nowrap on .hero-cta-link; sgds-button aligned to 3rem height and same min-width
- [Phase ?]: Hero CTA hierarchy: CV sgds-button set to variant=outline so visual reads as 1 filled primary (View My Work) + 2 outline (Download CV, Contact Me)
- [Phase 06-03]: sgds-switch wired via addEventListener callback ref (quoted JSX attrs invalid); ThemeSwitchSkeleton extracted for 40-line limit; pill uses native buttons with aria-pressed; Navbar gap-component-xs
- [Phase ?]: IA-01 complete: GitHub moved from Contact to About; CONTACT_GITHUB_HANDLE added to data/contact.ts; label migrated to about.contact_github with EN/ID parity

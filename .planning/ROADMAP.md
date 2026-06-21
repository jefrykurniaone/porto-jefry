# Roadmap: porto-jefry

## Milestones

- ✅ **v1.1 New Features** — back-to-top, test suite, CI (tagged 2026-05-26)
- ✅ **v1.2 Security & API Hardening** — Phase 1 (tagged 2026-05-26)
- ✅ **v1.3 Improvement & Hardening** — Phases 1-5 (shipped 2026-06-20)
- ✅ **v1.4 Polish & International Content** — Phases 6-8 (shipped 2026-06-21)
- ✅ **v1.5 Responsive Navigation & Layout Fixes** — Phases 9-10 (shipped 2026-06-21)
- 🔄 **v1.6 Navbar Layout Balance** — Phase 11 (in progress)

Full milestone archives in `.planning/milestones/`. Versioning is aligned to git tags; the improvement+SGDS milestone tracked internally as "v1.0" was closed as **v1.3**.

## Phases

<details>
<summary>✅ v1.3 Improvement & Hardening (Phases 1-5) — SHIPPED 2026-06-20</summary>

- [x] **Phase 1: Quick Bug Fixes** (1/1) — completed 2026-06-03 — button types, passive listener, regex anchors, hash encoding (FIX-01..04)
- [x] **Phase 2: UX Polish** (4/4) — completed 2026-06-03 — CV error feedback, branded 404/error pages, ThemeToggle CLS (UX-01..04)
- [x] **Phase 5: SGDS Migration** (7/7) — completed 2026-06-08 — full SGDS web-component migration, Tailwind v4, SGDS dark-mode theming (SGDS-01..05)
- [x] **Phase 3: Security Hardening** (3/3) — completed 2026-06-10 — trusted-IP rate limiting, CSP re-audit, SEC-03 accepted-risk (SEC-01..03)
- [x] **Phase 4: Code Quality & Type Safety** (6/6) — completed 2026-06-20 — exported `ExperienceMessages`, build-time date codegen, sonarjs lint gates, `TECH_*` constants (TYPE-01..02, QUAL-01..03)

Full phase details: `milestones/v1.3-ROADMAP.md`. Production CSP/theme-init smoke test verified 2026-06-20.

</details>

<details>
<summary>✅ v1.4 Polish & International Content (Phases 6-8) — SHIPPED 2026-06-21</summary>

- [x] **Phase 6: Look & Feel Polish** (3/3) — completed 2026-06-20 — WCAG-AA muted-text contrast, hero CTA rebalance, sun/moon theme switch + segmented EN|ID pill (UI-05..07)
- [x] **Phase 7: Information Architecture** (1/1) — completed 2026-06-20 — GitHub link moved Contact → About (IA-01)
- [x] **Phase 8: International Content Overhaul** (2/2) — completed 2026-06-21 — humanized prose + remote/relocation availability signal, AI agentic-coding-workflow narrative, 14 bilingual project descriptions, idiomatic education English (CONTENT-01..03)

Full phase details: `milestones/v1.4-ROADMAP.md`. Shipped via PRs #31 (Phases 6-7 + partial 8) and #32 (Phase 8 completion).

</details>

<details>
<summary>✅ v1.5 Responsive Navigation & Layout Fixes (Phases 9-10) — SHIPPED 2026-06-21</summary>

- [x] **Phase 9: Responsive Navbar** (2/2) — completed 2026-06-21 — phone hamburger + accessible right-side MobileDrawer (7 links + theme/lang toggles, focus-trap, scroll-lock, Esc/backdrop), inline tablet/desktop nav scrolls horizontally on overflow (NAV-01..05, A11Y-01..04)
- [x] **Phase 10: Hero & Overflow Fixes** (1/1) — completed 2026-06-21 — `--navbar-height` token + `.hero-section` top-clearance, root-cause CTA overflow fix + defensive `overflow-x: clip` (LAYOUT-01..02)

Full phase details: `milestones/v1.5-ROADMAP.md`. Shipped via PR #36 (squash).

</details>

- [x] **Phase 11: Navbar Layout Balance** - Center the inline nav links between the brand and controls on desktop (completed 2026-06-21)

## Phase Details

### Phase 11: Navbar Layout Balance

**Goal**: The desktop navbar row reads balanced — the 7 section links sit centered between the "JK" brand on the left and the theme/language controls on the right, with no large dead gap.
**Depends on**: Phase 10 (v1.5 responsive behavior must be preserved as-is)
**Requirements**: NAVBAL-01, NAVBAL-02, NAVBAL-03, NAVBAL-04
**Success Criteria** (what must be TRUE):

  1. On a wide desktop (≥ md breakpoint), the nav links appear visually centered in the navbar row with balanced whitespace on both sides — no large empty gap between the last link and the theme/language controls.
  2. When the browser window is narrowed to a tablet width where the 7 links no longer all fit, the inline nav scrolls horizontally (NAV-05 behavior) instead of overflowing or clipping.
  3. On phone widths (< md), the hamburger menu still opens the MobileDrawer with all 7 section links, the theme toggle, and the language toggle — the drawer behavior is completely unchanged from v1.5.
  4. No horizontal page scrollbar appears at any width from 320px through 1024px; ≥44px tap targets are preserved.

**Plans**: 1 plan

  - [x] 11-01-PLAN.md — Center the InlineNav links (flex-grow + centered, scroll-fallback preserved)

**UI hint**: yes

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Quick Bug Fixes | v1.3 | 1/1 | ✅ Complete | 2026-06-03 |
| 2. UX Polish | v1.3 | 4/4 | ✅ Complete | 2026-06-03 |
| 5. SGDS Migration | v1.3 | 7/7 | ✅ Complete | 2026-06-08 |
| 3. Security Hardening | v1.3 | 3/3 | ✅ Complete | 2026-06-10 |
| 4. Code Quality & Type Safety | v1.3 | 6/6 | ✅ Complete | 2026-06-20 |
| 6. Look & Feel Polish | v1.4 | 3/3 | ✅ Complete | 2026-06-20 |
| 7. Information Architecture | v1.4 | 1/1 | ✅ Complete | 2026-06-20 |
| 8. International Content Overhaul | v1.4 | 2/2 | ✅ Complete | 2026-06-21 |
| 9. Responsive Navbar | v1.5 | 2/2 | ✅ Complete | 2026-06-21 |
| 10. Hero & Overflow Fixes | v1.5 | 1/1 | ✅ Complete | 2026-06-21 |
| 11. Navbar Layout Balance | v1.6 | 1/1 | Complete   | 2026-06-21 |

# Roadmap: porto-jefry

## Milestones

- ✅ **v1.1 New Features** — back-to-top, test suite, CI (tagged 2026-05-26)
- ✅ **v1.2 Security & API Hardening** — Phase 1 (tagged 2026-05-26)
- ✅ **v1.3 Improvement & Hardening** — Phases 1-5 (shipped 2026-06-20)
- ✅ **v1.4 Polish & International Content** — Phases 6-8 (shipped 2026-06-21)
- 🔄 **v1.5 Responsive Navigation & Layout Fixes** — Phases 9-10 (in progress)

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

### v1.5 Responsive Navigation & Layout Fixes

- [x] **Phase 9: Responsive Navbar** — Navbar collapses to brand + hamburger on phones; hamburger opens an accessible right-side drawer with all 7 section links and both toggles; inline nav at tablet/desktop scrolls horizontally whenever items overflow so navigation never breaks at any width (completed 2026-06-21)
- [ ] **Phase 10: Hero & Overflow Fixes** — Hero photo and content clear the fixed navbar on phones and tablets (portrait and landscape); no horizontal page overflow from 320px through 1024px

## Phase Details

### Phase 9: Responsive Navbar

**Goal**: Navigation works correctly at every viewport width — phones collapse to a hamburger drawer, tablets and desktops use an inline nav that scrolls horizontally when items don't all fit
**Depends on**: Nothing (Phase 8 shipped; this begins v1.5)
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, NAV-05, A11Y-01, A11Y-02, A11Y-03, A11Y-04
**Success Criteria** (what must be TRUE):

  1. At 360 / 390 / 430px wide, the navbar shows only the brand and the hamburger button; no inline section links are visible, and tapping the hamburger opens a right-side drawer listing all 7 sections (About, Experience, Education, Skills, Projects, Certifications, Contact) with touch targets of at least 44px
  2. Tapping any drawer link smooth-scrolls to that section, updates the URL hash, and closes the drawer — verified on both EN and ID labels
  3. The theme toggle and EN|ID language switch are present and functional inside the open drawer at all phone widths (360–430px)
  4. At 768px and 1024px (tablet), the inline nav is visible; when the 7 labels (especially the longer Indonesian ones) or a non-maximized window means they don't all fit, the nav row scrolls horizontally (swipe/drag) so every section remains reachable — no item is clipped or permanently hidden
  5. At 1280px+ (desktop, full-width window), all 7 nav items are fully visible with no scroll required; the drawer and hamburger are hidden
  6. While the drawer is open: keyboard focus is trapped inside it, Tab cycles within it, Esc closes it and returns focus to the hamburger button, the backdrop tap closes it, and background page scroll is locked; all interactive controls have accessible labels and meet 44px minimum touch targets**Plans**: 2 plans

**Wave 1**

  - [x] 09-01-PLAN.md — Build the accessible MobileDrawer (7 links + theme/lang toggles + close/backdrop, focus-trap + scroll-lock), the `useScrollLock` hook, and bilingual `nav.close_menu` (NAV-02, NAV-04, A11Y-01..04) ✅ 2026-06-21

**Wave 2** *(blocked on Wave 1 completion)*

  - [x] 09-02-PLAN.md — Integrate the drawer into Navbar: collapse phone bar to brand+hamburger, remove `expand="always"`, add `overflow-x-auto` inline-nav scroll fallback, wire `scrollTo`, update tests (NAV-01, NAV-03, NAV-05, A11Y-04)

**UI hint**: yes

### Phase 10: Hero & Overflow Fixes

**Goal**: The hero profile photo and all page content are fully visible and horizontally contained on phones and tablets after the navbar is finalized
**Depends on**: Phase 9 (navbar height and structure must be settled before the hero top-offset is calculated)
**Requirements**: LAYOUT-01, LAYOUT-02
**Success Criteria** (what must be TRUE):

  1. At 360 / 390 / 430px (phone, portrait) and 768 / 1024px (tablet, portrait and landscape), the hero profile photo and heading are fully visible below the fixed navbar — no part of the photo or content is obscured by the fixed header
  2. On tablets in landscape orientation (e.g. 1024px wide, short viewport height), the hero content clears the fixed navbar so the photo is not clipped at the top
  3. From 320px through 1024px, no section or component causes a horizontal scrollbar; all content fits the viewport width at the validation widths 360 / 390 / 430 (phone) and 768 / 1024 (tablet), with desktop (1280px+) unaffected

**Plans**: 1 plan

**Wave 1**

  - [ ] 10-01-PLAN.md — Fix hero top-clipping below the fixed navbar (`--navbar-height` token + `.hero-section` 100svh/top-anchored clearance) and eliminate horizontal page overflow 320→1024px (root-cause `min-width: 11.5rem` CTA fix + defensive `overflow-x: clip`) (LAYOUT-01, LAYOUT-02)

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
| 9. Responsive Navbar | v1.5 | 2/2 | Complete   | 2026-06-21 |
| 10. Hero & Overflow Fixes | v1.5 | 0/1 | Planned | - |

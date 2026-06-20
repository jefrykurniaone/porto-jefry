# Roadmap: porto-jefry

## Milestones

- ✅ **v1.1 New Features** — back-to-top, test suite, CI (tagged 2026-05-26)
- ✅ **v1.2 Security & API Hardening** — Phase 1 (tagged 2026-05-26)
- ✅ **v1.3 Improvement & Hardening** — Phases 1-5 (shipped 2026-06-20)
- 🔵 **v1.4 Polish & International Content** — Phases 6-8 (current)

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

### 🔵 v1.4 — Polish & International Content (CURRENT)

Refinement milestone for the deployed, SGDS-migrated portfolio, tuned to appeal to **international employers**. Three independently-shippable phases, each on its own branch (`branching_strategy: "phase"`).

- [x] **Phase 6: Look & Feel Polish** ✅ **(COMPLETE)** — fix muted-text contrast (WCAG AA), rebalance the three hero CTAs (no wrap, equal size), redesign the theme/language toggles (sliding switch + segmented EN|ID pill)
- [ ] **Phase 7: Information Architecture** — move the GitHub link from Contact to About
- [ ] **Phase 8: International Content Overhaul** — rewrite all prose in a natural humanized voice, add a remote/global-availability signal, add bilingual project descriptions, fix education-major English

#### Phase 6: Look & Feel Polish 🔵 (CURRENT PRIORITY)

**Goal**: Muted text is readable in both themes; the hero CTAs are balanced and never wrap; the theme/language controls are a compact sliding switch and segmented pill
**Depends on**: Nothing (first v1.4 phase; builds on the shipped SGDS UI)
**Requirements**: UI-05, UI-06, UI-07
**Branch**: `06-look-feel-polish`
**Success Criteria**:

  1. Every `sgds:text-muted` usage (hero h2/subtitle, contact, projects period, education date, certifications issuer, 404/error) renders at ≥4.5:1 contrast in both light and dark themes
  2. The hero shows three equal-height, equal-width CTA buttons; "View My Work" sits on a single line at all desktop widths; the three stack full-width below 512px
  3. The theme toggle is a sun/moon sliding switch and the language toggle is a compact segmented EN|ID pill; both smaller than the prior buttons and in the navbar
  4. `npm run lint` + `npx tsc --noEmit` + `npm run test` + `npm run build` all pass; coverage thresholds maintained

**Plans**: 3

- [x] 06-01-PLAN.md — Contrast & readability: `--sgds-color-muted` token override (UI-05)
- [x] 06-02-PLAN.md — Hero CTA rebalance: equal-sized, no-wrap buttons (UI-06)
- [x] 06-03-PLAN.md — Toggle redesign: theme slider + language EN|ID pill (UI-07)

#### Phase 7: Information Architecture

**Goal**: The GitHub link is presented in About and no longer in Contact, with the URL still defined exactly once
**Depends on**: Phase 6 (sequential; independent code areas)
**Requirements**: IA-01
**Branch**: `07-information-architecture`
**Success Criteria**:

  1. The About section renders a GitHub link (icon + handle) using `CONTACT_GITHUB_URL` from `src/data/contact.ts`
  2. The Contact section no longer renders a GitHub card; its grid stays balanced (3 cards)
  3. The GitHub URL is defined only in `src/data/contact.ts`; the label key lives under `about.*` in both `en.json` and `id.json` (key parity holds)
  4. Contact and About tests updated; full CI passes

**Plans**: 1

- [ ] 07-01-PLAN.md — Move GitHub link Contact→About + i18n label key move + tests (IA-01)

#### Phase 8: International Content Overhaul

**Goal**: All user-facing prose reads as natural, specific, human writing aimed at international employers; projects carry bilingual descriptions; education terms are idiomatic English
**Depends on**: Phase 7
**Requirements**: CONTENT-01, CONTENT-02, CONTENT-03
**Branch**: `08-international-content`
**Success Criteria**:

  1. A humanizer skill is installed (via `find-skills`) and used to rewrite `hero.subtitle`/`hero.title`, `about.description`, all `experience.items.*.bullets`, `contact.description`, and `certifications.coding_id.description` — no buzzword resume-speak remains
  2. The About/Contact copy includes a clear remote/international availability signal
  3. No fabricated metrics: impact statements are qualitative, with explicit `[your number]` placeholders where a real figure would help
  4. All 14 projects have bilingual descriptions read from i18n (`projects.items.<id>.description`); `Projects.tsx` consumes them via next-intl with a missing-key guard
  5. Education majors/degrees read "Diploma in Informatics Management" and "Bachelor's in Information Systems"
  6. `en.json`/`id.json` key parity holds (`translations.test.ts` passes); full CI passes

**Plans**: 2

- [ ] 08-01-PLAN.md — Humanizer install + core prose rewrite + global-availability signal (CONTENT-01)
- [ ] 08-02-PLAN.md — Bilingual project descriptions (i18n + Projects.tsx) + education English fixes (CONTENT-02, CONTENT-03)

## Progress

**Execution Order:** v1.4 — 6 → 7 → 8

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Quick Bug Fixes | v1.3 | 1/1 | ✅ Complete | 2026-06-03 |
| 2. UX Polish | v1.3 | 4/4 | ✅ Complete | 2026-06-03 |
| 5. SGDS Migration | v1.3 | 7/7 | ✅ Complete | 2026-06-08 |
| 3. Security Hardening | v1.3 | 3/3 | ✅ Complete | 2026-06-10 |
| 4. Code Quality & Type Safety | v1.3 | 6/6 | ✅ Complete | 2026-06-20 |
| 6. Look & Feel Polish | v1.4 | 3/3 | Complete    | 2026-06-20 |
| 7. Information Architecture | v1.4 | 0/1 | 🔵 Planned | — |
| 8. International Content Overhaul | v1.4 | 0/2 | 🔵 Planned | — |

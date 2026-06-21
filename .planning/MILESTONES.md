# Milestones — porto-jefry

Historical record of shipped milestones. Full archives in `.planning/milestones/`.

> **Versioning note:** Early planning versions diverged from git tags. Git tags are the source of truth for shipped order: `v1.1`, `v1.2` were tagged 2026-05-26. The improvement+SGDS milestone (tracked internally as "v1.0") is aligned and closed as **v1.3**.

---

## v1.6 — Navbar Layout Balance

**Shipped:** 2026-06-21
**Phases:** 1 (11) · **Plans:** 1
**Tag:** v1.6
**Archive:** `milestones/v1.6-ROADMAP.md`, `milestones/v1.6-REQUIREMENTS.md`

**Delivered:** Rebalanced the desktop navbar so the 7 section links sit centered between the "JK" brand (left) and the theme/language controls (right), removing the large dead gap — without regressing any v1.5 responsive behavior. Root cause was SGDS `<sgds-mainnav>` packing slotted links left (`justify-content: flex-start`) and shoving `.slot-end` controls right (`margin-left: auto`); fixed purely within the `InlineNav` wrapper.

**Key accomplishments:**

- `InlineNav` wrapper gains `sgds:flex-1 + sgds:justify-center` to fill the middle space and center the 7 desktop links between the brand and controls (NAVBAL-01, NAVBAL-02) (#39)
- A vertical-alignment follow-up added `sgds:items-center` (the slotted wrapper defaulted to `align-items: stretch`, so links rode high) — found and fixed during UAT (`28fe7ce`)
- NAV-05 horizontal-scroll fallback preserved: `sgds:overflow-x-auto + sgds:flex-nowrap` retained, with a new regression test asserting grow + scroll coexist (NAVBAL-03)
- No regression to the phone hamburger drawer, ≥44px targets, or no-horizontal-overflow guarantee 320→1024px (NAVBAL-04)

**Quality:** Lint 0 · tsc 0 · Vitest 628 pass · build clean · security `threats_open: 0` · human UAT 4/4 pass (desktop centering, overflow scroll, phone drawer, 320–1024px overflow). Pure Tailwind layout change — no new dependencies.

---

## v1.5 — Responsive Navigation & Layout Fixes

**Shipped:** 2026-06-21
**Phases:** 2 (9 → 10) · **Plans:** 3
**Tag:** v1.5
**Archive:** `milestones/v1.5-ROADMAP.md`, `milestones/v1.5-REQUIREMENTS.md`

**Delivered:** Fixed the prod-mobile regressions (Samsung Galaxy S8, 360×740): hero photo clipped under the fixed navbar, only 3 of 7 nav links visible (always-expanded nav overflowed with no scroll), no hamburger. Phones now collapse to a brand + hamburger that opens an accessible right-side drawer (all 7 sections + theme/language toggles, focus-trap, scroll-lock, Esc/backdrop); the inline tablet/desktop nav scrolls horizontally whenever items overflow; and the hero clears the fixed navbar on phones and tablets with no horizontal page overflow from 320px through 1024px.

**Key accomplishments:**

- Phone navbar collapses to brand + hamburger; custom accessible `MobileDrawer` (7 links + toggles, focus-trap, scroll-lock, Esc/backdrop, ≥44px targets) (NAV-01..04, A11Y-01..04) (#36)
- Inline tablet/desktop nav gains `overflow-x-auto` horizontal-scroll fallback so navigation never breaks when labels don't fit (NAV-05) (#36)
- Root cause fixed: `expand="always"` on `<sgds-mainnav>` was forcing the desktop layout at all widths (#36)
- Hero clears the fixed navbar via a single `--navbar-height` token + `.hero-section` (100svh, top-anchored, `box-sizing: border-box`) replacing the center-only `min-h-screen` (LAYOUT-01) (#36)
- Horizontal overflow eliminated 320→1024px: root-cause CTA fix (full-width to `max-width: 1024px`) + defensive `overflow-x: clip` (LAYOUT-02) (#36)

**Quality:** Lint 0 · tsc 0 · Vitest 627/627 · build clean · security `threats_open: 0` · human UAT passed both phases (phone/tablet/desktop, EN + ID).

---

## v1.4 — Polish & International Content

**Shipped:** 2026-06-21
**Phases:** 3 (6 → 7 → 8) · **Plans:** 6
**Tag:** v1.4
**Archive:** `milestones/v1.4-ROADMAP.md`, `milestones/v1.4-REQUIREMENTS.md`

**Delivered:** Readability and look-and-feel polish (WCAG-AA muted-text contrast, rebalanced hero CTAs, sun/moon theme switch + segmented EN|ID language pill), the GitHub link moved from Contact to About, and a full international-content rewrite — all portfolio prose humanized into a natural, first-person, non-buzzword voice with a remote/international + relocation availability signal, an AI agentic-coding-workflow narrative (Claude/Copilot/OpenCode), 14 bilingual project descriptions, and idiomatic education terms.

**Key accomplishments:**

- WCAG-AA muted-text contrast in light + dark via a single `--sgds-color-muted` override (UI-05) (#31)
- Hero CTA rebalance (equal-sized, no-wrap) + sun/moon `sgds-switch` theme slider + segmented EN|ID language pill (UI-06, UI-07) (#31)
- GitHub link moved Contact → About; URL still defined once in `data/contact.ts` (IA-01) (#31)
- All prose humanized via the free `blader/humanizer` (paid HumanizerAI API rejected) + remote/relocation availability signal; EN/ID parity (CONTENT-01) (#32)
- 14 bilingual project descriptions via i18n + idiomatic education English (CONTENT-02, CONTENT-03) (#31, #32)

**Owner follow-ups (non-blocking):** verify the 14 drafted project descriptions; optionally add real metrics to experience bullets.

---

## v1.3 — Improvement & Hardening

**Shipped:** 2026-06-20
**Phases:** 5 (executed 1 → 2 → 5 → 3 → 4) · **Plans:** 21
**Tag:** v1.3
**Archive:** `milestones/v1.3-ROADMAP.md`, `milestones/v1.3-REQUIREMENTS.md`

**Delivered:** Full migration of the portfolio UI to SGDS web components (Tailwind v4, SGDS dark-mode theming, minimalist monochrome look), security hardening (trusted-IP rate limiting, tightened CSP), type-safety and code-quality improvements (exported `ExperienceMessages`, build-time date codegen, sonarjs lint gates), UX polish (CV error feedback, branded 404/error pages), and four quick correctness fixes.

**Key accomplishments:**

- Full SGDS migration + Tailwind v3→v4 + dark mode on SGDS theming (#26, #27)
- Security: `ipAddress()` rate-limit identity, CSP tightened, SEC-03 accepted-risk (#28)
- Type safety & code quality: double-cast removed, automated build date, sonarjs gates (#29)
- UX: inline CV error feedback, locale-aware 404/error pages, ThemeToggle CLS fix
- Production CSP + theme-init smoke test verified against live production (2026-06-20)

**Known deferred items at close:** UK English writing-standards audit; SGDS Masthead (evaluated, not adopted).

---

## v1.2 — Security & API Hardening (Phase 1)

**Shipped:** 2026-05-26 · **Tag:** v1.2
Correct IP extraction, bounded rate-limit Map with lazy eviction, RFC 9110 `Retry-After`, `URLSearchParams` CV URL. (PR #11.) Known deferred at the time: 15 requirements (STAB/PERF/DEBT/TEST/DEP). See the early `milestones/v1.0-*` snapshot, which documents this "Quality & Technical Debt Remediation" scope.

## v1.1 — New Features

**Shipped:** 2026-05-26 · **Tag:** v1.1
Back-to-top button, test suite (79 tests, 83.6% coverage), GitHub Actions CI pipeline. (PR #10.)

---

## Next

- ⚪ **TBD** — define the next milestone via `/gsd-new-milestone`. Deferred candidates (v2): CI Lighthouse/CWV checks, Playwright E2E, Dependabot, blog, testimonials, experience timeline, Core Web Vitals ≥90, progressive image loading.

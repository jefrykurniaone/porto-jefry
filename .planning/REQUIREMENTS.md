# Requirements: porto-jefry

**Defined:** 2026-06-02
**Core Value:** A fast, accessible, bilingual portfolio that accurately represents Jefry's work and makes it easy for recruiters and collaborators to download his CV and reach him.

## v1.3 Requirements (shipped 2026-06-20)

Requirements for the Improvement & Hardening milestone (archived as `milestones/v1.3-REQUIREMENTS.md`). All complete. Each maps to roadmap phases 1-5.

### Quick Fixes

- [x] **FIX-01**: `LanguageToggle` and `ThemeToggle` buttons have `type="button"` attribute
- [x] **FIX-02**: Navbar scroll event listener is registered with `{ passive: true }`
- [x] **FIX-03**: `translatePeriod` regex uses word-boundary anchors (`\b`) to prevent partial matches
- [x] **FIX-04**: Hash encoding is consistent between Hero (`encodeURIComponent`) and Navbar (plain `#id`) — standardize on plain `#id`

### UX Polish

- [x] **UX-01**: CV download failure shows user-visible inline error message (not just `console.error`) *(Completed 2026-06-03)*
- [x] **UX-02**: Custom locale-aware 404 page (`src/app/[locale]/not-found.tsx`) renders branded UI *(Completed 2026-06-03)*
- [x] **UX-03**: Custom locale-aware error boundary page (`src/app/[locale]/error.tsx`) renders branded fallback *(Completed 2026-06-03)*
- [x] **UX-04**: ThemeToggle renders a stable placeholder icon (no layout shift on hydration) *(Completed 2026-06-03)*

### Security

- [x] **SEC-01**: Rate-limit identity derives only from `ipAddress(req)` (@vercel/functions, reads the Vercel-injected `x-real-ip`) with a `127.0.0.1` dev fallback — a client-supplied `x-forwarded-for` can no longer change the rate-limit bucket (D-02). *(Completed 2026-06-11)*
- [x] **SEC-02**: CSP `style-src` no longer includes `https://fonts.googleapis.com` and `font-src` no longer includes `https://fonts.gstatic.com` (fonts self-hosted via next/font); prod `script-src` theme-init hash recomputed to the SGDS-era `sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc=` and verified against the live script (D-05, D-06, D-08). *(Completed 2026-06-11)*
- [x] **SEC-03**: In-memory rate limiter — distributed rate limiting (Upstash Redis / Vercel KV) formally closed as **accepted-risk**. Rationale: per-instance Map is adequate for portfolio scale; CV PDF is module-cached per locale (CV_BUFFER_CACHE) so the expensive render path runs at most once per instance. Reopen if Analytics shows sustained abuse. *(Closed 2026-06-10)*

### Type Safety

- [x] **TYPE-01**: `ExperienceMessages` is a top-level exported interface (not defined inline inside a function body)
- [x] **TYPE-02**: Experience bullets accessed via `useTranslations` namespace drilling instead of `useMessages()` + double cast

### Code Quality

- [x] **QUAL-01**: `LAST_MODIFIED_DATE` is derived from `git log` at build time (or replaced with `new Date()`)
- [x] **QUAL-02**: `eslint-plugin-sonarjs` (or equivalent) added to `.eslintrc.json` for max-lines, max-lines-per-function, and no-nested-template-literals rules
- [x] **QUAL-03**: Shared tech stacks in `src/data/projects.ts` extracted as named constants to prevent duplication and stay under 300-line limit

## v1.4 Requirements

Current milestone — **polish-and-international-content** (v1.4). Readability, look & feel, and content tuned for international employers. Each maps to roadmap Phases 6-8.

### Look & Feel

- [x] **UI-05**: All `sgds:text-muted` text meets WCAG AA contrast (≥4.5:1) in both light and dark themes — fixed via a single `--sgds-color-muted` override in `globals.css` (root cause: token was `#c6c6c6` day / `#3b3b3b` night ≈ 1.6:1)
- [ ] **UI-06**: Hero shows three equal-sized CTA buttons; "View My Work" never wraps to a second line; buttons stack full-width below 512px
- [ ] **UI-07**: Theme toggle is a sun/moon sliding switch (`sgds-switch`); language toggle is a compact segmented EN|ID pill; both compact and in the navbar

### Information Architecture

- [ ] **IA-01**: GitHub link is rendered in the About section and removed from the Contact section; the URL stays defined once in `src/data/contact.ts`

### Content

- [ ] **CONTENT-01**: Core prose (hero subtitle/title, about summary, experience bullets, contact, certification) rewritten in a natural, non-buzzword voice via a humanizer skill; includes a remote/international availability signal; EN/ID key parity preserved
- [ ] **CONTENT-02**: All 14 projects have bilingual descriptions sourced from i18n (`projects.items.<id>.description`); `Projects.tsx` reads them via next-intl
- [ ] **CONTENT-03**: Education majors/degrees use idiomatic English ("Diploma in Informatics Management", "Bachelor's in Information Systems")

## v2 Requirements

Deferred to future milestone. Tracked but not in current roadmap.

### Infrastructure

- **INFRA-01**: CI pipeline with automated Lighthouse/Core Web Vitals checks
- **INFRA-02**: End-to-end test suite (Playwright) covering CV download, language toggle, theme toggle
- **INFRA-03**: Automated dependency update bot (Dependabot or Renovate)

### Content Features

- **FEAT-01**: Blog section with markdown-based posts
- **FEAT-02**: Testimonials section from colleagues/managers
- **FEAT-03**: Timeline visualization for Experience section

### Performance

- **PERF-01**: Core Web Vitals score ≥90 on all metrics (tracked via Vercel Analytics)
- **PERF-02**: Progressive image loading with blur placeholder for profile photo

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User authentication | Portfolio sites don't need accounts |
| Database / backend persistence | All content is static by design |
| Blog or CMS | Content is code-managed for simplicity; deferred to v2 |
| Server-side personalization | Static generation is the architecture |
| Real-time features | Unnecessary for a portfolio |
| Mobile app | Web-first, responsive design is sufficient |
| OAuth login | No user accounts exist |
| Internationalization beyond EN/ID | Current audience only needs these two |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FIX-01 | Phase 1 — Quick Bug Fixes | ✅ Complete |
| FIX-02 | Phase 1 — Quick Bug Fixes | ✅ Complete |
| FIX-03 | Phase 1 — Quick Bug Fixes | ✅ Complete |
| FIX-04 | Phase 1 — Quick Bug Fixes | ✅ Complete |
| UX-01 | Phase 2 — UX Polish | ✅ Complete |
| UX-02 | Phase 2 — UX Polish | ✅ Complete |
| UX-03 | Phase 2 — UX Polish | ✅ Complete |
| UX-04 | Phase 2 — UX Polish | ✅ Complete |
| SEC-01 | Phase 3 — Security Hardening | ✅ Complete |
| SEC-02 | Phase 3 — Security Hardening | ✅ Complete |
| SEC-03 | Phase 3 — Security Hardening | Closed (accepted-risk) |
| TYPE-01 | Phase 4 — Code Quality & Type Safety | Complete |
| TYPE-02 | Phase 4 — Code Quality & Type Safety | Complete |
| QUAL-01 | Phase 4 — Code Quality & Type Safety | Complete |
| QUAL-02 | Phase 4 — Code Quality & Type Safety | Complete |
| QUAL-03 | Phase 4 — Code Quality & Type Safety | Complete |
| UI-05 | Phase 6 — Look & Feel Polish | 🔵 Planned |
| UI-06 | Phase 6 — Look & Feel Polish | 🔵 Planned |
| UI-07 | Phase 6 — Look & Feel Polish | 🔵 Planned |
| IA-01 | Phase 7 — Information Architecture | 🔵 Planned |
| CONTENT-01 | Phase 8 — International Content | 🔵 Planned |
| CONTENT-02 | Phase 8 — International Content | 🔵 Planned |
| CONTENT-03 | Phase 8 — International Content | 🔵 Planned |

**Coverage:**

- v1.3 requirements: 16 total — ✅ all complete (FIX-01..04, UX-01..04, SEC-01..03, TYPE-01..02, QUAL-01..03) — archived
- v1.4 requirements: 7 total (UI-05..07, IA-01, CONTENT-01..03) — mapped to Phases 6-8, 0 unmapped ✓
- v1.4 roadmap written: 2026-06-20

---
*Requirements defined: 2026-06-02*
*Last updated: 2026-06-20 — milestone v1.3 closed (archived to milestones/v1.3-*), v1.4 (polish-and-international-content) opened*

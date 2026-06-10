# Requirements: porto-jefry

**Defined:** 2026-06-02
**Core Value:** A fast, accessible, bilingual portfolio that accurately represents Jefry's work and makes it easy for recruiters and collaborators to download his CV and reach him.

## v1 Requirements

Requirements for the current improvement milestone. Each maps to roadmap phases.

### Quick Fixes

- [x] **FIX-01**: `LanguageToggle` and `ThemeToggle` buttons have `type="button"` attribute
- [x] **FIX-02**: Navbar scroll event listener is registered with `{ passive: true }`
- [x] **FIX-03**: `translatePeriod` regex uses word-boundary anchors (`\b`) to prevent partial matches
- [x] **FIX-04**: Hash encoding is consistent between Hero (`encodeURIComponent`) and Navbar (plain `#id`) — standardize on plain `#id`

### UX Polish

- [ ] **UX-01**: CV download failure shows user-visible inline error message (not just `console.error`)
- [ ] **UX-02**: Custom locale-aware 404 page (`src/app/[locale]/not-found.tsx`) renders branded UI
- [ ] **UX-03**: Custom locale-aware error boundary page (`src/app/[locale]/error.tsx`) renders branded fallback
- [ ] **UX-04**: ThemeToggle renders a stable placeholder icon (no layout shift on hydration)

### Security

- [ ] **SEC-01**: Rate limiting uses platform-provided `req.ip` instead of untrusted `x-real-ip` / `x-forwarded-for` headers
- [ ] **SEC-02**: CSP `style-src` no longer includes `https://fonts.googleapis.com` (fonts are self-hosted via next/font)
- [x] **SEC-03**: In-memory rate limiter — distributed rate limiting (Upstash Redis / Vercel KV) formally closed as **accepted-risk**. Rationale: per-instance Map is adequate for portfolio scale; CV PDF is module-cached per locale (CV_BUFFER_CACHE) so the expensive render path runs at most once per instance. Reopen if Analytics shows sustained abuse. *(Closed 2026-06-10)*

### Type Safety

- [ ] **TYPE-01**: `ExperienceMessages` is a top-level exported interface (not defined inline inside a function body)
- [ ] **TYPE-02**: Experience bullets accessed via `useTranslations` namespace drilling instead of `useMessages()` + double cast

### Code Quality

- [ ] **QUAL-01**: `LAST_MODIFIED_DATE` is derived from `git log` at build time (or replaced with `new Date()`)
- [ ] **QUAL-02**: `eslint-plugin-sonarjs` (or equivalent) added to `.eslintrc.json` for max-lines, max-lines-per-function, and no-nested-template-literals rules
- [ ] **QUAL-03**: Shared tech stacks in `src/data/projects.ts` extracted as named constants to prevent duplication and stay under 300-line limit

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
| UX-01 | Phase 2 — UX Polish | Pending |
| UX-02 | Phase 2 — UX Polish | Pending |
| UX-03 | Phase 2 — UX Polish | Pending |
| UX-04 | Phase 2 — UX Polish | Pending |
| SEC-01 | Phase 3 — Security Hardening | Pending |
| SEC-02 | Phase 3 — Security Hardening | Pending |
| SEC-03 | Phase 3 — Security Hardening | Closed (accepted-risk) |
| TYPE-01 | Phase 4 — Code Quality & Type Safety | Pending |
| TYPE-02 | Phase 4 — Code Quality & Type Safety | Pending |
| QUAL-01 | Phase 4 — Code Quality & Type Safety | Pending |
| QUAL-02 | Phase 4 — Code Quality & Type Safety | Pending |
| QUAL-03 | Phase 4 — Code Quality & Type Safety | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓
- Completed: 4 (25%)
- Roadmap written: 2026-06-02

---
*Requirements defined: 2026-06-02*
*Last updated: 2026-06-03 after Phase 1 completion*

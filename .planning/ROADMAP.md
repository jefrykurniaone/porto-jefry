# Roadmap — porto-jefry

---

## Milestone 1 — Foundation & Fixes ✅ COMPLETE (2026-05-25)

| Phase | Title | Status |
|---|---|---|
| 01 | Fix All Concerns + Base URL | ✅ Complete |

---

## Milestone 2 — v1.1 New Features 🚧 IN PROGRESS

**Goal:** Ship quality improvements, a new UX feature, a test suite, and a CI pipeline.  
**Requirements:** See `REQUIREMENTS.md`

| Phase | Title | Goal | Status |
|---|---|---|---|
| 02 | Code Quality + Back-to-Top | Fix 6 info items; add back-to-top button | 🔲 Not started |
| 03 | Test Suite (Vitest + RTL) | Install Vitest, write tests, reach 80%+ coverage | 🔲 Not started |
| 04 | CI Pipeline (GitHub Actions) | Lint + typecheck + test + build on every PR | 🔲 Not started |

---

## Phase Details

### Phase 02 — Code Quality + Back-to-Top
**Requirements:** FR-01-A through FR-01-F, FR-02-A through FR-02-F, NFR-01 through NFR-07  
**Inputs:** REVIEW.md (IN-01 to IN-06), design decision for back-to-top placement  
**Deliverables:**
- `src/utils/constants.ts` — shared `BASE_URL` constant
- `src/app/sitemap.ts` — deterministic `lastModified`, `x-default` already fixed
- `src/data/projects.ts` — `id` field added to each project
- `src/components/sections/Projects.tsx` — stable React key
- `src/components/sections/Hero.tsx` — `encodeURIComponent` on scrollTo
- `package.json` — `engines` field added
- `src/components/layout/Navbar.tsx` — minor const style fix
- `src/components/layout/BackToTop.tsx` — new back-to-top button component
- i18n keys for back-to-top `aria-label` in `en.json` + `id.json`

**UAT:**
- All 6 info items resolved and verified
- Back-to-top appears/disappears at correct scroll threshold
- Back-to-top is accessible (keyboard, aria-label, contrast)

---

### Phase 03 — Test Suite (Vitest + RTL)
**Requirements:** FR-03-A through FR-03-H, NFR-01, NFR-02  
**Inputs:** Completed Phase 02 codebase  
**Deliverables:**
- `vitest.config.ts` — Vitest config with jsdom environment
- `src/utils/translate-period.test.ts`
- `src/data/*.test.ts` — shape/field validation tests for all data modules
- `src/components/layout/Navbar.test.tsx`
- `src/components/layout/Footer.test.tsx`
- `src/components/sections/Hero.test.tsx`
- `src/components/layout/ThemeToggle.test.tsx`
- `src/components/layout/LanguageToggle.test.tsx`
- `src/components/layout/BackToTop.test.tsx`
- Coverage report showing ≥ 80% line coverage

**UAT:**
- `npm test` runs and exits 0
- Coverage report generated
- Coverage ≥ 80% on covered lines

---

### Phase 04 — CI Pipeline (GitHub Actions)
**Requirements:** FR-04-A through FR-04-G, NFR-08  
**Inputs:** Completed Phase 03 (tests must exist before CI can run them)  
**Deliverables:**
- `.github/workflows/ci.yml` — CI workflow
  - Triggers: `pull_request` targeting `main`, `push` to `main`
  - Jobs: lint → typecheck → test → build (sequential)
  - Node version from `engines` field

**UAT:**
- Push a test PR; CI runs all 4 checks
- CI fails correctly on intentional lint/type/test/build errors
- CI completes in < 3 minutes on a clean run

---

## Backlog (Future Milestones)

- Contact form with email sending (Resend / Nodemailer)
- Blog / writing section
- Testimonials section
- Animations / page transitions (Framer Motion)
- Performance audit (Lighthouse 90+ all categories)
- Upgrade Next.js to v15
- Upgrade ESLint to v9
- Rate limiting redesign (Redis-backed)
- Vercel Analytics dashboard integration

# Roadmap: porto-jefry

## Overview

Improvement and hardening milestone for an existing, deployed personal portfolio (https://porto-jefry.vercel.app). Phases progress from low-risk quick fixes through UX polish, SGDS component migration (showcase for GovTech applications), security hardening, and type-safety / code-quality improvements — each phase independently shippable via PR.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3, 4, 5, 6, 7): Planned milestone work
- Decimal phases (e.g., 2.1): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Quick Bug Fixes** - Correct four low-risk defects (button types, passive listener, regex anchors, hash encoding)
- [x] **Phase 2: UX Polish** - Add CV error feedback, custom 404/error pages, and fix ThemeToggle CLS
- [x] **Phase 3: Security Hardening** - Replace unsafe IP header trust, clean up CSP, and close distributed rate limiting as an accepted-risk (completed 2026-06-10)
- [ ] **Phase 4: Code Quality & Type Safety** - Eliminate double cast, automate stale date, enforce linting rules, extract constants `[DEFERRED → Phase 7]`
- [ ] **Phase 5: SGDS Migration** ⭐ **(CURRENT PRIORITY)** - Full migration of all UI components to SGDS web components, Tailwind v3→v4 upgrade, dark mode migrated to SGDS theming

## Phase Details

### Phase 1: Quick Bug Fixes

**Goal**: Four latent correctness defects are fixed and cannot regress
**Depends on**: Nothing (first phase)
**Requirements**: FIX-01, FIX-02, FIX-03, FIX-04
**Success Criteria** (what must be TRUE):

  1. `LanguageToggle` and `ThemeToggle` buttons each carry `type="button"` — no accidental form submission on Enter key
  2. Navbar scroll listener is registered with `{ passive: true }` — no browser console warnings about passive event violations
  3. `translatePeriod` regex uses `\b` anchors — period strings with overlapping tokens no longer produce partial/double replacements
  4. Hero anchor hash and Navbar hash link use the same plain `#id` format — clicking a Navbar link scrolls to the correct section in all browsers

**Plans**: 1 complete

**Execution Summary:**

- Plan 1: Quick Bug Fixes — All fixes already implemented and verified (00:03:02)

### Phase 2: UX Polish

**Goal**: Users see a branded, locale-aware experience on errors, and CV download failures are clearly communicated
**Depends on**: Phase 1
**Requirements**: UX-01, UX-02, UX-03, UX-04
**Success Criteria** (what must be TRUE):

  1. When CV PDF generation fails, an inline error message (localized, EN and ID) is visible on the page — no silent failure
  2. Navigating to a non-existent URL shows the branded `not-found.tsx` page in the correct locale instead of the Next.js default
  3. An unexpected runtime error surfaces the branded `error.tsx` fallback page (locale-aware) instead of a blank/default crash page
  4. ThemeToggle renders its icon immediately on hydration — no icon pop-in or layout shift (CLS = 0 for the toggle)

**Plans**: 4 plans in 1 wave
**UI hint**: yes

Plans:

- [x] 02-01-PLAN.md — CV download error feedback with inline banner
- [x] 02-02-PLAN.md — Custom 404 page (locale-aware)
- [x] 02-03-PLAN.md — Custom error boundary page (locale-aware)
- [x] 02-04-PLAN.md — Verify ThemeToggle CLS fix (verification only)

### Phase 5: SGDS Migration ⭐ (CURRENT PRIORITY)

**Goal**: All portfolio UI components are migrated to SGDS web components; Tailwind CSS is upgraded to v4; dark mode uses SGDS theming exclusively; portfolio serves as a live demonstration of SGDS expertise for GovTech applications
**Depends on**: Phase 2 (complete)
**Requirements**: SGDS-01 (foundation setup), SGDS-02 (layout components), SGDS-03 (section components part 1), SGDS-04 (section components part 2), SGDS-05 (testing & polish)
**Success Criteria** (what must be TRUE):

  1. `@govtechsg/sgds-web-component` installed; Tailwind upgraded to v4; SGDS CSS imported in correct order (`themes/day.css` → `sgds.css` → `utility.css`)
  2. `next-themes` removed; dark mode controlled by `.sgds-night-theme` class on `<html>`; toggle persists in localStorage
  3. All section components (Hero, About, Experience, Education, Skills, Projects, Certifications, Contact) use `<sgds-*>` web components where SGDS equivalents exist
  4. Layout components (Navbar, Footer) migrated to SGDS; custom components (Timeline, BackToTop) styled with `sgds:` utility classes
  5. All test files rewritten for SGDS components; 80% coverage maintained; `npm run build` + `npm run lint` + `npx tsc --noEmit` all pass

**Plans**: 7 plans in 5 waves

Plans:

- [x] 05-01-PLAN.md — SGDS foundation build pipeline and test harness
- [x] 05-02-PLAN.md — React 18 direct SGDS validation checkpoint
- [x] 05-03-PLAN.md — SGDS theme ownership and ThemeToggle migration
- [x] 05-04-PLAN.md — SGDS layout chrome and truthful footer checkpoint
- [x] 05-05-PLAN.md — Hero/About/Experience/Education SGDS section migration
- [x] 05-06-PLAN.md — Skills/Projects/Certifications/Contact SGDS section migration
- [x] 05-07-PLAN.md — SGDS fallback polish, source audit, and final verification

### Phase 3: Security Hardening

**Goal**: The CV download API trusts only platform-provided IP identity, CSP is tightened to what is actually used, and rate limiting is safe across serverless instances
**Depends on**: Phase 2
**Requirements**: SEC-01, SEC-02, SEC-03
**Success Criteria** (what must be TRUE):

  1. `/api/generate-cv` reads client IP exclusively from `ipAddress(req)` (@vercel/functions, reads the Vercel-injected `x-real-ip`) -- spoofed `x-forwarded-for` headers have no effect on rate-limit identity (CONTEXT supersedes the prior `req.ip` wording: D-02)
  2. CSP `style-src` no longer lists `https://fonts.googleapis.com` and `font-src` no longer lists `https://fonts.gstatic.com`; the prod `script-src` theme-init hash matches the live SGDS script (D-05, D-06, D-08)
  3. SEC-03 (distributed rate limiting) is formally closed as **accepted-risk** -- the in-memory per-instance limiter stays, documented in route.ts and REQUIREMENTS.md (CONTEXT supersedes the prior Upstash/Vercel KV wording: D-12)

**Plans**: 2 plans in 1 wave
Plans:

- [x] 03-02-PLAN.md -- SEC-01 trusted IP via ipAddress() + SEC-03 accepted-risk documentation
- [x] 03-03-PLAN.md -- SEC-02 post-SGDS CSP re-audit (remove Google Fonts, recompute theme-init hash) + middleware tests

### Phase 4: Code Quality & Type Safety [DEFERRED → Phase 7]

**Goal**: The codebase passes strict type checks without workarounds, stale metadata is automated, and linting enforces structural quality rules
**Depends on**: Phase 3 (or can run after Phase 5)
**Requirements**: TYPE-01, TYPE-02, QUAL-01, QUAL-02, QUAL-03
**Success Criteria** (what must be TRUE):

  1. `ExperienceMessages` is a top-level exported interface — no `as unknown as` or double-cast in the Experience component and TypeScript strict mode reports zero errors
  2. Experience bullet text is accessed via `useTranslations` namespace drilling — `useMessages()` is no longer called in the Experience component
  3. `LAST_MODIFIED_DATE` reflects the actual last git commit date automatically at build time — no manual constant to update
  4. `eslint-plugin-sonarjs` (or equivalent) is installed and active — `npm run lint` fails on max-lines, max-lines-per-function, and no-nested-template-literals violations
  5. Shared tech stacks in `src/data/projects.ts` are extracted as named `TECH_*` constants — no string arrays duplicated across project entries, and the file stays under 300 lines

**Plans**: 6 plans in 2 waves
Plans:
**Wave 1**

- [x] 04-01-PLAN.md — Experience type safety: exported ExperienceMessages interface + useTranslations typed access (TYPE-01, TYPE-02)
- [x] 04-02-PLAN.md — Build-time LAST_MODIFIED_DATE codegen from git commit date (QUAL-01)
- [ ] 04-03-PLAN.md — Extract duplicate tech stacks into TECH_* constants in projects.ts (QUAL-03)
- [ ] 04-04-PLAN.md — Function-length refactors: route.ts, error.tsx, Projects, About (QUAL-02)
- [ ] 04-05-PLAN.md — Function-length refactors via hooks: Navbar, Hero, Contact (QUAL-02)

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 04-06-PLAN.md — Install eslint-plugin-sonarjs + activate error-level lint gate + full CI verify (QUAL-02)

## Progress

**Execution Order:** 1 → 2 → 5 → [6 (was 3)] → [7 (was 4)]

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Quick Bug Fixes | 1/1 | ✅ Complete | 2026-06-03 |
| 2. UX Polish | 4/4 | ✅ Complete | 2026-06-03 |
| 5. SGDS Migration | 7/7 | ✅ Complete | 2026-06-08 |
| 3. Security Hardening | 3/3 | Complete    | 2026-06-10 |
| 4. Code Quality & Type Safety | 2/6 | In Progress|  |

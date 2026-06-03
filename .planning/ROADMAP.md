# Roadmap: porto-jefry

## Overview

Improvement and hardening milestone for an existing, deployed personal portfolio (https://porto-jefry.vercel.app). Four phases progress from low-risk quick fixes through UX polish, security hardening, and finally type-safety / code-quality improvements — each phase independently shippable via PR.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (e.g., 2.1): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Quick Bug Fixes** - Correct four low-risk defects (button types, passive listener, regex anchors, hash encoding)
- [ ] **Phase 2: UX Polish** - Add CV error feedback, custom 404/error pages, and fix ThemeToggle CLS
- [ ] **Phase 3: Security Hardening** - Replace unsafe IP header trust, clean up CSP, and upgrade to distributed rate limiting
- [ ] **Phase 4: Code Quality & Type Safety** - Eliminate double cast, automate stale date, enforce linting rules, extract constants

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

### Phase 3: Security Hardening
**Goal**: The CV download API trusts only platform-provided IP identity, CSP is tightened to what is actually used, and rate limiting is safe across serverless instances
**Depends on**: Phase 2
**Requirements**: SEC-01, SEC-02, SEC-03
**Success Criteria** (what must be TRUE):
  1. `/api/generate-cv` reads client IP exclusively from `req.ip` (Vercel-injected) — spoofed `x-real-ip` / `x-forwarded-for` headers have no effect on rate-limit identity
  2. CSP `style-src` directive no longer lists `https://fonts.googleapis.com` — Google Fonts is absent from the policy and the site renders correctly with self-hosted fonts
  3. Rate limit state is stored in Upstash Redis or Vercel KV — two concurrent serverless instances enforce a shared 5 req/min limit correctly
**Plans**: TBD

### Phase 4: Code Quality & Type Safety
**Goal**: The codebase passes strict type checks without workarounds, stale metadata is automated, and linting enforces structural quality rules
**Depends on**: Phase 3
**Requirements**: TYPE-01, TYPE-02, QUAL-01, QUAL-02, QUAL-03
**Success Criteria** (what must be TRUE):
  1. `ExperienceMessages` is a top-level exported interface — no `as unknown as` or double-cast in the Experience component and TypeScript strict mode reports zero errors
  2. Experience bullet text is accessed via `useTranslations` namespace drilling — `useMessages()` is no longer called in the Experience component
  3. `LAST_MODIFIED_DATE` reflects the actual last git commit date automatically at build time — no manual constant to update
  4. `eslint-plugin-sonarjs` (or equivalent) is installed and active — `npm run lint` fails on max-lines, max-lines-per-function, and no-nested-template-literals violations
  5. Shared tech stacks in `src/data/projects.ts` are extracted as named `TECH_*` constants — no string arrays duplicated across project entries, and the file stays under 300 lines
**Plans**: TBD

## Progress

**Execution Order:** 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Quick Bug Fixes | 1/1 | ✅ Complete | 2026-06-03 |
| 2. UX Polish | 4/4 | ✅ Complete | 2026-06-03 |
| 3. Security Hardening | 0/TBD | Not started | - |
| 4. Code Quality & Type Safety | 0/TBD | Not started | - |

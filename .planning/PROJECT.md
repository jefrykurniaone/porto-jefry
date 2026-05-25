# Project: porto-jefry

Personal portfolio website for Jefry Kurnia — built with Next.js 14 App Router, TypeScript, Tailwind CSS, and next-intl. Targets international companies and recruiters. Deployed to Vercel.

---

## Current State

- **URL:** https://porto-jefry.vercel.app/
- **Stack:** Next.js 14, TypeScript (strict), Tailwind CSS, next-intl (EN/ID), @react-pdf/renderer
- **Architecture:** Single-page portfolio, anchor-scroll navigation, locale-prefixed routes (`/en`, `/id`)
- **Sections:** Hero, About, Experience, Projects, Skills, Certifications, Education, Contact
- **Features:** CV PDF download, dark/light mode, bilingual (EN/ID), CSP nonce security headers

---

## Milestone History

### Milestone 1 — Foundation & Fixes (COMPLETE)
**Delivered:** 2026-05-25
- Established codebase map and identified all concerns
- Phase 01: Fixed all 13 codebase concerns (base URL, CSP nonce, TypeScript safety, accessibility, rate limiting, sitemap, focus trap)
- Phase 01 Code Review: PASS WITH WARNINGS (6W + 6I)
- Fixed all 6 warnings (WR-01 → WR-06)
- All 13 UAT tests pass; build clean

---

## Active Milestone

### Milestone 2 — v1.1 New Features (IN PROGRESS)
**Started:** 2026-05-25
**Target audience:** International companies and recruiters
**Priority:** Quality-first

**Goals:**
1. Fix all 6 remaining info-level code review items (IN-01 to IN-06)
2. Add "back to top" button (UX — appears after scrolling to bottom)
3. Set up unit/integration test suite (Vitest + React Testing Library)
4. Set up CI pipeline (GitHub Actions — lint, typecheck, test, build)

**Success criteria:**
- All 6 info items resolved
- Back-to-top button working on both EN and ID builds
- 80%+ test coverage on utilities and data modules
- CI passes on every PR and push to main
- Zero new lint/type/SonarQube warnings introduced

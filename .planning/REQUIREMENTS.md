# Requirements — Milestone 2 (v1.1 New Features)

**Project:** porto-jefry  
**Milestone:** v1.1 — New Features  
**Created:** 2026-05-25  
**Target audience:** International companies and recruiters  
**Priority:** Quality-first

---

## Functional Requirements

### FR-01: Fix Code Review Info Items (inherited from Phase 01 review)

| ID | Requirement | Source |
|---|---|---|
| FR-01-A | Extract `BASE_URL` to a single shared constant, removing duplication across `layout.tsx` and `sitemap.ts` | IN-01 |
| FR-01-B | Replace `new Date()` in `sitemap.ts` with a fixed build-time date constant so `lastModified` is deterministic across deploys | IN-02 |
| FR-01-C | Replace `project.name` React key in `Projects.tsx` with a stable `project.id` field | IN-03 |
| FR-01-D | URL-encode the section ID in `Hero.tsx` scrollTo template literal using `encodeURIComponent` | IN-04 |
| FR-01-E | Add `engines` field to `package.json` declaring minimum Node and npm versions | IN-05 |
| FR-01-F | Fix `const`/`let` style inconsistency in `Navbar.tsx:101` | IN-06 |

### FR-02: Back-to-Top Button

| ID | Requirement |
|---|---|
| FR-02-A | A "back to top" button appears when the user has scrolled to (or near) the bottom of the page |
| FR-02-B | Clicking the button scrolls smoothly to the top of the page |
| FR-02-C | The button is hidden when at the top; visible only after reaching the bottom threshold |
| FR-02-D | Button has accessible `aria-label` for screen readers |
| FR-02-E | Button is keyboard-navigable |
| FR-02-F | Works correctly in both EN and ID locale builds |

### FR-03: Unit & Integration Test Suite

| ID | Requirement |
|---|---|
| FR-03-A | Vitest is installed and configured for the Next.js project (with jsdom environment) |
| FR-03-B | React Testing Library is installed for component testing |
| FR-03-C | `npm test` runs the full test suite and exits 0 on success |
| FR-03-D | Tests exist for all utility functions in `src/utils/` |
| FR-03-E | Tests exist for all data modules in `src/data/` (validate shape, required fields, no empty values) |
| FR-03-F | Component smoke tests exist for at least: `Navbar`, `Footer`, `Hero`, `ThemeToggle`, `LanguageToggle` |
| FR-03-G | Test coverage report is generated; overall coverage ≥ 80% on lines covered |
| FR-03-H | Test files are co-located with source files (e.g., `utils/translate-period.test.ts`) |

### FR-04: CI Pipeline (GitHub Actions)

| ID | Requirement |
|---|---|
| FR-04-A | A CI workflow runs on every PR targeting `main` and every push to `main` |
| FR-04-B | CI runs ESLint — fails the build if any lint errors are present |
| FR-04-C | CI runs `tsc --noEmit` — fails if TypeScript errors are present |
| FR-04-D | CI runs the full test suite — fails if any tests fail |
| FR-04-E | CI runs `npm run build` — fails if the Next.js build fails |
| FR-04-F | CI uses Node.js version matching the `engines` field from `package.json` |
| FR-04-G | CI workflow file is placed at `.github/workflows/ci.yml` |

---

## Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | All changes must produce zero new lint/type errors |
| NFR-02 | All changes must pass `tsc --noEmit` |
| NFR-03 | Build must remain clean (all 8 static pages generated) |
| NFR-04 | No magic numbers — use named constants |
| NFR-05 | Max function length: 40 lines; max file length: 300 lines |
| NFR-06 | All new user-facing strings must be added to both `en.json` and `id.json` |
| NFR-07 | Back-to-top button must meet WCAG AA contrast ratio (4.5:1) |
| NFR-08 | CI must complete in under 3 minutes for fast feedback |

---

## Out of Scope

- Next.js v15 upgrade
- ESLint v9 upgrade
- Rate limiting redesign
- Blog or writing section
- Contact form with email
- Testimonials section
- Next.js upgrade
- Major visual redesign

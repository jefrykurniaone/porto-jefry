# Testing

**Analysis Date:** 2026-05-25

## Test Setup

**No test infrastructure exists in this project.**

There is no test runner, no assertion library, and no test configuration of any kind.

- `package.json` scripts: `dev`, `build`, `start`, `lint` — no `test` script
- No testing libraries in `dependencies` or `devDependencies`
- No test runner config files (`jest.config.*`, `vitest.config.*`, `playwright.config.*`)
- No test helpers, fixtures, or factory files

## Test Coverage

**Current coverage: 0%**

No tests have been written. No coverage tooling is configured.

## Test Files Found

None. A recursive search for `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx` across the entire workspace returned zero results.

## Testing Patterns

No patterns established. The project has no prior testing conventions to follow.

## Test Commands

No test commands defined. The only quality-gate script is:

```bash
npm run lint    # ESLint via next lint
```

## Gaps / Missing Tests

The following areas have zero test coverage and represent the highest risk:

**Utility functions (High priority — pure functions, easiest to test):**
- `src/utils/translate-period.ts` — `translatePeriod(period, locale)` — pure string transform; ideal unit test candidate
- `src/i18n/request.ts` — locale fallback logic

**API route (High priority — business logic + security):**
- `src/app/api/generate-cv/route.ts`
  - Rate limit logic: `checkRateLimit(ip)` is a pure function extractable for unit tests
  - Locale validation: unsupported locale fallback behavior
  - Response headers: `Content-Disposition`, `Cache-Control` correctness
  - Error handling: `HTTP 4xx/5xx` response shapes

**Data integrity (Medium priority — static data shape validation):**
- `src/data/experience.ts` — all `ExperienceItem` records have required fields
- `src/data/contact.ts` — constants match expected format (email regex, tel href format)
- `src/data/education.ts`, `src/data/skills.ts`, `src/data/projects.ts` — shape validation

**i18n completeness (Medium priority — runtime crash risk):**
- Verify all translation keys present in both `src/i18n/messages/en.json` and `src/i18n/messages/id.json`
- Missing keys in one locale cause runtime errors in production

**Component smoke tests (Lower priority — UI rendering):**
- `src/components/sections/Hero.tsx` — renders without crashing, CTA buttons render
- `src/components/layout/Navbar.tsx` — scroll behavior, mobile menu toggle
- `src/components/layout/ThemeToggle.tsx` — hydration guard renders placeholder before mount

## Recommended Setup

If tests are added, the recommended stack for this Next.js 14 / React 18 project:

```bash
npm install --save-dev vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event
```

**Suggested `package.json` scripts:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

**Test file placement:** Co-locate with source files (e.g., `src/utils/translate-period.test.ts` next to `src/utils/translate-period.ts`)

**Priority order for first tests:**
1. `src/utils/translate-period.ts` — pure function, no mocking needed
2. `checkRateLimit` extracted from `src/app/api/generate-cv/route.ts`
3. i18n key completeness check (both locale files)

---

*Testing analysis: 2026-05-25*

# PLAN: Phase 1 — Quick Bug Fixes

**Created:** 2026-06-03T00:14:14.255+07:00
**Status:** Ready for implementation

Summary
- Small, low-risk, in-place fixes that eliminate four correctness defects (FIX-01..FIX-04). Prioritize minimal surface-area changes, preserve existing components, and add unit tests to prevent regression.

Scope (in)
- LanguageToggle and ThemeToggle: ensure `type="button"` and avoid ThemeToggle hydration CLS via server-side placeholder.
- Navbar scroll listener: register with `{ passive: true }` and throttle state updates.
- `translatePeriod` regex: add `\b` anchors and unit tests for overlapping tokens.
- Internal anchor links: standardize to plain `#id` in Hero and Navbar.

Out of scope
- Replacing scroll handlers with IntersectionObserver (deferred)
- Distributed rate limiting (Phase 3)

Approach
1. Make focused edits to the listed source files. Keep changes small and well-tested.
2. Add/update co-located unit tests for each fix.
3. Run lint, types, and test coverage. Fix any issues before PR.
4. Create a single feature branch and an atomic PR covering these related fixes.

Tasks (atomic)
- T1 — fix-toggle-buttons
  - Change `LanguageToggle` and `ThemeToggle` to use `<button type="button">` with accessible labels.
  - Add server-side stable placeholder (inline SVG or fixed-size element) in `ThemeToggle` to reserve icon space for hydration.
  - Files: `src/components/layout/ThemeToggle.tsx`, `src/components/layout/LanguageToggle.tsx`.
  - Tests: update/create `ThemeToggle.test.tsx`, `LanguageToggle.test.tsx` to assert role/button and placeholder existence.
  - Acceptance: lint/type/test pass; no CLS regression for ThemeToggle.

- T2 — make-navbar-passive
  - Register scroll listener with `{ passive: true }` and throttle updates via `requestAnimationFrame` or small debounce.
  - Files: `src/components/layout/Navbar.tsx`.
  - Tests: `Navbar.test.tsx` simulate scroll and assert behavior; no console warnings.
  - Acceptance: no console passive event warnings in tests; behavior unchanged.

- T3 — fix-translate-period
  - Update `src/utils/translate-period.ts` to use `\b` word-boundary anchors to avoid partial replacements.
  - Add `src/utils/translate-period.test.ts` with overlapping-token cases and edge cases.
  - Acceptance: tests cover edge cases; existing rendering unaffected.

- T4 — standardize-internal-anchors
  - Update `Hero.tsx` and `Navbar.tsx` to use plain `#id` for in-page links (remove `encodeURIComponent` for internal anchors).
  - Tests: update `Hero.test.tsx` and `Navbar.test.tsx` to assert correct anchor format and scrolling triggers.
  - Acceptance: in-page anchors consistent; cross-browser behavior validated by unit tests.

- T5 — add-tests-for-fixes
  - Ensure all changed code has co-located tests following project testing patterns and mocks (see `src/test/setup.ts`).
  - Acceptance: tests added/updated and run in CI.

- T6 — verify-lint-and-tests
  - Run `npm run lint`, `npm run test`, and `npm run test:coverage` locally. Fix any drift from lint, type, or coverage rules before PR.
  - Acceptance: tests and lint pass; coverage thresholds unchanged.

Verification & Done criteria
- All unit tests pass locally and in CI.
- `npm run lint` produces zero errors.
- TypeScript strict check passes (`tsc --noEmit`).
- Changes are covered by co-located tests where appropriate.

Branch & PR
- Branch name: `feat/01-quick-bug-fixes` (follow conventional commits in PR title).
- PR body: link to `.planning/phases/01-quick-bug-fixes/01-CONTEXT.md` and include a short checklist (tests added, lint OK, types OK).

Notes for planner/implementer
- Keep each task as a small commit so reviewers can focus on a single behavior per commit.
- Prefer reusing existing components and patterns; avoid refactors that change public behavior.

---
*Phase 1 plan generated from: .planning/phases/01-quick-bug-fixes/01-CONTEXT.md*

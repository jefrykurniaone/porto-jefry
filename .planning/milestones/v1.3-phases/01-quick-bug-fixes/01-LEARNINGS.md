---
phase: 1
phase_name: "Quick Bug Fixes"
project: "Porto-Jefry"
generated: "2026-06-03T12:54:44+08:00"
counts:
  decisions: 4
  lessons: 3
  patterns: 3
  surprises: 1
missing_artifacts:
  - "VERIFICATION.md"
  - "UAT.md"
---

# Phase 1 Learnings: Quick Bug Fixes

## Decisions

### D-01: Use button type="button" with accessible labels for toggles

Both LanguageToggle and ThemeToggle must be implemented as `<button type="button">` with accessible labels (e.g., `aria-label="Toggle theme"`). ThemeToggle must render a server-side stable placeholder matching the final icon's size to prevent hydration/layout shift (CLS).

**Rationale:** Ensures semantic correctness, keyboard accessibility, and prevents cumulative layout shift during hydration. Server-side placeholder reserves space before client-side icon hydration completes.

**Source:** 01-CONTEXT.md (D-01)

---

### D-02: Register scroll listeners with passive: true

Scroll listeners must be registered with `{ passive: true }` to avoid console warnings and improve scroll performance. State updates driven by scroll must be throttled using `requestAnimationFrame` or small debounce.

**Rationale:** Passive listeners allow the browser to optimize scroll performance by not blocking scroll events. Throttling prevents excessive re-renders during scroll.

**Source:** 01-CONTEXT.md (D-02)

---

### D-03: Use word-boundary anchors in translatePeriod regex

The `translatePeriod` implementation must use word-boundary anchors (`\b`) to avoid partial replacements and include unit tests covering overlapping tokens and edge cases (e.g., "May" vs "Maynard").

**Rationale:** Word boundaries prevent accidental partial replacements when month abbreviations appear within other words. Comprehensive tests guard against regression.

**Source:** 01-CONTEXT.md (D-03)

---

### D-04: Standardize on plain #id for internal anchors

Standardize on plain `#id` internal anchors for in-page links across Hero and Navbar components. Remove `encodeURIComponent` for internal hashes to ensure consistent cross-browser behavior.

**Rationale:** Plain `#id` format is the standard for same-page anchors and works consistently across all browsers. Encoding is unnecessary for internal navigation and can cause inconsistent behavior.

**Source:** 01-CONTEXT.md (D-04)

---

## Lessons

### L-01: Pre-existing fixes eliminate execution risk

All four bug fixes were already implemented in the codebase before plan execution began. Verification confirmed that ThemeToggle/LanguageToggle had correct button types, Navbar had passive listeners, translatePeriod used word boundaries, and anchor formats were standardized.

**Context:** During execution verification (T1-T6), manual code inspection and automated test runs revealed that all planned fixes were already present and correctly implemented with test coverage exceeding thresholds (92.06% lines, 93.84% functions, 89.09% statements, 67.56% branches).

**Source:** 01-SUMMARY.md (What Was Executed, Deviations from Plan)

---

### L-02: Verification-first workflow prevents duplicate work

Starting execution with comprehensive verification (checking each task's acceptance criteria before attempting changes) quickly identified that no code changes were needed, saving implementation and testing time.

**Context:** The execution followed the plan's 6 tasks (T1-T6) by verifying each fix's presence first. This verification-first approach took only 3 minutes and 2 seconds to confirm all requirements were met, avoiding unnecessary refactoring or re-implementation.

**Source:** 01-SUMMARY.md (Verification Process, Execution time: 00:03:02)

**Graduated:** CONVENTIONS.md:2026-06-03

---

### L-03: Test coverage provides confidence in existing implementation

Comprehensive test coverage (22 test files, 84 tests) across all components involved in the fixes provided immediate confidence that the existing implementations were correct and protected against regression.

**Context:** All test files existed with specific coverage for the fixed behaviors: ThemeToggle.test.tsx verified button type and placeholder, LanguageToggle.test.tsx verified button type and aria-label, Navbar.test.tsx verified passive listener and scroll behavior, Hero.test.tsx verified anchor format, and translate-period.test.ts verified word-boundary regex with edge cases.

**Source:** 01-SUMMARY.md (Test Results, Manual Verification)

**Graduated:** PROJECT.md:2026-06-03

---

## Patterns

### P-01: Co-located tests with behavior-focused assertions

All changed components have co-located test files (`ComponentName.test.tsx`) that assert behavior rather than implementation details. Tests use the project's standard mocking pattern for `next/image` and `next-themes` from `src/test/setup.ts`.

**When to use:** Apply to all component changes. Place test file next to source file and use vitest + React Testing Library to assert user-visible behavior (rendered output, interaction outcomes) rather than internal state or method calls.

**Source:** 01-CONTEXT.md (Established Patterns), 01-SUMMARY.md (Test Results)

---

### P-02: Verification commands as acceptance gates

Run the canonical verification suite (`npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run test:coverage`) as the final acceptance gate for any phase completion. These commands must pass before considering work done.

**When to use:** Before creating PR, before marking phase complete, and in CI pipeline. The sequence (lint → typecheck → test → build) must pass without warnings or errors. Coverage thresholds (80% lines/functions/statements, 65% branches) must be met.

**Source:** 01-PLAN.md (T6 - verify-lint-and-tests), 01-SUMMARY.md (Verification Results)

**Graduated:** TESTING.md:2026-06-03

---

### P-03: Manual code inspection for pre-existing implementations

When verifying plan requirements, manually inspect source files at specific lines to confirm implementation details before attempting changes. This pattern prevents unnecessary refactoring and validates that existing code meets requirements.

**When to use:** At the start of execution for phases involving bug fixes or correctness improvements. Check each requirement's implementation location and verify it matches the plan's acceptance criteria. Document findings with file paths and line numbers.

**Source:** 01-SUMMARY.md (Manual Verification, Deviations from Plan)

**Graduated:** CONVENTIONS.md:2026-06-03

---

## Surprises

### S-01: Zero implementation work required for bug fix phase

Despite planning for implementation of four bug fixes across six files, all fixes were already present in the codebase with complete test coverage, requiring zero code changes or new commits.

**Impact:** Positive - execution completed in 3 minutes instead of the estimated implementation time. The phase validated that the identified bugs were already fixed and protected by tests, eliminating regression risk. However, this also highlighted a potential gap between issue identification and current codebase state verification during planning.

**Source:** 01-SUMMARY.md (Major Deviation: All Fixes Already Implemented), Metrics (files_modified: 0, lines_changed: 0, tests_added: 0)

---

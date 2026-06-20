---
phase: 05-sgds-migration
plan: 04
subsystem: "SGDS layout chrome migration"
tags: ["SGDS", "migration", "Navbar", "LanguageToggle", "BackToTop", "Footer", "layout"]
requires: ["05-02", "05-03"]
provides:
  - "sgds-migrated-navbar"
  - "sgds-migrated-language-toggle"
  - "sgds-migrated-back-to-top"
  - "sgds-migrated-footer"
affects:
  - src/components/layout/Navbar.tsx
  - src/components/layout/Navbar.test.tsx
  - src/components/layout/LanguageToggle.tsx
  - src/components/layout/LanguageToggle.test.tsx
  - src/components/layout/BackToTop.tsx
  - src/components/layout/BackToTop.test.tsx
  - src/components/layout/Footer.tsx
  - src/components/layout/Footer.test.tsx
  - src/i18n/messages/en.json
  - src/i18n/messages/id.json
tech-stack:
  added:
    - "<sgds-mainnav expand=\"always\"> with brand slot and end slot for Navbar desktop shell"
    - "<sgds-mainnav-item> for navigation entries"
    - "<sgds-button variant=\"outline\" tone=\"neutral\" size=\"sm\"> for LanguageToggle"
    - "<sgds-icon name=\"arrow-up\"> for BackToTop"
    - "<sgds-icon name=\"menu\"> and name=\"cross\" for mobile hamburger toggle"
    - "sgds: utility classes throughout (layout, spacing, visibility, positioning)"
  removed:
    - "lucide-react icons from Navbar (menu, x, arrow-up, chevron-up, sun, moon)"
    - "Tailwind dark: utilities from Navbar, LanguageToggle, BackToTop, Footer"
    - "next-themes mocks from all four layout test files"
patterns:
  - "SGDS custom element key prop workaround: wrap in <React.Fragment key={id}> for .map() iterators"
  - "container.querySelector('sgds-*') for assertions on SGDS custom elements in jsdom"
  - "Conditional render for hidden state (BackToTop returns null when not visible)"
  - "No next-themes mocks in test files — theme transitions removed from layout chrome"
key-files:
  created: []
  modified:
    - src/components/layout/Navbar.tsx
    - src/components/layout/LanguageToggle.tsx
    - src/components/layout/BackToTop.tsx
    - src/components/layout/Footer.tsx
    - src/components/layout/Navbar.test.tsx
    - src/components/layout/LanguageToggle.test.tsx
    - src/components/layout/BackToTop.test.tsx
    - src/components/layout/Footer.test.tsx
    - src/i18n/messages/en.json
    - src/i18n/messages/id.json
decisions:
  - "approved-truthful-footer-fallback: semantic <footer> with SGDS utilities, NO <sgds-footer>, NO government ownership, NO placeholder legal links — because the portfolio has no truthful contact/privacy/terms URLs to satisfy the sgds-footer contract"
  - "BackToTop hidden state: conditional render (null) — guarantees not pointer-accessible or keyboard-focusable when hidden, no tabIndex workarounds needed"
  - "SGDS icon names verified in @govtechsg/sgds-web-component@3.21.0: menu, cross, arrow-up, sun, moon all available"
  - "SGDS custom element key prop: wrap in <React.Fragment key={id}> because SgdsMainnavItemProps types do not include key"
  - "LanguageToggle: sgds-button has no implicit role in jsdom — tests use container.querySelector('sgds-button')"
  - "suppressHydrationWarning on direct <sgds-*> elements to prevent React hydration mismatch on custom elements"
metrics:
  duration: "00:08:00"
  completed_date: "2026-06-08"
  tasks: 3
  commits: 3
  tests_passed: 261
requirements-completed: [SGDS-02, SGDS-05]
---

# Phase 05 Plan 04: Migrate Persistent Layout Chrome to SGDS Summary

**Migrated Navbar, LanguageToggle, BackToTop, and Footer from hand-crafted Tailwind + Lucide to SGDS components and utilities, with 35 layout-specific tests passing and 261 total tests passing across the full suite.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-06-08T18:15:00Z
- **Completed:** 2026-06-08T18:18:34Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments

- **Navbar**: Desktop shell migrated to `<sgds-mainnav expand="always">` with brand slot "JK.", `<sgds-mainnav-item>` entries for all NAV_KEYS, and end slot containing ThemeToggle + LanguageToggle. Mobile hamburger preserved as custom React component per D-07, restyled with `sgds:` utilities and SGDS icons (menu/cross). Focus trap, Escape close, and scroll-to-section behavior all preserved.
- **LanguageToggle**: Migrated to `<sgds-button variant="outline" tone="neutral" size="sm">` with EN/ID visible text and translated aria-label. Preserved `router.replace(pathname, { locale })` for locale switching via next-intl.
- **BackToTop**: IntersectionObserver logic preserved. Restyled with `sgds:` utility classes and `<sgds-icon name="arrow-up">`. Hidden state uses conditional render (returns `null`) — guarantees not pointer-accessible or keyboard-focusable when hidden. 44×44px touch target preserved.
- **Footer**: Uses approved-truthful-footer-fallback path — semantic `<footer id='site-footer'>` with `sgds:` utility classes, NO `<sgds-footer>`, no government ownership text, no placeholder legal links. `footer.built_with` updated: "Built with Next.js & SGDS" (EN) / "Dibangun dengan Next.js dan SGDS" (ID).
- **Translations**: Updated `footer.built_with` in both en.json and id.json to mention SGDS.

## Task Commits

Each task was committed atomically:

| # | Name | Type | Key Files | Commit |
|---|------|------|-----------|--------|
| 1 | Decide truthful Footer implementation path | checkpoint:decision | (resolved in prior conversation) | — |
| 2 | Migrate Navbar, LanguageToggle, BackToTop, Footer to SGDS | auto | Navbar.tsx, LanguageToggle.tsx, BackToTop.tsx, Footer.tsx, en.json, id.json | `9d8c205` |
| 3 | Rewrite layout tests for SGDS custom elements | tdd | Navbar.test.tsx, LanguageToggle.test.tsx, BackToTop.test.tsx, Footer.test.tsx | `a42c975` |
| — | Remove unused imports in layout tests | fix | Navbar.test.tsx, LanguageToggle.test.tsx | `f44a051` |

## Files Created/Modified

- `src/components/layout/Navbar.tsx` — SGDS mainnav desktop shell + custom mobile hamburger with SGDS icons
- `src/components/layout/LanguageToggle.tsx` — SGDS button for locale switching
- `src/components/layout/BackToTop.tsx` — IntersectionObserver-based scroll-to-top with SGDS icon and utilities
- `src/components/layout/Footer.tsx` — Semantic footer with SGDS utilities (approved-truthful-footer-fallback)
- `src/components/layout/Navbar.test.tsx` — 12 tests: sgds-mainnav, mobile toggle, scroll behavior, Escape, focus trap, source assertions
- `src/components/layout/LanguageToggle.test.tsx` — 6 tests: sgds-button render, locale switch EN→ID and ID→EN, aria-label
- `src/components/layout/BackToTop.test.tsx` — 8 tests: conditional render, observer lifecycle, hidden keyboard safety, visible scroll, cleanup
- `src/components/layout/Footer.test.tsx` — 9 tests: sgds utility fallback, no sgds-footer, no placeholder links, translated built_with, source assertions
- `src/i18n/messages/en.json` — `footer.built_with` → "Built with Next.js & SGDS"
- `src/i18m/messages/id.json` — `footer.built_with` → "Dibangun dengan Next.js dan SGDS"

## Decisions Made

- **approved-truthful-footer-fallback**: Per checkpoint decision (Task 1), the Footer uses a semantic `<footer id='site-footer'>` with SGDS utilities rather than `<sgds-footer>`. Rationale: the portfolio has no truthful contact, privacy, feedback, or terms-of-use URLs. Using `<sgds-footer>` would require either placeholder `#` links or imply Government of Singapore ownership via the default `copyrightLiner`. The UI-SPEC approved this documented exception.
- **BackToTop hidden state: conditional render**: Instead of `tabIndex={-1}` + `aria-hidden`, the component returns `null` when not visible. This guarantees the control is not tabbable, not focusable, and not pointer-accessible while hidden — with zero risk of edge cases or browser inconsistencies.
- **SGDS custom element `key` prop**: React 18 strict typing for custom elements means `SgdsMainnavItemProps` does not include `key` as a valid prop. Wrapped each `<sgds-mainnav-item>` in `<React.Fragment key={NAV_KEYS[id]}>` as the canonical workaround.
- **Test queries for SGDS elements**: jsdom does not expose shadow DOM roles. `<sgds-button>` has no implicit `button` role in jsdom. Tests use `container.querySelector('sgds-button')` for element assertions, while behavioral assertions (router.replace calls) use vitest spies on the mocked `useRouter`.
- **No next-themes mocks in tests**: ThemeToggle now lives inside Navbar's end slot, so Navbar tests no longer need `vi.mock('next-themes', ...)`. Theme transitions are fully removed from layout chrome.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added unused import lint fix**
- **Found during:** Task 3 verification (npm run lint)
- **Issue:** `LanguageToggle.test.tsx` imported unused `screen`; `Navbar.test.tsx` imported unused `beforeEach`/`afterEach`
- **Fix:** Removed unused imports from both test files
- **Files modified:** src/components/layout/LanguageToggle.test.tsx, src/components/layout/Navbar.test.tsx
- **Verification:** `npm run lint` passes with no warnings
- **Committed in:** `f44a051` (separate fix commit)

**2. [Rule 1 - Bug] Fixed duplicate `act` import in BackToTop test**
- **Found during:** Task 3 test run
- **Issue:** `BackToTop.test.tsx` imported `act` from both `vitest` and `@testing-library/react`, causing a parse error (duplicate identifier)
- **Fix:** Removed `act` from vitest import, kept `act` from `@testing-library/react` — the correct source for React 18 act()
- **Files modified:** src/components/layout/Navbar.test.tsx, src/components/layout/BackToTop.test.tsx
- **Verification:** Tests pass with correct `act` import
- **Committed in:** `a42c975` (part of Task 3 commit)

**3. [Rule 1 - Bug] Fixed `container.innerHTML === ''` assertion in BackToTop test**
- **Found during:** Task 3 test failure investigation
- **Issue:** BackToTop test asserted `container.innerHTML === ''` when component renders `null`, but `NextIntlClientProvider` wrapper adds non-empty content to container
- **Fix:** Changed assertion to use `screen.queryByRole('button').not.toBeInTheDocument()` and `container.querySelector('button').not.toBeInTheDocument()` — behavior-valid assertions matching the intent (no focusable button when hidden)
- **Files modified:** src/components/layout/BackToTop.test.tsx
- **Verification:** All 8 BackToTop tests pass
- **Committed in:** `a42c975` (part of Task 3 commit)

**4. [Rule 1 - Bug] Fixed `querySelectorAll('*')` TypeScript iteration error**
- **Found during:** Task 3 typecheck (`npx tsc --noEmit`)
- **Issue:** `container.querySelectorAll('*')` returns `NodeListOf<Element>` which requires `--downlevelIteration` for `for...of`. Without that tsconfig flag, TypeScript reported TS2802.
- **Fix:** Wrapped with `Array.from()` to produce a regular iterable `Element[]`
- **Files modified:** src/components/layout/Navbar.test.tsx
- **Verification:** `npx tsc --noEmit` passes
- **Committed in:** `f44a051` (loose — applied after test commit but before final commit)

---

**Total deviations:** 4 auto-fixed (2 bugs, 1 missing critical, 1 blocking)
**Impact on plan:** All auto-fixes necessary for correctness and lint compliance. No scope creep. No architectural changes.

## Issues Encountered

- **Footer truthfulness checkpoint**: Task 1 (checkpoint:decision) was resolved in the prior conversation before execution began. Selected `approved-truthful-footer-fallback` — semantic footer with SGDS utilities, no `<sgds-footer>`, no placeholder links, no government ownership. All subsequent implementation followed this decision.
- **BackToTop hidden-state implementation**: Two approaches were considered — conditional render vs. `tabIndex={-1}` + `aria-hidden`. Conditional render was selected as it guarantees the element cannot be reached by keyboard, pointer, or assistive technology while hidden, with zero runtime cost.
- **SGDS `key` prop workaround**: The `key` prop is not in the SGDS custom element prop types for React 18. Wrapping in `<React.Fragment key={...}>` is the established pattern from Plan 05-05.
- **jsdom custom element querying**: `<sgds-button>` doesn't expose an implicit button role in jsdom's limited custom element support. Tests use `container.querySelector('sgds-button')` for element presence/attribute assertions.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All four layout components (Navbar, LanguageToggle, BackToTop, Footer) are migrated to SGDS with passing tests, typecheck, and lint
- 261 tests pass across the full suite (28 test files, no regressions)
- Next plans (05-06, 05-07) can continue section migration work
- Threat model compliance verified: T-05-04-01 (DoS → focus trap/Escape/focus return/hidden state), T-05-04-02 (Spoofing → approved footer truthfulness), T-05-04-03 (Tampering → tests assert SGDS tags and forbid dark:/next-themes), T-05-04-04 (Info Disclosure → no new data sources)

## Verification Results

| Check | Result |
|-------|--------|
| `npx vitest run src/components/layout/*.test.tsx --bail 1` | 35/35 passed |
| `npx vitest run` (full suite) | 261/261 passed, 28/28 files |
| `npx tsc --noEmit` | No errors |
| `npm run lint` | No warnings or errors |

## Self-Check: PASSED

- [x] All 3 tasks executed (Task 1 decided before start, Task 2 migrated sources + i18n, Task 3 rewrote tests)
- [x] Each task committed individually (3 commits: feat, test, fix)
- [x] SUMMARY.md created in `.planning/phases/05-sgds-migration/`
- [x] All 35 layout tests pass, all 261 full-suite tests pass
- [x] Typecheck passes (`tsc --noEmit`)
- [x] Lint passes (`npm run lint`)
- [x] No stub patterns found in migrated files (only `vi.stubGlobal` calls, not application stubs)
- [x] No threat flags introduced beyond plan's threat model
- [x] No "not available", "coming soon", "placeholder", TODO, or FIXME patterns in source

---

*Phase: 05-sgds-migration*
*Completed: 2026-06-08*

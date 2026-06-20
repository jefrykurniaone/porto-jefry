---
phase: 04-code-quality-type-safety-deferred-phase-7
plan: "06"
subsystem: testing
tags: [eslint, sonarjs, lint, code-quality, max-lines, max-lines-per-function]

requires:
  - phase: 04-code-quality-type-safety-deferred-phase-7
    provides: "Wave 1 source violations cleaned (plans 04-01..04-05)"

provides:
  - "eslint-plugin-sonarjs installed as devDependency"
  - "QUAL-02 rules active at error level: max-lines (300), max-lines-per-function (40), sonarjs/no-nested-template-literals"
  - "Test files (*.test.ts / *.test.tsx) exempt from length rules via overrides block"
  - "Full CI chain green with QUAL-02 gate active"

affects:
  - future-phases
  - code-quality-gate

tech-stack:
  added:
    - "eslint-plugin-sonarjs (SonarSource, LGPL-3.0, dev-only)"
  patterns:
    - "Lint rules active at error level as CI gate — not advisory warnings"
    - "Test file overrides block pattern for exempting test globs from style rules"
    - "Private helper function extraction to meet max-lines-per-function limit"

key-files:
  created: []
  modified:
    - ".eslintrc.json"
    - "package.json"
    - "package-lock.json"
    - "src/hooks/use-focus-trap.ts"

key-decisions:
  - "Only sonarjs/no-nested-template-literals activated from sonarjs plugin — not the full recommended set, to avoid unrelated violations"
  - "useFocusTrap refactored by extracting handleFocusTrapKeyDown as a private module-level helper to keep useEffect callback within 40-line limit"

patterns-established:
  - "Overrides block exempts test files from length rules, not from logic/quality rules"
  - "Private helper extraction (module-level, non-exported) is the pattern for keeping hook bodies within 40-line limit"

requirements-completed: [QUAL-02]

duration: 15min
completed: 2026-06-20
---

# Phase 04 Plan 06: QUAL-02 Lint Gate Summary

**eslint-plugin-sonarjs installed and three error-level lint rules active (max-lines 300, max-lines-per-function 40, sonarjs/no-nested-template-literals) with test-file overrides; full CI chain green**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-06-20T00:25:00Z
- **Completed:** 2026-06-20T00:42:03Z
- **Tasks:** 2 (Task 1 was a human-verify checkpoint, cleared before this agent ran)
- **Files modified:** 4

## Accomplishments

- Installed `eslint-plugin-sonarjs` (SonarSource, LGPL-3.0) as a devDependency — supply-chain gate confirmed by human before install
- Updated `.eslintrc.json` with sonarjs plugin, three error-level rules, and a test-file overrides block
- Fixed `useFocusTrap` function-length violation (44 lines → under 40) by extracting `handleFocusTrapKeyDown` as a private helper
- Full CI chain passed: lint (0 errors), typecheck (0 errors), 598 tests passed, build succeeded with prebuild codegen setting `LAST_MODIFIED_DATE=2026-06-20`

## Task Commits

Each task was committed atomically:

1. **Task 1: Verify eslint-plugin-sonarjs legitimacy (supply-chain gate)** — Cleared by human before this agent ran (no commit; checkpoint only)
2. **Task 2: Install eslint-plugin-sonarjs and activate QUAL-02 rules** — `2534f70` (feat)
3. **Task 3: Full CI-chain verification** — No separate commit; verification passed, no new files changed

**Plan metadata:** (docs commit — see final state update)

## Files Created/Modified

- `.eslintrc.json` — Added `plugins: ["sonarjs"]`, three error-level rules, and test-file overrides block
- `package.json` — Added `eslint-plugin-sonarjs` to devDependencies
- `package-lock.json` — Updated lockfile for new package (125 packages added)
- `src/hooks/use-focus-trap.ts` — Extracted `handleFocusTrapKeyDown` private helper to keep `useFocusTrap` within 40-line limit

## Decisions Made

- Only `sonarjs/no-nested-template-literals` enabled from the sonarjs plugin (not the full recommended set), as per D-02 context decision — avoids introducing unrelated violations in Wave 2
- `useFocusTrap` refactored by extracting `handleFocusTrapKeyDown` as a module-level private helper rather than relaxing the rule or adding a source-file exception — keeps CI gate strict

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed useFocusTrap function exceeding 40-line limit**
- **Found during:** Task 2 (rule activation + lint run)
- **Issue:** `useFocusTrap` in `src/hooks/use-focus-trap.ts` had a `useEffect` callback spanning 36 lines inside a function body of 43 lines total, violating `max-lines-per-function: 40`
- **Fix:** Extracted the keyboard event handler into a private module-level helper `handleFocusTrapKeyDown` — keeps both the helper and the hook body within 40 lines. No behavioral change; same logic, same tests pass.
- **Files modified:** `src/hooks/use-focus-trap.ts`
- **Verification:** `npm run lint` exits 0; `npm run test` 598 tests passed
- **Committed in:** `2534f70` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** The plan stated Wave 1 cleaned all violations, but one was missed in `use-focus-trap.ts` (created in Plan 05). The fix is minimal and correct — same behavior, no scope creep.

## Issues Encountered

- `useFocusTrap` function-length violation not caught in Wave 1 (created in Plan 05 — the hook was new, so its length wasn't checked against the lint rule that wasn't active yet). Fixed inline per Rule 1.

## User Setup Required

None — no external service configuration required. `eslint-plugin-sonarjs` is dev-only.

## Known Stubs

None — no stubs or placeholders introduced.

## Threat Flags

No new security surface introduced. `eslint-plugin-sonarjs` is a dev-only lint tool; not shipped to production bundle.

## Next Phase Readiness

- QUAL-02 gate is live and CI-blocking — future PRs will fail lint if max-lines, max-lines-per-function, or nested template literals are violated
- Phase 04 complete — all 6 plans executed, Wave 1 source violations cleaned, Wave 2 gate active
- No blockers for next phase

---
*Phase: 04-code-quality-type-safety-deferred-phase-7*
*Completed: 2026-06-20*

---
phase: 05
slug: sgds-migration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-06
---

# Phase 05 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.7 + React Testing Library + jsdom |
| **Config file** | `vitest.config.ts`; setup in `src/test/setup.ts` |
| **Quick run command** | `npm run test` |
| **Full suite command** | `npm run lint && npx tsc --noEmit && npm run test:coverage && npm run build` |
| **Estimated runtime** | ~120 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test`
- **After every plan wave:** Run `npm run lint && npx tsc --noEmit && npm run test:coverage && npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | SGDS-01 | T-05-01 / - | SGDS imports and theme state do not weaken CSP nonce handling or locale routing | unit/build | `npm run lint && npx tsc --noEmit && npm run test` | W0 | pending |
| 05-02-01 | 02 | 1 | SGDS-02 | T-05-02 / - | Navigation and footer remain keyboard-accessible after SGDS migration | unit/a11y assertions | `npm run test` | W0 | pending |
| 05-03-01 | 03 | 2 | SGDS-03 | T-05-03 / - | Hero/About/Experience/Education content remains localized and semantic | unit/render | `npm run test` | W0 | pending |
| 05-04-01 | 04 | 2 | SGDS-04 | T-05-04 / - | Skills/Projects/Certifications/Contact interactions remain reachable by keyboard | unit/render | `npm run test` | W0 | pending |
| 05-05-01 | 05 | 3 | SGDS-05 | T-05-05 / - | Regression suite, coverage threshold, lint, typecheck, and production build all pass | full-suite | `npm run lint && npx tsc --noEmit && npm run test:coverage && npm run build` | W0 | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `src/test/setup.ts` — verify SGDS custom elements are safe in jsdom tests.
- [ ] Component test updates — add or adapt mocks/assertions for SGDS web components before section migrations rely on them.
- [ ] Existing infrastructure covers framework installation; no new test runner is required.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Desktop and mobile visual review of SGDS theme, layout, and section spacing | SGDS-02, SGDS-03, SGDS-04 | jsdom cannot validate rendered SGDS visual styling or responsive layout quality | Run `npm run dev`, inspect `/en` and `/id` at mobile and desktop widths, and confirm day/night theme parity. |
| CV download and contact links remain usable after SGDS component migration | SGDS-04 | External link/download behavior is only partially covered by component tests | In browser, activate the CV download and each Contact action with keyboard and pointer. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

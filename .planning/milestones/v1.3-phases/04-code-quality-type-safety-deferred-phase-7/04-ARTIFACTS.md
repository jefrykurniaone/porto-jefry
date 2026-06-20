# Phase 04 — Artifacts this phase produces

Every symbol, file, and config key this phase creates or changes. Downstream agents
(execute-phase, verification) treat this as the authoritative inventory.

## New exported symbols

| Symbol | Kind | File | Plan | Requirement |
|--------|------|------|------|-------------|
| `ExperienceMessages` | exported interface | `src/components/sections/Experience.tsx` | 04-01 | TYPE-01 |
| `TECH_SITEFINITY_DOTNET` | exported/module const (string[]) | `src/data/projects.ts` | 04-03 | QUAL-03 |
| `TECH_VBNET_WEBFORMS` | exported/module const (string[]) | `src/data/projects.ts` | 04-03 | QUAL-03 |

## New files

| File | Purpose | Plan | Requirement |
|------|---------|------|-------------|
| `scripts/gen-build-meta.mjs` | Build-time codegen: derives `LAST_MODIFIED_DATE` from `git log -1 --format=%cs` with `new Date()` fallback; rewrites `src/utils/constants.ts` | 04-02 | QUAL-01 |
| `src/hooks/use-focus-trap.ts` | `useFocusTrap` — extracted mobile-menu focus-trap effect (Escape close, Tab wrap, initial focus) | 04-05 | QUAL-02 |
| `src/hooks/use-cv-download.ts` | `useCvDownload` — extracted CV download logic (fetch, blob, localized error, auto-clear) | 04-05 | QUAL-02 |

> Note: 04-05 may optionally also create `src/hooks/use-scrolled.ts` (extracted Navbar scroll-state effect) if needed to bring `Navbar` under 40 lines. If created, it is owned exclusively by plan 04-05.

## Private (in-file) sub-components / helpers introduced (no new exports)

| Symbol (suggested name) | File | Plan |
|-------------------------|------|------|
| `ExperienceBulletList` | `src/components/sections/Experience.tsx` | 04-01 |
| `resolveLocale`, `rateLimitGuard`, `renderCvResponse` | `src/app/api/generate-cv/route.ts` | 04-04 |
| `ErrorActions` | `src/app/[locale]/error.tsx` | 04-04 |
| `ProjectCard` | `src/components/sections/Projects.tsx` | 04-04 |
| `AboutContactLinks` | `src/components/sections/About.tsx` | 04-04 |
| `buildContactLinks` (or `useContactLinks`) | `src/components/sections/Contact.tsx` | 04-05 |
| Navbar header sub-component (optional) | `src/components/layout/Navbar.tsx` | 04-05 |
| Hero photo/heading sub-component (optional) | `src/components/sections/Hero.tsx` | 04-05 |

(Names are recommendations; executor may choose equivalent descriptive names. They are NOT
exported across module boundaries.)

## New config keys / dependency changes

| Change | File | Plan | Requirement |
|--------|------|------|-------------|
| `eslint-plugin-sonarjs` devDependency | `package.json` / `package-lock.json` | 04-06 | QUAL-02 |
| `plugins: ["sonarjs"]` | `.eslintrc.json` | 04-06 | QUAL-02 |
| `max-lines: [error, 300]` | `.eslintrc.json` | 04-06 | QUAL-02 |
| `max-lines-per-function: [error, 40]` | `.eslintrc.json` | 04-06 | QUAL-02 |
| `sonarjs/no-nested-template-literals: error` | `.eslintrc.json` | 04-06 | QUAL-02 |
| `overrides` block disabling length rules for `*.test.ts` / `*.test.tsx` | `.eslintrc.json` | 04-06 | QUAL-02 |
| `prebuild` script running `node scripts/gen-build-meta.mjs` | `package.json` | 04-02 | QUAL-01 |
| Regenerated `LAST_MODIFIED_DATE` (now generated, not hand-edited) | `src/utils/constants.ts` | 04-02 | QUAL-01 |

## Files modified (no new symbols, refactor only)

`src/app/api/generate-cv/route.ts`, `src/app/[locale]/error.tsx`,
`src/components/sections/Projects.tsx`, `src/components/sections/About.tsx`,
`src/components/sections/Contact.tsx`, `src/components/layout/Navbar.tsx`,
`src/components/sections/Hero.tsx` — function-length refactors (QUAL-02).

---

# Multi-Source Coverage Audit

Every source item mapped to a plan. No item is MISSING.

## GOAL (ROADMAP Phase 4 success criteria)

| # | ROADMAP success criterion | Plan(s) | Status |
|---|---------------------------|---------|--------|
| 1 | `ExperienceMessages` top-level exported interface; no double cast; strict mode zero errors | 04-01 | COVERED |
| 2 | Experience bullets via `useTranslations`; `useMessages()` no longer called | 04-01 | COVERED |
| 3 | `LAST_MODIFIED_DATE` from last git commit date automatically at build time | 04-02 | COVERED |
| 4 | `eslint-plugin-sonarjs` installed/active; lint fails on max-lines, max-lines-per-function, no-nested-template-literals | 04-04, 04-05 (refactors), 04-06 (activation) | COVERED |
| 5 | Shared tech stacks extracted as `TECH_*` constants; no duplicated arrays; file under 300 lines | 04-03 | COVERED |

## REQ (phase requirement IDs)

| Requirement | Plan(s) | Status |
|-------------|---------|--------|
| TYPE-01 | 04-01 | COVERED |
| TYPE-02 | 04-01 | COVERED |
| QUAL-01 | 04-02 | COVERED |
| QUAL-02 | 04-04, 04-05, 04-06 | COVERED |
| QUAL-03 | 04-03 | COVERED |

## CONTEXT (locked decisions D-01..D-06)

| Decision | Plan(s) | Status |
|----------|---------|--------|
| D-01 / D-01a (git commit date at build time, single repo-wide date, safe fallback) | 04-02 | COVERED |
| D-02 (SonarJS-style rules at error level) | 04-06 | COVERED |
| D-03 (test files exempt via overrides) | 04-06 | COVERED |
| D-04 / D-04a (fix existing source violations in-phase; build stays green) | 04-04, 04-05 (fixes), 04-06 (activation after fixes) | COVERED |
| D-05 / D-05a / D-05b (one TECH_* const per exact-duplicate array; near-dupes inline; constants at top of projects.ts unless >300 lines) | 04-03 | COVERED |
| D-06 (exported `ExperienceMessages`; `useTranslations`-based access replacing double cast; preserve `expItems[exp.id]?.bullets ?? []`) | 04-01 | COVERED |

## RESEARCH

No RESEARCH.md exists for this phase (research disabled by project config). The two CONTEXT.md
items flagged "resolve in research/planning" were resolved during planning by inspecting source:
- QUAL-01 build-time mechanism → prebuild codegen script writing `constants.ts` (Plan 04-02).
- TYPE-02 idiomatic next-intl access → `useTranslations('experience')` + `t.raw('items')` asserted
  to `ExperienceMessages['items']` (Plan 04-01).

## Exclusions (not gaps)

- CONTEXT.md "Deferred Ideas": None.
- The original ROADMAP `[DEFERRED → Phase 7]` tag is superseded — all five requirements are
  planned and in scope for Phase 4.

**Result: 0 unplanned items. No phase split required.**

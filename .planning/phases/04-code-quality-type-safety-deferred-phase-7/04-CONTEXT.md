# Phase 4: Code Quality & Type Safety - Context

**Gathered:** 2026-06-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Internal code-quality and type-safety hardening of the existing portfolio. **No user-facing feature or visual changes.** Five requirements are in scope, all roadmap-defined:

- **TYPE-01** — `ExperienceMessages` becomes a top-level exported interface (not declared inside the component function body).
- **TYPE-02** — Experience bullets are read via `useTranslations` namespace drilling, removing the `messages.experience as unknown as ExperienceMessages` double cast.
- **QUAL-01** — `LAST_MODIFIED_DATE` is derived automatically instead of a hardcoded string.
- **QUAL-02** — A SonarJS-style ESLint ruleset enforces `max-lines` (300), `max-lines-per-function` (40), and `no-nested-template-literals`.
- **QUAL-03** — Duplicated tech-stack arrays in `src/data/projects.ts` are extracted as named constants.

This phase was tagged `[DEFERRED → Phase 7]` in the roadmap; the user has chosen to proceed with it as Phase 4. Scope is the five requirements above — nothing added, nothing dropped.

</domain>

<decisions>
## Implementation Decisions

### QUAL-01 — Stale `LAST_MODIFIED_DATE`
- **D-01:** The date MUST reflect the **last git commit date**, derived at build time (e.g. `git log -1 --format=%cs`). Rationale: it is the most accurate freshness signal for the sitemap `lastmod` (SEO) — it changes only when content/code actually changes, unlike a raw build date which bumps on every unrelated redeploy.
- **D-01a:** Single repo-wide last-commit date is sufficient (per-page git dates were considered and rejected as overkill for a single-page portfolio).
- **Constraint to resolve in research/planning:** git must be available where the date is computed. It runs at **build time** (Vercel build has full git history), NOT at request time / edge runtime. Consumer is `src/app/sitemap.ts` via `src/utils/constants.ts`. Researcher should confirm the cleanest mechanism (build-time generation of the constant vs. reading commit metadata) and a safe fallback if git is unavailable (e.g. `new Date()`), so the build never breaks.

### QUAL-02 — Lint enforcement policy
- **D-02:** SonarJS-style rules are set to **`error`** (CI-blocking). Enforcement must be real, not advisory — this codifies the existing coding-standard limits (300 lines/file, 40 lines/function).
- **D-03:** **Test files (`*.test.ts` / `*.test.tsx`) are exempted** from the length rules (`max-lines`, `max-lines-per-function`). Test files legitimately run long (existing test files are 250–270 lines and that is acceptable). Use an ESLint `overrides` block for the test glob.
- **D-04:** **Existing source-code violations are fixed within this phase** so the build stays green the instant the rules activate. No broken CI is handed off. Researcher/planner MUST first inventory current violations (especially `max-lines-per-function` ≤ 40) across `src/**` non-test files and include the refactors in scope. Candidate files to check: `src/components/cv/cv-styles.ts` (266 lines), `src/app/api/generate-cv/route.ts` (154 lines), `src/components/layout/Navbar.tsx` (178 lines).
- **D-04a:** Decision delegated to Claude's judgement by the user (user was not familiar with lint policy trade-offs). Captured rationale above so the user can revisit if desired.
- **Implementation note:** `max-lines` and `max-lines-per-function` are **core ESLint rules** (not SonarJS); `no-nested-template-literals` is provided by `eslint-plugin-sonarjs`. The requirement reads "eslint-plugin-sonarjs (or equivalent)" — planner should wire the core rules + the SonarJS plugin together to cover all three named rules. The project currently uses legacy `.eslintrc.json` (extends `next/core-web-vitals`, `next/typescript`) — keep that format unless research shows a flat-config migration is cleaner.

### QUAL-03 — Tech-stack duplication in `projects.ts`
- **D-05:** Extract **one named constant per exact-duplicate array** (e.g. `SITEFINITY_DOTNET_STACK` appears in 3 projects, the `Sitecore`/`.NET` and `VB.NET`/`ASP.NET Web Forms`/`SSRS`/`SSIS` stacks repeat verbatim across multiple entries). Constants use `SCREAMING_SNAKE_CASE` per naming standard.
- **D-05a:** Composable base + spread (`[...BASE, 'extra']`) was considered and rejected — extract only verbatim duplicates to keep the file readable; near-duplicates with small differences stay inline.
- **D-05b:** Constants may live at the top of `src/data/projects.ts` (file is currently 232 lines — well under the 300 limit, so a separate file is not required). If extraction would push the file over 300 lines, move stacks to `src/data/tech-stacks.ts` instead.

### TYPE-01 / TYPE-02 — Experience type safety
- **D-06:** Mechanical refactor with one obvious correct form; no user input needed. Lift `ExperienceMessages` to a top-level **exported** interface and replace `useMessages()` + `as unknown as` with `useTranslations`-based access. Researcher should confirm the idiomatic next-intl pattern for reading the per-item `bullets` array (e.g. `t.raw(...)` typed against the exported interface, or namespace drilling) so the double cast is fully eliminated while preserving current behaviour: `bullets={expItems[exp.id]?.bullets ?? []}` keyed by `exp.id`.

### Claude's Discretion
- QUAL-02 enforcement policy (D-02/D-03/D-04) was explicitly delegated to Claude by the user. Documented above as locked decisions; user may override.
- The exact next-intl access mechanism for TYPE-02 (D-06) — implementation detail for researcher/planner.
- Exact constant naming for D-05 — keep descriptive and `SCREAMING_SNAKE_CASE`.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & roadmap
- `.planning/REQUIREMENTS.md` §Type Safety, §Code Quality — TYPE-01, TYPE-02, QUAL-01, QUAL-02, QUAL-03 definitions and acceptance wording.
- `.planning/ROADMAP.md` → "Phase 4: Code Quality & Type Safety" — goal and 5 success criteria.

### Coding standards (these rules are what QUAL-02 enforces)
- `.github/copilot-instructions.md` — max 300 lines/file, 40 lines/function; naming conventions (`camelCase` / `PascalCase` / `SCREAMING_SNAKE_CASE`); no empty catch blocks.
- `copilot-instructions.md` (repo root, extended version) — same standards, fuller detail.

### Target source files
- `src/components/sections/Experience.tsx` — TYPE-01/02 (double cast at line ~69, inline interface at ~66).
- `src/utils/constants.ts` — QUAL-01 (`LAST_MODIFIED_DATE`).
- `src/app/sitemap.ts` — QUAL-01 consumer (sitemap `lastmod`).
- `src/data/projects.ts` — QUAL-03 (duplicated `tech` arrays).
- `.eslintrc.json` — QUAL-02 (currently bare; rules added here).

No external ADRs/specs exist for this phase — decisions fully captured above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useTranslations`/`useLocale` from `next-intl` already imported in `Experience.tsx` — TYPE-02 reuses them; `useMessages` import is removed.
- `src/i18n/messages/en.json` & `id.json` hold the `experience.items.<id>.bullets` arrays the typed access must match.

### Established Patterns
- Constants live in `src/utils/constants.ts` and are `SCREAMING_SNAKE_CASE` (`BASE_URL`, `LAST_MODIFIED_DATE`) — D-05 constants follow the same convention.
- Project uses legacy `.eslintrc.json` (not flat config). CI order: lint → typecheck → test → build — a `max-lines` error will fail the lint stage before build.
- 80% line/function/statement coverage, 65% branch enforced; CV components, API routes, middleware, i18n excluded from coverage.

### Integration Points
- `LAST_MODIFIED_DATE` → consumed by `src/app/sitemap.ts`; build-time derivation must keep the same export shape so `sitemap.ts` needs no signature change (string in `YYYY-MM-DD` form preferred to stay compatible).
- New ESLint rules apply repo-wide via `.eslintrc.json`; test-glob `overrides` scopes the exemptions.

</code_context>

<specifics>
## Specific Ideas

- "Last modified" should be **truthful** — it must mean "when did this content/code actually last change," which is why D-01 uses the git commit date rather than the deploy date.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. (Note: the original roadmap `[DEFERRED → Phase 7]` tag is now superseded — the work is being done in Phase 4.)

</deferred>

---

*Phase: 4-code-quality-type-safety*
*Context gathered: 2026-06-20*

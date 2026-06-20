# Phase 4: Code Quality & Type Safety - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-20
**Phase:** 4-code-quality-type-safety
**Areas discussed:** Stale date (QUAL-01), Lint policy (QUAL-02), Tech-stack constants (QUAL-03)

---

## Stale date (QUAL-01)

| Option | Description | Selected |
|--------|-------------|----------|
| Last git commit date | Derive from `git log -1` at build time; reflects when content/code last changed. Most accurate SEO lastmod signal. | ✓ |
| Build/deploy date | Use `new Date()` at build; simpler but bumps on every unrelated redeploy. | |
| Per-page git dates | Each sitemap entry gets its source file's last-commit date; precise but overkill for a one-page portfolio. | |

**User's choice:** Last git commit date
**Notes:** Aligns with the "truthful" freshness goal — the date should mean "when content actually changed," not "when we last deployed."

---

## Lint policy (QUAL-02)

| Option | Description | Selected |
|--------|-------------|----------|
| Error + fix existing now | Rules as `error` (CI-blocking); refactor all current violations this phase. | |
| Error, exclude tests | Block on `error` for source; relax length limits for `*.test.*`; fix source violations now. | ✓ (Claude's judgement) |
| Warn first | Rules as `warn` only; non-blocking, weaker guarantee. | |

**User's choice:** Deferred to Claude — "saya tidak paham tentang ini. give your best judgement" (user not familiar with lint trade-offs).
**Notes:** Claude selected "Error, exclude tests, fix existing source violations now." Rationale given to user in plain language: `error` makes the 300/40 standards real; test files legitimately run long so they are exempted from length rules; existing source violations fixed in-phase so CI stays green when rules activate.

---

## Tech-stack constants (QUAL-03)

| Option | Description | Selected |
|--------|-------------|----------|
| Named const per exact duplicate | Extract only verbatim-repeated arrays as `SCREAMING_SNAKE_CASE` constants. | ✓ |
| Composable base + extras | Define base blocks and spread/extend per project; DRYer but more indirection. | |
| Separate constants file | Move stacks to `src/data/tech-stacks.ts`; keeps projects.ts lean, adds a file. | |

**User's choice:** Named const per exact duplicate
**Notes:** Keep constants in `projects.ts` (232 lines, under the 300 limit); move to a separate file only if extraction would breach 300 lines.

---

## Claude's Discretion

- QUAL-02 enforcement policy (error level, test exemption, fix-existing-now) — fully delegated by the user.
- TYPE-01/TYPE-02 — mechanical refactor, no decision surfaced to the user; the idiomatic next-intl access mechanism is left to research/planning.
- Exact constant names and the next-intl access mechanism — implementation details.

## Deferred Ideas

None — discussion stayed within phase scope. The roadmap's `[DEFERRED → Phase 7]` tag for this phase is now superseded; the work proceeds as Phase 4.

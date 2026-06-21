# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.4 — Polish & International Content

**Shipped:** 2026-06-21
**Phases:** 3 | **Plans:** 6 | **Sessions:** 2 (Phases 6-7 + partial 8 in PR #31; Phase 8 completion + close in PR #32)

### What Was Built
- WCAG-AA muted-text contrast fix, rebalanced hero CTAs, and a sun/moon theme switch + segmented EN|ID language pill (Phase 6)
- GitHub link moved from Contact to About, URL still defined once in `data/contact.ts` (Phase 7)
- Full humanized prose rewrite (EN + ID): natural first-person voice, an AI agentic-coding-workflow narrative, a remote/international + relocation availability signal, 14 bilingual project descriptions, and idiomatic education terms (Phase 8)

### What Worked
- Splitting Phase 8 into a mechanical slice first (i18n plumbing + education fix) and deferring the voice-dependent prose kept PR #31 shippable while the humanizer decision was still open.
- The CI gate (lint → tsc → test → build) plus strict EN/ID key-parity caught copy-coupled test breakage immediately every time copy changed.
- A free, prompt-based humanizer (`blader/humanizer`) drove the voice with no cost and no third-party data exposure.

### What Was Inefficient
- The humanizer choice churned: a paid API skill was installed first, then rejected and swapped for a free one mid-phase. Checking a skill's cost/permission model before install would have avoided the round-trip.
- Project descriptions were drafted from inferred sectors and needed an owner correction pass (TDK was training *delivery*, not a built app; Docker was never used). Upfront fact-gathering beats draft-then-correct for content about real third parties.

### Patterns Established
- User-facing copy lives in i18n only; tests assert on distinctive substrings and are updated in lockstep with the copy.
- A humanizer voice checklist (no em/en dashes, no buzzwords, no fabricated metrics, first-person) is applied to all prose.
- Prefer free, prompt-based skills over paid external APIs for content tasks.

### Key Lessons
1. When a phase depends on an external or uninstalled tool, ship the mechanical slice and defer the tool-dependent work rather than blocking the whole phase.
2. Vet a skill's cost model and permissions (API key, per-word credits, data exfiltration) before installing — a "humanizer" can be a paid detector-evasion API.
3. Content about real third parties needs an explicit owner fact-check gate; inferred drafts will contain errors.

### Cost Observations
- Model mix: predominantly Opus this milestone.
- Sessions: 2.
- Notable: i18n/content work is cheap to verify because the key-parity test + CI gate make regressions obvious.

---

## Milestone: v1.6 — Navbar Layout Balance

**Shipped:** 2026-06-21
**Phases:** 1 | **Plans:** 1 | **Sessions:** 1 (PR #39)

### What Was Built
- The `InlineNav` wrapper gained `sgds:flex-1 + sgds:items-center + sgds:justify-center` so the 7 desktop nav links center between the "JK" brand and the theme/language controls, with NAV-05 horizontal-scroll overflow preserved and a regression test locking in grow + scroll coexistence (Phase 11).

### What Worked
- A tightly-scoped, single-requirement-cluster milestone (one ~2-line className change + one test) went from plan to ship in ~6 minutes of execution; the existing lint → tsc → test → build gate plus a targeted regression test made it safe.
- The fix stayed inside the slotted wrapper instead of patching SGDS shadow-DOM internals — slotted children keep their own flex props through the slot, so no shadow piercing or `globals.css` fallback was needed.

### What Was Inefficient
- The first pass centered links horizontally but missed vertical alignment: the wrapper had no `align-items`, so against the shadow `.navbar-nav` row (default `align-items: stretch`) the links rode high. It took a UAT round-trip and a follow-up commit (`28fe7ce` adds `items-center`) to catch. Reasoning about the inherited flex context of a slotted element up front would have folded both axes into the first change.

### Patterns Established
- SGDS slot centering: to fill and center within `<sgds-mainnav>`'s default slot, set `flex-1 + items-center + justify-center` on the slotted child wrapper — the child's own flex props apply inside the shadow-DOM slot; no shadow piercing needed.

### Key Lessons
1. When centering a slotted element in a flex row, account for BOTH axes at once — a slot inherits the parent row's cross-axis behavior (here `stretch`), so horizontal centering without `items-center` leaves a visible vertical-alignment bug.
2. For a layout-only milestone, a single regression test that pins the exact utility contract (grow + `overflow-x-auto` coexist) is enough to guard the most likely future regression.

### Cost Observations
- Model mix: predominantly Opus.
- Sessions: 1.
- Notable: a one-requirement layout milestone is cheap end-to-end; the only real cost was the missed second axis, surfaced in human UAT rather than automated checks.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.3 | — | 5 | Full SGDS migration; versioning aligned to git tags |
| v1.4 | 2 | 3 | Split tool-dependent work into a deferrable slice; adopted a free prompt-based humanizer skill |
| v1.5 | — | 2 | Fixed prod mobile regressions; custom accessible MobileDrawer + responsive nav fallback |
| v1.6 | 1 | 1 | Single-requirement layout milestone; established the SGDS slot-centering pattern |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.4 | 603 | ≥80% lines/fn/stmt, ≥65% branches | 1 (humanizer is a skill, not a runtime dep) |
| v1.5 | 627 | ≥80% lines/fn/stmt, ≥65% branches | 0 |
| v1.6 | 628 | ≥80% lines/fn/stmt, ≥65% branches | 0 |

### Top Lessons (Verified Across Milestones)

1. The lint → typecheck → test → build gate plus EN/ID key parity is the backbone that makes content and UI changes safe to ship fast.
2. Defer work that depends on an undecided tool or external input; keep the rest shippable.

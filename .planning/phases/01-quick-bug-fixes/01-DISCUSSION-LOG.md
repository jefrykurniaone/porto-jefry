# Phase 1: Quick Bug Fixes - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-02T23:01:17.663+07:00
**Phase:** 1 - Quick Bug Fixes
**Areas discussed:** Toggle buttons & ThemeToggle hydration; Navbar scroll listener; translatePeriod regex; Anchor/hash link standardization

---

## Toggle buttons & ThemeToggle hydration

| Option | Description | Selected |
|--------|-------------|----------|
| Add `type="button"` and server-side placeholder SVG | Ensure toggles are `<button type="button">` and ThemeToggle renders a stable placeholder server-side to avoid CLS | ✓ |
| Use non-button controls (links/div with role) | Replace with non-button controls and manage keyboard interaction manually | |
| CSS-only placeholder (no server-side SVG) | Reserve space with CSS (may still cause hydration mismatch) | |

**User's choice:** Agent-autoselected recommended fix (type="button" + server-side placeholder)
**Notes:** Low ambiguity; chosen to fix correctness and avoid CLS regressions.

---

## Navbar scroll listener

| Option | Description | Selected |
|--------|-------------|----------|
| Add `{ passive: true }` and throttle updates | Register scroll listener with passive:true; throttle state updates with rAF/debounce | ✓ |
| Replace with `IntersectionObserver` | Use IO for visibility changes and sticky detection | |

**User's choice:** Agent-autoselected `{ passive: true }` + lightweight throttle
**Notes:** Simple, low-risk fix; IO deferred to future phase if needed.

---

## translatePeriod regex

| Option | Description | Selected |
|--------|-------------|----------|
| Use `\b` anchors in `translatePeriod` and add unit tests | Apply word-boundary anchors to avoid partial replacements; add tests for overlapping tokens | ✓ |
| Non-regex approach (tokenize by whitespace) | Replace with tokenization logic instead of regex | |

**User's choice:** Agent-autoselected regex with `\b` anchors + tests
**Notes:** Lowest-risk corrective change; tests guard regressions.

---

## Anchor/hash link standardization

| Option | Description | Selected |
|--------|-------------|----------|
| Standardize on plain `#id` for in-page anchors | Remove `encodeURIComponent` for internal hashes; keep plain `#id` across Hero and Navbar | ✓ |
| Keep `encodeURIComponent` for safety | Use encoded values for hashes to support special characters | |

**User's choice:** Agent-autoselected plain `#id` standardization
**Notes:** Matches roadmap requirement and cross-browser behavior expectations.

---

## the agent's Discretion

Agent made low-risk, reversible decisions where the user was unavailable. Planner should confirm any trade-offs during planning.

## Deferred Ideas

- Consider `IntersectionObserver` for scroll detection in a follow-up phase.
- Upstash Redis / Vercel KV replacement for rate limiting belongs to Phase 3.

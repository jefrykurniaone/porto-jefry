# Phase 2: UX Polish - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-03T13:19:16.995+08:00
**Phase:** 2-UX Polish
**Areas discussed:** CV error feedback

---

## CV Error Feedback — Display Method

| Option | Description | Selected |
|--------|-------------|----------|
| Inline banner under the CV button | Stays visible, doesn't block content, matches the button-group layout | ✓ |
| Toast notification | Auto-dismissing popup, needs new toast component (none exists yet) | |
| Modal dialog | Blocks the UI until dismissed, may be too intrusive for a download failure | |

**User's choice:** Inline banner under the CV button (Recommended)
**Notes:** Preferred for its visibility without blocking content, and consistency with the existing button-group layout.

---

## CV Error Feedback — Message Tone

| Option | Description | Selected |
|--------|-------------|----------|
| Friendly, non-technical | "Couldn't download CV. Please try again." — Matches portfolio's approachable tone | |
| Technical with HTTP code | "Failed to generate CV (HTTP 500). Try again later." — More diagnostic info | ✓ |
| Minimal | "Download failed. Retry?" — Very brief | |

**User's choice:** Technical with HTTP code
**Notes:** Provides diagnostic clarity for technical users (developers, recruiters) who may want to understand what went wrong.

---

## CV Error Feedback — Banner Visibility Duration

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-dismiss after 5 seconds | User sees feedback but it clears automatically | ✓ |
| Manual dismiss only | Stays until user clicks X button | |
| Persist until retry succeeds | Banner stays until successful download | |

**User's choice:** Auto-dismiss after 5 seconds (Recommended)
**Notes:** Balances user feedback visibility with clean UI — error is communicated but doesn't linger.

---

## CV Error Feedback — Translation Structure

| Option | Description | Selected |
|--------|-------------|----------|
| hero.cv_error and hero.cv_error_retry | Stays in hero namespace, consistent with hero.cta_downloading | ✓ |
| errors.cv_download_failed | New errors namespace for all error messages | |
| common.error_download | Generic error in common namespace | |

**User's choice:** hero.cv_error and hero.cv_error_retry (Recommended)
**Notes:** Maintains consistency with the existing hero namespace pattern (e.g., `hero.cta_downloading`).

---

## the agent's Discretion

- Banner styling details (exact colors, icon choice, border/shadow styles) — use Tailwind utilities and match existing design system
- Error page layout specifics (header size, spacing, button style) — follow existing patterns from other sections
- Whether to include a "Retry" button in the error banner — optional, auto-dismiss may be sufficient

## Deferred Ideas

None — discussion stayed within phase scope. ThemeToggle CLS (UX-04) was pre-completed in Phase 1, and 404/error pages were not discussed in detail (implementation details deferred to planning stage).

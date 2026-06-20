# Phase 2: UX Polish - Context

**Gathered:** 2026-06-03T13:19:16.995+08:00
**Status:** Ready for planning

<domain>
## Phase Boundary

Add user-visible CV download error feedback, create branded custom 404 and error pages (locale-aware), and verify ThemeToggle CLS fix from Phase 1. This phase focuses on improving error experiences and ensuring the site degrades gracefully.

</domain>

<decisions>
## Implementation Decisions

### CV Download Error Feedback
- **D-01:** Display CV download failures as an inline banner positioned directly under the CV download button in the Hero CTA button group
- **D-02:** Use technical error messages with HTTP status codes (e.g., "Failed to generate CV (HTTP 500). Try again later.") for diagnostic clarity
- **D-03:** Auto-dismiss the error banner after 5 seconds — user sees feedback but it clears automatically
- **D-04:** Structure error translations in hero namespace: `hero.cv_error` and `hero.cv_error_retry` (consistent with existing `hero.cta_downloading`)

### 404 and Error Pages
- **D-05:** Create custom locale-aware `not-found.tsx` and `error.tsx` in `src/app/[locale]/` — both must be branded and use the Next.js App Router error handling conventions
- **D-06:** 404/Error pages should include: page title, user-friendly message (localized via next-intl), and a "Return Home" link — reuse the same layout/navigation chrome as the main site for consistency
- **D-07:** Error pages must test for locale awareness — both EN and ID variants should render correctly when navigating to `/en/invalid` and `/id/invalid`

### ThemeToggle CLS
- **D-08:** ThemeToggle CLS (UX-04) was already resolved in Phase 1 with a server-side stable placeholder — verify the fix is working (CLS = 0) via existing tests and visual inspection. No new implementation needed.

### the agent's Discretion
- Banner styling (colors, icons, positioning details) — use Tailwind utilities and existing design system colors (blue-600, gray-900/white, rounded-xl)
- Error page layout specifics — match existing section spacing and typography patterns from `globals.css`
- Whether to add a "Retry" button in the error banner — optional, auto-dismiss may be sufficient

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Roadmap / Requirements
- `.planning/ROADMAP.md` — Phase 2 goal, dependencies, and success criteria (UX-01..UX-04)
- `.planning/REQUIREMENTS.md` — UX requirements (CV error feedback, 404/error pages, ThemeToggle CLS verification)
- `.planning/PROJECT.md` — Project constraints (bilingual requirement, 300-line/40-line limits, test coverage thresholds)

### Codebase maps
- `.planning/codebase/STRUCTURE.md` — File locations (sections/, layout/, i18n/messages/)
- `.planning/codebase/CONVENTIONS.md` — Naming conventions, co-located tests, sub-component extraction pattern
- `.planning/codebase/TESTING.md` — Vitest setup, co-location rule, coverage thresholds (80% lines/functions/statements, 65% branches)

### Relevant source files
- `src/components/sections/Hero.tsx` — CV download handler (line 27-46), currently only does `console.error` on failure
- `src/components/layout/ThemeToggle.tsx` — Server-side placeholder pattern for CLS prevention (verify fix works)
- `src/i18n/messages/en.json` and `src/i18n/messages/id.json` — Translation files (add `hero.cv_error`, `hero.cv_error_retry`, and error page keys)
- `src/app/[locale]/layout.tsx` — Locale layout (reference for error page structure)

### Next.js error handling
- Next.js App Router docs: `not-found.tsx` and `error.tsx` conventions — must be `'use client'` for error.tsx, optional for not-found.tsx

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Hero CTA button group already exists (line 49-81 in `Hero.tsx`) — error banner should fit naturally below the buttons
- Tailwind utility classes for styling (bg-blue-600, text-white, rounded-xl, dark: variants) — reuse for consistency
- `useTranslations` and `useLocale` hooks from next-intl — already used in Hero, apply the same pattern to error pages

### Established Patterns
- Co-located tests next to source files (Hero.test.tsx, ThemeToggle.test.tsx) — add tests for error banner rendering and locale-aware error pages
- Server-side stable placeholder pattern (ThemeToggle.tsx lines 7-22) — reference for understanding CLS prevention approach
- Translation namespace pattern (e.g., `hero.cta_downloading`) — follow the same pattern for `hero.cv_error` keys

### Integration Points
- Hero component `handleDownload` catch block (line 40-42) — add state management for error message and banner visibility
- Error boundary and 404 pages integrate with Next.js App Router — must follow file-based routing conventions
- Translation files need new keys for error messages and error page content

</code_context>

<specifics>
## Specific Ideas

- CV error banner should auto-dismiss after 5 seconds but allow manual dismiss if user wants to clear it sooner
- Error pages should feel like part of the portfolio (same fonts, colors, spacing) — not generic Next.js defaults
- HTTP status code in error message helps technical users (recruiters, developers viewing the portfolio) understand what went wrong

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. ThemeToggle CLS (UX-04) was pre-completed in Phase 1 and only requires verification here.

</deferred>

---

*Phase: 2-UX Polish*
*Context gathered: 2026-06-03T13:19:16.995+08:00*

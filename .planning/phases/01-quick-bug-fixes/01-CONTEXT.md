# Phase 1: Quick Bug Fixes - Context

**Gathered:** 2026-06-02T23:01:17.663+07:00
**Status:** Ready for planning

<domain>
## Phase Boundary

Correct four low-risk correctness defects (FIX-01..FIX-04) so they are fixed and cannot regress. This phase is strictly limited to these fixes; no new capabilities are added here.

</domain>

<decisions>
## Implementation Decisions

### Toggle buttons & ThemeToggle hydration
- **D-01:** LanguageToggle and ThemeToggle MUST be implemented as `<button type="button">` with an accessible label (e.g., `aria-label="Toggle theme"`). To prevent hydration/layout shift (CLS) the ThemeToggle should render a server-side stable placeholder matching the final icon's size (inline SVG or sized element). The planner may choose inline SVG placeholder or CSS box-sizing, but tests must assert no CLS and stable layout on hydration.

### Navbar scroll listener and scroll detection
- **D-02:** Register scroll listeners with `{ passive: true }` to avoid console warnings and improve scroll performance. State updates driven by scroll should be throttled (requestAnimationFrame or small debounce). Using `IntersectionObserver` is acceptable as a follow-up optimization but is NOT required for this phase.

### translatePeriod regex and tests
- **D-03:** The `translatePeriod` implementation in `src/utils/translate-period.ts` must use word-boundary anchors (`\b`) to avoid partial replacements. Add unit tests covering overlapping tokens and edge cases (e.g., "May" vs "Maynard"). Use the `u` flag only if necessary for Unicode-aware matches.

### Anchor/hash link standardization (Hero & Navbar)
- **D-04:** Standardize on plain `#id` internal anchors for in-page links. Update `src/components/sections/Hero.tsx` and `src/components/layout/Navbar.tsx` to use plain `#id` (remove `encodeURIComponent` for internal hashes) so all browsers behave consistently. Add tests asserting correct scrolling/navigation behaviour.

### the agent's Discretion
- Prefer in-place, minimal changes that reuse existing components and test patterns. Any trade-offs left to the planner must be documented in the plan.

</decisions>

<canonical_refs>
## Canonical References

### Roadmap / Requirements
- `.planning/ROADMAP.md` — Phase 1 goal and boundaries
- `.planning/REQUIREMENTS.md` — FIX-01..FIX-04 (locked requirements for this phase)
- `.planning/PROJECT.md` — Project constraints and key decisions

### Codebase maps
- `.planning/codebase/STRUCTURE.md` — Project layout and key locations
- `.planning/codebase/CONVENTIONS.md` — Coding conventions and limits
- `.planning/codebase/TESTING.md` — Test patterns and coverage thresholds

### Relevant source files
- `src/components/layout/ThemeToggle.tsx` — Toggle implementation & hydration behaviour
- `src/components/layout/LanguageToggle.tsx` — Toggle implementation
- `src/components/layout/Navbar.tsx` — Scroll listener & anchor links
- `src/components/sections/Hero.tsx` — Anchor hash usage
- `src/utils/translate-period.ts` — Regex to fix; add tests in `src/utils/translate-period.test.ts`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- ThemeToggle and LanguageToggle components exist in `src/components/layout/` and can be updated in-place.
- Test render helpers and mocks are available in `src/test/setup.ts` and `vitest.config.ts`.

### Established Patterns
- Co-located tests next to source files; follow the existing mocking pattern for `next/image` and `next-themes`.
- Strict TypeScript and ESLint rules; all changes must pass lint and tests before merge.

### Integration Points
- Hero and Navbar anchor changes affect client-side navigation and unit tests (`Hero.test.tsx`, `Navbar.test.tsx`).
- `translatePeriod` touches `src/utils/` and may affect text rendering across components; ensure regression tests cover Experience/Time rendering.

</code_context>

<specifics>
## Specific Ideas
- ThemeToggle CLS: server-side render a placeholder SVG with the final icon dimensions to reserve space before hydration.
- translatePeriod tests: include tokens that could overlap (e.g., "Mar" inside "Marchman") to avoid accidental replacement.

</specifics>

<deferred>
## Deferred Ideas
- Replace scroll handler with `IntersectionObserver` as a performance follow-up (Phase 2/3 candidate).
- Replace in-memory rate limiter with Upstash Redis or Vercel KV (Phase 3).

</deferred>

---

*Phase: 1-Quick Bug Fixes*
*Context gathered: 2026-06-02T23:01:17.663+07:00*

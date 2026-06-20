# Phase 6: Look & Feel Polish - Context

**Gathered:** 2026-06-20
**Status:** Ready for planning/execution

<domain>
## Phase Boundary

Three look-and-feel fixes on the shipped SGDS monochrome UI, all driven by owner feedback:
1. **Contrast** — muted gray text is hard to read.
2. **Hero CTAs** — three unbalanced buttons; "View My Work" wraps.
3. **Toggles** — theme and language controls feel oversized; replace with a sliding switch + segmented pill.

This phase touches only presentation (`globals.css` + a few layout/section components). No content, no data, no API changes.
</domain>

<decisions>
## Implementation Decisions

### Contrast (UI-05)
- **D-06-01:** Root cause is the SGDS token `--sgds-color-muted` = `gray-300`/`#c6c6c6` (day) and `gray-800`/`#3b3b3b` (night), ≈1.6:1 on the page background — far below WCAG AA 4.5:1.
- **D-06-02:** Fix at the **token level** in `globals.css`, not per-component. Override `--sgds-color-muted` in `:root` (day ≈ `#5f5f5f`) and `:root.sgds-night-theme` (night ≈ `#b0b0b0`). Final hex tuned to clear 4.5:1 while staying visibly lighter than body text (`#1a1a1a` day / `#f3f3f3` night).
- **D-06-03:** Do **not** touch the existing `.readable-muted` helper (already a safe 72% color-mix) or any component classNames. The single token override fixes every `sgds:text-muted` site at once.

### Hero CTAs (UI-06)
- **D-06-04:** Keep all three CTAs (View My Work / Download CV / Contact Me). Owner chose "keep 3, make balanced."
- **D-06-05:** Root cause: `.hero-cta-link` has a fixed `width: 9.25rem` + padding + inline icon and **no `white-space: nowrap`**, so the longest label wraps. The CV `sgds-button` is sized by a separate `::part(button)` rule (44px tall / 168px min-width vs the anchors' 48px / 148px).
- **D-06-06:** Unify sizing in `globals.css`: add `white-space: nowrap`; replace the fixed width with a shared `min-width` (~11.5rem) + `width: auto` + `height: 3rem`; align the CV button's `::part(button)` to `height: 3rem` and the same `min-width`. Preserve the `<512px` full-width stacking rule.
- **D-06-07:** Visual hierarchy: View My Work = filled primary; Download CV + Contact Me = outline (1 primary + 2 outline). The CV control stays an `<sgds-button>` (it needs the `loading` state for the download).

### Toggles (UI-07)
- **D-06-08:** Theme toggle → `<sgds-switch>` (checked = `night`) flanked by small sun/moon `sgds-icon`s. `sgds-switch` is already registered globally via the dynamic import in `src/app/sgds.tsx` — no new dependency or registration.
- **D-06-09:** Keep the `useSgdsTheme` hook exactly as-is (day/night, localStorage `sgds-theme`, `.sgds-night-theme` class). Wire `checked={theme === 'night'}` + `onChange/sl-change → toggleTheme`. Preserve the `theme.toggle_dark`/`toggle_light` aria-labels.
- **D-06-10:** Language toggle → a compact **segmented EN|ID pill** with a sliding active indicator (radio-group semantics for a11y; CSS in `globals.css`). Keep the existing `router.replace(pathname, { locale })` logic and `lang.switch` aria-label. (A pill is clearer than a slider for two text labels.)
- **D-06-11:** Both controls stay in `Navbar.tsx` `slot="end"`; tighten the surrounding `gap`.

### the agent's Discretion
- Exact muted hex values (within the AA constraint), switch icon sizing, pill border-radius/active-color — use existing SGDS tokens and the monochrome palette.
- Whether the language pill uses two `<button>`s or a styled radio group — pick the most accessible option that keeps keyboard nav.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

- `.planning/ROADMAP.md` — Phase 6 goal, success criteria (UI-05/06/07)
- `.planning/REQUIREMENTS.md` — v1.4 requirements
- `.planning/PROJECT.md` — constraints (300-line/40-line limits, EN/ID parity, coverage ≥80%)
- `.planning/codebase/CONVENTIONS.md` — naming, co-located tests, sub-component extraction
- `src/app/globals.css` — SGDS token overrides (`:root` / `:root.sgds-night-theme`), `.hero-cta-*`, `.hero-download-button`, mobile `<512px` rules
- `src/components/sections/Hero.tsx` — `HeroCtaLinks` (anchors + sgds-button), `HeroPhotoHeading` (h2/subtitle use `sgds:text-muted`)
- `src/components/layout/ThemeToggle.client.tsx` — current `sgds-icon-button` sun/moon
- `src/components/layout/LanguageToggle.tsx` — current `sgds-button` EN/ID
- `src/components/layout/Navbar.tsx` — `slot="end"` holds both toggles + hamburger
- `src/hooks/useSgdsTheme.ts` — theme hook (do not change its contract)
- `src/app/sgds.tsx` — global SGDS component registration (confirms `sgds-switch` available)
</canonical_refs>

<code_context>
## Existing Code Insights

- `sgds:text-muted` is used at: Hero.tsx (h2 line ~126, subtitle line ~129), Contact.tsx (~44, ~96), Projects.tsx (~31), Education.tsx (~26), Certifications.tsx (~25), not-found.tsx (~21), error.tsx (~60). All inherit from `--sgds-color-muted`.
- `.readable-muted` (the safe helper) is used in Footer, Experience, TechList — leave untouched; it already passes.
- Hero CTA labels come from `hero.cta_work`/`cta_cv`/`cta_contact` (en.json) — unchanged this phase.
- `useSgdsTheme` returns `{ theme, toggleTheme }` and guards SSR with an `isMounted` pattern — the switch must respect that (no hydration mismatch; use `suppressHydrationWarning` consistent with sibling SGDS components).
</code_context>

<specifics>
## Specific Ideas

- Keep the change set small per plan so each is a clean diff/PR.
- After the token override, re-check the hero's "Backend Developer & .NET Specialist" subtitle (the exact text the owner flagged in the screenshot) — it should now be clearly legible.
- The language pill should visibly slide the active indicator between EN and ID; the theme switch should read as sun→moon.
</specifics>

<deferred>
## Deferred Ideas

- Animating the hero CTAs or adding hover micro-interactions — out of scope (look & feel correctness only).
</deferred>

---
*Phase: 6 — Look & Feel Polish*
*Context gathered: 2026-06-20*

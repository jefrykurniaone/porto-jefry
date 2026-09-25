# Spec — visual foundation for the ui-redesign run (palette, type scale, motion setup, stylesheet split)

- **Spec issue**: [#63](https://github.com/jefrykurniaone/porto-jefry/issues/63)
- **Execution map**: [#82](https://github.com/jefrykurniaone/porto-jefry/issues/82)
- **Tickets**: [#68](https://github.com/jefrykurniaone/porto-jefry/issues/68) · [#69](https://github.com/jefrykurniaone/porto-jefry/issues/69) · [#70](https://github.com/jefrykurniaone/porto-jefry/issues/70) · [#81](https://github.com/jefrykurniaone/porto-jefry/issues/81)
- **Run**: `ui-redesign`
- **Version**: v1, copied from the spec issue on 2026-09-25

This is a point-in-time copy. Claims below describe the codebase and the plan as of 2026-09-25; the run that delivers this spec will change the code it describes.

---

## Problem statement

The owner wants the portfolio to feel like https://13-years.com/: bold oversized type, a restrained palette, and motion driven by scroll. Three separate pieces of work will build that: the hero stage, the site chrome, and the restyled sections. None of them can start cleanly today.

- The palette is dark with a purple accent (`#9d7bff`) and has no colour for long reading text distinct from short labels, so every surface would invent its own greys.
- There is no type scale for display sizes. Each surface would pick its own headline sizes.
- There is no animation library, and no shared answer to "what happens under reduced motion".
- Every section's styles live in one stylesheet. Three pieces of work editing it at once would collide on every merge.
- The PDF CV is still purple, so the downloaded CV would stop matching the site the moment the new palette ships.

## Solution

Lay one shared foundation that the other three specs build on, and change nothing a visitor would recognise as a new layout. After this spec the site keeps its current layout but already wears the new palette in both themes, the PDF CV matches it, the animation library is installed and wired once, and each section's styles sit in a file of their own.

## Goals and non-goals

Goals:

- One token set expresses the settled palette in both themes: monochrome neutrals, a khaki accent, a Reading text colour at AAA, a Label colour at AA, and the hero's inverted colours.
- One type scale covers every display size the redesign uses.
- The animation library is installed once, registered once, and every later motion effect has one sanctioned way to switch itself off under reduced motion.
- Section styles are split so the hero stage, the chrome and the section restyle can be built in parallel without touching the same stylesheet.
- The PDF CV uses the khaki accent and still meets its contrast rule.

Non-goals:

- Any new layout, component or animation on the page. Those belong to `hero-stage`, `site-chrome` and `section-restyle`.
- Any change to CV layout, typography or content.
- Adopting Tailwind utilities.

## User stories

1. As a visitor on the dark theme, I want the page to use calm neutrals with one warm khaki accent, so that the site reads as confident rather than loud.
2. As a visitor on the light theme, I want the same palette carefully re-tuned for light backgrounds, so that nothing looks washed out or inverted by accident.
3. As a visitor reading the About text or an experience bullet, I want the text to be clearly legible, so that I do not strain to read the part that matters.
4. As a visitor scanning dates, company names and tags, I want them visibly quieter than the reading text, so that the hierarchy is obvious.
5. As a visitor who has asked their system for reduced motion, I want every animation on the site to respect that, so that the site does not make me uncomfortable.
6. As a recruiter downloading the CV, I want the PDF to share the site's colour, so that the two feel like one person's work.
7. As the owner, I want the status colours (available, error) to keep their meaning, so that the accent never gets confused with a state.
8. As a developer building one section, I want that section's styles in their own file, so that my change does not conflict with someone restyling another section.
9. As a developer adding motion, I want one place that registers the animation plugins and one rule for reduced motion, so that I do not re-solve that per component.
10. As a developer, I want named type-scale steps, so that headline sizes stay consistent across sections built by different people.

## Implementation decisions

**Palette tokens.** Values were settled in the grilling prototype and every pairing below was measured for WCAG contrast.

| Role | Dark theme (default) | Light theme |
|---|---|---|
| Page background | `#0d0d0e` | `#f4f3ef` |
| Text (headings) | `#ecebe7`, 16.3:1 | `#151515`, 16.5:1 |
| Reading text | `#c8c6bf`, 11.4:1 (AAA) | `#3d3b37`, 10.1:1 (AAA) |
| Label | `#9b9993`, 6.8:1 (AA) | `#5d5b56`, 6.1:1 (AA) |
| Rule / line | `#28282b` | `#d8d5cd` |
| Accent fill (khaki) | `#cbb892` with ink `#0d0d0e`, 10.0:1 | `#6f5c3a` with ink `#ffffff`, 6.4:1 |
| Accent ink (accent-coloured text) | `#cbb892`, 10.0:1 | `#54452b`, 8.4:1 on the page, 9.3:1 on white |
| Dot (dot field) | `#6d6b66` | `#aaa79f` |

The status colours (ok, fault) keep their current values and meaning. The khaki accent is never used to mean a state.

The repository's existing Ink Rule stays in force: the accent is a fill, and text that must look accented uses the accent-ink token. On the light theme, accent-ink is darker than the fill because the fill would only reach 5.8:1 as text.

**Hero tokens (the inverse of the theme).** The hero always takes the opposite polarity of the page, so these live on the root next to the theme tokens where both the hero stage and the header can read them:

| Role | Dark theme → light hero | Light theme → dark hero |
|---|---|---|
| Hero background | `#e7e5df` | `#111113` |
| Hero ink | `#111112`, 15.0:1 | `#efeee9`, 16.2:1 |
| Hero label | `#4d4b46`, 6.9:1 | `#a3a19b`, 7.3:1 |
| Hero accent fill | `#6f5c3a` with ink `#ffffff` | `#cbb892` with ink `#0d0d0e` |
| Hero status dot | `#0d8055` (3.9:1, a graphic, needs 3:1) | `#3ddc97` |
| Giant letter tint | khaki mixed 42% into the hero background (decorative) | same rule |

**Token naming.** The existing token names stay where their meaning is unchanged, so the other specs do not chase a rename. The existing muted token becomes the Label colour. A new token carries the Reading text colour. The purple accent and the CTA tokens are retuned to khaki, not duplicated. Hero tokens get their own prefix.

**Type scale.** Named steps for: the giant hero letters, the hero name, the manifesto statement, section titles, the lead line, and Reading text at 17px. Display steps use fluid `clamp()` sizes and tight negative tracking. Fonts stay Space Grotesk and JetBrains Mono.

**Motion foundation.** Add `gsap` (3.15.x) and `@gsap/react` (2.1.x). One client module registers `ScrollTrigger`, `ScrambleTextPlugin` and the `useGSAP` hook exactly once, and nothing else in the codebase calls `registerPlugin`. Every motion effect is created inside a `gsap.matchMedia()` condition keyed on `(prefers-reduced-motion: no-preference)`. When a visitor turns reduced motion on, GSAP reverts that effect by itself. Hooks that only need to know the preference keep the existing `useSyncExternalStore` pattern, never an effect that sets state.

The library is bundled from npm, so its chunks carry the per-request nonce like the rest of the app. The content security policy does not change.

**Stylesheet split and primitive ownership.** The per-section stylesheet becomes one file per section, imported from the global stylesheet in the current order, so the rendered CSS does not change.

Some rules in the section stylesheet are used outside their own section. The primary and outline buttons sit in the hero block but are also used by the mobile drawer and the contact CV panel. The split moves every such rule into the shared primitives, so each section file holds only rules its own section uses.

After the split, ownership is disjoint:

- **This spec**: primitives consumed by more than one of the other specs (buttons, notices, the CV action, visually-hidden, focus), plus the token, type-scale and reduced-motion blocks.
- **`hero-stage`**: the hero and about files.
- **`site-chrome`**: the layout stylesheet.
- **`section-restyle`**: the remaining section files, and the primitives only sections use (page container, section band, section header, chip, panel card).

**PDF CV colours.** The CV's colour constants say they are "the site's light theme resolved to opaque hex" and must be kept in step with the stylesheet. That rule is followed, not bent:

- every CV colour is re-resolved from the new light theme: text, Label, rule, the light background, and accent-ink;
- the PDF accent therefore becomes khaki accent-ink `#54452b`, 9.3:1 on white, replacing `#49377a`;
- nothing about the CV's layout, typography or content changes.

## Testing decisions

There is no test suite in this repository, and adding one is out of scope. A good check here observes rendered behaviour, never source text.

- **Static gate**: lint, typecheck and build, the same three commands CI runs.
- **Page walk** (orchestrator, Playwright MCP against the local dev server), in both themes and both locales:
  - read the resolved token values with `getComputedStyle` and compute the contrast pairs in the tables above;
  - confirm zero console errors;
  - confirm the page renders unchanged apart from colour.
- **Stylesheet split**: the built CSS must contain the same rules before and after the split. Rule order is allowed to shift only where Lightning CSS already reorders it.
- **PDF**: `GET /api/generate-cv?locale=en` and `?locale=id` both return `200` with `application/pdf`, and the CV colour constants equal the new light-theme tokens.

Prior art: the dep-health run's verification tickets, which checked real HTTP responses and build output instead of source.

## Success criteria

- Every contrast pair in the two tables measures at or above the stated ratio in the running site, in both themes.
- No purple (`#9d7bff`, `#49377a` or any other derivative) remains in the site's CSS or the PDF tokens.
- `gsap` and `@gsap/react` are dependencies, and exactly one module registers plugins.
- The section styles live in one file per section, and the built CSS is equivalent to before the split.
- `npm run lint`, `npx tsc --noEmit` and `npm run build` pass.
- The CV downloads as a valid PDF in both locales, its accent is khaki accent-ink, and every CV colour constant matches a light-theme token.

## Out of scope

- New layouts, components or animations (the other three specs).
- CV layout, typography or content.
- Tailwind utilities.
- A test runner or visual-regression tooling.
- A new OG image.

## Further notes

The prototype that settled these values is on the throwaway branch `prototype/ui-redesign-hero`, at `prototypes/ui-redesign-hero/index.html`. It is a primary source for the numbers, not code to copy. Its dot field is a 2D stand-in, and it was written without the repository's lint limits.

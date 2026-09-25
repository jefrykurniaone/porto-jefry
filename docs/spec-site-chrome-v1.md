# Spec — site chrome restyle (JK navbar with ink flip, one-row footer)

- **Spec issue**: [#65](https://github.com/jefrykurniaone/porto-jefry/issues/65)
- **Execution map**: pending, added when the map is published
- **Tickets**: pending, added when the tickets are published
- **Run**: `ui-redesign`
- **Version**: v1, copied from the spec issue on 2026-09-25

This is a point-in-time copy. Claims below describe the codebase and the plan as of 2026-09-25; the run that delivers this spec will change the code it describes.

---

## Problem statement

The chrome around the content was built for the old look.

- The logo is "JK_" with a blinking-cursor accent.
- The Contact link looks like every other link.
- The navbar has one colour everywhere, so once the hero becomes a bone-white block on the dark theme, light navbar text over it would disappear.
- The footer closes with a `$ exit` terminal gag and a "built with" line that no longer fit the new, quieter visual language. The owner asked for the footer to be simpler.

## Solution

Restyle the navbar, mobile drawer, footer and back-to-top button onto the new foundation, without changing what any of them does.

- The logo becomes a plain "JK" wordmark.
- The Contact link becomes a khaki-filled button.
- While the navbar sits over the inverted hero, its ink flips to the hero's colours. Past the hero, it sits on a translucent, blurred bar in the page's own colours.
- The footer shrinks to one row: "JK" on one side, "© <year> Jefry Kurniawan" on the other.

## Goals and non-goals

Goals:

- The navbar stays legible everywhere: over the inverted hero, over the manifesto, over every later section, in both themes.
- Contact is the one visually emphasised navigation target.
- The footer is a single, quiet row.
- Every existing behaviour is untouched: section links, theme and language toggles, the mobile drawer with its focus trap, inert background and scroll lock, and back-to-top.

Non-goals:

- Adding or removing navigation targets.
- Changing how the language switch preserves the reader's section. The hero stage's anchor design keeps that mechanism working as it is.
- Deciding when the header is over the hero. `hero-stage` publishes that signal. This spec only consumes it.

## User stories

1. As a visitor on the first screen, I want the navbar text to contrast with the bone-white or near-black hero, so that I can still find the menu.
2. As a visitor scrolling past the hero, I want the navbar to sit on a subtle bar in the page's colours, so that it does not collide with the content moving under it.
3. As a recruiter, I want Contact to stand out from the other links, so that reaching the owner is the obvious next step.
4. As a visitor, I want the logo to match the giant "JK" I just saw, so that the brand reads as one thing.
5. As a phone visitor, I want the drawer to look like the rest of the redesign while working exactly as before, so that nothing about it surprises me.
6. As a keyboard user, I want every navbar and drawer control to keep a visible focus state in both ink colours, so that I never lose my place.
7. As a visitor at the bottom of the page, I want a short, calm footer, so that the page ends cleanly after Contact.
8. As a visitor far down the page, I want the back-to-top button to appear only once I have scrolled past the hero stage, so that it does not clutter the first screens.
9. As a visitor with reduced motion on, I want the ink change to be instant rather than animated, so that the header does not flicker.

## Implementation decisions

**Ink flip.** The navbar reads one data attribute on the document root, which `hero-stage` sets while the header is over the inverted intro. With the attribute present, the navbar's text, icons, toggles and the Contact button use the hero tokens from `visual-foundation`. Without it, they use the theme tokens. The colour change eases over about 0.35 s and is instant under reduced motion. No scroll listener is added to the navbar.

**Navbar surface.** Over the hero the bar is transparent. Elsewhere it is translucent in the page's background colour, with the existing backdrop blur. The blur declaration must keep the prefixed spelling first, and its survival is checked in the build output. This is the Lightning CSS lesson recorded in the repository guidance.

**Logo.** A "JK" wordmark in the display face. The blinking-cursor accent is removed, and its keyframes too, if nothing else uses them.

**Contact as a button.** The Contact entry of the section links renders as a khaki-filled button with the accent's ink colour. It is the same link to the same anchor, only styled differently. In the drawer, it keeps its place in the link list with the same emphasis.

**Drawer.** Restyled onto the new tokens and type scale. Its dialog semantics, focus trap, inert background, scroll lock, CV download action and toggles are unchanged.

**Footer.** One row: the "JK" wordmark and "© <current year> Jefry Kurniawan". The `$ exit` prompt, the "built with" line and the rights sentence are removed, along with the footer message keys in both locales once nothing reads them. The component's comment explaining the old ordering goes with them.

**Back-to-top.** Restyled only. It already observes the About anchor. Once `hero-stage` places that anchor at the end of the transition, "past About" means "past the hero stage", so its trigger logic stays as it is. The walk confirms it.

## Testing decisions

There is no test suite, and adding one is out of scope. A good check observes rendered colours, attributes and behaviour, never the source.

- **Static gate**: lint, typecheck, build. The backdrop-filter check runs on the built CSS: both spellings must be present.
- **Page walk** (orchestrator, Playwright MCP, local dev server), both themes and both locales:
  - At scroll 0, with the ink-flip attribute present, the navbar link colour against the hero background is ≥ 4.5:1.
  - Past the stage, the link colour against the page background is also ≥ 4.5:1.
  - The Contact button's text against its fill is ≥ 4.5:1.
  - The drawer opens, traps focus, closes on Escape, and restores focus.
  - The footer renders one row with the wordmark and the current year.
  - Back-to-top is hidden at the top and visible after the stage.
  - Zero console errors.
- **Reduced motion emulated**: the ink change has no transition.

## Success criteria

- The navbar passes AA over the hero, over the manifesto and over every later section, in both themes.
- The logo reads "JK", and Contact is a khaki button in the navbar and emphasised in the drawer.
- The footer is one row. `$ exit`, "built with" and the rights sentence are gone, and so are their message keys in both locales.
- Every behaviour listed under Goals works as before.
- Both backdrop-filter spellings survive in the built CSS.
- Lint, typecheck and build pass. There are no console errors.

## Out of scope

- New navigation targets, a scroll-progress indicator, or hide-on-scroll behaviour.
- Changing the language switch's section-preservation mechanism.
- The hero stage and its signal logic (`hero-stage`).
- Section styling (`section-restyle`).
- The error and 404 pages beyond what the new tokens change automatically.

## Further notes

The prototype on `prototype/ui-redesign-hero` shows the ink flip and the khaki Contact button. It uses a simplified link list, and the real navbar keeps every section link and both toggles.

# Spec — section restyle (ruled rows, open project grid, scrambling titles, reveal)

- **Spec issue**: [#66](https://github.com/jefrykurniaone/porto-jefry/issues/66)
- **Execution map**: [#82](https://github.com/jefrykurniaone/porto-jefry/issues/82)
- **Tickets**: [#76](https://github.com/jefrykurniaone/porto-jefry/issues/76) · [#77](https://github.com/jefrykurniaone/porto-jefry/issues/77) · [#78](https://github.com/jefrykurniaone/porto-jefry/issues/78) · [#79](https://github.com/jefrykurniaone/porto-jefry/issues/79) · [#80](https://github.com/jefrykurniaone/porto-jefry/issues/80)
- **Run**: `ui-redesign`
- **Version**: v1, copied from the spec issue on 2026-09-25

This is a point-in-time copy. Claims below describe the codebase and the plan as of 2026-09-25; the run that delivers this spec will change the code it describes.

---

## Problem statement

Below the hero, every section uses the same devices: a terminal-prompt kicker above the title, content in bordered cards on alternating background bands, and technology shown as pill chips.

Card grids are the most templated-looking part of the current site. The terminal flavour no longer matches the new, quieter visual language. Long reading text such as experience bullets and project descriptions uses the same grey as short labels, which the owner found hard to read on the prototype.

## Solution

Restyle Experience, Skills, Projects, Education and Contact into the editorial language settled in grilling:

- **Section headers**: large display-type section titles that scramble into place the first time they scroll into view.
- **Experience, Education and Skills**: ruled rows with no boxes.
- **Projects**: an open grid, with no boxes, where a hairline rule and a large title carry each project.
- **Items**: rise in gently as they arrive.
- **Colour**: Reading text at AAA contrast, and dates, companies and tags as quieter Labels.

Every interaction stays: expanding experience bullets, the project archive, the contact CV panel.

## Goals and non-goals

Goals:

- All five sections share one visual language with the manifesto and the approved prototype.
- Reading text meets 7:1 and Labels meet 4.5:1, in both themes.
- Motion is limited to the title scramble and the item reveal. Both are off under reduced motion, and neither ever hides content that is meant to be visible without JavaScript.
- No section content, order or interaction changes.

Non-goals:

- Changing any data file or message prose.
- Pinning or chaptering any section.
- Restyling the hero, the manifesto or the chrome.

## User stories

1. As a recruiter scanning Experience, I want each role on one ruled row with its dates on the left and the role in large type, so that I can read the career at a glance.
2. As a recruiter, I want to expand a role's bullets exactly as before, so that detail is there when I want it.
3. As a reader of the bullets and project descriptions, I want them in the high-contrast reading colour, so that they are easy to read.
4. As a recruiter, I want each skill category on one row with its items as a plain list, so that the stack reads like a sentence rather than a wall of pills.
5. As a visitor, I want projects to keep their live, in-progress and archive groups, so that I can tell shipped work from ongoing work.
6. As a visitor, I want the project archive to open and close exactly as before, so that older work is available without crowding the page.
7. As a visitor, I want education and the certification in the same ruled rows as experience, so that the page reads consistently.
8. As a recruiter at Contact, I want the ways to reach the owner and the CV download to be obvious, so that I can act immediately.
9. As a visitor, I want each section title to resolve from scrambled glyphs the first time I reach it, so that the page keeps the energy of the hero.
10. As a screen-reader user, I want to hear each section title as its real text, never the scramble glyphs, so that the headings make sense.
11. As a visitor with reduced motion on, I want titles and items to appear without scrambling or rising, so that nothing moves.
12. As a visitor without JavaScript, I want every item visible, so that the reveal never hides content.

## Implementation decisions

**Section header.** The shared section-header component drops the terminal-prompt kicker (`$ cat …`) and the hard-coded command prop. It renders a display-type title and keeps the optional summary line as a Label.

The scramble plays once, on first entry. It uses `ScrambleTextPlugin` with the glyph set `JKEFRYNXTDV#/+*`, about 1.1 s. It animates an `aria-hidden` visual layer while the heading's accessible text stays the real title the whole time. Before hydration, under reduced motion and without JavaScript, the title renders as plain text.

**Reveal.** A shared reveal primitive animates items once as they enter: rising about 28 px and fading in over about 0.7 s, staggered by about 0.08 s, starting when the item is 8% into the viewport. The resting state in CSS is fully visible. The hidden starting state is applied only by the animation at the moment it runs, so items are never left invisible waiting for an observer. It is built on the shared GSAP setup and its reduced-motion condition.

**Rows instead of cards.**

- **Experience**: period and location as Labels in a narrow left column; role in large type, company as a Label, bullets as Reading text; the "show more / show less" control unchanged; technology as a Label list.
- **Education**: the same row shape, with the certification row inside it as today.
- **Skills**: one row per category, with the category name as a Label and its items as an inline list separated by middle dots. The "working on" items follow as a quieter second list.

**Projects.** Live and in-progress groups stay a responsive grid, but each project loses its box. A hairline rule on top, a large title, the description as Reading text, and period, company and stack as Labels. Links keep their current targets. The archive keeps its disclosure behaviour with the new row style.

**Contact.** A large closing line, the contact entries as ruled rows, and the CV panel as a ruled block with the khaki primary button. The CV download keeps its current busy, success and error states.

**Shared primitives owned here.** The alternating background band is removed, and sections are separated by hairline rules. The chip becomes a Label list item with no pill box. The panel card is retired, once no section uses it.

**Hover.** A role or project title may take the accent-ink colour on hover. No other decoration is added.

## Testing decisions

There is no test suite, and adding one is out of scope. A good check observes the rendered page, never the source.

- **Static gate**: lint, typecheck, build.
- **Page walk** (orchestrator, Playwright MCP, local dev server), both themes and both locales:
  - Every bullet, project description and archive description measures ≥ 7:1 against the page background.
  - Every period, company, tag and category name measures ≥ 4.5:1.
  - All six experience entries render, expand and collapse.
  - The project archive opens and closes.
  - Live, in-progress and archive groups keep their current membership.
  - Education shows both formal entries and the certification.
  - The contact CV download returns a PDF.
  - Each section heading's accessible name equals its real title before, during and after the scramble.
  - With JavaScript disabled, every item is visible.
  - With reduced motion emulated, nothing scrambles or rises.
  - Zero console errors.
- **Motion**: the scramble runs once per title per page load, not on every re-entry.

## Success criteria

- The five sections match the approved prototype's language: ruled rows, open project grid, display titles, no boxes, no alternating bands, no terminal kickers.
- The contrast rules hold for every Reading text and Label element in both themes.
- Every existing interaction works as before, and every entry of the data files is still rendered.
- The scramble never reaches assistive technology, and the reveal never hides content without JavaScript.
- Lint, typecheck and build pass. There are no console errors.

## Out of scope

- Data files and message prose.
- Pinning, chapters or horizontal scrolling in any section.
- The hero stage, manifesto and chrome.
- A new project or skill taxonomy.

## Further notes

The approved prototype on `prototype/ui-redesign-hero` shows the Experience rows and the Contact block. Skills, Projects and Education follow the same rules without a prototype, so the first walk of each is also its design review.

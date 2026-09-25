# Spec — hero stage and manifesto (sticky scroll transition, JK mark, dot field)

- **Spec issue**: [#64](https://github.com/jefrykurniaone/porto-jefry/issues/64)
- **Execution map**: [#82](https://github.com/jefrykurniaone/porto-jefry/issues/82)
- **Tickets**: [#71](https://github.com/jefrykurniaone/porto-jefry/issues/71) · [#72](https://github.com/jefrykurniaone/porto-jefry/issues/72) · [#73](https://github.com/jefrykurniaone/porto-jefry/issues/73)
- **Run**: `ui-redesign`
- **Version**: v1, copied from the spec issue on 2026-09-25

This is a point-in-time copy. Claims below describe the codebase and the plan as of 2026-09-25; the run that delivers this spec will change the code it describes.

---

## Problem statement

The top of the portfolio is where a recruiter decides whether to keep reading. Today it is a centred block: a particle-network canvas, a round photo, the name, a typed role line, a long subtitle and three buttons, followed by a two-column About section with a decorative terminal card and a row of contact chips.

It is competent but forgettable, and it looks like many developer portfolios. The owner wants the opening to feel like https://13-years.com/: one oversized mark, a single cinematic scroll moment, then a short, confident statement about who they are.

## Solution

Replace the current Hero and About with one **hero stage**.

1. The visitor lands on a full-screen block in the inverse of the page theme: bone-white on the dark theme, near-black on the light theme. Giant "JK" letters sit centred in their own row, tinted with the khaki accent. Below them is a band with the status pill, the name, the role ticker (the same typing line as today), and two buttons: Download CV and View my work. A strip along the bottom scrolls the tech stack and company names.
2. When the visitor scrolls, the stage holds in place. The J and K part and grow, and a circle opens from the centre of the letters. It reveals the **manifesto**: the About section, now led by one oversized line, "I like **boring** code." / "Saya suka kode yang **membosankan**.", over an animated field of dots.
3. The About paragraphs and a black-and-white photo land on the same screen as the line. One flick of the wheel or trackpad is enough to finish the transition.
4. Then the page scrolls on normally.

## Goals and non-goals

Goals:

- The stage and its transition feel like the reference site, driven by native scroll and never by intercepting input.
- The manifesto line, the About paragraphs and the photo are readable together the moment the transition ends.
- Every way of arriving at About lands on the fully revealed manifesto, never on the stage's first frame. That includes a nav link, a drawer link, a shared link with `#about`, and a language switch.
- Arriving at any later section by anchor also lands exactly on that section.
- The stage renders its final first-paint layout from the server, with no layout shift at hydration and no inline script.
- Reduced motion, no JavaScript and no WebGL2 each get a complete, legible page.

Non-goals:

- Any video, showreel or chapter sequence.
- Changing the About paragraphs, the role list or the CV download behaviour.
- Restyling the navbar. This spec only publishes the signal the navbar uses to flip its ink colour.

## User stories

1. As a recruiter, I want the first screen to show one memorable mark and my candidate's name, so that I remember whose portfolio this was.
2. As a recruiter, I want to see which roles the owner fills without reading a paragraph, so that I can judge fit in seconds.
3. As a recruiter, I want to download the CV from the first screen, so that I do not have to hunt for it.
4. As a visitor, I want scrolling to feel like one deliberate cinematic moment, so that the site feels crafted.
5. As a trackpad or mouse-wheel user, I want one flick to complete the transition, so that I am never left staring at a half-open frame.
6. As a keyboard user, I want Page Down, Space and the arrow keys to scroll normally through the stage, so that nothing traps me.
7. As a visitor, I want the About text and photo to appear together with the statement, so that I do not scroll through an empty screen to find the content.
8. As a visitor who clicks "About" in the menu, I want to land on the finished manifesto, so that I do not see the intro screen instead.
9. As a visitor who switches language while reading About or Experience, I want to stay where I was, so that the switch does not throw me back to the top.
10. As a visitor opening a shared link to `#experience`, I want to land on Experience, so that the stage above it does not push me somewhere else.
11. As a visitor with reduced motion on, I want the intro and the manifesto shown as two still blocks, so that I get the content without the motion.
12. As a visitor on a phone, I want the same transition, sized so that the letters and the text never overlap, so that the mobile site does not feel like a lesser copy.
13. As a visitor whose browser has no WebGL2, I want a still dot pattern or a plain background, so that the manifesto still reads well.
14. As a visitor reading the About paragraphs, I want the moving dots to stay out from behind the text, so that I can read comfortably.
15. As a screen-reader user, I want the name, roles, buttons and About text in a sensible reading order without decorative noise, so that the stage makes sense unseen.
16. As the owner, I want the tech stack and company strip to stay in step with my data, so that I never edit a second list.

## Implementation decisions

**One stage component replaces Hero and About in the page composition.** It owns the intro screen and the manifesto layer. Server-renderable content (the name, the About paragraphs, the photo) is rendered on the server and passed into the client stage as children, so the About text keeps shipping as HTML. The existing role-ticker hook is reused unchanged: 62 ms per character typed, 34 ms per character erased, 2200 ms hold. So is the existing CV download hook, including its success and error notices.

**The stage holds by CSS `position: sticky`, not by a GSAP pin.** The stage sits inside a taller wrapper, and the wrapper's height reserves the scroll distance: one screen plus 140% of the viewport. ScrollTrigger only scrubs the timeline across the wrapper. It never inserts a pin spacer.

The reason: a GSAP pin adds its spacer after hydration. That pushes every later section down by 1.4 screens after the browser has already jumped to a `#hash`, so shared links and the language switch would land mid-stage. A sticky wrapper has its final height in the server HTML, so native anchor scrolling is correct from the first paint, and nothing shifts at hydration.

**The first-paint layout is chosen in CSS, not by a script.** The media features `(prefers-reduced-motion: no-preference)` and `(scripting: enabled)` decide whether the wrapper is tall and the manifesto is clipped behind the intro, or whether the two stack as ordinary blocks. JavaScript only adds the scrub. This respects the repository's rule of no inline scripts, and a no-JS visitor never gets a clipped, invisible manifesto.

**`#about` is a marker at the end of the transition.** In the motion layout, the element carrying `id="about"` sits at the scroll offset where the timeline ends, with no top scroll margin. Native anchors, the navbar and drawer links, the language switch's section detection, and the back-to-top observer all resolve to the fully revealed manifesto with no extra JavaScript. In the stacked layout, the marker sits at the top of the manifesto block.

**Timeline.** Labels `start` (0) and `end` (1). `scrub: 1`. Snap is `labelsDirectional`: duration 0.35–0.9 s, delay 0.05 s, `power2.inOut`. The sequence runs in progress units:

| Progress | What happens |
|---|---|
| 0–0.30 | Intro copy exits upward |
| 0–0.25 | Marquee drops away |
| 0–0.85 | J moves left and K moves right, each growing to about 1.9× |
| 0.28–0.90 | The circle opens from the centre of the letters |
| 0.72–1.0 | Manifesto content rises in, staggered |

The circle's centre is measured from the letters' untransformed layout, so a refresh mid-scroll measures the resting position.

**Intro layout.** The letters get a row of their own, centred. The copy band sits below it: identity on the left, actions on the right, from 900px wide; stacked below that. The marquee strip runs along the bottom edge of the first screen. Nothing in the intro overlaps anything else at any width from 320px up.

The current photo, greeting and subtitle leave the intro. The photo moves to the manifesto. The greeting and subtitle are no longer rendered.

**Marquee content comes from data.** Every company in the experience data appears once, followed by every skill item. It scrolls at a constant speed in pixels per second, so a longer list loops slower rather than faster. It is hidden from assistive technology because it repeats content found in Experience and Skills, and it stops under reduced motion.

**Manifesto.** The kicker shows the section's name. The statement is a new message in both locales, with the highlighted word marked up inside the message, rendered through next-intl rich text as a khaki-filled highlight. The highlight is an inline-block so its background never covers the line above: the prototype hit exactly that overlap.

Below the statement come the existing About paragraphs as Reading text, and the profile photo in black and white. The terminal card and the contact chips are removed, and so are their message keys in both locales, once nothing else reads them.

**Dot field.** A WebGL2 point cloud replaces the particle-network canvas, which is deleted.

- A perspective tunnel of about 10,000 points on desktop, and about 4,000 on narrow or coarse-pointer screens, drifting toward the viewer with a slow roll.
- Points lean toward the cursor on fine pointers only.
- Colours come from the theme's dot token, with a small share of points in khaki. They are re-read whenever the theme changes.
- Device pixel ratio is capped at 2.
- It draws only while the manifesto is on screen and the tab is visible, and it handles WebGL context loss.
- The tunnel's centre sits between the statement and the paragraphs.
- Points dim to about 6% opacity inside the bounds of the Reading text, so no moving dot ever passes behind a letter.
- Under reduced motion it draws one still frame. Without WebGL2, it falls back to a single still frame drawn without WebGL, or no field at all. Either way the manifesto stays fully legible.
- It stays decorative and hidden from assistive technology. Following the repository's Sonar lesson, the `aria-hidden` goes on a wrapper, not on the canvas.

**Ink flip signal (the seam with `site-chrome`).** While the header sits over the inverted intro, meaning timeline progress below 0.75 or any position before the stage's scroll range, the stage sets a data attribute on the document root saying the header is over the hero. It clears the attribute otherwise, and sets it again when the visitor scrolls back up. The navbar styles itself against that attribute and nothing else. The attribute's exact name is settled by this spec's first ticket and recorded in the map.

**Motion rules.** Every tween and ScrollTrigger is created through the shared GSAP setup from `visual-foundation`, inside its reduced-motion `matchMedia` condition, and scoped with `useGSAP` so it cleans up on unmount and on locale change.

## Testing decisions

There is no test suite, and adding one is out of scope. A good check observes the rendered page and scroll positions, never the source.

- **Static gate**: lint, typecheck, build.
- **Page walk** (orchestrator, Playwright MCP, local dev server), both themes and both locales:
  - At scroll 0: the letters' box and the copy band's box do not intersect, at 1366×768, 1920×945 and 390×844.
  - At the end of the transition: the statement and the first About paragraph are both inside the viewport at 1366×768.
  - Contrast from `getComputedStyle`: Reading text ≥ 7:1 and Labels ≥ 4.5:1, on the manifesto and on the inverted intro.
  - Anchors:
    - Loading `/en#about` puts the manifesto statement on screen, fully revealed.
    - Loading `/id#experience` puts the Experience heading at the top, allowing for the navbar offset.
    - Switching language while at Projects lands at Projects.
  - Clicking the navbar's About link lands on the revealed manifesto.
  - The root ink-flip attribute is present at scroll 0 and absent once the stage has scrolled away.
  - With `prefers-reduced-motion: reduce` emulated: no scrub, the manifesto is a normal block below the intro, and the dot field is still.
  - Zero console errors throughout, including on a locale switch.
- **Keyboard**: Space and Page Down scroll through the stage without trapping focus, and Tab order follows the reading order.

## Success criteria

- The intro, the transition and the manifesto match the approved prototype: centred "JK", no overlap, the circle from the letters, and the About text on the same screen as the statement.
- Every anchor arrival listed above lands where it should in the walk.
- No layout shift at hydration: the stage's wrapper height in the server HTML equals its height after hydration.
- Reading text contrast is AAA in both themes, and no dot is drawn at more than about 6% opacity inside the Reading text bounds.
- The particle-network canvas and its styles are gone. The About terminal card, the contact chips and their message keys are gone from both locales.
- Lint, typecheck and build pass. The page has no console errors.

## Out of scope

- Video, reels, a showreel button, chapters.
- Intercepting wheel, touch or keyboard input.
- three.js or any 3D library.
- The navbar's own styling (`site-chrome`).
- The restyle of Experience and later sections (`section-restyle`).
- Changing About prose, the role list or CV download behaviour.

## Further notes

The approved prototype is on the throwaway branch `prototype/ui-redesign-hero` (`prototypes/ui-redesign-hero/index.html`, version 6). Read it for timings, layout and colours. It uses a GSAP pin and a 2D dot field. This spec deliberately replaces both, for the anchor and CLS reasons above and for the fidelity decision made in grilling.

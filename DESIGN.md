---
name: Porto-Jefry
description: A dark-first developer portfolio built like a terminal at night — hairline structure, mono metadata, and one violet that means signal.
colors:
  phosphor-violet: "#9d7bff"
  legible-phosphor: "#b9a0ff"
  phosphor-glow: "rgba(157, 123, 255, 0.22)"
  ready-green: "#3ddc97"
  fault-red: "#e5484d"
  terminal-black: "#07070c"
  band-black: "#0b0b13"
  panel-slate: "#0f0f19"
  screen-white: "#ececf4"
  half-lit-grey: "#9c9cb0"
  hairline: "rgba(235, 235, 248, 0.09)"
  cta-ink: "#0a0a10"
typography:
  # The ramp is hand-set in half-pixel steps, not generated from a ratio, and
  # every rung below is in use. It is enumerated in full so tooling can tell a
  # deliberate step from a stray value — a size that is NOT on this list is out
  # of system, and adding one means adding it here in the same commit.
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(46px, 8vw, 84px)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  contact-headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(30px, 5vw, 48px)"
    fontWeight: 700
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(28px, 4vw, 40px)"
    fontWeight: 700
    letterSpacing: "-0.02em"
  fullpage-headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(26px, 4vw, 36px)"
    fontWeight: 700
    letterSpacing: "-0.02em"
  fullpage-glyph:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "44px"
  hamburger:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "20px"
  title:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "19px"
    fontWeight: 600
    letterSpacing: "-0.01em"
  float-glyph:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "18px"
  card-title:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "16.5px"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  card-title-sm:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "16px"
    fontWeight: 600
  body-lead:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.75
  body:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
    lineHeight: 1.85
  control:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "15px"
    fontWeight: 600
  contact-value:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "14.5px"
    fontWeight: 500
  body-dense:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.65
  hero-typed:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "clamp(15px, 2.4vw, 21px)"
    fontWeight: 500
  hero-kicker:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "13px"
    letterSpacing: "0.2em"
  nav-link:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "13.5px"
    fontWeight: 500
  body-fine:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.65
  contact-chip:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "12.5px"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "0.2em"
  # Same 12px rung as `label`, at command tracking. Section kickers are shell
  # commands now, not uppercase labels, so the Tracking-With-Caps Rule does not
  # reach them — see the Section Command Rule under Typography.
  section-command:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "0.06em"
  meta:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "11.5px"
    letterSpacing: "0.08em"
  chip:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "11px"
    letterSpacing: "0.16em"
  eyebrow:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "10.5px"
    letterSpacing: "0.14em"
  badge:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "10px"
    letterSpacing: "0.14em"
  # PDF only. @react-pdf/renderer cannot read the WOFF2 next/font caches, so
  # the CV registers the vendored Space Grotesk TTFs and falls back to the
  # PDF-standard face if those files are missing from the serverless bundle.
  # Declared here so the fallback is a documented state, not a stray family.
  pdf-fallback:
    fontFamily: "Helvetica"
  pdf-fallback-bold:
    fontFamily: "Helvetica-Bold"
rounded:
  chip: "6px"
  control: "8px"
  action: "10px"
  card: "12px"
  window: "14px"
  pill: "999px"
spacing:
  hairline-gap: "8px"
  tight: "12px"
  card-gap: "18px"
  gutter: "24px"
  column-gap: "44px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.phosphor-violet}"
    textColor: "{colors.cta-ink}"
    rounded: "{rounded.action}"
    padding: "14px 28px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.screen-white}"
    rounded: "{rounded.action}"
    padding: "14px 28px"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.screen-white}"
    rounded: "{rounded.control}"
    height: "34px"
    width: "34px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.half-lit-grey}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    padding: "4px 9px"
  card:
    backgroundColor: "{colors.panel-slate}"
    textColor: "{colors.screen-white}"
    rounded: "{rounded.card}"
    padding: "24px"
  status-pill:
    backgroundColor: "{colors.panel-slate}"
    textColor: "{colors.half-lit-grey}"
    rounded: "{rounded.pill}"
    padding: "7px 16px"
  terminal:
    backgroundColor: "{colors.panel-slate}"
    textColor: "{colors.screen-white}"
    rounded: "{rounded.window}"
    padding: "20px 22px"
  lang-pill-active:
    backgroundColor: "{colors.phosphor-violet}"
    textColor: "{colors.cta-ink}"
    rounded: "{rounded.pill}"
    padding: "0 11px"
    height: "28px"
---

# Design System: Porto-Jefry

## Overview

**Creative North Star: "The Terminal at Night"**

The room is dark and the code is lit. Content sits on a near-black field (`#07070c`) that has a faint violet tilt rather than a neutral grey one, and every structural boundary is a single hairline of light. Nothing in this system is decorated; things are either *lit* or *drawn*. Prose is set in Space Grotesk at a comfortable reading measure, but every piece of metadata — dates, locations, tech chips, section kickers, the logo — switches to JetBrains Mono with wide tracking, the way a terminal separates output from chrome. The greeting is written as a code comment (`// Hi, I'm`), the role line runs behind a `>` prompt with a blinking block cursor, and the About section is a literal terminal window with a title bar. This is not a metaphor applied on top of a portfolio; it is the portfolio's actual voice.

Depth is emitted, not cast. The system is flat by construction: hairline borders, no drop shadows on ordinary surfaces, no gradients on panels. What glows is what is *powered* — the primary CTA, the AI badge, the profile portrait, the floating back-to-top control, all lit by `--glow`, a translucent derivative of the accent. Hover does not add shadow; it lifts by two or three pixels and warms the border toward the accent. The only ambient motion is a canvas particle network in the hero that draws faint links between drifting nodes, and it turns itself off entirely under `prefers-reduced-motion`.

Both themes are first-class, but they are not symmetrical in intent. Dark is the default and the designed state — the one the North Star describes. Light is a faithful inversion for daylight and for the recruiter who prints: the same hairlines, the same accent hue, the same geometry, on `#f7f7fb` paper with the accent darkened for legible contrast. The type scale is hand-set rather than ratio-generated, in half-pixel steps (10.5, 11.5, 13.5, 15.5, 16.5), which is what keeps dense metadata rows legible without a size jump between neighbours.

**Key Characteristics:**
- Dark-first, near-black canvas with a violet undertone; light is an inversion, not a second identity.
- One accent hue only. Violet marks signal; nothing else competes.
- Hairline structure: every boundary is exactly 1px, at 9% (dark) / 11% (light) opacity.
- Dual typeface split by *function*, not by hierarchy — sans for language, mono for metadata.
- Flat surfaces; glow means powered, motion means lift.
- Half-step type sizing, tuned per component rather than generated from a ratio.
- Non-colour redundancy on every meaningful distinction (dashed borders, glyphs, labels).

## Colors

A near-monochrome violet-black field carrying exactly one chromatic accent, plus two status colours that appear only as small marks.

### Primary

- **Phosphor Violet** (`#9d7bff`): the single accent. Used as a fill and a light source — the CTA background, the active language segment, particle-network links and nodes, and the source of `--glow`. It is *never* used directly on text; see The Ink Rule.
- **Legible Phosphor** (`≈#b9a0ff` dark / `≈#52369f` light): the text-safe derivative, generated as `color-mix(in oklab, var(--accent) 72%, white)` in dark and `… 58%, black)` in light. This is the colour of every accent-carrying *word or glyph*: section kickers, the `//` greeting, the `>` prompt, employment periods, links, bullet markers, focus rings, terminal prompts. Two separately-tuned mixes exist precisely so accent text clears AA against both backgrounds.
- **Phosphor Glow** (`rgba(157, 123, 255, 0.22)` dark / `0.16` light): not a colour you set on anything — a light quantity, spent only in `box-shadow`.

### Tertiary

- **Ready Green** (`#3ddc97`): availability and success only. Two appearances site-wide: the pulsing dot in the hero status pill, and the success line inside the terminal window. It never becomes a surface, a border, or a heading.
- **Fault Red** (`#e5484d`): the CV-generation error alert, and only that. It is tokenized as `--fault` in `globals.css` and appears mixed, never raw — a 55% border against the hairline and a 12% wash into the panel, so a failure reads as a tinted panel rather than a red box. A second error surface consumes `--fault`; it never copies the literal.

### Neutral

Dark theme (default):

- **Terminal Black** (`#07070c`): the page field. Deliberately violet-tilted, not neutral grey.
- **Band Black** (`#0b0b13`): the alternating section band. The only device separating one section from the next besides a hairline.
- **Panel Slate** (`#0f0f19`): every raised surface — cards, drawer, terminal, back-to-top, skip link.
- **Screen White** (`#ececf4`): headings, names, values, and interactive labels. Not body prose.
- **Half-Lit Grey** (`#9c9cb0`): all body prose, descriptions, chips, locations, secondary metadata.
- **Hairline** (`rgba(235, 235, 248, 0.09)`): every border, divider, and the hero grid overlay.
- **CTA Ink** (`#0a0a10`): text on the accent fill.

Light theme overrides the same roles: field `#f7f7fb`, band `#efeff6`, panel `#ffffff`, text `#16161f`, muted `#5c5c70`, hairline `rgba(12, 12, 36, 0.11)`, CTA text `#ffffff`, CTA fill `color-mix(in oklab, var(--accent) 62%, black)`. The accent hue itself is the one value that does not flip.

A `--accent-2` (`#4fd8e8`, cyan) was once declared in `globals.css` and consumed nowhere; it has been deleted. Do not reintroduce it — see The One Voice Rule.

### Named Rules

**The Ink Rule.** Raw `--accent` never touches text. Text uses `--accent-ink`, which is contrast-corrected per theme. A component that hardcodes `--accent` on a foreground colour will pass in dark and fail AA in light.

**The One Voice Rule.** There is exactly one accent hue. Status green and fault red are *marks*, never surfaces — together they occupy well under 1% of any viewport. Introducing a second accent hue breaks the world.

**The Muted Body Rule.** Body prose is `--muted`; `--text` is reserved for headings, proper nouns, values, and interactive labels. Full-strength text on a paragraph reads as an error in this system, not as emphasis.

## Typography

**Display Font:** Space Grotesk (with `sans-serif`), weights 400/500/600/700, loaded via `next/font` as `--font-sans`
**Label/Mono Font:** JetBrains Mono (with `monospace`), weights 400/500/600, as `--font-mono`

**Character:** Space Grotesk is a grotesque with engineered, slightly quirky letterforms — geometric enough to look precise at 84px, humane enough to read at 15.5px for a 300-word paragraph. JetBrains Mono is a working programmer's face, not a decorative typewriter one. The pairing works because the split is functional: if it is a sentence a person wrote, it is Space Grotesk; if it is something a machine would print — a date, a path, a tech name, a coordinate — it is mono.

### Hierarchy

- **Display** (700, `clamp(46px, 8vw, 84px)`, 1.02, `-0.03em`, `text-wrap: balance`): the name in the hero. Exactly one per site.
- **Headline** (700, `clamp(28px, 4vw, 40px)`, `-0.02em`): section titles, with a fixed 44px gap to the content below. The contact section runs a larger variant (`clamp(30px, 5vw, 48px)`) because it is the closing statement.
- **Title** (600, 19px, `-0.01em`): job role. Card titles step down from it — project name 16.5px/1.35, institution 16px, skill category 15px — all at 600.
- **Body** (400, 15.5–16px, 1.75–1.85, `--muted`): About prose runs the loosest leading (1.85) at up to a full column; hero and contact intros are capped at 620px and 560px. Dense secondary prose — experience bullets, project descriptions — drops to 13.5–14px at 1.65.
- **Label** (mono, 10.5–13px, `0.12–0.2em`, usually uppercase): the entire metadata layer. Hero kicker 13px/`0.2em`, status pill 11px/`0.16em`, card eyebrows 10.5px/`0.14em`, chips 11px, GPA and location lines 11.5px.
- **Section command** (mono, 12px/`0.06em`, lowercase): the section kicker. It is a shell command — `$ cat about.md`, `$ history --work`, `$ ls --production`, `$ ls -la ~/work`, `$ cat credentials.md`, `$ mail jefry` — with the `$` in `--muted` and the command in `--accent-ink`, the same split the hero runs between `.hero__typed-prompt` and its typed line. Under it, an optional **output** line reuses the `meta` rung (11.5px/`0.08em`, `--muted`) and carries counts derived from the data arrays.

### Named Rules

**The Mono Metadata Rule.** JetBrains Mono never sets a sentence. Its job is dates, locations, tech names, chips, kickers, the logo, and code-like glyphs (`//`, `>`, `▌`, `+`, `−`). A paragraph in mono is out of system.

**The Tracking-With-Caps Rule.** Every uppercase run carries at least `0.12em` letter-spacing, and tracking scales *inversely* with size — 10.5px runs at `0.14em`, the 13px hero kicker at `0.2em`. Uppercase at default tracking is never correct here. It applies to *uppercase runs only*: lowercase mono, such as a section command, tracks tighter.

**The Section Command Rule.** Every section is introduced by the command that would produce it, not by a number. The numbered eyebrows (`01 /` … `06 /`) were removed because the sequence carried nothing a reader needed, and because they left the terminal voice stranded in the hero and About while five sections below spoke in generic portfolio grammar. Commands stay untranslated — they are code, exactly like `$ whoami` inside the About terminal — and the localized section name is the `<h2>` directly beneath. A new section adopts a command; it does not reintroduce a number.

**The Derived Output Rule.** The count line under a section command is read from the data arrays at render time (`experiences.length`, `projects.filter(hasPublicUrl).length`, and so on). It is never written down. A hand-maintained count is a claim that drifts the first time the array changes, and this site's whole argument is that its claims are checkable.

**The Negative Tracking Rule.** Large sans type tightens as it grows: `-0.01em` at 19px, `-0.02em` at section scale, `-0.03em` at display. Optical correction, not decoration.

## Layout

A single centred column, not a grid system. `.container-page` caps content at **1100px** with 24px gutters (the navbar runs 1160px so its edges sit just outside the content column). Vertical rhythm is one number: `.section-inner` pads **96px** top and bottom; the closing contact section stretches to 110px and narrows to 900px to signal an ending.

Sections alternate `--bg` and `--bg2` bands, each opened by a 1px hairline (`.section-band`). There is no other section separator — no rules, no ornaments, no wave dividers.

Card regions are auto-responsive rather than breakpoint-driven: `repeat(auto-fit, minmax(N, 1fr))` with an 18px gap, where N encodes the content's minimum comfortable width — 230px for contact cards, 280px for education, 300px for skills, 320px for projects (`auto-fill`, so a lone card does not stretch across the row). About is a two-up `minmax(320px, 1fr)` at a 44px column gap.

Two real breakpoints exist:
- **900px** — the navbar swaps between inline links plus desktop controls, and a hamburger opening a 18rem right-side drawer.
- **640px** — the experience row collapses from a `minmax(170px, 210px) 1fr` period/detail split into a single stacked column.

The hero is full-height (`100svh`, with a `100vh` fallback) and clears the fixed navbar via `calc(var(--navbar-height) + 66px)` top padding. `--navbar-height: 64px` is the single source of truth for that clearance and for every section's `scroll-margin-top`; hardcoding 64px anywhere else silently breaks anchor scrolling.

Touch targets are held at 44px minimum on the hamburger, drawer links, and back-to-top — every control that is reachable on a phone. Pointer-only controls (navbar links, the `+N more` button, project links) clear the 24px WCAG 2.5.8 floor instead, and three of them buy that height without moving anything: the navbar link pads inside a fixed-height flex row, `.exp-more-btn` absorbs its padding with a negative top margin, and `.project-card__link` grows a `::after` box `-8px` vertically so it never reaches across the 16px gap to its neighbour. Both `html` and `body` carry `overflow-x: clip` (not `hidden`, which would create a scroll container and break `position: sticky` and `scroll-margin-top`).

### Named Rules

**The One Column Rule.** 1100px, 24px gutters, 96px rhythm. New sections adopt these three numbers; they do not negotiate their own.

## Elevation & Depth

This system is **flat**, and its depth vocabulary is *emission*, not lift. Ordinary surfaces — cards, chips, inputs, the navbar, the drawer — have no shadow at all. They separate from the field by a 1px hairline and a tonal step (`--panel` over `--bg`). That is the whole ordinary depth model.

Shadow exists only as **glow**: an accent-derived, high-blur, zero-or-low-offset halo that says *this element is powered*. It is spent on four things: the primary CTA (`0 6px 30px`), the hero portrait (`0 0 54px`, over a hairline ring), the AI badge (`0 0 16px`), and the floating back-to-top (`0 6px 24px`). Nothing else may glow without displacing one of them.

Hover elevation is expressed as **motion plus border warmth**, never as a new shadow: cards translate `-3px` and shift their border toward `color-mix(in srgb, var(--accent) 45%, var(--line))`; the primary button translates `-2px`; outline buttons and icon buttons only warm their border to `--accent-ink`.

### Shadow Vocabulary

- **Action glow** (`box-shadow: 0 6px 30px var(--glow)`): the primary CTA at rest. The one glow that carries a downward offset, because it is the only element that also moves on hover.
- **Portrait halo** (`box-shadow: 0 0 0 1px var(--line), 0 0 54px var(--glow)`): the hero photo. A hairline ring plus a wide bloom, in one declaration.
- **Badge glow** (`box-shadow: 0 0 16px var(--glow)`): the small AI badge on the workflow skill card.
- **Float glow** (`box-shadow: 0 6px 24px var(--glow)`): the back-to-top control, the only element that floats over scrolling content.
- **Window shadow** (`box-shadow: 0 20px 60px color-mix(in srgb, black 25%, transparent), 0 0 40px var(--glow)`): the About terminal, and **the system's single documented exception** — the only place a neutral cast shadow appears. It is justified because the terminal is presented as a physical window sitting on the page, not as page furniture. Do not generalize it; a second neutral shadow anywhere else means the exception has become a rule and the flat model is gone.

### Named Rules

**The Emitted Light Rule.** If it does not carry the accent, it does not glow. Depth on neutral surfaces is a hairline and a tonal step — nothing else.

**The Lift-Is-Motion Rule.** Hover elevation is `translateY(-2px | -3px)` and a warmed border. Never a shadow that appears on hover.

## Shapes

Rectilinear with softened corners, on a **radius ladder that scales with the surface**: 6px chips → 8px controls (icon buttons, contact chips, skip link) → 10px actions (buttons, alerts) → 12px cards → 14px the terminal window. Fully round (`999px`) is reserved for things that read as *state* rather than *container*: the hero status pill, the EN|ID segmented toggle, the back-to-top button. True circles (`50%`) belong to the portrait and to indicator dots.

Borders are the system's primary drawing tool and they are always exactly **1px** — there is no 2px weight, no double rule, no coloured divider. The same hairline draws card edges, section bands, the navbar underline, the drawer's left edge, and the 56px hero grid overlay (which is masked by a radial gradient so it fades out before reaching the viewport edges).

Border *style* carries meaning once: skill chips for working-knowledge use `border-style: dashed` rather than a colour change, so the production/working distinction survives greyscale printing and colour-blind vision.

Focus is a 2px `--accent-ink` outline, offset outward (`2px`/`3px`) on free-standing controls and inward (`-2px`) inside the segmented language pill where an outward ring would clip.

### Named Rules

**The Hairline Rule.** Every boundary in this system is 1px `--line`. A thicker border, or a border in any other colour, is out of system — the two sanctioned deviations are the dashed working-knowledge chip and the accent-warmed hover border.

**The Radius Ladder Rule.** Radius grows with surface size, and a new component adopts the rung its size implies rather than inventing a value.

## Components

### Buttons

- **Shape:** softly rounded rectangles (10px), 14px/28px padding, 600 weight at 15px in the sans face, icons and glyphs sitting in an 8px flex gap.
- **Primary:** accent fill (`--cta-bg`) with near-black ink (`--cta-text`) and the action glow. Hover lifts 2px; there is no colour change, because the fill is already the loudest thing on screen.
- **Outline:** transparent with a hairline border and full-strength text. Hover warms the border to `--accent-ink`. This is the default for secondary actions and it is used twice as often as primary — the hero runs one primary against two outlines.
- **Disabled:** `opacity: 0.6` with `cursor: wait` on the CV button, which is a genuinely async action rather than a blocked one.
- **Icon button:** 34×34, 8px radius, transparent, hairline border, mono glyph. Hover warms the border. Used for theme toggle and drawer close.

### Chips

- **Style:** mono at 11px, `--muted` text, transparent background, 1px hairline, 6px radius, 4px/9px padding. They wrap in an 8px-gap flex row. Project cards shrink them to 10.5px/3px-8px so a nine-item tech stack still reads as one texture rather than nine objects.
- **Working-knowledge variant:** identical, but `border-style: dashed`. Solid means shipped to production; dashed means side work. The distinction is structural, not chromatic, on purpose.

### Cards / Containers

- **Corner style:** 12px.
- **Background:** `--panel`, one tonal step above the field.
- **Shadow strategy:** none. See Elevation.
- **Border:** 1px hairline.
- **Internal padding:** 24px.
- **Lift variant** (`.panel-card--lift`): on hover, border warms to 45% accent and the card rises 3px over 0.2s. Applied to skill, project, education, and contact cards — every card that represents a discrete piece of evidence.

### Navigation

Fixed, full-width, 64px tall, with a `blur(16px)` backdrop over an 80%-opaque field colour and a hairline bottom border — the one place in the system that uses translucency, so content scrolling under it stays legible without a solid bar. The logo is mono at 15px with `0.12em` tracking and a single accent-inked character. Links are 13.5px/500 sans in `--muted`, going to `--text` on hover, with no underline and no active-state marker; they carry `5px` of vertical padding and a `26px` min-height so a 17px line of type is still a legal pointer target. Below 900px the link row and desktop controls are replaced by a hamburger opening a 18rem drawer from the right, over a 55%-black backdrop, with 44px-tall links and the theme and language controls docked in a hairline-topped footer. The drawer sets `inert` on the navbar, `main`, `footer`, the skip link, and the back-to-top control while it is open, so a screen reader's virtual cursor cannot walk the page behind it.

**The blur is order-sensitive.** `.site-nav` must declare `-webkit-backdrop-filter` *before* the standard `backdrop-filter`. Lightning CSS (Turbopack's CSS pass) collapses the pair to the last declaration and then re-prefixes; standard-first emits only the WebKit alias, which Blink never implemented, and the blur dies silently in every Chromium browser while Safari keeps it. After touching that rule, confirm both spellings survive into `.next/static/chunks/*.css`.

### Language toggle (signature)

A 28px-tall segmented pill: two mono 11px/600 buttons inside a `999px` hairline capsule with `overflow: hidden`. The active segment takes the accent fill and CTA ink via `aria-pressed="true"` — state is expressed through the same ARIA attribute the assistive layer reads, not a separate class. Inactive segments are `--muted` and warm to `--text` on hover.

The focus ring is inset (`outline-offset: -2px`) because the capsule's `overflow: hidden` would clip an outward one, and it **switches colour on the active segment**: `--accent-ink` sits on the accent fill at 1.4:1 (dark) / 1.1:1 (light) and is effectively invisible there, so `[aria-pressed='true']:focus-visible` takes `--cta-text` instead — 6.3:1 and 8.9:1. Any future control that puts a focus ring on top of `--cta-bg` needs the same swap.

### Terminal (signature)

The About section's proof-of-voice: a 14px-radius panel with a title bar of three 10px dots (two muted, one accent), a mono title, and a hairline separator, over a body at 13px/2.05 line-height. Inside, `--accent-ink` sets the prompt, `--text` the typed command, `--muted` the output, `--ok` the success line, and a blinking block cursor closes it. This is the only component with a cast shadow, and the only place the interface renders itself as an object rather than a surface.

### Status pill (signature)

A `999px` capsule with 60%-opaque panel fill, hairline border, mono 11px `0.16em` uppercase text, led by a 7px Ready Green dot that pulses on a 2.2s ease loop (opacity plus an expanding 6px shadow ring). It is how availability is stated — the only always-animating element outside the hero canvas.

### Particle canvas (signature)

A decorative, `aria-hidden` full-bleed canvas behind the hero: 55 nodes drifting at ~0.00045 units/frame, linking with straight accent strokes whenever they come within 0.14 normalized units, at 16% (dark) / 14% (light) alpha, nodes at 55%/40%. It re-reads `data-theme` every frame so a theme switch is instant, scales by `devicePixelRatio`, and **returns before allocating anything** when `prefers-reduced-motion: reduce` matches — the canvas simply stays empty rather than freezing on a first frame.

## Do's and Don'ts

### Do:

- **Do** derive accent text from `--accent-ink` and accent light from `--glow`. Both are theme-corrected; raw `--accent` is not.
- **Do** put every date, location, tech name, chip, kicker, and code-like glyph in `--font-mono`, and every sentence in `--font-sans`.
- **Do** give any uppercase run at least `0.12em` tracking, more as the size drops.
- **Do** build new sections from `.section-band` + `.section-inner` + `.container-page` so they inherit the 96px rhythm and the 1100px column for free.
- **Do** reach for `.panel-card`, `.chip`, `.chip-row`, `.section-title`, and `.section-kicker` before writing new CSS — the shared primitives already carry the system.
- **Do** express hover as `translateY(-2px | -3px)` plus a warmed border.
- **Do** back every colour-coded distinction with a second, non-colour cue — a dashed border, a glyph, or a label.
- **Do** read `--navbar-height` for anything that must clear the fixed navbar.
- **Do** guard any new ambient motion behind `prefers-reduced-motion: reduce`, and make the guard *skip the work*, not just hide it.
- **Do** keep both themes in step: any new colour needs a value that clears 4.5:1 on `#07070c` **and** on `#f7f7fb`. Mix borders and washes from `--accent-ink`, not raw `--accent` — a raw mix that reads on the dark field can fall to 1.7:1 on the light one.
- **Do** check the *emitted* CSS, not the source, after touching a vendor-prefixed property. Lightning CSS rewrites this stylesheet on every build and has already deleted one working declaration outright.
- **Do** add any new font size to the `typography` block in this file's front matter in the same commit. The ramp is enumerated there precisely so a stray value is detectable.

### Don't:

- **Don't** introduce a second accent hue. `--accent-2` (`#4fd8e8`) was removed for this reason; it is not a reserve.
- **Don't** put `--accent` on text, or hardcode `#9d7bff` anywhere outside `globals.css` and the particle canvas (which needs the raw RGB triplet for `rgba()` strokes).
- **Don't** add a `box-shadow` to a neutral surface. Depth is a hairline plus a tonal step; glow belongs to accent-carrying elements only.
- **Don't** widen a border past 1px or divide sections with anything but a hairline.
- **Don't** set body prose in `--text` or in the mono face.
- **Don't** invent a radius outside the ladder (6/8/10/12/14/999), or apply `999px` to something that is a container rather than a state.
- **Don't** use `overflow: hidden` on `html`/`body` — `clip` is deliberate, and `hidden` breaks sticky positioning and `scroll-margin-top`.
- **Don't** add a gradient, a texture, or an illustrated ornament to a panel. The hero grid and the particle canvas are the system's entire atmospheric budget, and both are masked, decorative, and `aria-hidden`.
- **Don't** communicate anything by colour alone.

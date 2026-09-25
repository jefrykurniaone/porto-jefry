# The hero stage holds by CSS sticky, not by a GSAP pin

The hero stage (see `CONTEXT.md`) holds in place while its scroll transition plays. The obvious way to build that, and the one GSAP's own examples show, is `ScrollTrigger` with `pin: true`. We deliberately do not use it.

A pin inserts its spacer at hydration. That lengthens the page by the transition's scroll distance after the browser has already scrolled to any `#hash`, so shared links, the language switch (which restores the reader's section through the URL hash), and in-page anchors would all land mid-stage.

Instead, a wrapper whose height already includes the scroll distance is rendered from the server. The stage is `position: sticky` inside it, and ScrollTrigger only scrubs the timeline. CSS media queries on `prefers-reduced-motion` and `scripting` pick the tall, clipped layout or a plain stacked one at first paint, so no inline script is needed. The `#about` anchor is a marker placed at the offset where the transition ends, so native anchor scrolling lands on the fully revealed manifesto.

Decided on 2026-09-25 in the grilling for run `ui-redesign`, spec #64. The approved prototype used a pin, and that choice is what exposed the problem.

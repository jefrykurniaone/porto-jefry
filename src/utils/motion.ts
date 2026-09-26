/**
 * The single motion setup for the site. Rules:
 *
 * - Import `gsap`, `ScrollTrigger` and `useGSAP` from this module only, never
 *   from `gsap` or `@gsap/react` directly.
 * - Plugins register once, below, when this module evaluates in the browser --
 *   never inside a component, an effect, `useGSAP`, or a `gsap.context`.
 *   Registering inside any of those attaches ScrollTrigger's core-init timer
 *   (`gsap.delayedCall(0.5, () => _startup = 0)`, ScrollTrigger.js:2116) to
 *   that context: reverting the context before the 0.5s timer fires -- a
 *   React StrictMode double-mount under `next dev`, or any unmount within
 *   half a second in production -- kills the call, and ScrollTrigger's
 *   `_startup` flag then stays `1` for the rest of the page's life, which
 *   blocks every future snap. `registerMotion()` is kept only so existing
 *   call sites still compile; it is an idempotent no-op and never needs to
 *   be called.
 * - Create every tween and ScrollTrigger inside
 *   `gsap.matchMedia().add(MOTION_OK, ...)`, so GSAP reverts it by itself when
 *   the visitor turns reduced motion on.
 * - Never call `gsap.registerPlugin` anywhere else.
 */
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

/** Media query under which motion is allowed. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, useGSAP);
    // Next's own DOMContentLoaded/load pair (ScrollTrigger.js:2146) forces a
    // refresh: both reach `_refreshAll` with a truthy DOM event as `force`,
    // which skips the "defer while scrolling" guard at ScrollTrigger.js:484.
    // `load` can fire long after DOMContentLoaded -- late enough to land in
    // the middle of a navbar click's smooth scroll and snap it back to 0.
    // Dropping only `load` keeps DOMContentLoaded (fires before a visitor
    // could have clicked anything), `resize` and `visibilitychange`.
    ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,DOMContentLoaded,resize' });
}

/**
 * No-op kept only so existing call sites still compile: registration happens
 * above, at module evaluation. Calling this is harmless and never required.
 */
export function registerMotion(): void {
    // Intentionally empty -- see the module doc comment.
}

export { gsap, ScrollTrigger, useGSAP };

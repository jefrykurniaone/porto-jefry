/**
 * The single motion setup for the site. Rules:
 *
 * - Import `gsap`, `ScrollTrigger` and `useGSAP` from this module only, never
 *   from `gsap` or `@gsap/react` directly.
 * - Call `registerMotion()` in a client component before its first tween. It is
 *   idempotent and a no-op on the server, so every caller may call it.
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

let registered = false;

/** Registers ScrollTrigger, ScrambleTextPlugin and useGSAP once, in the browser only. */
export function registerMotion(): void {
    if (registered || typeof window === 'undefined') {
        return;
    }
    gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, useGSAP);
    registered = true;
}

export { gsap, ScrollTrigger, useGSAP };

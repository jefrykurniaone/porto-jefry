'use client';

import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '@/utils/motion';

/** The glyphs the title resolves out of: the owner's initials plus code punctuation. */
const SCRAMBLE_CHARS = 'JKEFRYNXTDV#/+*';
const SCRAMBLE_DURATION = 1.1;
/** How far into the viewport the title's top must be before it scrambles. */
const SCRAMBLE_START = 'top 85%';

interface ScrambleTitleProps {
    /** The real title. Rendered as plain text, and the only text assistive technology reads. */
    text: string;
}

/**
 * Scrambles `glyphs` into `text` once, when `root` first scrolls into view.
 * `once: true` kills the trigger after it fires, so scrolling away and back
 * never replays it.
 */
function scrambleOnce(root: HTMLElement, glyphs: HTMLElement, text: string): void {
    gsap.to(glyphs, {
        duration: SCRAMBLE_DURATION,
        scrambleText: {
            text,
            chars: SCRAMBLE_CHARS,
            speed: 0.5,
            // Full-length glyphs from the first frame, rather than growing from
            // nothing, so the title reads as resolving rather than typing.
            tweenLength: false,
        },
        // Hand the title back to the real text layer once it has resolved.
        onComplete: () => {
            glyphs.textContent = '';
        },
        // The trigger is the in-flow wrapper, never the empty glyph layer, whose
        // zero-size box would fire at page load.
        scrollTrigger: { trigger: root, start: SCRAMBLE_START, once: true },
    });
}

/**
 * A heading's text that scrambles into place once, the first time it scrolls
 * into view. Place it inside the heading element; it renders spans, not a heading.
 *
 * Two layers, so the scramble never reaches assistive technology:
 *
 * - `.scramble-title__text` holds the real title and stays in the accessibility
 *   tree the whole time. It also sets the box, so nothing around it moves.
 * - `.scramble-title__glyphs` is `aria-hidden`, absolutely positioned over the
 *   real text, and empty at rest. Only the running tween fills it; while it
 *   holds glyphs, CSS makes the real text transparent (never `visibility`, which
 *   would drop it from the accessibility tree).
 *
 * Without JavaScript, before hydration and under reduced motion the glyph layer
 * stays empty, so the title is plain text.
 */
export default function ScrambleTitle({ text }: Readonly<ScrambleTitleProps>) {
    const rootRef = useRef<HTMLSpanElement>(null);
    const glyphsRef = useRef<HTMLSpanElement>(null);

    useGSAP(
        () => {
            const root = rootRef.current;
            const glyphs = glyphsRef.current;
            if (!root || !glyphs) {
                return;
            }
            gsap.matchMedia().add(MOTION_OK, () => scrambleOnce(root, glyphs, text));
        },
        { dependencies: [text], revertOnUpdate: true },
    );

    return (
        <span ref={rootRef} className='scramble-title'>
            <span ref={glyphsRef} className='scramble-title__glyphs' aria-hidden='true' />
            <span className='scramble-title__text'>{text}</span>
        </span>
    );
}

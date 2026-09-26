'use client';

import { useCallback, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '@/utils/motion';

/** Each item rises this far, in px, as it fades in. */
const RISE = 28;
const DURATION = 0.7;
const STAGGER = 0.08;
/** 8% into the viewport: the item's top has crossed 92% of the viewport height. */
const START = 'top 92%';

interface RevealProps {
    children: ReactNode;
    /** The wrapper element. `ul` / `ol` keep list semantics when the items are `li`. */
    as?: 'div' | 'ul' | 'ol';
    /** Class for the wrapper element, e.g. the section's own grid or list class. */
    className?: string;
}

/**
 * Batches `items` so each group that crosses the start line together rises in
 * once, staggered. `once: true` kills each trigger after it fires. The hidden starting state is written by the `from` tween at
 * the moment it runs and cleared when it finishes, so nothing is ever left
 * hidden waiting for a trigger.
 */
function revealOnce(items: Element[], contextSafe: gsap.ContextSafeFunc | undefined): void {
    const rise = (batch: Element[]) => {
        gsap.from(batch, {
            y: RISE,
            // Opacity, not autoAlpha: `visibility: hidden` would drop the item
            // from the accessibility tree and the tab order mid-rise.
            opacity: 0,
            duration: DURATION,
            stagger: STAGGER,
            ease: 'power2.out',
            // A leftover inline transform would make each item a containing
            // block and stacking context for good; the rest state is CSS.
            clearProps: 'transform,opacity',
        });
    };
    ScrollTrigger.batch(items, {
        start: START,
        once: true,
        // Wrapped so the tween, created later on scroll, still belongs to the
        // matchMedia context and is reverted with it if reduced motion turns on.
        onEnter: (contextSafe?.(rise) ?? rise) as typeof rise,
    });
}

/**
 * Animates each direct child once, the first time it enters the viewport: up
 * from 28px below and from transparent, staggered. Put one item per direct
 * child. Children are collected on mount; items added later render at rest.
 *
 * The CSS resting state is fully visible. Without JavaScript, before hydration
 * and under reduced motion no tween exists, so every item is simply there.
 */
export default function Reveal({ children, as = 'div', className }: Readonly<RevealProps>) {
    const rootRef = useRef<HTMLElement | null>(null);
    // A callback ref, because one element type serves all three tags: an
    // object ref typed for one of them is not assignable to the others.
    const setRoot = useCallback((node: HTMLElement | null) => {
        rootRef.current = node;
    }, []);

    useGSAP(() => {
        const root = rootRef.current;
        if (!root) {
            return;
        }
        gsap.matchMedia().add(MOTION_OK, (_context, contextSafe) => {
            revealOnce(Array.from(root.children), contextSafe);
        });
    });

    const Tag = as;
    return (
        <Tag ref={setRoot} className={className}>
            {children}
        </Tag>
    );
}

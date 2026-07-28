'use client';

import { useEffect } from 'react';

/**
 * Marks everything outside the drawer `inert` while it is open.
 *
 * The focus trap already holds the Tab ring, but a screen reader's virtual
 * cursor does not use Tab — without this it walks straight through the page
 * behind an `aria-modal='true'` dialog. `inert` removes those subtrees from the
 * accessibility tree and from hit-testing in one attribute.
 *
 * The drawer renders inside <header> alongside the fixed navbar, so the navbar
 * is targeted directly rather than by inerting <header> — that would take the
 * drawer down with it.
 */
const BACKGROUND_SELECTOR = '.site-nav, main, footer, .skip-link, .back-to-top';

export function useInertBackground(isActive: boolean): void {
    useEffect(() => {
        if (!isActive) return;

        const nodes = [...document.querySelectorAll<HTMLElement>(BACKGROUND_SELECTOR)];
        // Captured per node: something else may already have set it.
        const previous = nodes.map((node) => node.inert);
        nodes.forEach((node) => {
            node.inert = true;
        });

        return () => {
            nodes.forEach((node, i) => {
                node.inert = previous[i];
            });
        };
    }, [isActive]);
}

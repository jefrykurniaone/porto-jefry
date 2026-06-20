'use client';

import { useState, useEffect } from 'react';

/**
 * Returns true when the page has been scrolled more than the given threshold.
 * Uses a passive scroll listener with requestAnimationFrame debouncing.
 */
export function useScrolled(threshold = 20): boolean {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    setIsScrolled(globalThis.scrollY > threshold);
                    ticking = false;
                });
            }
        };
        const opts = { passive: true } as AddEventListenerOptions;
        globalThis.addEventListener('scroll', onScroll, opts);
        return () => globalThis.removeEventListener('scroll', onScroll, opts);
    }, [threshold]);

    return isScrolled;
}

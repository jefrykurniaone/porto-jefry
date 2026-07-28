'use client';

import { useEffect } from 'react';

/**
 * Locks page scroll while isLocked is true.
 *
 * `body { overflow: hidden }` alone does not hold on iOS Safari — the page
 * keeps scrolling under the drawer — so the body is also pinned with
 * `position: fixed` at the current offset and restored afterwards. Every
 * property touched is captured before it is overwritten and put back on
 * unlock or unmount; nothing is blindly cleared to ''.
 *
 * Note `overflow: hidden` here is scoped to the drawer being open. The
 * `overflow-x: clip` that globals.css sets on html/body is deliberate and
 * unaffected — see CLAUDE.md on why `hidden` must not be the resting value.
 */
export function useScrollLock(isLocked: boolean): void {
    useEffect(() => {
        if (typeof document === 'undefined') return;
        if (!isLocked) return;

        const { body } = document;
        const previous = {
            overflow: body.style.overflow,
            position: body.style.position,
            top: body.style.top,
            width: body.style.width,
        };
        const scrollY = window.scrollY;

        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `${-scrollY}px`;
        body.style.width = '100%';

        return () => {
            body.style.overflow = previous.overflow;
            body.style.position = previous.position;
            body.style.top = previous.top;
            body.style.width = previous.width;
            // Restoring position removes the pin, so the browser jumps to the
            // top unless the offset is put back explicitly. 'instant' because
            // this is a restoration, not a navigation.
            window.scrollTo({ top: scrollY, behavior: 'instant' });
        };
    }, [isLocked]);
}

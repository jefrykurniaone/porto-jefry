'use client';

import { useEffect } from 'react';

/**
 * Locks document.body scroll while isLocked is true.
 * Captures the prior overflow value before locking and restores it on unlock
 * or unmount — never blindly clears to ''.
 * Guards against SSR (no document available).
 */
export function useScrollLock(isLocked: boolean): void {
    useEffect(() => {
        if (typeof document === 'undefined') return;
        if (!isLocked) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isLocked]);
}

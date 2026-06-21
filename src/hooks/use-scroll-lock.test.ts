import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollLock } from './use-scroll-lock';

describe('useScrollLock', () => {
    beforeEach(() => {
        document.body.style.overflow = '';
    });

    it('locks scroll (overflow=hidden) when isLocked is true', () => {
        renderHook(() => useScrollLock(true));
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('does not change overflow when isLocked is false', () => {
        document.body.style.overflow = 'auto';
        renderHook(() => useScrollLock(false));
        expect(document.body.style.overflow).toBe('auto');
    });

    it('restores the prior overflow value when isLocked flips to false', () => {
        document.body.style.overflow = 'scroll';
        const { rerender } = renderHook(({ locked }: { locked: boolean }) => useScrollLock(locked), {
            initialProps: { locked: true },
        });
        expect(document.body.style.overflow).toBe('hidden');

        rerender({ locked: false });
        expect(document.body.style.overflow).toBe('scroll');
    });

    it('restores original overflow on unmount while locked', () => {
        document.body.style.overflow = 'auto';
        const { unmount } = renderHook(() => useScrollLock(true));
        expect(document.body.style.overflow).toBe('hidden');
        unmount();
        expect(document.body.style.overflow).toBe('auto');
    });
});

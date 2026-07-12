import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTypedRoles } from './use-typed-roles';

const ROLES = ['Dev', 'Ops'] as const;

function mockReducedMotion(matches: boolean) {
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation((query: string) => ({
        matches,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    }));
}

describe('useTypedRoles', () => {
    beforeEach(() => {
        mockReducedMotion(false);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('types the first role character by character', () => {
        const { result } = renderHook(() => useTypedRoles(ROLES));

        act(() => vi.advanceTimersByTime(62));
        expect(result.current).toBe('De');

        act(() => vi.advanceTimersByTime(62));
        expect(result.current).toBe('Dev');
    });

    it('holds the completed word, then deletes and advances to the next role', () => {
        const { result } = renderHook(() => useTypedRoles(ROLES));

        // Type "Dev" fully (first tick is synchronous on mount)
        act(() => vi.advanceTimersByTime(62 * 2));
        expect(result.current).toBe('Dev');

        // Hold, then delete 3 chars
        act(() => vi.advanceTimersByTime(2200));
        act(() => vi.advanceTimersByTime(34 * 3));
        expect(result.current).toBe('');

        // Next role starts typing
        act(() => vi.advanceTimersByTime(62 * 2));
        expect(result.current.startsWith('O')).toBe(true);
    });

    it('shows the first role statically under prefers-reduced-motion', () => {
        mockReducedMotion(true);
        const { result } = renderHook(() => useTypedRoles(ROLES));
        expect(result.current).toBe('Dev');
        act(() => vi.advanceTimersByTime(5000));
        expect(result.current).toBe('Dev');
    });

    it('returns empty string for an empty roles list', () => {
        const { result } = renderHook(() => useTypedRoles([]));
        expect(result.current).toBe('');
    });

    it('cleans up its timer on unmount', () => {
        const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
        const { unmount } = renderHook(() => useTypedRoles(ROLES));
        unmount();
        expect(clearSpy).toHaveBeenCalled();
        clearSpy.mockRestore();
    });
});

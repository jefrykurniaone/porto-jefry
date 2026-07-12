import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './use-theme';

describe('useTheme', () => {
    it('defaults to dark and stamps data-theme on <html>', () => {
        const { result } = renderHook(() => useTheme());
        expect(result.current.theme).toBe('dark');
        expect(document.documentElement.dataset.theme).toBe('dark');
    });

    it('reads a stored light preference on mount', () => {
        localStorage.setItem('porto-theme', 'light');
        const { result } = renderHook(() => useTheme());
        expect(result.current.theme).toBe('light');
        expect(document.documentElement.dataset.theme).toBe('light');
    });

    it('ignores invalid stored values', () => {
        localStorage.setItem('porto-theme', 'neon');
        const { result } = renderHook(() => useTheme());
        expect(result.current.theme).toBe('dark');
    });

    it('toggleTheme flips theme, persists it, and updates the attribute', () => {
        const { result } = renderHook(() => useTheme());

        act(() => result.current.toggleTheme());
        expect(result.current.theme).toBe('light');
        expect(localStorage.getItem('porto-theme')).toBe('light');
        expect(document.documentElement.dataset.theme).toBe('light');

        act(() => result.current.toggleTheme());
        expect(result.current.theme).toBe('dark');
        expect(localStorage.getItem('porto-theme')).toBe('dark');
        expect(document.documentElement.dataset.theme).toBe('dark');
    });
});

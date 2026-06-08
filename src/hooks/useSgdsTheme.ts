'use client';

import { useState, useCallback, useEffect } from 'react';

export type SgdsTheme = 'day' | 'night';

const STORAGE_KEY = 'sgds-theme';
const NIGHT_CLASS = 'sgds-night-theme';

function isSgdsTheme(value: string | null): value is SgdsTheme {
    return value === 'day' || value === 'night';
}

function readStoredTheme(): SgdsTheme {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (isSgdsTheme(stored)) return stored;
    } catch {
        // localStorage not available (SSR, private mode, etc.)
    }
    return 'day';
}

function applySgdsTheme(theme: SgdsTheme): void {
    document.documentElement.classList.toggle(NIGHT_CLASS, theme === 'night');
}

export function useSgdsTheme() {
    const [theme, setThemeState] = useState<SgdsTheme>('day');

    useEffect(() => {
        const stored = readStoredTheme();
        setThemeState(stored);
        applySgdsTheme(stored);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => {
            const next: SgdsTheme = prev === 'day' ? 'night' : 'day';
            try {
                localStorage.setItem(STORAGE_KEY, next);
            } catch {
                // localStorage not available
            }
            applySgdsTheme(next);
            return next;
        });
    }, []);

    return { theme, toggleTheme };
}

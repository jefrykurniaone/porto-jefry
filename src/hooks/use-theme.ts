'use client';

import { useState, useCallback, useEffect } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'porto-theme';

function isTheme(value: string | null): value is Theme {
    return value === 'dark' || value === 'light';
}

function readStoredTheme(): Theme {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (isTheme(stored)) return stored;
    } catch {
        // localStorage not available (SSR, private mode, etc.)
    }
    return 'dark';
}

function applyTheme(theme: Theme): void {
    document.documentElement.dataset.theme = theme;
}

/**
 * Dark-first theme state synced to localStorage ('porto-theme') and the
 * `data-theme` attribute on <html>, which drives the CSS token overrides.
 * The pre-hydration script in the locale layout stamps the attribute before
 * first paint; this hook takes over after mount.
 */
export function useTheme() {
    const [theme, setThemeState] = useState<Theme>('dark');

    useEffect(() => {
        const stored = readStoredTheme();
        setThemeState(stored);
        applyTheme(stored);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => {
            const next: Theme = prev === 'dark' ? 'light' : 'dark';
            try {
                localStorage.setItem(STORAGE_KEY, next);
            } catch {
                // localStorage not available
            }
            applyTheme(next);
            return next;
        });
    }, []);

    return { theme, toggleTheme };
}

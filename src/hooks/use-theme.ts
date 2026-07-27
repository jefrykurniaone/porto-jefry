'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

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

// Local listeners so a toggle in one component re-renders every other consumer;
// the 'storage' event covers the theme being changed in another tab.
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void): () => void {
    const onStorage = (event: StorageEvent) => {
        if (event.key !== null && event.key !== STORAGE_KEY) return;
        applyTheme(readStoredTheme());
        onStoreChange();
    };

    listeners.add(onStoreChange);
    window.addEventListener('storage', onStorage);

    return () => {
        listeners.delete(onStoreChange);
        window.removeEventListener('storage', onStorage);
    };
}

/**
 * Dark-first theme state synced to localStorage ('porto-theme') and the
 * `data-theme` attribute on <html>, which drives the CSS token overrides.
 * The pre-hydration script in the locale layout stamps the attribute before
 * first paint; this hook reads that same storage key as an external store, so
 * the server snapshot ('dark') matches the server-rendered HTML and the real
 * value takes over once hydration completes.
 */
export function useTheme() {
    const theme = useSyncExternalStore<Theme>(
        subscribe,
        readStoredTheme,
        () => 'dark',
    );

    // Reconcile the DOM with the store after hydration. THEME_INIT_SCRIPT
    // normally wins the race before first paint, but it is a plain inline
    // script: if CSP rejects it, or React declines to run it on a client
    // render, `data-theme` would otherwise never be stamped and a stored
    // 'light' preference would silently render dark.
    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        const next: Theme = readStoredTheme() === 'dark' ? 'light' : 'dark';
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // localStorage not available
        }
        applyTheme(next);
        listeners.forEach((listener) => listener());
    }, []);

    return { theme, toggleTheme };
}

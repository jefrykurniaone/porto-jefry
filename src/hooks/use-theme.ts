'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import {
    DEFAULT_THEME,
    isTheme,
    THEME_COOKIE,
    THEME_COOKIE_MAX_AGE,
    THEME_STORAGE_KEY,
    type Theme,
} from '@/utils/theme';

export type { Theme };

function readCookieTheme(): Theme | null {
    for (const entry of document.cookie.split(';')) {
        const [name, ...rest] = entry.trim().split('=');
        if (name === THEME_COOKIE) {
            const value = rest.join('=');
            return isTheme(value) ? value : null;
        }
    }
    return null;
}

function readStoredTheme(): Theme | null {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        return isTheme(stored) ? stored : null;
    } catch {
        // localStorage not available (private mode, blocked cookies, etc.)
        return null;
    }
}

function readDomTheme(): Theme | null {
    const value = document.documentElement.dataset.theme;
    return isTheme(value) ? value : null;
}

/**
 * Cookie first — it is what the server rendered from. localStorage outranks the
 * DOM so that a visitor from before the cookie existed keeps their preference:
 * the server could not see localStorage, so `data-theme` would say 'dark' while
 * they had chosen 'light'.
 */
function readTheme(): Theme {
    return readCookieTheme() ?? readStoredTheme() ?? readDomTheme() ?? DEFAULT_THEME;
}

function persistTheme(theme: Theme): void {
    // Not HttpOnly by design: the client owns this value and must read it back.
    const secure = location.protocol === 'https:' ? '; secure' : '';
    document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax${secure}`;
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // localStorage not available — the cookie alone is enough
    }
}

function applyTheme(theme: Theme): void {
    document.documentElement.dataset.theme = theme;
}

// Local listeners so a toggle in one component re-renders every other consumer
// (ThemeToggle renders in both the navbar and the mobile drawer); 'storage'
// covers the theme being changed in another tab.
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void): () => void {
    const onStorage = (event: StorageEvent) => {
        if (event.key !== null && event.key !== THEME_STORAGE_KEY) return;
        const next = readStoredTheme();
        if (next) applyTheme(next);
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
 * Dark-first theme state. The server renders `data-theme` on <html> from the
 * `porto-theme` cookie, so there is no inline pre-paint script and no flash.
 * This hook keeps the cookie, localStorage, and the DOM attribute in step.
 */
export function useTheme() {
    const theme = useSyncExternalStore<Theme>(
        subscribe,
        readTheme,
        () => DEFAULT_THEME,
    );

    // One-time migration for visitors from before the cookie existed. It must
    // NOT persist `theme`: during hydration that is still the server snapshot
    // (always DEFAULT_THEME), so writing it would overwrite a stored 'light'
    // with 'dark' before the client snapshot is ever read. Read the sources
    // directly instead, and only write when there is genuinely no cookie yet.
    useEffect(() => {
        if (readCookieTheme() !== null) return;
        const legacy = readStoredTheme();
        if (legacy === null) return;
        persistTheme(legacy);
        applyTheme(legacy);
        listeners.forEach((listener) => listener());
    }, []);

    const toggleTheme = useCallback(() => {
        const next: Theme = readTheme() === 'dark' ? 'light' : 'dark';
        persistTheme(next);
        applyTheme(next);
        listeners.forEach((listener) => listener());
    }, []);

    return { theme, toggleTheme };
}

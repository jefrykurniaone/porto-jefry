export type Theme = 'dark' | 'light';

/**
 * The cookie is the SSR source of truth: `[locale]/layout.tsx` reads it and
 * stamps `data-theme` on <html> during the server render, so the correct theme
 * is in the first byte of HTML and there is no pre-paint script to run.
 *
 * localStorage is still written alongside it. It is what visitors from before
 * this change have, and `useTheme` migrates them by promoting it to a cookie.
 */
export const THEME_COOKIE = 'porto-theme';
export const THEME_STORAGE_KEY = 'porto-theme';

export const DEFAULT_THEME: Theme = 'dark';

/** One year — the cookie has to outlive the session to be useful on SSR. */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isTheme(value: string | null | undefined): value is Theme {
    return value === 'dark' || value === 'light';
}

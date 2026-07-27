'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useTranslations } from 'next-intl';

function ThemeTogglePlaceholder() {
    return <div className='icon-btn' style={{ visibility: 'hidden' }} aria-hidden='true' />;
}

// Never emits: the server/client snapshot pair alone is what flips this from
// false (server render + hydration) to true (every render after hydration).
const subscribeNever = () => () => {};

/**
 * Sun/moon toggle button. Renders a hidden placeholder until mounted so the
 * icon (derived from localStorage) never mismatches the server-rendered HTML.
 */
export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const t = useTranslations('theme');
    const isMounted = useSyncExternalStore(
        subscribeNever,
        () => true,
        () => false,
    );

    if (!isMounted) return <ThemeTogglePlaceholder />;

    const isDark = theme === 'dark';

    return (
        <button
            type='button'
            onClick={toggleTheme}
            aria-label={isDark ? t('toggle_light') : t('toggle_dark')}
            className='icon-btn'>
            {isDark ? '☀' : '☾'}
        </button>
    );
}

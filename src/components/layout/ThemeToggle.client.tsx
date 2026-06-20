'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSgdsTheme } from '@/hooks/useSgdsTheme';
import { useTranslations } from 'next-intl';

export default function ThemeToggleClient() {
    const { theme, toggleTheme } = useSgdsTheme();
    const t = useTranslations('theme');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const switchCallbackRef = useCallback((el: HTMLElement | null) => {
        if (!el) return;
        const switchEl = el.querySelector('sgds-switch');
        if (!switchEl) return;
        switchEl.addEventListener('sgds-change', toggleTheme);
    }, [toggleTheme]);

    const isNight = theme === 'night';
    const ariaLabel = isNight ? t('toggle_light') : t('toggle_dark');

    if (!isMounted) {
        return (
            <div
                style={{ width: '3.5rem', height: '1.5rem' }}
                aria-hidden="true"
                suppressHydrationWarning
            />
        );
    }

    return (
        <div
            ref={switchCallbackRef}
            className='sgds:flex sgds:items-center sgds:gap-1'
            suppressHydrationWarning
        >
            <sgds-icon name="sun" size="sm" aria-hidden="true" suppressHydrationWarning />
            <sgds-switch
                checked={isNight}
                size="sm"
                aria-label={ariaLabel}
                suppressHydrationWarning
            />
            <sgds-icon name="moon" size="sm" aria-hidden="true" suppressHydrationWarning />
        </div>
    );
}

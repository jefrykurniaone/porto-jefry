'use client';

import { useState, useEffect, useRef } from 'react';
import { useSgdsTheme } from '@/hooks/useSgdsTheme';
import { useTranslations } from 'next-intl';

type SgdsSwitchElement = HTMLElement & { checked: boolean };

function ThemeSwitchSkeleton() {
    return (
        <div
            style={{ width: '3.5rem', height: '1.5rem' }}
            aria-hidden="true"
            suppressHydrationWarning
        />
    );
}

// Owns the <sgds-switch> wiring. `checked` is bound as a DOM property (not a JSX
// attribute) because React strips boolean attributes from custom elements on every
// render, which Lit reads back as `checked=false` and snaps the thumb back — making
// the switch appear not to slide. The ref sits on the wrapper since the SGDS JSX
// types don't allow `ref` on <sgds-switch>; the element is resolved via querySelector.
function useSgdsSwitch(isNight: boolean, toggleTheme: () => void, isMounted: boolean) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const switchEl = wrapperRef.current?.querySelector('sgds-switch');
        if (!switchEl) return;
        switchEl.addEventListener('sgds-change', toggleTheme);
        return () => switchEl.removeEventListener('sgds-change', toggleTheme);
    }, [toggleTheme, isMounted]);

    useEffect(() => {
        const switchEl = wrapperRef.current?.querySelector('sgds-switch') as SgdsSwitchElement | null;
        if (switchEl) switchEl.checked = isNight;
    }, [isNight, isMounted]);

    return wrapperRef;
}

export default function ThemeToggleClient() {
    const { theme, toggleTheme } = useSgdsTheme();
    const t = useTranslations('theme');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);

    const isNight = theme === 'night';
    const wrapperRef = useSgdsSwitch(isNight, toggleTheme, isMounted);

    if (!isMounted) return <ThemeSwitchSkeleton />;

    const ariaLabel = isNight ? t('toggle_light') : t('toggle_dark');

    return (
        <div
            ref={wrapperRef}
            className='sgds:flex sgds:items-center sgds:gap-1'
            suppressHydrationWarning
        >
            <sgds-icon name="sun" size="sm" aria-hidden="true" suppressHydrationWarning />
            <sgds-switch
                size="sm"
                aria-label={ariaLabel}
                suppressHydrationWarning
            />
            <sgds-icon name="moon" size="sm" aria-hidden="true" suppressHydrationWarning />
        </div>
    );
}

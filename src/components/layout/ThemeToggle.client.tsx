'use client';

import { useSgdsTheme } from '@/hooks/useSgdsTheme';
import { useTranslations } from 'next-intl';

export default function ThemeToggleClient() {
    const { theme, toggleTheme } = useSgdsTheme();
    const t = useTranslations('theme');

    return (
        <sgds-icon-button
            name={theme === 'night' ? 'sun' : 'moon'}
            aria-label={theme === 'night' ? t('toggle_light') : t('toggle_dark')}
            onClick={toggleTheme}
            style={{ minWidth: '44px', minHeight: '44px' }}
        />
    );
}

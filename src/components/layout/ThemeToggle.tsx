'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { SunIcon, MoonIcon } from 'lucide-react';

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);
    const t = useTranslations('theme');

    useEffect(() => setIsMounted(true), []);

    if (!isMounted) return <div className='w-9 h-9' />;

    return (
        <button
            onClick={() =>
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
            aria-label={
                resolvedTheme === 'dark'
                    ? t('toggle_light')
                    : t('toggle_dark')
            }
            className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
            {resolvedTheme === 'dark' ? (
                <MoonIcon size={20} className='text-blue-400' />
            ) : (
                <SunIcon size={20} className='text-yellow-500' />
            )}
        </button>
    );
}

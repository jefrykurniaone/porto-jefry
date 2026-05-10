'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className='w-9 h-9' />;

    return (
        <button
            onClick={() =>
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
            aria-label={
                resolvedTheme === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
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

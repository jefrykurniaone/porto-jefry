'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { MenuIcon, XIcon } from 'lucide-react';

const NAV_KEYS = [
    'about',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'contact',
] as const;

export default function Navbar() {
    const t = useTranslations('nav');
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        setOpen(false);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm'
                    : 'bg-transparent'
            }`}>
            <nav className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
                {/* Logo */}
                <button
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                    className='text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                    {'JK'}<span className='text-blue-600 dark:text-blue-400'>{'.'}</span>
                </button>

                {/* Desktop nav */}
                <ul className='hidden md:flex items-center gap-6'>
                    {NAV_KEYS.map((key) => (
                        <li key={key}>
                            <button
                                onClick={() => scrollTo(key)}
                                className='text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize'>
                                {t(key)}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Controls */}
                <div className='flex items-center gap-2'>
                    <ThemeToggle />
                    <LanguageToggle />
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setOpen(!open)}
                        className='md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                        aria-label='Toggle menu'>
                        {open ? <XIcon size={20} /> : <MenuIcon size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {open && (
                <div className='md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 py-4'>
                    <ul className='flex flex-col gap-3'>
                        {NAV_KEYS.map((key) => (
                            <li key={key}>
                                <button
                                    onClick={() => scrollTo(key)}
                                    className='w-full text-left py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize'>
                                    {t(key)}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
}

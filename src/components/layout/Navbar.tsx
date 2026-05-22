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

interface NavLinksProps {
    onNavClick: (id: string) => void;
}

function DesktopNavLinks({ onNavClick }: Readonly<NavLinksProps>) {
    const t = useTranslations('nav');
    return (
        <ul className='hidden md:flex items-center gap-6'>
            {NAV_KEYS.map((key) => (
                <li key={key}>
                    <button
                        onClick={() => onNavClick(key)}
                        className='text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize'>
                        {t(key)}
                    </button>
                </li>
            ))}
        </ul>
    );
}

function MobileNavLinks({ onNavClick }: Readonly<NavLinksProps>) {
    const t = useTranslations('nav');
    return (
        <div className='md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 py-4'>
            <ul className='flex flex-col gap-3'>
                {NAV_KEYS.map((key) => (
                    <li key={key}>
                        <button
                            onClick={() => onNavClick(key)}
                            className='w-full text-left py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize'>
                            {t(key)}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Navbar() {
    const t = useTranslations('nav');
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        setIsOpen(false);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm'
                    : 'bg-transparent'
            }`}>
            <nav className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    aria-label={t('logo_label')}
                    className='text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                    {'JK'}
                    <span className='text-blue-600 dark:text-blue-400'>{'.'}</span>
                </button>
                <DesktopNavLinks onNavClick={scrollTo} />
                <div className='flex items-center gap-2'>
                    <ThemeToggle />
                    <LanguageToggle />
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className='md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                        aria-label='Toggle menu'>
                        {isOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
                    </button>
                </div>
            </nav>
            {isOpen && <MobileNavLinks onNavClick={scrollTo} />}
        </header>
    );
}

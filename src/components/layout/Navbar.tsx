'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
                    <a
                        href={`#${key}`}
                        onClick={(e) => { e.preventDefault(); onNavClick(key); }}
                        className='text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize'>
                        {t(key)}
                    </a>
                </li>
            ))}
        </ul>
    );
}

interface MobileNavLinksProps {
    onNavClick: (key: string) => void;
    id?: string;
    menuRef?: React.RefObject<HTMLDivElement>;
}

function MobileNavLinks({ onNavClick, id, menuRef }: Readonly<MobileNavLinksProps>) {
    const t = useTranslations('nav');
    return (
        <div ref={menuRef} id={id} className='md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 py-4'>
            <ul className='flex flex-col gap-3'>
                {NAV_KEYS.map((key) => (
                    <li key={key}>
                        <a
                            href={`#${key}`}
                            onClick={(e) => { e.preventDefault(); onNavClick(key); }}
                            className='w-full text-left py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize'>
                            {t(key)}
                        </a>
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
    const menuRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const hasMountedRef = useRef(false);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    setIsScrolled(globalThis.scrollY > 20);
                    ticking = false;
                });
            }
        };
        const opts = { passive: true } as AddEventListenerOptions;
        globalThis.addEventListener('scroll', onScroll, opts);
        return () => globalThis.removeEventListener('scroll', onScroll, opts);
    }, []);

    // Focus trap for mobile menu
    useEffect(() => {
        if (!isOpen) return;

        const menu = menuRef.current;
        if (!menu) return;

        const focusable = Array.from(
            menu.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])')
        );
        focusable[0]?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
                toggleRef.current?.focus();
                return;
            }
            if (e.key !== 'Tab' || focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable.at(-1);

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                }
            } else if (document.activeElement === last) {
                e.preventDefault();
                first?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Return focus to toggle button when menu closes (skip initial mount)
    useEffect(() => {
        if (!hasMountedRef.current) { hasMountedRef.current = true; return; }
        if (!isOpen) toggleRef.current?.focus();
    }, [isOpen]);

    const scrollTo = useCallback((id: string) => {
        setIsOpen(false);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', `#${id}`);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm'
                    : 'bg-transparent'
            }`}>
            <nav className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
                <a
                    href='#hero'
                    onClick={(e) => { e.preventDefault(); globalThis.scrollTo({ top: 0, behavior: 'smooth' }); history.pushState(null, '', location.pathname); }}
                    aria-label={t('logo_label')}
                    className='text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                    {'JK'}
                    <span className='text-blue-600 dark:text-blue-400'>{'.'}</span>
                </a>
                <DesktopNavLinks onNavClick={scrollTo} />
                <div className='flex items-center gap-2'>
                    <ThemeToggle />
                    <LanguageToggle />
                    <button
                        ref={toggleRef}
                        type='button'
                        onClick={() => setIsOpen(!isOpen)}
                        className='md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                        aria-label={t('toggle_menu')}
                        aria-expanded={isOpen}
                        aria-controls='mobile-nav-menu'>
                        {isOpen ? <XIcon size={20} aria-hidden='true' /> : <MenuIcon size={20} aria-hidden='true' />}
                    </button>
                </div>
            </nav>
            {isOpen && <MobileNavLinks onNavClick={scrollTo} id='mobile-nav-menu' menuRef={menuRef} />}
        </header>
    );
}

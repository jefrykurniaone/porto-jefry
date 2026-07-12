'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import MobileDrawer from './MobileDrawer';

export const NAV_KEYS = [
    'about',
    'experience',
    'skills',
    'projects',
    'education',
    'contact',
] as const;

interface NavLinksProps {
    onNavClick: (id: string) => void;
}

function DesktopNavLinks({ onNavClick }: Readonly<NavLinksProps>) {
    const t = useTranslations('nav');
    return (
        <div className='site-nav__links'>
            {NAV_KEYS.map((key) => (
                <a
                    key={key}
                    href={`#${key}`}
                    onClick={(e) => { e.preventDefault(); onNavClick(key); }}
                    className='site-nav__link'>
                    {t(key)}
                </a>
            ))}
        </div>
    );
}

interface HamburgerButtonProps {
    isOpen: boolean;
    toggleRef: React.RefObject<HTMLButtonElement>;
    onToggle: () => void;
    label: string;
}

function HamburgerButton({ isOpen, toggleRef, onToggle, label }: Readonly<HamburgerButtonProps>) {
    return (
        <button
            ref={toggleRef}
            type='button'
            onClick={onToggle}
            className='nav-hamburger'
            aria-label={label}
            aria-expanded={isOpen}>
            {isOpen ? '✕' : '☰'}
        </button>
    );
}

function NavControls({ isOpen, toggleRef, onToggle, toggleLabel }: Readonly<{
    isOpen: boolean;
    toggleRef: React.RefObject<HTMLButtonElement>;
    onToggle: () => void;
    toggleLabel: string;
}>) {
    return (
        <div className='site-nav__controls'>
            <div className='site-nav__desktop-controls'>
                <ThemeToggle />
                <LanguageToggle />
            </div>
            <HamburgerButton
                isOpen={isOpen}
                toggleRef={toggleRef}
                onToggle={onToggle}
                label={toggleLabel}
            />
        </div>
    );
}

export default function Navbar() {
    const t = useTranslations('nav');
    const [isOpen, setIsOpen] = useState(false);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const closeMenu = useCallback(() => {
        setIsOpen(false);
        // Return focus to the toggle on every close path (close button, backdrop,
        // link select, Escape) so focus is never orphaned on <body> — WCAG 2.4.3.
        toggleRef.current?.focus();
    }, []);
    const scrollTo = useCallback((id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', `#${id}`);
        closeMenu();
    }, [closeMenu]);

    return (
        <header>
            <nav className='site-nav'>
                <div className='site-nav__inner'>
                    <a href='#hero' aria-label={t('logo_label')} className='site-nav__logo'>
                        JK<span className='site-nav__logo-accent'>_</span>
                    </a>
                    <DesktopNavLinks onNavClick={scrollTo} />
                    <NavControls
                        isOpen={isOpen}
                        toggleRef={toggleRef}
                        onToggle={() => setIsOpen(!isOpen)}
                        toggleLabel={t('toggle_menu')}
                    />
                </div>
            </nav>
            <MobileDrawer isOpen={isOpen} onClose={closeMenu} onNavClick={scrollTo} toggleRef={toggleRef} />
        </header>
    );
}

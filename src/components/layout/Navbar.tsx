'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { scrollToSection } from '@/utils/scroll';
import { NAV_KEYS } from '@/utils/sections';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import MobileDrawer, { DRAWER_ID } from './MobileDrawer';

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
    toggleRef: React.RefObject<HTMLButtonElement | null>;
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
            // Only while the drawer exists. MobileDrawer returns null when
            // closed, so a permanent aria-controls pointed at an id that is not
            // in the DOM — an invalid reference in the default state. State is
            // still carried by aria-expanded, which is always present.
            aria-controls={isOpen ? DRAWER_ID : undefined}
            aria-expanded={isOpen}>
            {isOpen ? '✕' : '☰'}
        </button>
    );
}

function NavControls({ isOpen, toggleRef, onToggle, toggleLabel }: Readonly<{
    isOpen: boolean;
    toggleRef: React.RefObject<HTMLButtonElement | null>;
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

/**
 * Drawer state, plus the two things that must not happen until the drawer's own
 * effects have torn down.
 *
 * While it is open `useInertBackground` marks `.site-nav` inert and
 * `useScrollLock` pins <body> with `position: fixed`. Both make the obvious
 * inline version of these actions silently fail: focusing a node inside an inert
 * subtree is a no-op, so focus lands on <body> instead of the toggle, and a
 * pinned page cannot be scrolled — `scrollIntoView` moves nothing and the
 * unlock's own scroll restore then puts the reader back where they started, so
 * every drawer nav link went nowhere.
 *
 * React runs a child's effect cleanups before a parent's effects, so by the time
 * this effect runs the page is scrollable and the toggle is focusable again.
 */
function useDrawerNavigation() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const pendingScroll = useRef<string | null>(null);
    const wasOpen = useRef(false);

    useEffect(() => {
        const justClosed = wasOpen.current && !isOpen;
        wasOpen.current = isOpen;
        if (!justClosed) return;

        // Focus returns to the toggle on every close path (close button,
        // backdrop, link select, Escape) so it is never orphaned — WCAG 2.4.3.
        // preventScroll because the toggle rides a fixed bar and is always in
        // view: an implicit scroll here would only fight the one below.
        toggleRef.current?.focus({ preventScroll: true });

        const target = pendingScroll.current;
        pendingScroll.current = null;
        if (target) scrollToSection(target);
    }, [isOpen]);

    const closeMenu = useCallback(() => { setIsOpen(false); }, []);

    const navigateTo = useCallback((id: string) => {
        // Closed already — the desktop links, which have nothing to wait for.
        if (!wasOpen.current) {
            scrollToSection(id);
            return;
        }
        pendingScroll.current = id;
        setIsOpen(false);
    }, []);

    return { isOpen, setIsOpen, toggleRef, closeMenu, navigateTo };
}

export default function Navbar() {
    const t = useTranslations('nav');
    const { isOpen, setIsOpen, toggleRef, closeMenu, navigateTo } =
        useDrawerNavigation();

    return (
        <header>
            <nav className='site-nav'>
                <div className='site-nav__inner'>
                    <a href='#hero' aria-label={t('logo_label')} className='site-nav__logo'>
                        JK<span className='site-nav__logo-accent'>_</span>
                    </a>
                    <DesktopNavLinks onNavClick={navigateTo} />
                    <NavControls
                        isOpen={isOpen}
                        toggleRef={toggleRef}
                        onToggle={() => setIsOpen(!isOpen)}
                        toggleLabel={t('toggle_menu')}
                    />
                </div>
            </nav>
            <MobileDrawer isOpen={isOpen} onClose={closeMenu} onNavClick={navigateTo} toggleRef={toggleRef} />
        </header>
    );
}

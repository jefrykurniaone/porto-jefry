'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useScrolled } from '@/hooks/use-scrolled';
import MobileDrawer from './MobileDrawer';

export const NAV_KEYS = [
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
        <>
            {NAV_KEYS.map((key) => (
                <React.Fragment key={key}>
                    <sgds-mainnav-item className='sgds:hidden sgds:md:block' suppressHydrationWarning>
                        <a
                            href={`#${key}`}
                            onClick={(e) => { e.preventDefault(); onNavClick(key); }}
                            className='sgds:capitalize'
                        >
                            {t(key)}
                        </a>
                    </sgds-mainnav-item>
                </React.Fragment>
            ))}
        </>
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
            type="button"
            onClick={onToggle}
            className='sgds:md:hidden sgds:flex sgds:items-center sgds:justify-center sgds:rounded-sm sgds:border-0 sgds:bg-transparent sgds:cursor-pointer'
            style={{ minWidth: '44px', minHeight: '44px' }}
            aria-label={label}
            aria-expanded={isOpen}
        >
            <sgds-icon name={isOpen ? 'cross' : 'menu'} suppressHydrationWarning />
        </button>
    );
}

function InlineNav({ onNavClick }: Readonly<NavLinksProps>) {
    return (
        <div
            data-testid="inline-nav-wrapper"
            className='sgds:hidden sgds:md:flex sgds:flex-1 sgds:items-center sgds:justify-center sgds:flex-nowrap sgds:overflow-x-auto'
        >
            <DesktopNavLinks onNavClick={onNavClick} />
        </div>
    );
}

// expand="always" disables SGDS's own mobile collapse/toggler — otherwise it renders a
// stray hamburger and pulls the end-slot controls into an (empty) native collapse,
// conflicting with our custom MobileDrawer. Responsive behavior is driven by our CSS
// (hide inline nav < md) plus the overflow-x-auto wrapper for tablet/desktop.
export default function Navbar() {
    const t = useTranslations('nav');
    const [isOpen, setIsOpen] = useState(false);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const isScrolled = useScrolled(20);
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
    const headerClass = `sgds:fixed sgds:top-0 sgds:left-0 sgds:right-0 sgds:z-50 sgds:transition-all sgds:duration-300 ${
        isScrolled ? 'sgds:bg-surface-raised/90 sgds:backdrop-blur-md sgds:shadow-sm' : 'sgds:bg-transparent'
    }`;
    return (
        <header className={headerClass}>
            <sgds-mainnav expand="always" suppressHydrationWarning>
                <strong slot="brand" className='sgds:text-heading-sm sgds:font-semibold sgds:text-heading-default'>JK</strong>
                <InlineNav onNavClick={scrollTo} />
                <div slot="end" className='sgds:flex sgds:items-center sgds:gap-component-xs'>
                    <div className='sgds:hidden sgds:md:flex sgds:items-center sgds:gap-component-xs'>
                        <ThemeToggle />
                        <LanguageToggle />
                    </div>
                    <HamburgerButton isOpen={isOpen} toggleRef={toggleRef} onToggle={() => setIsOpen(!isOpen)} label={t('toggle_menu')} />
                </div>
            </sgds-mainnav>
            <MobileDrawer isOpen={isOpen} onClose={closeMenu} onNavClick={scrollTo} toggleRef={toggleRef} />
        </header>
    );
}

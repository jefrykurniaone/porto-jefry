'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useScrolled } from '@/hooks/use-scrolled';

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

interface MobileNavLinksProps {
    onNavClick: (key: string) => void;
    id?: string;
    menuRef?: React.RefObject<HTMLDivElement>;
}

function MobileNavLinks({ onNavClick, id, menuRef }: Readonly<MobileNavLinksProps>) {
    const t = useTranslations('nav');
    return (
        <div
            ref={menuRef}
            id={id}
            className='sgds:border-t sgds:border-divider sgds:px-4 sgds:py-4'
        >
            <ul className='sgds:flex sgds:flex-col sgds:gap-3'>
                {NAV_KEYS.map((key) => (
                    <li key={key}>
                        <a
                            href={`#${key}`}
                            onClick={(e) => { e.preventDefault(); onNavClick(key); }}
                            className='sgds:block sgds:w-full sgds:py-2 sgds:text-body-md sgds:text-default sgds:no-underline sgds:capitalize'
                        >
                            {t(key)}
                        </a>
                    </li>
                ))}
            </ul>
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
            type="button"
            onClick={onToggle}
            className='sgds:md:hidden sgds:flex sgds:items-center sgds:justify-center sgds:rounded-sm sgds:border-0 sgds:bg-transparent sgds:cursor-pointer'
            style={{ minWidth: '44px', minHeight: '44px' }}
            aria-label={label}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-menu"
        >
            <sgds-icon name={isOpen ? 'cross' : 'menu'} suppressHydrationWarning />
        </button>
    );
}

export default function Navbar() {
    const t = useTranslations('nav');
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const hasMountedRef = useRef(false);
    const isScrolled = useScrolled(20);
    const closeMenu = useCallback(() => setIsOpen(false), []);
    useFocusTrap(isOpen, menuRef, toggleRef, closeMenu);
    useEffect(() => {
        if (!hasMountedRef.current) { hasMountedRef.current = true; return; }
        if (!isOpen) toggleRef.current?.focus();
    }, [isOpen]);
    const scrollTo = useCallback((id: string) => {
        setIsOpen(false);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', `#${id}`);
    }, []);
    const headerClass = `sgds:fixed sgds:top-0 sgds:left-0 sgds:right-0 sgds:z-50 sgds:transition-all sgds:duration-300 ${
        isScrolled ? 'sgds:bg-surface-raised/90 sgds:backdrop-blur-md sgds:shadow-sm' : 'sgds:bg-transparent'
    }`;
    return (
        <header className={headerClass}>
            <sgds-mainnav expand="always" suppressHydrationWarning>
                <strong slot="brand" className='sgds:text-heading-sm sgds:font-semibold sgds:text-heading-default'>JK</strong>
                <DesktopNavLinks onNavClick={scrollTo} />
                <div slot="end" className='sgds:flex sgds:items-center sgds:gap-component-xs'>
                    <ThemeToggle />
                    <LanguageToggle />
                    <HamburgerButton isOpen={isOpen} toggleRef={toggleRef} onToggle={() => setIsOpen(!isOpen)} label={t('toggle_menu')} />
                </div>
            </sgds-mainnav>
            {isOpen && <MobileNavLinks onNavClick={scrollTo} id='mobile-nav-menu' menuRef={menuRef} />}
        </header>
    );
}

'use client';

import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useScrollLock } from '@/hooks/use-scroll-lock';
import { NAV_KEYS } from './Navbar';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onNavClick: (id: string) => void;
    toggleRef: React.RefObject<HTMLButtonElement>;
}

interface DrawerLinksProps {
    onNavClick: (id: string) => void;
}

function DrawerLinks({ onNavClick }: Readonly<DrawerLinksProps>) {
    const t = useTranslations('nav');
    return (
        <ul className='drawer-links'>
            {NAV_KEYS.map((key) => (
                <li key={key}>
                    <a
                        href={`#${key}`}
                        onClick={(e) => { e.preventDefault(); onNavClick(key); }}
                        className='drawer-link'>
                        {t(key)}
                    </a>
                </li>
            ))}
        </ul>
    );
}

interface DrawerPanelProps {
    panelRef: React.RefObject<HTMLDivElement>;
    onClose: () => void;
    onNavClick: (id: string) => void;
}

function DrawerPanel({ panelRef, onClose, onNavClick }: Readonly<DrawerPanelProps>) {
    const t = useTranslations('nav');
    return (
        <div
            ref={panelRef}
            role='dialog'
            aria-modal='true'
            aria-label={t('toggle_menu')}
            className='drawer-panel'
            onClick={(e) => e.stopPropagation()}>
            <div className='drawer-header'>
                <button
                    type='button'
                    onClick={onClose}
                    aria-label={t('close_menu')}
                    className='nav-hamburger'>
                    ✕
                </button>
            </div>

            <nav className='drawer-nav'>
                <DrawerLinks onNavClick={onNavClick} />
            </nav>

            <div className='drawer-footer'>
                <ThemeToggle />
                <LanguageToggle />
            </div>
        </div>
    );
}

export default function MobileDrawer({
    isOpen,
    onClose,
    onNavClick,
    toggleRef,
}: Readonly<MobileDrawerProps>) {
    const panelRef = useRef<HTMLDivElement>(null);

    useFocusTrap(isOpen, panelRef, toggleRef, onClose);
    useScrollLock(isOpen);

    if (!isOpen) return null;

    return (
        <>
            <div
                data-testid='drawer-backdrop'
                className='drawer-backdrop'
                onClick={onClose}
                aria-hidden='true'
            />
            <DrawerPanel panelRef={panelRef} onClose={onClose} onNavClick={onNavClick} />
        </>
    );
}

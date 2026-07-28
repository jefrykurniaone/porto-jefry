'use client';

import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useInertBackground } from '@/hooks/use-inert-background';
import { useScrollLock } from '@/hooks/use-scroll-lock';
import { NAV_KEYS } from '@/utils/sections';
import CvDownloadAction from '@/components/ui/CvDownloadAction';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

/** Shared with the navbar's hamburger, which points `aria-controls` at it. */
export const DRAWER_ID = 'mobile-drawer';

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onNavClick: (id: string) => void;
    toggleRef: React.RefObject<HTMLButtonElement | null>;
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
    panelRef: React.RefObject<HTMLDivElement | null>;
    onClose: () => void;
    onNavClick: (id: string) => void;
}

function DrawerPanel({ panelRef, onClose, onNavClick }: Readonly<DrawerPanelProps>) {
    const t = useTranslations('nav');
    return (
        <div
            ref={panelRef}
            id={DRAWER_ID}
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

            <DrawerFooter />
        </div>
    );
}

/**
 * The drawer is the only navigation a phone visitor has. Without the CV here,
 * the menu cannot reach the one artifact the site exists to hand over.
 */
function DrawerFooter() {
    return (
        <div className='drawer-footer'>
            <CvDownloadAction
                className='cv-action drawer-cv'
                buttonClassName='btn-outline drawer-cv__btn'
            />
            <div className='drawer-footer__controls'>
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
    useInertBackground(isOpen);
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

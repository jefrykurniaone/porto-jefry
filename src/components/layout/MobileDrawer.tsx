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
        <ul className='sgds:flex sgds:flex-col sgds:gap-1'>
            {NAV_KEYS.map((key) => (
                <li key={key}>
                    <a
                        href={`#${key}`}
                        onClick={(e) => { e.preventDefault(); onNavClick(key); }}
                        className='sgds:block sgds:w-full sgds:text-body-md sgds:text-default sgds:no-underline sgds:capitalize'
                        style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
                    >
                        {t(key)}
                    </a>
                </li>
            ))}
        </ul>
    );
}

export default function MobileDrawer({
    isOpen,
    onClose,
    onNavClick,
    toggleRef,
}: Readonly<MobileDrawerProps>) {
    const t = useTranslations('nav');
    const panelRef = useRef<HTMLDivElement>(null);

    useFocusTrap(isOpen, panelRef, toggleRef, onClose);
    useScrollLock(isOpen);

    if (!isOpen) return null;

    return (
        <>
            {/* Full-screen backdrop */}
            <div
                data-testid="drawer-backdrop"
                className='sgds:fixed sgds:inset-0 sgds:z-40 sgds:bg-black/40'
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Right-side slide-in panel */}
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={t('toggle_menu')}
                className='sgds:fixed sgds:right-0 sgds:top-0 sgds:z-50 sgds:h-full sgds:w-72 sgds:flex sgds:flex-col sgds:bg-surface-raised sgds:shadow-lg'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header row with close button */}
                <div className='sgds:flex sgds:items-center sgds:justify-end sgds:px-4 sgds:py-3 sgds:border-b sgds:border-divider'>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t('close_menu')}
                        className='sgds:flex sgds:items-center sgds:justify-center sgds:rounded-sm sgds:border-0 sgds:bg-transparent sgds:cursor-pointer'
                        style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                        <sgds-icon name="cross" suppressHydrationWarning />
                    </button>
                </div>

                {/* Navigation links */}
                <nav className='sgds:flex-1 sgds:overflow-y-auto sgds:px-4 sgds:py-4'>
                    <DrawerLinks onNavClick={onNavClick} />
                </nav>

                {/* Footer controls: theme + language */}
                <div className='sgds:flex sgds:items-center sgds:gap-component-xs sgds:px-4 sgds:py-4 sgds:border-t sgds:border-divider'>
                    <ThemeToggle />
                    <LanguageToggle />
                </div>
            </div>
        </>
    );
}

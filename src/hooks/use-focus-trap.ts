'use client';

import { useEffect, RefObject } from 'react';

/**
 * Traps keyboard focus within a mobile menu when it is open.
 * Handles:
 *   - Initial focus on the first focusable element
 *   - Escape key: closes the menu and returns focus to the toggle button
 *   - Tab / Shift+Tab: wraps focus within the menu
 */
export function useFocusTrap(
    isOpen: boolean,
    menuRef: RefObject<HTMLDivElement>,
    toggleRef: RefObject<HTMLButtonElement>,
    onClose: () => void
): void {
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
                onClose();
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
    }, [isOpen, menuRef, toggleRef, onClose]);
}

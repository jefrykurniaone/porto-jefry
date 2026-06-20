import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, waitFor, act } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import ThemeToggle from './ThemeToggle';

function renderThemeToggle() {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <ThemeToggle />
        </NextIntlClientProvider>,
    );
}

describe('ThemeToggle SGDS behavior', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove('sgds-night-theme');
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders the sgds-switch control after mount', async () => {
        const { container } = renderThemeToggle();
        // The component has an isMounted guard — tick timers to let useEffect run
        await act(async () => { vi.runAllTimers(); });
        const sw = container.querySelector('sgds-switch');
        expect(sw).toBeInTheDocument();
    });

    it('renders sun and moon sgds-icons flanking the switch', async () => {
        const { container } = renderThemeToggle();
        await act(async () => { vi.runAllTimers(); });
        const icons = container.querySelectorAll('sgds-icon');
        const names = Array.from(icons).map((el) => el.getAttribute('name'));
        expect(names).toContain('sun');
        expect(names).toContain('moon');
    });

    it('switch has an accessible aria-label from translations', async () => {
        const { container } = renderThemeToggle();
        await act(async () => { vi.runAllTimers(); });
        const sw = container.querySelector('sgds-switch');
        expect(sw).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('switch checked property reflects day (false) by default', async () => {
        const { container } = renderThemeToggle();
        await act(async () => { vi.runAllTimers(); });
        const sw = container.querySelector('sgds-switch') as (HTMLElement & { checked?: boolean }) | null;
        // `checked` is bound as a DOM property (not a JSX attribute) so React does
        // not strip it on re-render; it should be false for the default day theme.
        expect(sw?.checked).toBe(false);
    });

    it('dispatching sgds-change on the switch calls toggleTheme (night→day→night)', async () => {
        vi.useRealTimers();
        const { container } = renderThemeToggle();
        await waitFor(() => {
            expect(container.querySelector('sgds-switch')).toBeInTheDocument();
        });

        const sw = container.querySelector('sgds-switch')!;
        // Simulate the sgds-change custom event that sgds-switch fires
        await act(async () => {
            sw.dispatchEvent(new CustomEvent('sgds-change', { bubbles: true }));
        });

        expect(localStorage.getItem('sgds-theme')).toBe('night');
        expect(document.documentElement.classList.contains('sgds-night-theme')).toBe(true);
    });

    it('dispatching sgds-change twice toggles back to day', async () => {
        vi.useRealTimers();
        const { container } = renderThemeToggle();
        await waitFor(() => {
            expect(container.querySelector('sgds-switch')).toBeInTheDocument();
        });

        const sw = container.querySelector('sgds-switch')!;
        await act(async () => {
            sw.dispatchEvent(new CustomEvent('sgds-change', { bubbles: true }));
        });
        await act(async () => {
            sw.dispatchEvent(new CustomEvent('sgds-change', { bubbles: true }));
        });

        expect(localStorage.getItem('sgds-theme')).toBe('day');
        expect(document.documentElement.classList.contains('sgds-night-theme')).toBe(false);
    });

    it('aria-label updates after theme toggle to night', async () => {
        vi.useRealTimers();
        const { container } = renderThemeToggle();
        await waitFor(() => {
            expect(container.querySelector('sgds-switch')).toBeInTheDocument();
        });

        const sw = container.querySelector('sgds-switch')!;
        await act(async () => {
            sw.dispatchEvent(new CustomEvent('sgds-change', { bubbles: true }));
        });

        await waitFor(() => {
            expect(sw).toHaveAttribute('aria-label', 'Switch to light mode');
        });
    });
});

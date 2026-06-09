import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    });

    it('renders the sgds-icon-button control', () => {
        const { container } = renderThemeToggle();
        const btn = container.querySelector('sgds-icon-button');
        expect(btn).toBeInTheDocument();
    });

    it('has accessible aria-label from translations', () => {
        const { container } = renderThemeToggle();
        const btn = container.querySelector('sgds-icon-button');
        expect(btn).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('toggles to night on click, persists sgds-theme, and applies sgds-night-theme', async () => {
        const user = userEvent.setup();
        const { container } = renderThemeToggle();
        const btn = container.querySelector('sgds-icon-button')!;
        await user.click(btn);
        expect(localStorage.getItem('sgds-theme')).toBe('night');
        expect(document.documentElement.classList.contains('sgds-night-theme')).toBe(true);
    });

    it('toggles back to day on second click', async () => {
        const user = userEvent.setup();
        const { container } = renderThemeToggle();
        const btn = container.querySelector('sgds-icon-button')!;
        await user.click(btn);
        expect(localStorage.getItem('sgds-theme')).toBe('night');
        await user.click(btn);
        expect(localStorage.getItem('sgds-theme')).toBe('day');
        expect(document.documentElement.classList.contains('sgds-night-theme')).toBe(false);
    });

    it('updates aria-label after toggle to night', async () => {
        const user = userEvent.setup();
        const { container } = renderThemeToggle();
        const btn = container.querySelector('sgds-icon-button')!;
        expect(btn).toHaveAttribute('aria-label', 'Switch to dark mode');
        await user.click(btn);
        await waitFor(() => {
            expect(btn).toHaveAttribute('aria-label', 'Switch to light mode');
        });
    });
});

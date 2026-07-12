import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

async function findToggleButton() {
    return waitFor(() => screen.getByRole('button'));
}

describe('ThemeToggle', () => {
    it('defaults to dark and offers switching to light mode', async () => {
        renderThemeToggle();
        const btn = await findToggleButton();
        expect(btn).toHaveAccessibleName('Switch to light mode');
        expect(btn.textContent).toBe('☀');
        expect(document.documentElement.dataset.theme).toBe('dark');
    });

    it('click toggles to light: stamps data-theme and persists to localStorage', async () => {
        renderThemeToggle();
        const user = userEvent.setup();
        const btn = await findToggleButton();

        await user.click(btn);

        expect(document.documentElement.dataset.theme).toBe('light');
        expect(localStorage.getItem('porto-theme')).toBe('light');
        expect(btn).toHaveAccessibleName('Switch to dark mode');
        expect(btn.textContent).toBe('☾');
    });

    it('a second click returns to dark', async () => {
        renderThemeToggle();
        const user = userEvent.setup();
        const btn = await findToggleButton();

        await user.click(btn);
        await user.click(btn);

        expect(document.documentElement.dataset.theme).toBe('dark');
        expect(localStorage.getItem('porto-theme')).toBe('dark');
    });

    it('respects a stored light preference on mount', async () => {
        localStorage.setItem('porto-theme', 'light');
        renderThemeToggle();
        const btn = await findToggleButton();
        expect(btn.textContent).toBe('☾');
        expect(document.documentElement.dataset.theme).toBe('light');
    });

    it('ignores an invalid stored value and falls back to dark', async () => {
        localStorage.setItem('porto-theme', 'sepia');
        renderThemeToggle();
        await findToggleButton();
        expect(document.documentElement.dataset.theme).toBe('dark');
    });
});

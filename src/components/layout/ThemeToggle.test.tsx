import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import ThemeToggle from './ThemeToggle';

vi.mock('next-themes', () => ({
    useTheme: () => ({ resolvedTheme: 'light', setTheme: vi.fn() }),
}));

function renderThemeToggle() {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <ThemeToggle />
        </NextIntlClientProvider>,
    );
}

describe('ThemeToggle', () => {
    it('renders the toggle button after mount', async () => {
        renderThemeToggle();
        const btn = await screen.findByRole('button');
        expect(btn).toBeInTheDocument();
    });

    it('button has an accessible aria-label', async () => {
        renderThemeToggle();
        const btn = await screen.findByRole('button');
        expect(btn).toHaveAttribute('aria-label');
    });
});

describe('ThemeToggle (dark mode)', () => {
    it('renders with dark resolvedTheme', async () => {
        vi.doMock('next-themes', () => ({
            useTheme: () => ({ resolvedTheme: 'dark', setTheme: vi.fn() }),
        }));
        render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <ThemeToggle />
            </NextIntlClientProvider>,
        );
        const btn = await screen.findByRole('button');
        expect(btn).toBeInTheDocument();
    });
});

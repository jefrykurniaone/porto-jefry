import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import LanguageToggle from './LanguageToggle';

vi.mock('@/i18n/routing', () => ({
    useRouter: () => ({ replace: vi.fn() }),
    usePathname: () => '/',
}));

function renderLanguageToggle() {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <LanguageToggle />
        </NextIntlClientProvider>,
    );
}

describe('LanguageToggle', () => {
    it('renders without crashing', () => {
        renderLanguageToggle();
    });

    it('renders a button', () => {
        renderLanguageToggle();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('button has an accessible aria-label', () => {
        renderLanguageToggle();
        expect(screen.getByRole('button')).toHaveAttribute('aria-label');
    });

    it('displays locale label in button text', () => {
        renderLanguageToggle();
        expect(screen.getByRole('button').textContent).toMatch(/EN|ID/);
    });
});

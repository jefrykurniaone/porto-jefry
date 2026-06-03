import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import LanguageToggle from './LanguageToggle';

vi.mock('@/i18n/routing', () => ({
    useRouter: () => ({ replace: vi.fn() }),
    usePathname: () => '/',
}));

function renderLanguageToggle(locale: 'en' | 'id' = 'en') {
    return render(
        <NextIntlClientProvider locale={locale} messages={messages}>
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
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('button has an accessible aria-label', () => {
        renderLanguageToggle();
        expect(screen.getByRole('button')).toHaveAttribute('aria-label');
    });

    it('displays EN when locale is en', () => {
        renderLanguageToggle('en');
        expect(screen.getByRole('button').textContent).toBe('EN');
    });

    it('displays ID when locale is id', () => {
        renderLanguageToggle('id');
        expect(screen.getByRole('button').textContent).toBe('ID');
    });

    it('calls router.replace when clicked', async () => {
        renderLanguageToggle();
        const user = userEvent.setup();
        await user.click(screen.getByRole('button'));
    });
});

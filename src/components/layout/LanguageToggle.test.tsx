import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import LanguageToggle from './LanguageToggle';

const replaceMock = vi.fn();

vi.mock('@/i18n/routing', () => ({
    useRouter: () => ({ replace: replaceMock }),
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
    beforeEach(() => {
        replaceMock.mockClear();
    });

    it('renders without crashing', () => {
        renderLanguageToggle();
    });

    it('renders an sgds-button element', () => {
        const { container } = renderLanguageToggle();
        expect(container.querySelector('sgds-button')).toBeInTheDocument();
    });

    it('button has an accessible aria-label', () => {
        const { container } = renderLanguageToggle();
        const btn = container.querySelector('sgds-button');
        expect(btn).toHaveAttribute('aria-label');
    });

    it('displays EN when locale is en', () => {
        const { container } = renderLanguageToggle('en');
        expect(container.querySelector('sgds-button')?.textContent).toBe('EN');
    });

    it('displays ID when locale is id', () => {
        const { container } = renderLanguageToggle('id');
        expect(container.querySelector('sgds-button')?.textContent).toBe('ID');
    });

    it('calls router.replace with id locale when switching from en', async () => {
        const { container } = renderLanguageToggle('en');
        const user = userEvent.setup();
        const btn = container.querySelector('sgds-button')!;
        await user.click(btn);
        expect(replaceMock).toHaveBeenCalledWith('/', { locale: 'id' });
    });

    it('calls router.replace with en locale when switching from id', async () => {
        const { container } = renderLanguageToggle('id');
        const user = userEvent.setup();
        const btn = container.querySelector('sgds-button')!;
        await user.click(btn);
        expect(replaceMock).toHaveBeenCalledWith('/', { locale: 'en' });
    });
});

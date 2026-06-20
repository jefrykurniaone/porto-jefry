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

    it('renders a two-button segmented pill (not an sgds-button)', () => {
        const { container } = renderLanguageToggle();
        // New pill: two <button> elements, no sgds-button
        const buttons = container.querySelectorAll('button.lang-pill__btn');
        expect(buttons).toHaveLength(2);
        expect(container.querySelector('sgds-button')).not.toBeInTheDocument();
    });

    it('the pill group has an accessible aria-label', () => {
        const { container } = renderLanguageToggle();
        const group = container.querySelector('[role="group"]');
        expect(group).toHaveAttribute('aria-label');
    });

    it('EN button is aria-pressed=true when locale is en', () => {
        renderLanguageToggle('en');
        const enBtn = screen.getByRole('button', { name: 'EN' });
        const idBtn = screen.getByRole('button', { name: 'ID' });
        expect(enBtn).toHaveAttribute('aria-pressed', 'true');
        expect(idBtn).toHaveAttribute('aria-pressed', 'false');
    });

    it('ID button is aria-pressed=true when locale is id', () => {
        renderLanguageToggle('id');
        const enBtn = screen.getByRole('button', { name: 'EN' });
        const idBtn = screen.getByRole('button', { name: 'ID' });
        expect(idBtn).toHaveAttribute('aria-pressed', 'true');
        expect(enBtn).toHaveAttribute('aria-pressed', 'false');
    });

    it('clicking the inactive segment (ID) calls router.replace with id locale', async () => {
        renderLanguageToggle('en');
        const user = userEvent.setup();
        const idBtn = screen.getByRole('button', { name: 'ID' });
        await user.click(idBtn);
        expect(replaceMock).toHaveBeenCalledWith('/', { locale: 'id' });
    });

    it('clicking the inactive segment (EN) calls router.replace with en locale', async () => {
        renderLanguageToggle('id');
        const user = userEvent.setup();
        const enBtn = screen.getByRole('button', { name: 'EN' });
        await user.click(enBtn);
        expect(replaceMock).toHaveBeenCalledWith('/', { locale: 'en' });
    });

    it('clicking the already-active segment does not call router.replace', async () => {
        renderLanguageToggle('en');
        const user = userEvent.setup();
        const enBtn = screen.getByRole('button', { name: 'EN' });
        await user.click(enBtn);
        expect(replaceMock).not.toHaveBeenCalled();
    });
});

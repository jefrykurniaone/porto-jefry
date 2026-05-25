import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import Footer from './Footer';

function renderFooter() {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <Footer />
        </NextIntlClientProvider>,
    );
}

describe('Footer', () => {
    it('renders without crashing', () => {
        renderFooter();
    });

    it('has site-footer id for BackToTop anchor', () => {
        const { container } = renderFooter();
        expect(container.querySelector('#site-footer')).not.toBeNull();
    });

    it('displays the current year', () => {
        renderFooter();
        expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
    });
});

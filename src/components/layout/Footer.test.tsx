import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import idMessages from '@/i18n/messages/id.json';
import Footer from './Footer';

function renderFooter(locale: 'en' | 'id' = 'en') {
    const msg = locale === 'en' ? messages : idMessages;
    return render(
        <NextIntlClientProvider locale={locale} messages={msg}>
            <Footer />
        </NextIntlClientProvider>,
    );
}

describe('Footer', () => {
    describe('approved-truthful-footer-fallback path', () => {
        it('renders without crashing', () => {
            renderFooter();
        });

        it('has site-footer id', () => {
            const { container } = renderFooter();
            expect(container.querySelector('#site-footer')).toBeInTheDocument();
        });

        it('does not render sgds-footer', () => {
            const { container } = renderFooter();
            expect(container.querySelector('sgds-footer')).not.toBeInTheDocument();
        });

        it('displays the current year', () => {
            renderFooter();
            expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
        });

        it('displays translated built_with text in English', () => {
            renderFooter('en');
            expect(screen.getByText('Built with Next.js & SGDS')).toBeInTheDocument();
        });

        it('displays translated built_with text in Indonesian', () => {
            renderFooter('id');
            expect(screen.getByText('Dibangun dengan Next.js dan SGDS')).toBeInTheDocument();
        });

        it('has SGDS utility classes on the footer element', () => {
            const { container } = renderFooter();
            const footer = container.querySelector('#site-footer');
            expect(footer?.className).toContain('sgds:');
        });

        it('has no placeholder href="#" links', () => {
            const { container } = renderFooter();
            const links = container.querySelectorAll('a[href="#"]');
            expect(links.length).toBe(0);
        });

        it('has no government ownership text', () => {
            renderFooter();
            expect(screen.queryByText(/government/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/singapore/i)).not.toBeInTheDocument();
        });
    });
});

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
    it('renders the AI-workflow credit line (en)', () => {
        renderFooter();
        expect(
            screen.getByText(/Designed & shipped with an AI-agentic workflow/i),
        ).toBeInTheDocument();
        expect(screen.getByText(/Claude · Copilot · OpenCode/)).toBeInTheDocument();
    });

    it('renders the AI-workflow credit line (id)', () => {
        renderFooter('id');
        expect(
            screen.getByText(/Didesain & dibangun dengan alur kerja AI-agentic/i),
        ).toBeInTheDocument();
    });

    it('renders the copyright with the current year and rights text', () => {
        renderFooter();
        const year = String(new Date().getFullYear());
        const copyright = screen.getByText((content) => content.includes('Jefry Kurniawan'));
        expect(copyright.textContent).toContain(year);
        expect(copyright.textContent).toContain(messages.footer.rights);
    });

    it('does not mention SGDS anymore', () => {
        const { container } = renderFooter();
        expect(container.textContent).not.toMatch(/SGDS/);
    });
});

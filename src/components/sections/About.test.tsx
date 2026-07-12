import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import About from './About';
import {
    CONTACT_EMAIL,
    CONTACT_PHONE_HREF,
    CONTACT_LINKEDIN_URL,
    CONTACT_GITHUB_URL,
} from '@/data/contact';

function renderAbout() {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <About />
        </NextIntlClientProvider>,
    );
}

describe('About', () => {
    it('renders the section title', () => {
        renderAbout();
        expect(screen.getByRole('heading', { name: 'About Me' })).toBeInTheDocument();
    });

    it('renders the numbered section kicker', () => {
        renderAbout();
        expect(screen.getByText('01 / About')).toBeInTheDocument();
    });

    it('renders the about description', () => {
        renderAbout();
        expect(screen.getByText(/backend developer with over five years/i)).toBeInTheDocument();
    });

    it('renders four contact chips with correct hrefs', () => {
        const { container } = renderAbout();
        expect(container.querySelector(`a[href="mailto:${CONTACT_EMAIL}"]`)).toBeInTheDocument();
        expect(container.querySelector(`a[href="${CONTACT_PHONE_HREF}"]`)).toBeInTheDocument();
        expect(container.querySelector(`a[href="${CONTACT_LINKEDIN_URL}"]`)).toBeInTheDocument();
        expect(container.querySelector(`a[href="${CONTACT_GITHUB_URL}"]`)).toBeInTheDocument();
    });

    it('external chips open in a new tab with rel noopener', () => {
        const { container } = renderAbout();
        const linkedin = container.querySelector(`a[href="${CONTACT_LINKEDIN_URL}"]`);
        expect(linkedin).toHaveAttribute('target', '_blank');
        expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders the terminal card with whoami output', () => {
        renderAbout();
        expect(screen.getByText('whoami')).toBeInTheDocument();
        expect(screen.getByText(/jefry\.kurniawan · backend developer/i)).toBeInTheDocument();
    });

    it('renders the translated terminal status line', () => {
        renderAbout();
        expect(screen.getByText(/open to remote roles & relocation/i)).toBeInTheDocument();
    });

    it('renders the AI workflow line in the terminal', () => {
        renderAbout();
        expect(screen.getByText('Claude · GitHub Copilot · OpenCode')).toBeInTheDocument();
    });
});

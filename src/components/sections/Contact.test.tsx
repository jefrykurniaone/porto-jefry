import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import {
    CONTACT_EMAIL,
    CONTACT_PHONE_HREF,
    CONTACT_PHONE_INTL,
    CONTACT_LINKEDIN_URL,
    CONTACT_LINKEDIN_DISPLAY,
} from '@/data/contact';
import Contact from './Contact';

function renderContact() {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <Contact />
        </NextIntlClientProvider>,
    );
}

describe('Contact', () => {
    it('renders the section title', () => {
        renderContact();
        expect(screen.getByRole('heading', { name: 'Get In Touch' })).toBeInTheDocument();
    });

    it('renders the contact description', () => {
        renderContact();
        expect(screen.getByText(/open to new roles and freelance work/i)).toBeInTheDocument();
    });

    it('renders three contact cards with correct hrefs', () => {
        const { container } = renderContact();
        expect(container.querySelector(`a[href="mailto:${CONTACT_EMAIL}"]`)).toBeInTheDocument();
        expect(container.querySelector(`a[href="${CONTACT_PHONE_HREF}"]`)).toBeInTheDocument();
        expect(container.querySelector(`a[href="${CONTACT_LINKEDIN_URL}"]`)).toBeInTheDocument();
        expect(container.querySelectorAll('.contact-card')).toHaveLength(3);
    });

    it('shows the email, international phone number, and LinkedIn handle', () => {
        renderContact();
        expect(screen.getByText(CONTACT_EMAIL)).toBeInTheDocument();
        expect(screen.getByText(CONTACT_PHONE_INTL)).toBeInTheDocument();
        expect(screen.getByText(CONTACT_LINKEDIN_DISPLAY)).toBeInTheDocument();
    });

    it('LinkedIn card opens in a new tab with rel noopener', () => {
        const { container } = renderContact();
        const linkedin = container.querySelector(`a[href="${CONTACT_LINKEDIN_URL}"]`);
        expect(linkedin).toHaveAttribute('target', '_blank');
        expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('email and phone cards do not force a new tab', () => {
        const { container } = renderContact();
        const email = container.querySelector(`a[href="mailto:${CONTACT_EMAIL}"]`);
        expect(email).not.toHaveAttribute('target');
    });
});

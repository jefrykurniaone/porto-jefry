import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import fs from 'fs';
import messages from '@/i18n/messages/en.json';
import {
    CONTACT_EMAIL,
    CONTACT_PHONE_HREF,
    CONTACT_PHONE_DISPLAY,
    CONTACT_LINKEDIN_URL,
    CONTACT_LINKEDIN_DISPLAY,
    CONTACT_GITHUB_URL,
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
    it('renders translated section heading', () => {
        renderContact();
        expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    it('renders translated description', () => {
        renderContact();
        expect(screen.getByText(/open to new roles and freelance work/)).toBeInTheDocument();
    });

    it('renders email link with mailto href', () => {
        renderContact();
        const link = document.querySelector(`a[href="mailto:${CONTACT_EMAIL}"]`);
        expect(link).toBeInTheDocument();
        expect(link).not.toHaveAttribute('target');
        expect(link).not.toHaveAttribute('rel');
    });

    it('renders phone link with tel href', () => {
        renderContact();
        const link = document.querySelector(`a[href="${CONTACT_PHONE_HREF}"]`);
        expect(link).toBeInTheDocument();
    });

    it('renders phone display value', () => {
        renderContact();
        expect(screen.getByText(CONTACT_PHONE_DISPLAY)).toBeInTheDocument();
    });

    it('renders LinkedIn link with external link guards', () => {
        renderContact();
        const link = document.querySelector(`a[href="${CONTACT_LINKEDIN_URL}"]`);
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders LinkedIn display value', () => {
        renderContact();
        expect(screen.getByText(CONTACT_LINKEDIN_DISPLAY)).toBeInTheDocument();
    });

    it('does not render GitHub link in contact section', () => {
        renderContact();
        const link = document.querySelector(`a[href="${CONTACT_GITHUB_URL}"]`);
        expect(link).not.toBeInTheDocument();
    });

    it('renders translated labels', () => {
        renderContact();
        expect(screen.getByText('Email Me')).toBeInTheDocument();
        expect(screen.getByText('Call Me')).toBeInTheDocument();
        expect(screen.getByText('LinkedIn Profile')).toBeInTheDocument();
    });

    it('renders sgds-card for each contact method', () => {
        renderContact();
        const cards = document.querySelectorAll('sgds-card');
        expect(cards.length).toBe(3);
    });

    it('renders sgds-icon for mail and phone', () => {
        renderContact();
        const mailIcon = document.querySelector('sgds-icon[name="mail"]');
        expect(mailIcon).toBeInTheDocument();
        const phoneIcon = document.querySelector('sgds-icon[name="phone"]');
        expect(phoneIcon).toBeInTheDocument();
    });

    it('source contains sgds-card', () => {
        const source = fs.readFileSync('src/components/sections/Contact.tsx', 'utf-8');
        expect(source).toContain('sgds-card');
    });

    it('source contains ContactLinkItem interface', () => {
        const source = fs.readFileSync('src/components/sections/Contact.tsx', 'utf-8');
        expect(source).toContain('ContactLinkItem');
    });

    it('source contains noopener noreferrer for external links', () => {
        const source = fs.readFileSync('src/components/sections/Contact.tsx', 'utf-8');
        expect(source).toContain('noopener noreferrer');
    });

    it('source does not contain GitHubIcon (moved to About)', () => {
        const source = fs.readFileSync('src/components/sections/Contact.tsx', 'utf-8');
        expect(source).not.toContain('GitHubIcon');
    });

    it('source preserves LinkedInIcon', () => {
        const source = fs.readFileSync('src/components/sections/Contact.tsx', 'utf-8');
        expect(source).toContain('LinkedInIcon');
    });

    it('source contains no dark: utility', () => {
        const source = fs.readFileSync('src/components/sections/Contact.tsx', 'utf-8');
        expect(source).not.toContain('dark:');
    });

    it('source imports contact constants from data', () => {
        const source = fs.readFileSync('src/components/sections/Contact.tsx', 'utf-8');
        expect(source).toContain('@/data/contact');
    });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import fs from 'fs';
import messages from '@/i18n/messages/en.json';
import { CONTACT_GITHUB_URL, CONTACT_GITHUB_HANDLE } from '@/data/contact';
import About from './About';

function renderAbout() {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <About />
        </NextIntlClientProvider>,
    );
}

describe('About', () => {
    it('renders translated heading', () => {
        renderAbout();
        expect(screen.getByText('About Me')).toBeInTheDocument();
    });

    it('renders translated description', () => {
        renderAbout();
        expect(screen.getByText(/Results-driven Backend Developer/)).toBeInTheDocument();
    });

    it('renders sgds-card for the summary surface', () => {
        renderAbout();
        const card = document.querySelector('sgds-card');
        expect(card).toBeInTheDocument();
    });

    it('renders email link with correct href', () => {
        renderAbout();
        const link = document.querySelector('a[href^="mailto:"]');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', 'mailto:jefrykurniaone@gmail.com');
    });

    it('renders phone link with correct href', () => {
        renderAbout();
        const link = document.querySelector('a[href^="tel:"]');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', 'tel:+6282126229978');
    });

    it('renders LinkedIn link with target=_blank and rel=noopener noreferrer', () => {
        renderAbout();
        const link = document.querySelector('a[href*="linkedin.com"]');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders LinkedIn handle text', () => {
        renderAbout();
        const handles = screen.getAllByText('jefrykurniaone');
        expect(handles.length).toBeGreaterThanOrEqual(1);
    });

    it('renders GitHub link with correct href', () => {
        renderAbout();
        const link = document.querySelector(`a[href="${CONTACT_GITHUB_URL}"]`);
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders GitHub handle text', () => {
        renderAbout();
        const handles = screen.getAllByText(CONTACT_GITHUB_HANDLE);
        expect(handles.length).toBeGreaterThanOrEqual(1);
    });

    it('renders translated aria-labels on contact links', () => {
        renderAbout();
        const emailLink = document.querySelector('a[href^="mailto:"]');
        expect(emailLink).toHaveAttribute('aria-label', 'Email');
        const phoneLink = document.querySelector('a[href^="tel:"]');
        expect(phoneLink).toHaveAttribute('aria-label', 'Phone');
        const linkedinLink = document.querySelector('a[href*="linkedin.com"]');
        expect(linkedinLink).toHaveAttribute('aria-label', 'LinkedIn');
        const githubLink = document.querySelector(`a[href="${CONTACT_GITHUB_URL}"]`);
        expect(githubLink).toHaveAttribute('aria-label', 'GitHub');
    });

    it('source contains sgds-card', () => {
        const source = fs.readFileSync('src/components/sections/About.tsx', 'utf-8');
        expect(source).toContain('sgds-card');
    });

    it('source contains no dark: utility', () => {
        const source = fs.readFileSync('src/components/sections/About.tsx', 'utf-8');
        expect(source).not.toContain('dark:');
    });

    it('source imports contact constants from data', () => {
        const source = fs.readFileSync('src/components/sections/About.tsx', 'utf-8');
        expect(source).toContain('@/data/contact');
    });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import fs from 'fs';
import messages from '@/i18n/messages/en.json';
import Experience from './Experience';

function renderExperience() {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <Experience />
        </NextIntlClientProvider>,
    );
}

describe('Experience', () => {
    it('renders translated section heading', () => {
        renderExperience();
        expect(screen.getByText('Professional Experience')).toBeInTheDocument();
    });

    it('renders at least one company name', () => {
        renderExperience();
        const companies = screen.getAllByText('PT Xtremax Teknologi Indonesia');
        expect(companies.length).toBeGreaterThan(0);
    });

    it('renders experience roles', () => {
        renderExperience();
        expect(screen.getByText('Software Developer I - Backend')).toBeInTheDocument();
    });

    it('renders translated bullet points', () => {
        renderExperience();
        expect(screen.getByText(/Designing and developing backend systems/)).toBeInTheDocument();
    });

    it('renders timeline rail and section anchor', () => {
        const { container } = renderExperience();
        // Verify the section has the correct id anchor
        const section = container.querySelector('#experience');
        expect(section).toBeInTheDocument();
        // Verify the container for the timeline rail exists (has relative positioning)
        expect(section?.innerHTML).toContain('sgds:relative');
    });

    it('renders sgds-card for each experience panel', () => {
        renderExperience();
        const cards = document.querySelectorAll('sgds-card');
        expect(cards.length).toBeGreaterThan(0);
    });

    it('renders sgds-badge for technology tags', () => {
        renderExperience();
        const badges = document.querySelectorAll('sgds-badge');
        expect(badges.length).toBeGreaterThan(0);
    });

    it('renders technology badge text from data', () => {
        renderExperience();
        const badges = screen.getAllByText('C#');
        expect(badges.length).toBeGreaterThan(0);
    });

    it('source contains sgds-card and sgds-badge', () => {
        const source = fs.readFileSync('src/components/sections/Experience.tsx', 'utf-8');
        expect(source).toContain('sgds-card');
        expect(source).toContain('sgds-badge');
    });

    it('source contains no dark: utility', () => {
        const source = fs.readFileSync('src/components/sections/Experience.tsx', 'utf-8');
        expect(source).not.toContain('dark:');
    });

    it('source keeps useMessages() workaround unchanged', () => {
        const source = fs.readFileSync('src/components/sections/Experience.tsx', 'utf-8');
        expect(source).toContain('useMessages');
        expect(source).toContain('as unknown as');
    });
});

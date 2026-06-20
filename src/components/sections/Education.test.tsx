import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import fs from 'fs';
import messages from '@/i18n/messages/en.json';
import idMessages from '@/i18n/messages/id.json';
import Education from './Education';

function renderEducation(locale: 'en' | 'id' = 'en') {
    const msg = locale === 'id' ? idMessages : messages;
    return render(
        <NextIntlClientProvider locale={locale} messages={msg}>
            <Education />
        </NextIntlClientProvider>,
    );
}

describe('Education', () => {
    it('renders translated section heading', () => {
        renderEducation();
        expect(screen.getByText('Education')).toBeInTheDocument();
    });

    it('renders formal education heading', () => {
        renderEducation();
        expect(screen.getByText('Formal Education')).toBeInTheDocument();
    });

    it('renders informal education heading', () => {
        renderEducation();
        expect(screen.getByText('Informal Education')).toBeInTheDocument();
    });

    it('renders institution names', () => {
        renderEducation();
        expect(screen.getByText('Widyatama University')).toBeInTheDocument();
        expect(screen.getByText('Telkom University')).toBeInTheDocument();
    });

    it('renders degree and major text', () => {
        renderEducation();
        expect(screen.getByText(/Bachelor.*?Information Systems/)).toBeInTheDocument();
    });

    it('renders GPA label and value', () => {
        renderEducation();
        const gpaLabels = screen.getAllByText(/GPA/);
        expect(gpaLabels.length).toBeGreaterThan(0);
        expect(screen.getByText(/3\.63 \/ 4\.00/)).toBeInTheDocument();
    });

    it('renders Indonesian month when locale=id', () => {
        renderEducation('id');
        // Coding.ID informal education has period "Nov 2019 – Jan 2020" which should be translated
        expect(screen.getByText(/Nov 2019 – Jan 2020/)).toBeInTheDocument();
    });

    it('renders sgds-card for each education entry', () => {
        renderEducation();
        const cards = document.querySelectorAll('sgds-card');
        expect(cards.length).toBeGreaterThan(0);
    });

    it('renders sgds-grid container', () => {
        renderEducation();
        const grids = document.querySelectorAll('.sgds-grid');
        expect(grids.length).toBeGreaterThan(0);
    });

    it('source contains sgds-card', () => {
        const source = fs.readFileSync('src/components/sections/Education.tsx', 'utf-8');
        expect(source).toContain('sgds-card');
    });

    it('source uses formal/informal filtering', () => {
        const source = fs.readFileSync('src/components/sections/Education.tsx', 'utf-8');
        expect(source).toContain("e.type === 'formal'");
        expect(source).toContain("e.type === 'informal'");
    });

    it('source calls translatePeriod', () => {
        const source = fs.readFileSync('src/components/sections/Education.tsx', 'utf-8');
        expect(source).toContain('translatePeriod(edu.period, locale)');
    });

    it('source contains no dark: utility', () => {
        const source = fs.readFileSync('src/components/sections/Education.tsx', 'utf-8');
        expect(source).not.toContain('dark:');
    });
});

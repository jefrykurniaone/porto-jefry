import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import fs from 'fs';
import messages from '@/i18n/messages/en.json';
import idMessages from '@/i18n/messages/id.json';
import { certifications } from '@/data/certifications';
import Certifications from './Certifications';

function renderCertifications(locale: 'en' | 'id' = 'en') {
    const msg = locale === 'id' ? idMessages : messages;
    return render(
        <NextIntlClientProvider locale={locale} messages={msg}>
            <Certifications />
        </NextIntlClientProvider>,
    );
}

describe('Certifications', () => {
    it('renders translated section heading', () => {
        renderCertifications();
        expect(screen.getByText('Certifications')).toBeInTheDocument();
    });

    it('renders certification name from translation key', () => {
        renderCertifications();
        expect(screen.getByText('.NET Programmer Class')).toBeInTheDocument();
    });

    it('renders certification issuer from translation', () => {
        renderCertifications();
        expect(screen.getByText('Coding.ID')).toBeInTheDocument();
    });

    it('renders certification period from translation', () => {
        renderCertifications();
        expect(screen.getByText('Nov 2019 – Jan 2020')).toBeInTheDocument();
    });

    it('renders certification description from translation', () => {
        renderCertifications();
        expect(
            screen.getByText(/\.NET programming course covering C#/),
        ).toBeInTheDocument();
    });

    it('renders Indonesian translations when locale=id', () => {
        renderCertifications('id');
        expect(screen.getByText('Kelas Programmer .NET')).toBeInTheDocument();
        expect(screen.getByText(/Kursus pemrograman .NET yang mencakup/)).toBeInTheDocument();
    });

    it('renders sgds-card for each certification', () => {
        renderCertifications();
        const cards = document.querySelectorAll('sgds-card');
        expect(cards.length).toBe(certifications.length);
    });

    it('renders shield-tick icon on certification card', () => {
        renderCertifications();
        const icon = document.querySelector('sgds-icon[name="shield-tick"]');
        expect(icon).toBeInTheDocument();
    });

    it('source contains sgds-card', () => {
        const source = fs.readFileSync('src/components/sections/Certifications.tsx', 'utf-8');
        expect(source).toContain('sgds-card');
    });

    it('source imports certifications from data', () => {
        const source = fs.readFileSync('src/components/sections/Certifications.tsx', 'utf-8');
        expect(source).toContain('@/data/certifications');
    });

    it('source uses translation key by cert.id', () => {
        const source = fs.readFileSync('src/components/sections/Certifications.tsx', 'utf-8');
        expect(source).toContain('cert.id');
    });

    it('source contains no dark: utility', () => {
        const source = fs.readFileSync('src/components/sections/Certifications.tsx', 'utf-8');
        expect(source).not.toContain('dark:');
    });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import idMessages from '@/i18n/messages/id.json';
import Education from './Education';
import { education } from '@/data/education';

function renderEducation(locale: 'en' | 'id' = 'en') {
    const msg = locale === 'id' ? idMessages : messages;
    return render(
        <NextIntlClientProvider locale={locale} messages={msg}>
            <Education />
        </NextIntlClientProvider>,
    );
}

describe('Education', () => {
    it('renders the combined section title', () => {
        renderEducation();
        expect(
            screen.getByRole('heading', { name: 'Education & Certification' }),
        ).toBeInTheDocument();
    });

    it('renders every institution from data', () => {
        renderEducation();
        for (const edu of education) {
            expect(screen.getByRole('heading', { name: edu.institution })).toBeInTheDocument();
        }
    });

    it('tags formal entries as Formal and informal entries as Certification', () => {
        renderEducation();
        const formalCount = education.filter((e) => e.type === 'formal').length;
        const certCount = education.filter((e) => e.type === 'informal').length;
        expect(screen.getAllByText('Formal')).toHaveLength(formalCount);
        expect(screen.getAllByText('Certification')).toHaveLength(certCount);
    });

    it('renders localized degrees from messages (en)', () => {
        renderEducation();
        expect(screen.getByText("Bachelor's in Information Systems")).toBeInTheDocument();
        expect(screen.getByText('Diploma in Informatics Management')).toBeInTheDocument();
    });

    it('renders localized degrees from messages (id)', () => {
        renderEducation('id');
        expect(screen.getByText('S1 Sistem Informasi')).toBeInTheDocument();
        expect(screen.getByText('D3 Manajemen Informatika')).toBeInTheDocument();
    });

    it('renders GPA lines only for entries with a GPA', () => {
        renderEducation();
        const withGpa = education.filter((e) => e.gpa).length;
        expect(screen.getAllByText(/^GPA: /)).toHaveLength(withGpa);
    });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import { skillCategories } from '@/data/skills';
import Skills from './Skills';

function renderSkills() {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <Skills />
        </NextIntlClientProvider>,
    );
}

describe('Skills', () => {
    it('renders the section title', () => {
        renderSkills();
        expect(screen.getByRole('heading', { name: 'Technical Skills' })).toBeInTheDocument();
    });

    it('renders every translated category label', () => {
        renderSkills();
        for (const cat of skillCategories) {
            const label = messages.skills.categories[
                cat.category as keyof typeof messages.skills.categories
            ];
            expect(screen.getByRole('heading', { name: label })).toBeInTheDocument();
        }
    });

    it('lists the AI & Emerging Tech category first', () => {
        expect(skillCategories[0].category).toBe('ai_emerging');
    });

    it('renders the AI badge only on the AI category card', () => {
        renderSkills();
        const badges = screen.getAllByText('AI', { selector: '.ai-badge' });
        expect(badges).toHaveLength(1);
        const card = badges[0].closest('.skill-card');
        expect(card?.textContent).toContain('AI & Emerging Tech');
    });

    it('renders every skill as a chip', () => {
        renderSkills();
        for (const cat of skillCategories) {
            for (const skill of cat.skills) {
                expect(screen.getByText(skill)).toBeInTheDocument();
            }
        }
    });
});

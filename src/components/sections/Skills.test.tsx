import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import fs from 'fs';
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
    it('renders translated section heading', () => {
        renderSkills();
        expect(screen.getByText('Technical Skills')).toBeInTheDocument();
    });

    it('renders all category headings from translations', () => {
        renderSkills();
        expect(screen.getByText('Backend')).toBeInTheDocument();
        expect(screen.getByText('Frontend')).toBeInTheDocument();
        expect(screen.getByText('Database')).toBeInTheDocument();
        expect(screen.getByText('AI & Emerging Tech')).toBeInTheDocument();
        expect(screen.getByText('CMS & Platforms')).toBeInTheDocument();
        expect(screen.getByText('Tools & DevOps')).toBeInTheDocument();
    });

    it('renders all skill names as text for each category', () => {
        const { container } = renderSkills();
        skillCategories.forEach((cat) => {
            cat.skills.forEach((skill) => {
                expect(container.textContent).toContain(skill);
            });
        });
    });

    it('renders sgds-card for each skill category', () => {
        renderSkills();
        const cards = document.querySelectorAll('sgds-card');
        expect(cards.length).toBe(skillCategories.length);
    });

    it('source contains sgds-card', () => {
        const source = fs.readFileSync('src/components/sections/Skills.tsx', 'utf-8');
        expect(source).toContain('sgds-card');
    });

    it('source uses TechList and no sgds-badge', () => {
        const source = fs.readFileSync('src/components/sections/Skills.tsx', 'utf-8');
        expect(source).toContain('TechList');
        expect(source).not.toContain('sgds-badge');
    });

    it('source imports skillCategories from data', () => {
        const source = fs.readFileSync('src/components/sections/Skills.tsx', 'utf-8');
        expect(source).toContain('@/data/skills');
    });

    it('source contains no dark: utility', () => {
        const source = fs.readFileSync('src/components/sections/Skills.tsx', 'utf-8');
        expect(source).not.toContain('dark:');
    });
});

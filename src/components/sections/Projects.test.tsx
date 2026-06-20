import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import fs from 'fs';
import messages from '@/i18n/messages/en.json';
import { projects } from '@/data/projects';
import { translatePeriod } from '@/utils/translate-period';
import Projects from './Projects';

function renderProjects() {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <Projects />
        </NextIntlClientProvider>,
    );
}

describe('Projects', () => {
    it('renders translated section heading', () => {
        renderProjects();
        expect(screen.getByText('Projects Experience')).toBeInTheDocument();
    });

    it('renders all project names', () => {
        renderProjects();
        projects.forEach((project) => {
            expect(screen.getByText(project.name)).toBeInTheDocument();
        });
    });

    it('renders company names for all projects', () => {
        renderProjects();
        projects.forEach((project) => {
            const matches = screen.getAllByText(project.company);
            expect(matches.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('renders all project periods', () => {
        renderProjects();
        const uniquePeriods = new Map<string, number>();
        projects.forEach((project) => {
            const period = translatePeriod(
                project.period.replace('Present', 'Present'),
                'en',
            );
            uniquePeriods.set(period, (uniquePeriods.get(period) || 0) + 1);
        });
        uniquePeriods.forEach((count, period) => {
            const matches = screen.getAllByText(period);
            expect(matches.length).toBe(count);
        });
    });

    it('renders a description for every project from i18n', () => {
        const { container } = renderProjects();
        // Descriptions are read from i18n via resolveProjectDescription; every project
        // now has a projects.items.<id>.description key, so each card renders one.
        const descParas = container.querySelectorAll(
            'p.sgds\\:text-body-md.sgds\\:text-body-default.sgds\\:mb-component-sm',
        );
        expect(descParas.length).toBe(projects.length);
    });

    it('renders the actual description text for a known project', () => {
        renderProjects();
        expect(
            screen.getByText(messages.projects.items['rbbr-super-bank'].description),
        ).toBeInTheDocument();
    });

    it('renders all tech as plain text per project', () => {
        const { container } = renderProjects();
        projects.forEach((project) => {
            project.tech.forEach((tech) => {
                expect(container.textContent).toContain(tech);
            });
        });
    });

    it('renders sgds-card for each project', () => {
        renderProjects();
        const cards = document.querySelectorAll('sgds-card');
        expect(cards.length).toBe(projects.length);
    });

    it('source contains sgds-card', () => {
        const source = fs.readFileSync('src/components/sections/Projects.tsx', 'utf-8');
        expect(source).toContain('sgds-card');
    });

    it('source uses TechList and no sgds-badge', () => {
        const source = fs.readFileSync('src/components/sections/Projects.tsx', 'utf-8');
        expect(source).toContain('TechList');
        expect(source).not.toContain('sgds-badge');
    });

    it('source contains noopener noreferrer for external links', () => {
        const source = fs.readFileSync('src/components/sections/Projects.tsx', 'utf-8');
        expect(source).toContain('noopener noreferrer');
    });

    it('source imports projects from data', () => {
        const source = fs.readFileSync('src/components/sections/Projects.tsx', 'utf-8');
        expect(source).toContain('@/data/projects');
    });

    it('source contains no dark: utility', () => {
        const source = fs.readFileSync('src/components/sections/Projects.tsx', 'utf-8');
        expect(source).not.toContain('dark:');
    });
});

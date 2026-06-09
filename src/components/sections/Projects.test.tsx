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

    it('renders project descriptions when present', () => {
        renderProjects();
        projects
            .filter((p) => p.description)
            .forEach((project) => {
                expect(screen.getByText(project.description!)).toBeInTheDocument();
            });
    });

    it('renders MAX_TECH_VISIBLE visible tech badges per project', () => {
        renderProjects();
        // First project has 7 tech items; MAX_TECH_VISIBLE = 6, so 6 badges + 1 overflow
        const badges = document.querySelectorAll('sgds-badge');
        const totalTech = projects.reduce((sum, p) => {
            const visible = Math.min(p.tech.length, 6);
            return sum + visible + (p.tech.length > 6 ? 1 : 0);
        }, 0);
        expect(badges.length).toBe(totalTech);
    });

    it('shows overflow count when tech exceeds MAX_TECH_VISIBLE', () => {
        renderProjects();
        const overflowProjects = projects.filter((p) => p.tech.length > 6);
        const overflowBadges = screen.getAllByText(/^\+\d+$/);
        expect(overflowBadges.length).toBe(overflowProjects.length);
        // HRIS JOB Tomori has 11 tech: +5 overflow — unique value
        expect(screen.getByText('+5')).toBeInTheDocument();
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

    it('source contains sgds-badge', () => {
        const source = fs.readFileSync('src/components/sections/Projects.tsx', 'utf-8');
        expect(source).toContain('sgds-badge');
    });

    it('source contains MAX_TECH_VISIBLE', () => {
        const source = fs.readFileSync('src/components/sections/Projects.tsx', 'utf-8');
        expect(source).toContain('MAX_TECH_VISIBLE');
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

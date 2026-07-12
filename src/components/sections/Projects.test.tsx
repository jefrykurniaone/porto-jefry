import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import { projects } from '@/data/projects';
import Projects from './Projects';

function renderProjects() {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <Projects />
        </NextIntlClientProvider>,
    );
}

describe('Projects', () => {
    it('renders the section title', () => {
        renderProjects();
        expect(screen.getByRole('heading', { name: 'Projects Experience' })).toBeInTheDocument();
    });

    it('renders every project name from data', () => {
        renderProjects();
        for (const project of projects) {
            expect(screen.getByRole('heading', { name: project.name })).toBeInTheDocument();
        }
    });

    it('renders a translated description for every project', () => {
        renderProjects();
        for (const project of projects) {
            const desc = messages.projects.items[
                project.id as keyof typeof messages.projects.items
            ]?.description;
            expect(desc, `missing description message for ${project.id}`).toBeTruthy();
            expect(screen.getByText(desc)).toBeInTheDocument();
        }
    });

    it('renders the company eyebrow for each card', () => {
        renderProjects();
        const eyebrows = screen.getAllByText('PT Xtremax Teknologi Indonesia', {
            selector: '.card-eyebrow',
        });
        expect(eyebrows.length).toBeGreaterThan(0);
    });

    it('replaces Present with the translated label in periods', () => {
        renderProjects();
        expect(screen.getAllByText(/– Present/).length).toBeGreaterThan(0);
    });

    it('renders tech chips per project', () => {
        const { container } = renderProjects();
        const firstCard = container.querySelector('.project-card');
        expect(firstCard?.querySelectorAll('.chip').length).toBeGreaterThan(0);
    });
});

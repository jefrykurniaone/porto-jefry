import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import idMessages from '@/i18n/messages/id.json';
import Experience from './Experience';
import { experiences } from '@/data/experience';

function renderExperience(locale: 'en' | 'id' = 'en') {
    return render(
        <NextIntlClientProvider locale={locale} messages={locale === 'en' ? messages : idMessages}>
            <Experience />
        </NextIntlClientProvider>,
    );
}

describe('Experience', () => {
    it('renders the section title', () => {
        renderExperience();
        expect(
            screen.getByRole('heading', { name: 'Professional Experience' }),
        ).toBeInTheDocument();
    });

    it('renders every role from data', () => {
        renderExperience();
        for (const exp of experiences) {
            expect(screen.getByRole('heading', { name: exp.role })).toBeInTheDocument();
        }
    });

    it('shows at most 3 bullets per entry initially', () => {
        const { container } = renderExperience();
        const rows = container.querySelectorAll('.exp-row');
        expect(rows.length).toBe(experiences.length);
        rows.forEach((row) => {
            expect(row.querySelectorAll('li').length).toBeLessThanOrEqual(3);
        });
    });

    it('expands hidden bullets via the "+ N more" button and collapses again', async () => {
        const { container } = renderExperience();
        const user = userEvent.setup();
        const firstRow = container.querySelector('.exp-row') as HTMLElement;
        const bullets = messages.experience.items['xtremax-2025'].bullets;
        const hidden = bullets.length - 3;

        const moreBtn = within(firstRow).getByRole('button', {
            name: `+ ${hidden} more`,
        });
        expect(moreBtn).toHaveAttribute('aria-expanded', 'false');

        await user.click(moreBtn);
        expect(within(firstRow).getAllByRole('listitem').length).toBe(bullets.length);
        const lessBtn = within(firstRow).getByRole('button', { name: '− show less' });
        expect(lessBtn).toHaveAttribute('aria-expanded', 'true');

        await user.click(lessBtn);
        expect(within(firstRow).getAllByRole('listitem').length).toBe(3);
    });

    it('replaces Present with the localized label', () => {
        renderExperience('id');
        expect(screen.getByText(/Jul 2025 – Sekarang/)).toBeInTheDocument();
    });

    it('translates month abbreviations for the id locale', () => {
        renderExperience('id');
        // Dec 2024 → Des 2024 via translatePeriod
        expect(screen.getByText(/Des 2024/)).toBeInTheDocument();
    });

    it('renders tech chips for entries with tech', () => {
        const { container } = renderExperience();
        const firstRow = container.querySelector('.exp-row') as HTMLElement;
        expect(within(firstRow).getByText('Sitefinity')).toBeInTheDocument();
    });
});

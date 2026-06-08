import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import NotFound from './not-found';

// Mock @/i18n/routing
vi.mock('@/i18n/routing', () => ({
    Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

const messages = {
    notFound: {
        title: 'Page Not Found',
        message: "The page you're looking for doesn't exist or has been moved.",
        returnHome: 'Return Home',
    },
};

describe('NotFound (SGDS migration)', () => {
    const renderNotFound = () => {
        return render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <NotFound />
            </NextIntlClientProvider>,
        );
    };

    it('should render without errors', () => {
        expect(() => renderNotFound()).not.toThrow();
    });

    it('should display translated notFound.title in h1', () => {
        renderNotFound();
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('Page Not Found');
    });

    it('should display translated notFound.message in paragraph', () => {
        renderNotFound();
        const message = screen.getByText(
            /The page you're looking for doesn't exist/i,
        );
        expect(message).toBeInTheDocument();
        expect(message.tagName).toBe('P');
    });

    it('should display translated notFound.returnHome as link action', () => {
        renderNotFound();
        const link = screen.getByRole('link', { name: /Return Home/i });
        expect(link).toBeInTheDocument();
    });

    it('should have button link to / using Link from @/i18n/routing', () => {
        const { container } = renderNotFound();
        const link = container.querySelector('a[href="/"]');
        expect(link).toBeInTheDocument();
    });

    it('should use SGDS icon (question-circle)', () => {
        const { container } = renderNotFound();
        const icon = container.querySelector('sgds-icon');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('name', 'question-circle');
    });

    it('should have no lucide-react FileQuestion icon', () => {
        const { container } = renderNotFound();
        // No standalone SVG icons (lucide-react renders as <svg>)
        const lucideSvgs = Array.from(container.querySelectorAll('svg')).filter(
            svg => !svg.closest('sgds-icon')
        );
        expect(lucideSvgs.length).toBe(0);
    });
});

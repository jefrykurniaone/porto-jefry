import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import NotFound from './not-found';

// Mock @/i18n/routing
vi.mock('@/i18n/routing', () => ({
    Link: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} {...props}>{children}</a>
    ),
}));

const messages = {
    notFound: {
        title: 'Page Not Found',
        message: "The page you're looking for doesn't exist or has been moved.",
        returnHome: 'Return Home',
    },
};

describe('NotFound', () => {
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
        const message = screen.getByText(/The page you're looking for doesn't exist/i);
        expect(message).toBeInTheDocument();
        expect(message.tagName).toBe('P');
    });

    it('should display translated notFound.returnHome as link action to /', () => {
        renderNotFound();
        const link = screen.getByRole('link', { name: /Return Home/i });
        expect(link).toHaveAttribute('href', '/');
    });

    it('renders the 404 glyph decoratively (hidden from assistive tech)', () => {
        const { container } = renderNotFound();
        const glyph = container.querySelector('.fullpage-center__glyph');
        expect(glyph).toHaveAttribute('aria-hidden', 'true');
    });
});

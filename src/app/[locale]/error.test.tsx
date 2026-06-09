import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import ErrorPage from './error';

const messages = {
    error: {
        title: 'Something Went Wrong',
        message: 'An unexpected error occurred. Please try refreshing the page.',
        tryAgain: 'Try Again',
        returnHome: 'Return Home',
    },
};

// Mock next-intl hooks (keep useLocale patched)
vi.mock('next-intl', async () => {
    const actual = await vi.importActual('next-intl');
    return {
        ...actual,
        useLocale: vi.fn(() => 'en'),
    };
});

// Mock @/i18n/routing Link component
vi.mock('@/i18n/routing', () => ({
    Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

describe('Error page (SGDS migration)', () => {
    const mockError = new Error('Test error');
    const mockReset = vi.fn();

    const renderError = () => {
        return render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <ErrorPage error={mockError} reset={mockReset} />
            </NextIntlClientProvider>,
        );
    };

    it('should render with use client directive', () => {
        const { container } = renderError();
        expect(container).toBeTruthy();
    });

    it('should display translated error title in h1', () => {
        renderError();
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('Something Went Wrong');
    });

    it('should display translated error message', () => {
        renderError();
        const message = screen.getByText('An unexpected error occurred. Please try refreshing the page.');
        expect(message).toBeInTheDocument();
    });

    it('should render Try Again sgds-button that calls reset prop', async () => {
        const user = userEvent.setup();
        const { container } = renderError();

        const tryAgainBtn = container.querySelector('sgds-button');
        expect(tryAgainBtn).toBeInTheDocument();
        expect(tryAgainBtn?.textContent).toContain('Try Again');

        await user.click(tryAgainBtn!);
        expect(mockReset).toHaveBeenCalledTimes(1);
    });

    it('should render Return Home action with locale-aware link', () => {
        const { container } = renderError();

        // Mock returns locale 'en', so link should be /en
        const links = container.querySelectorAll('a');
        const homeLink = Array.from(links).find(link =>
            link.getAttribute('href')?.includes('/en')
        );
        expect(homeLink).toBeTruthy();
    });

    it('should log error to console with [Error Boundary] prefix', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        renderError();

        expect(consoleSpy).toHaveBeenCalledWith('[Error Boundary]', mockError);
        consoleSpy.mockRestore();
    });

    it('should have type="button" on the Try Again sgds-button', () => {
        const { container } = renderError();

        const tryAgainBtn = container.querySelector('sgds-button');
        expect(tryAgainBtn).toHaveAttribute('type', 'button');
    });

    it('should use SGDS icon (exclamation-triangle-fill)', () => {
        const { container } = renderError();
        const icon = container.querySelector('sgds-icon');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('name', 'exclamation-triangle-fill');
    });

    it('should have no lucide-react AlertTriangle icon', () => {
        // SGDS migration: error page should NOT render lucide-react icons
        const { container } = renderError();
        // lucide-react renders as <svg> with specific attributes
        const lucideSvgs = Array.from(container.querySelectorAll('svg')).filter(
            svg => !svg.closest('sgds-icon')
        );
        // No standalone SVG icons (sgds-icon wraps SVGs internally)
        expect(lucideSvgs.length).toBe(0);
    });
});

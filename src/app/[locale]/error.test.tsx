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
    Link: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} {...props}>{children}</a>
    ),
}));

describe('Error page', () => {
    const mockError = new Error('Test error');
    const mockReset = vi.fn();

    const renderError = () => {
        return render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <ErrorPage error={mockError} reset={mockReset} />
            </NextIntlClientProvider>,
        );
    };

    it('should display translated error title in h1', () => {
        renderError();
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('Something Went Wrong');
    });

    it('should display translated error message', () => {
        renderError();
        expect(
            screen.getByText('An unexpected error occurred. Please try refreshing the page.'),
        ).toBeInTheDocument();
    });

    it('should render a Try Again button that calls reset prop', async () => {
        const user = userEvent.setup();
        renderError();

        const tryAgainBtn = screen.getByRole('button', { name: 'Try Again' });
        expect(tryAgainBtn).toHaveAttribute('type', 'button');

        await user.click(tryAgainBtn);
        expect(mockReset).toHaveBeenCalledTimes(1);
    });

    it('should render Return Home action with locale-aware link', () => {
        const { container } = renderError();
        const links = container.querySelectorAll('a');
        const homeLink = Array.from(links).find((link) =>
            link.getAttribute('href')?.includes('/en'),
        );
        expect(homeLink).toBeTruthy();
    });

    it('should log error to console with [Error Boundary] prefix', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        renderError();

        expect(consoleSpy).toHaveBeenCalledWith('[Error Boundary]', mockError);
        consoleSpy.mockRestore();
    });
});

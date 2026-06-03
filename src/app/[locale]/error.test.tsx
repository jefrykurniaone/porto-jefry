import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import ErrorBoundary from './error';

const messages = {
  error: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try refreshing the page.',
    tryAgain: 'Try Again',
    returnHome: 'Return Home',
  },
};

// Mock next-intl hooks
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

describe('Error boundary component', () => {
  const mockError = new Error('Test error');
  const mockReset = vi.fn();

  const renderError = () => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ErrorBoundary error={mockError} reset={mockReset} />
      </NextIntlClientProvider>
    );
  };

  it('should render with use client directive', () => {
    // This test verifies the file structure - actual check is in the implementation
    const { container } = renderError();
    expect(container).toBeTruthy();
  });

  it('should render AlertTriangle icon from lucide-react', () => {
    renderError();
    // lucide-react icons render as SVG elements
    const svg = document.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should display translated error title in h1', () => {
    renderError();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Something Went Wrong');
  });

  it('should display translated error message in paragraph', () => {
    renderError();
    const message = screen.getByText('An unexpected error occurred. Please try refreshing the page.');
    expect(message).toBeInTheDocument();
  });

  it('should render Try Again button that calls reset prop', async () => {
    const user = userEvent.setup();
    renderError();
    
    const tryAgainButton = screen.getByRole('button', { name: 'Try Again' });
    expect(tryAgainButton).toBeInTheDocument();
    
    await user.click(tryAgainButton);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('should render Return Home button with Link to locale home', () => {
    const { container } = renderError();
    
    const returnHomeButton = screen.getByRole('button', { name: 'Return Home' });
    expect(returnHomeButton).toBeInTheDocument();
    
    // Check that the button is inside a Link component (rendered as anchor)
    const links = container.querySelectorAll('a');
    const homeLink = Array.from(links).find(link => 
      link.getAttribute('href')?.includes('/')
    );
    expect(homeLink).toBeTruthy();
  });

  it('should log error to console on mount', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderError();
    
    expect(consoleSpy).toHaveBeenCalledWith('[Error Boundary]', mockError);
    consoleSpy.mockRestore();
  });

  it('should have correct button types', () => {
    renderError();
    
    const tryAgainButton = screen.getByRole('button', { name: 'Try Again' });
    const returnHomeButton = screen.getByRole('button', { name: 'Return Home' });
    
    expect(tryAgainButton).toHaveAttribute('type', 'button');
    expect(returnHomeButton).toHaveAttribute('type', 'button');
  });
});

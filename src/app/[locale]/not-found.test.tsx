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

describe('NotFound Component', () => {
  const renderNotFound = () => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <NotFound />
      </NextIntlClientProvider>
    );
  };

  it('should render without errors', () => {
    expect(() => renderNotFound()).not.toThrow();
  });

  it('should render FileQuestion icon from lucide-react', () => {
    const { container } = renderNotFound();
    // Check for SVG element (lucide-react renders SVGs)
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
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

  it('should display translated notFound.returnHome in button', () => {
    renderNotFound();
    const button = screen.getByRole('button', { name: /Return Home/i });
    expect(button).toBeInTheDocument();
  });

  it('should have button link to / using Link from @/i18n/routing', () => {
    const { container } = renderNotFound();
    const link = container.querySelector('a[href="/"]');
    expect(link).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import Hero from './Hero';

vi.mock('next/image', () => ({
    default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { alt: string }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} {...props} />
    ),
}));

beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(new Blob()),
    });
    global.URL.createObjectURL = vi.fn(() => 'blob:mock');
    global.URL.revokeObjectURL = vi.fn();
});

function renderHero() {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <Hero />
        </NextIntlClientProvider>,
    );
}

describe('Hero', () => {
    it('renders without crashing', () => {
        renderHero();
    });

    it('renders heading with name', () => {
        renderHero();
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('renders CV download button', () => {
        renderHero();
        const btns = screen.getAllByRole('button');
        expect(btns.some((b) => /cv|unduh/i.test(b.textContent ?? ''))).toBe(true);
    });

    it('renders hero photo with alt text', () => {
        renderHero();
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')!.length).toBeGreaterThan(0);
    });
});

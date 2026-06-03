import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import Hero from './Hero';

vi.mock('next/image', () => ({
    default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { alt: string }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} {...props} />
    ),
}));

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(new Blob()),
    });
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
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
        expect(img.getAttribute('alt')).toBeTruthy();
    });

    it('clicking the CV button triggers download', async () => {
        renderHero();
        const user = userEvent.setup();
        const btns = screen.getAllByRole('button');
        const cvBtn = btns.find((b) => /cv|unduh/i.test(b.textContent ?? ''));
        expect(cvBtn).toBeDefined();
        if (!cvBtn) return;
        await user.click(cvBtn);
        expect(fetchMock).toHaveBeenCalled();
    });

    it('internal links use plain #id and trigger smooth scroll with pushState', async () => {
        renderHero();
        const projectsLink = document.querySelector('a[href="#projects"]') as HTMLAnchorElement | null;
        expect(projectsLink).toBeTruthy();

        const section = document.createElement('div');
        section.id = 'projects';
        const sectionEl = section as HTMLElement;
        const scrollSpy = vi.fn();
        Object.defineProperty(sectionEl, 'scrollIntoView', { value: scrollSpy, configurable: true });
        document.body.appendChild(section);

        const pushSpy = vi.spyOn(history, 'pushState');

        const user = userEvent.setup();
        await user.click(projectsLink!);

        expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' });
        expect(pushSpy).toHaveBeenCalledWith(null, '', '#projects');

        section.remove();
        scrollSpy.mockRestore();
        pushSpy.mockRestore();
    });

    it('error state initializes as null (no banner on mount)', () => {
        renderHero();
        const banner = screen.queryByRole('alert');
        expect(banner).not.toBeInTheDocument();
    });

    it('sets error message when CV download fails', async () => {
        const failedFetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
        });
        vi.stubGlobal('fetch', failedFetch);

        renderHero();
        const user = userEvent.setup();
        const btns = screen.getAllByRole('button');
        const cvBtn = btns.find((b) => /cv|unduh/i.test(b.textContent ?? ''));
        
        await user.click(cvBtn!);

        // Error message should be set (we'll verify banner rendering in Task 2)
        expect(failedFetch).toHaveBeenCalled();
    });

    it('translation key hero.cv_error exists in messages', () => {
        expect(messages.hero).toHaveProperty('cv_error');
    });

    it('error message interpolates HTTP status code', () => {
        const errorKey = messages.hero.cv_error;
        expect(errorKey).toContain('{status}');
        const interpolated = errorKey.replace('{status}', '500');
        expect(interpolated).toContain('500');
    });

    it('does not render error banner when errorMessage is null', () => {
        renderHero();
        const banner = screen.queryByRole('alert');
        expect(banner).not.toBeInTheDocument();
    });

    it('renders error banner with role=alert when error occurs', async () => {
        const failedFetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
        });
        vi.stubGlobal('fetch', failedFetch);

        renderHero();
        const user = userEvent.setup();
        const btns = screen.getAllByRole('button');
        const cvBtn = btns.find((b) => /cv|unduh/i.test(b.textContent ?? ''));
        
        await user.click(cvBtn!);

        await waitFor(() => {
            const banner = screen.getByRole('alert');
            expect(banner).toBeInTheDocument();
        });
    });

    it('error banner has aria-live=polite for screen readers', async () => {
        const failedFetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 403,
        });
        vi.stubGlobal('fetch', failedFetch);

        renderHero();
        const user = userEvent.setup();
        const btns = screen.getAllByRole('button');
        const cvBtn = btns.find((b) => /cv|unduh/i.test(b.textContent ?? ''));
        
        await user.click(cvBtn!);

        await waitFor(() => {
            const banner = screen.getByRole('alert');
            expect(banner).toHaveAttribute('aria-live', 'polite');
        });
    });

    it('error banner contains error message text with HTTP status', async () => {
        const failedFetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 404,
        });
        vi.stubGlobal('fetch', failedFetch);

        renderHero();
        const user = userEvent.setup();
        const btns = screen.getAllByRole('button');
        const cvBtn = btns.find((b) => /cv|unduh/i.test(b.textContent ?? ''));
        
        await user.click(cvBtn!);

        await waitFor(() => {
            const banner = screen.getByRole('alert');
            expect(banner).toHaveTextContent(/failed.*generate.*cv.*http.*404/i);
        });
    });

    it('sets 5-second auto-dismiss timer when error occurs', async () => {
        const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
        
        const failedFetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
        });
        vi.stubGlobal('fetch', failedFetch);

        renderHero();
        const user = userEvent.setup();
        const btns = screen.getAllByRole('button');
        const cvBtn = btns.find((b) => /cv|unduh/i.test(b.textContent ?? ''));
        
        await user.click(cvBtn!);

        // Wait for error state to be set
        await screen.findByRole('alert');

        // Verify setTimeout was called with 5000ms
        expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 5000);

        setTimeoutSpy.mockRestore();
    });
});

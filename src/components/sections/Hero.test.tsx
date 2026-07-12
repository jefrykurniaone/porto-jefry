import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import fs from 'fs';
import messages from '@/i18n/messages/en.json';
import Hero from './Hero';

vi.mock('next/image', () => ({
    default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { alt: string }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} {...props} />
    ),
}));

let fetchMock: ReturnType<typeof vi.fn>;

function mediaQueryResult(query: string, matches: boolean) {
    return {
        matches,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    };
}

beforeEach(() => {
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation(
        (query: string) => mediaQueryResult(query, false),
    );
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

function getCvButton() {
    return screen.getByRole('button', { name: /download cv/i });
}

describe('Hero', () => {
    it('renders translated heading with name', () => {
        renderHero();
        expect(screen.getByText('Jefry Kurniawan')).toBeInTheDocument();
    });

    it('renders the availability status pill', () => {
        renderHero();
        expect(screen.getByText('Open to remote roles')).toBeInTheDocument();
    });

    it('renders profile image with translated alt text', () => {
        renderHero();
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('alt', 'Jefry Kurniawan — profile photo');
    });

    it('types the first role into the typed line', async () => {
        renderHero();
        // Match a prefix rather than the full word: typing runs on real timers
        // (62 ms/char), so waiting for the complete role is slow and can flake
        // under parallel test load.
        await screen.findByText(
            (_, el) => el?.tagName === 'H2' && /Backend/.test(el.textContent ?? ''),
            undefined,
            { timeout: 4000 },
        );
    });

    it('shows the first role statically under prefers-reduced-motion', () => {
        (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation(
            (query: string) => mediaQueryResult(query, query.includes('prefers-reduced-motion')),
        );
        renderHero();
        const typed = document.querySelector('.hero__typed');
        expect(typed?.textContent).toContain('Backend Developer');
    });

    it('renders View My Work link pointing at #projects', () => {
        renderHero();
        const workLink = document.querySelector('a[href="#projects"]');
        expect(workLink).toBeInTheDocument();
        expect(workLink?.textContent).toMatch(/view.*work/i);
    });

    it('renders Contact Me link pointing at #contact', () => {
        renderHero();
        const contactLink = document.querySelector('a[href="#contact"]');
        expect(contactLink).toBeInTheDocument();
        expect(contactLink?.textContent).toMatch(/contact/i);
    });

    it('clicking a CTA link scrolls to its section and updates hash', async () => {
        renderHero();
        const section = document.createElement('div');
        section.id = 'projects';
        const scrollSpy = vi.fn();
        Object.defineProperty(section, 'scrollIntoView', { value: scrollSpy, configurable: true });
        document.body.appendChild(section);
        const pushSpy = vi.spyOn(history, 'pushState');

        const user = userEvent.setup();
        await user.click(document.querySelector('a[href="#projects"]')!);

        expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' });
        expect(pushSpy).toHaveBeenCalledWith(null, '', '#projects');
        section.remove();
        pushSpy.mockRestore();
    });

    it('clicking CV button triggers download fetch', async () => {
        renderHero();
        const user = userEvent.setup();
        await user.click(getCvButton());
        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/api/generate-cv?'),
        );
    });

    it('disables the CV button while downloading (no duplicate fetch)', async () => {
        fetchMock = vi.fn().mockReturnValue(new Promise(() => {}));
        vi.stubGlobal('fetch', fetchMock);

        renderHero();
        const user = userEvent.setup();
        const cvBtn = getCvButton();
        await user.click(cvBtn);
        await act(async () => {
            cvBtn.click();
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('button', { name: /generating/i })).toBeDisabled();
    });

    it('creates object URL and revokes URL on success', async () => {
        const createSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
        const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

        renderHero();
        const user = userEvent.setup();
        await user.click(getCvButton());

        await waitFor(() => {
            expect(createSpy).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(revokeSpy).toHaveBeenCalledWith('blob:mock');
        });
    });

    it('shows an aria-live alert with HTTP status text on failed CV download', async () => {
        const failedFetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
        vi.stubGlobal('fetch', failedFetch);

        renderHero();
        const user = userEvent.setup();
        await user.click(getCvButton());

        await waitFor(() => {
            const alert = screen.getByRole('alert');
            expect(alert).toHaveAttribute('aria-live', 'polite');
            expect(alert.textContent).toMatch(/failed|gagal|error/i);
        });
    });

    it('error alert auto-dismisses after 5 seconds', async () => {
        const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
        const failedFetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
        vi.stubGlobal('fetch', failedFetch);

        renderHero();
        const user = userEvent.setup();
        await user.click(getCvButton());

        await screen.findByText(/failed|gagal/i);
        expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
        setTimeoutSpy.mockRestore();
    });

    it('source uses Jefry_Kurniawan_CV.pdf download filename', () => {
        // filename lives in the extracted useCvDownload hook
        const source = fs.readFileSync('src/hooks/use-cv-download.ts', 'utf-8');
        expect(source).toContain('Jefry_Kurniawan_CV.pdf');
    });

    it('source: globals.css declares --navbar-height and uses it for scroll-margin-top', () => {
        const css = fs.readFileSync('src/app/globals.css', 'utf-8');
        expect(css).toContain('--navbar-height');
        expect(css).toContain('scroll-margin-top: var(--navbar-height)');
    });

    it('source: globals.css contains overflow-x: clip defensive guard (not overflow-x: hidden)', () => {
        const css = fs.readFileSync('src/app/globals.css', 'utf-8');
        expect(css).toContain('overflow-x: clip');
        expect(css).not.toContain('overflow-x: hidden');
    });
});

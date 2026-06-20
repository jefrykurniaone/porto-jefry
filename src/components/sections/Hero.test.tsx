import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
    it('renders translated heading with name', () => {
        renderHero();
        expect(screen.getByText('Jefry Kurniawan')).toBeInTheDocument();
    });

    it('renders translated title', () => {
        renderHero();
        expect(screen.getByText('Backend Developer & .NET Specialist')).toBeInTheDocument();
    });

    it('renders profile image with translated alt text', () => {
        renderHero();
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('alt', 'Jefry Kurniawan — profile photo');
    });

    it('renders CV download sgds-button', () => {
        renderHero();
        const cvBtn = document.querySelector('sgds-button');
        expect(cvBtn).toBeInTheDocument();
        expect(cvBtn?.textContent).toMatch(/download|unduh|cv/i);
    });

    it('renders View My Work link', () => {
        renderHero();
        const workLink = document.querySelector('a[href="#projects"]');
        expect(workLink).toBeInTheDocument();
        expect(workLink?.textContent).toMatch(/view.*work/i);
    });

    it('clicking CV button triggers download fetch', async () => {
        renderHero();
        const user = userEvent.setup();
        const cvBtn = document.querySelector('sgds-button');
        expect(cvBtn).toBeTruthy();
        if (!cvBtn) return;
        await user.click(cvBtn);
        expect(fetchMock).toHaveBeenCalled();
    });

    it('prevents duplicate fetch while isDownloading is true', async () => {
        fetchMock = vi.fn().mockReturnValue(new Promise(() => {}));
        vi.stubGlobal('fetch', fetchMock);

        renderHero();
        const user = userEvent.setup();
        const cvBtn = document.querySelector('sgds-button')!;
        expect(cvBtn).toBeTruthy();

        await user.click(cvBtn);
        await user.click(cvBtn);

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('creates object URL and revokes URL on success', async () => {
        const createSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
        const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

        renderHero();
        const user = userEvent.setup();
        const cvBtn = document.querySelector('sgds-button')!;
        await user.click(cvBtn);

        await waitFor(() => {
            expect(createSpy).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(revokeSpy).toHaveBeenCalledWith('blob:mock');
        });
        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/api/generate-cv?')
        );

        createSpy.mockRestore();
        revokeSpy.mockRestore();
    });

    it('renders sgds-alert with role="alert" on failed CV download', async () => {
        const failedFetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
        });
        vi.stubGlobal('fetch', failedFetch);

        renderHero();
        const user = userEvent.setup();
        const cvBtn = document.querySelector('sgds-button')!;
        await user.click(cvBtn);

        await waitFor(() => {
            const alert = document.querySelector('sgds-alert');
            expect(alert).toBeInTheDocument();
        });
    });

    it('error alert paragraph has aria-live="polite" with HTTP status text', async () => {
        const failedFetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
        });
        vi.stubGlobal('fetch', failedFetch);

        renderHero();
        const user = userEvent.setup();
        const cvBtn = document.querySelector('sgds-button')!;
        await user.click(cvBtn);

        await waitFor(() => {
            const liveRegion = document.querySelector('[aria-live="polite"]');
            expect(liveRegion).toBeInTheDocument();
            expect(liveRegion?.textContent).toMatch(/failed|gagal|error/i);
        });
    });

    it('error alert auto-dismisses after 5 seconds', async () => {
        const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
        const failedFetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
        });
        vi.stubGlobal('fetch', failedFetch);

        renderHero();
        const user = userEvent.setup();
        const cvBtn = document.querySelector('sgds-button')!;
        await user.click(cvBtn);

        await screen.findByText(/failed|gagal/i);
        expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
        setTimeoutSpy.mockRestore();
    });

    it('source contains sgds-button and sgds-alert', () => {
        const source = fs.readFileSync('src/components/sections/Hero.tsx', 'utf-8');
        expect(source).toContain('sgds-button');
        expect(source).toContain('sgds-alert');
    });

    it('source contains no dark: utility', () => {
        const source = fs.readFileSync('src/components/sections/Hero.tsx', 'utf-8');
        expect(source).not.toContain('dark:');
    });

    it('source uses Jefry_Kurniawan_CV.pdf download filename', () => {
        // filename lives in the extracted useCvDownload hook
        const source = fs.readFileSync('src/hooks/use-cv-download.ts', 'utf-8');
        expect(source).toContain("Jefry_Kurniawan_CV.pdf");
    });

    it('source contains no next-themes import', () => {
        const source = fs.readFileSync('src/components/sections/Hero.tsx', 'utf-8');
        expect(source).not.toContain('next-themes');
        expect(source).not.toContain('useTheme');
    });
});

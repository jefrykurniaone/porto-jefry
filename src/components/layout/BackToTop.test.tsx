import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import BackToTop from './BackToTop';

// Helper to create a controllable IntersectionObserver mock
type IOCallback = (entries: IntersectionObserverEntry[]) => void;

function makeEntry(isIntersecting: boolean, top: number): IntersectionObserverEntry {
    return {
        isIntersecting,
        boundingClientRect: { top, bottom: 0, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) },
        intersectionRatio: isIntersecting ? 1 : 0,
        intersectionRect: { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) },
        rootBounds: null,
        target: document.createElement('div'),
        time: 0,
    } as unknown as IntersectionObserverEntry;
}

let ioCallback: IOCallback | null = null;
let ioDisconnect: ReturnType<typeof vi.fn>;
let ioObserve: ReturnType<typeof vi.fn>;

function setupIOmock() {
    ioCallback = null;
    ioDisconnect = vi.fn();
    ioObserve = vi.fn();

    function MockIntersectionObserver(this: unknown, cb: IOCallback) {
        ioCallback = cb;
        (this as Record<string, unknown>).observe = ioObserve;
        (this as Record<string, unknown>).disconnect = ioDisconnect;
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
}

function triggerIO(isIntersecting: boolean, top: number) {
    act(() => {
        ioCallback?.([makeEntry(isIntersecting, top)]);
    });
}

describe('BackToTop (no #about element)', () => {
    beforeEach(setupIOmock);
    afterEach(() => vi.unstubAllGlobals());

    it('renders nothing when #about is not in DOM (observer never fires)', () => {
        render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <BackToTop />
            </NextIntlClientProvider>,
        );
        // When no #about, observer isn't created, visible stays false → null render
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});

describe('BackToTop', () => {
    let aboutEl: HTMLDivElement;
    let scrollToMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        aboutEl = document.createElement('div');
        aboutEl.id = 'about';
        document.body.appendChild(aboutEl);

        scrollToMock = vi.fn();
        vi.stubGlobal('scrollTo', scrollToMock);
        setupIOmock();
    });

    afterEach(() => {
        aboutEl.remove();
        vi.unstubAllGlobals();
    });

    it('renders nothing while hidden (no button in DOM when visible=false)', () => {
        render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <BackToTop />
            </NextIntlClientProvider>,
        );
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('button is not tabbable while hidden (no element rendered)', () => {
        const { container } = render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <BackToTop />
            </NextIntlClientProvider>,
        );
        // No button exists in the DOM while hidden (conditional render returns null)
        expect(container.innerHTML).toBe('');
        // Could also verify no button in the rendered output
        expect(container.querySelector('button')).not.toBeInTheDocument();
    });

    it('button becomes visible when About is above viewport (scrolled past)', () => {
        render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <BackToTop />
            </NextIntlClientProvider>,
        );
        // About is above viewport → visible becomes true → button renders
        triggerIO(false, -200);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveAttribute('aria-label');
    });

    it('button is hidden again when About comes back into view', () => {
        render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <BackToTop />
            </NextIntlClientProvider>,
        );
        triggerIO(false, -200); // scrolled past → visible
        expect(screen.getByRole('button')).toBeInTheDocument();
        triggerIO(true, 0); // back in view → hidden
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('clicking the visible button calls scrollTo', async () => {
        render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <BackToTop />
            </NextIntlClientProvider>,
        );
        triggerIO(false, -200);
        const user = userEvent.setup();
        await user.click(screen.getByRole('button'));
        expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('observer is disconnected on unmount', () => {
        const { unmount } = render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <BackToTop />
            </NextIntlClientProvider>,
        );
        unmount();
        expect(ioDisconnect).toHaveBeenCalled();
    });
});

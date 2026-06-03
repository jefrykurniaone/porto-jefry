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

    it('renders without crashing when #about is not in DOM', () => {
        render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <BackToTop />
            </NextIntlClientProvider>,
        );
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
});

function renderBackToTop() {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <BackToTop />
        </NextIntlClientProvider>,
    );
}

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

    it('renders a button with aria-label', () => {
        renderBackToTop();
        expect(screen.getByRole('button')).toHaveAttribute('aria-label');
    });

    it('button is hidden (opacity-0) on initial render', () => {
        renderBackToTop();
        expect(screen.getByRole('button').className).toContain('opacity-0');
    });

    it('button is hidden when About is below viewport (not yet scrolled to)', () => {
        renderBackToTop();
        // About is below viewport: isIntersecting=false, top > 0
        triggerIO(false, 300);
        expect(screen.getByRole('button').className).toContain('opacity-0');
    });

    it('button becomes visible when About is above viewport (scrolled past)', () => {
        renderBackToTop();
        // About is above viewport: isIntersecting=false, top < 0
        triggerIO(false, -200);
        expect(screen.getByRole('button').className).toContain('opacity-100');
    });

    it('button hides again when user scrolls back up to About section', () => {
        renderBackToTop();
        triggerIO(false, -200); // scrolled past
        expect(screen.getByRole('button').className).toContain('opacity-100');
        triggerIO(true, 0); // About back in view
        expect(screen.getByRole('button').className).toContain('opacity-0');
    });

    it('clicking the button calls scrollTo', async () => {
        renderBackToTop();
        triggerIO(false, -200);
        const user = userEvent.setup();
        await user.click(screen.getByRole('button'));
        expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('observer is disconnected on unmount', () => {
        const { unmount } = renderBackToTop();
        unmount();
        expect(ioDisconnect).toHaveBeenCalled();
    });
});


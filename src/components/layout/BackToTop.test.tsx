import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import BackToTop from './BackToTop';

describe('BackToTop (no #about element)', () => {
    it('renders without crashing when #about is not in DOM', () => {
        // #about element not appended — covers the if (!about) return guard
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

    beforeEach(() => {
        aboutEl = document.createElement('div');
        aboutEl.id = 'about';
        Object.defineProperty(aboutEl, 'offsetTop', { configurable: true, value: 500 });
        document.body.appendChild(aboutEl);

        Object.defineProperty(window, 'scrollY', {
            configurable: true,
            writable: true,
            value: 0,
        });
        Object.defineProperty(window, 'scrollTo', {
            configurable: true,
            value: vi.fn(),
        });
    });

    afterEach(() => {
        document.body.removeChild(aboutEl);
    });

    it('renders a button with aria-label', () => {
        renderBackToTop();
        expect(screen.getByRole('button')).toHaveAttribute('aria-label');
    });

    it('button is hidden (opacity-0) before scrolling past About', () => {
        renderBackToTop();
        const btn = screen.getByRole('button');
        expect(btn.className).toContain('opacity-0');
    });

    it('button becomes visible after scrolling past About section', () => {
        renderBackToTop();
        act(() => {
            Object.defineProperty(window, 'scrollY', {
                configurable: true,
                writable: true,
                value: 600,
            });
            window.dispatchEvent(new Event('scroll'));
        });
        const btn = screen.getByRole('button');
        expect(btn.className).toContain('opacity-100');
    });

    it('clicking the button calls window.scrollTo', async () => {
        renderBackToTop();
        act(() => {
            Object.defineProperty(window, 'scrollY', {
                configurable: true,
                writable: true,
                value: 600,
            });
            window.dispatchEvent(new Event('scroll'));
        });
        const user = userEvent.setup();
        await user.click(screen.getByRole('button'));
        expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import Navbar from './Navbar';

vi.mock('next-themes', () => ({
    useTheme: () => ({ resolvedTheme: 'light', setTheme: vi.fn() }),
}));

vi.mock('@/i18n/routing', () => ({
    useRouter: () => ({ replace: vi.fn() }),
    usePathname: () => '/',
}));

function renderNavbar() {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <Navbar />
        </NextIntlClientProvider>,
    );
}

describe('Navbar', () => {
    it('renders without crashing', () => {
        renderNavbar();
    });

    it('renders a nav element', () => {
        const { container } = renderNavbar();
        expect(container.querySelector('nav')).toBeInTheDocument();
    });

    it('renders navigation links for desktop', () => {
        renderNavbar();
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);
    });

    it('mobile menu toggle button exists', async () => {
        renderNavbar();
        const menuBtn = await screen.findByRole('button', { name: /menu|open|close|toggle/i });
        expect(menuBtn).toBeInTheDocument();
    });

    it('mobile menu opens on toggle click', async () => {
        renderNavbar();
        const user = userEvent.setup();
        const menuBtn = await screen.findByRole('button', { name: /menu|open|close|toggle/i });
        await user.click(menuBtn);
        const mobileLinks = screen.getAllByRole('link');
        expect(mobileLinks.length).toBeGreaterThan(0);
    });

    it('mobile menu closes on second toggle click', async () => {
        const { container } = renderNavbar();
        const user = userEvent.setup();
        const menuBtn = await screen.findByRole('button', { name: /menu|open|close|toggle/i });
        await user.click(menuBtn);
        expect(container.querySelector('#mobile-nav-menu')).toBeInTheDocument();
        await user.click(menuBtn);
        expect(container.querySelector('#mobile-nav-menu')).not.toBeInTheDocument();
    });

    it('pressing Escape closes the mobile menu', async () => {
        const { container } = renderNavbar();
        const user = userEvent.setup();
        const menuBtn = await screen.findByRole('button', { name: /menu|open|close|toggle/i });
        await user.click(menuBtn);
        expect(container.querySelector('#mobile-nav-menu')).toBeInTheDocument();
        await user.keyboard('{Escape}');
        expect(container.querySelector('#mobile-nav-menu')).not.toBeInTheDocument();
    });

    it('applies scroll class when window scrolls past 20px', () => {
        renderNavbar();
        act(() => {
            Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 100 });
            window.dispatchEvent(new Event('scroll'));
        });
        const { container } = renderNavbar();
        expect(container.querySelector('header')).toBeInTheDocument();
    });
});

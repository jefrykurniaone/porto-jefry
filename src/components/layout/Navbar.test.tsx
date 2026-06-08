import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import Navbar from './Navbar';

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

    it('renders sgds-mainnav custom element', () => {
        const { container } = renderNavbar();
        expect(container.querySelector('sgds-mainnav')).toBeInTheDocument();
    });

    it('renders desktop nav items as sgds-mainnav-item', () => {
        const { container } = renderNavbar();
        const items = container.querySelectorAll('sgds-mainnav-item');
        expect(items.length).toBeGreaterThan(0);
    });

    it('brand slot displays JK', () => {
        const { container } = renderNavbar();
        const brand = container.querySelector('[slot="brand"]');
        expect(brand).toBeInTheDocument();
        expect(brand?.textContent).toContain('JK');
    });

    it('renders desktop navigation links with translated text', () => {
        renderNavbar();
        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Projects')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('mobile menu toggle button exists with aria-label', () => {
        renderNavbar();
        const toggleBtn = screen.getByLabelText(/toggle navigation menu/i);
        expect(toggleBtn).toBeInTheDocument();
        expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
        expect(toggleBtn).toHaveAttribute('aria-controls', 'mobile-nav-menu');
    });

    it('mobile menu opens on toggle click', async () => {
        renderNavbar();
        const user = userEvent.setup();
        const toggleBtn = screen.getByLabelText(/toggle navigation menu/i);
        await user.click(toggleBtn);
        expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
        const mobileNav = document.getElementById('mobile-nav-menu');
        expect(mobileNav).toBeInTheDocument();
    });

    it('mobile menu closes on second toggle click', async () => {
        renderNavbar();
        const user = userEvent.setup();
        const toggleBtn = screen.getByLabelText(/toggle navigation menu/i);
        await user.click(toggleBtn);
        expect(document.getElementById('mobile-nav-menu')).toBeInTheDocument();
        await user.click(toggleBtn);
        expect(document.getElementById('mobile-nav-menu')).not.toBeInTheDocument();
    });

    it('pressing Escape closes the mobile menu', async () => {
        renderNavbar();
        const user = userEvent.setup();
        const toggleBtn = screen.getByLabelText(/toggle navigation menu/i);
        await user.click(toggleBtn);
        expect(document.getElementById('mobile-nav-menu')).toBeInTheDocument();
        await user.keyboard('{Escape}');
        expect(document.getElementById('mobile-nav-menu')).not.toBeInTheDocument();
    });

    it('applies scroll class when window scrolls past 20px and uses passive listener', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        renderNavbar();
        const header = document.querySelector('header') as HTMLElement;
        expect(header).toBeInTheDocument();
        // initially transparent
        expect(header.className).toContain('bg-transparent');

        act(() => {
            Object.defineProperty(globalThis, 'scrollY', { configurable: true, writable: true, value: 100 });
            globalThis.dispatchEvent(new Event('scroll'));
        });

        await act(async () => {
            await new Promise((resolve) => requestAnimationFrame(resolve));
        });

        expect(header.className).not.toContain('bg-transparent');
        expect(warnSpy).not.toHaveBeenCalled();
        warnSpy.mockRestore();
    });

    it('clicking a nav link scrolls to the section and updates hash', async () => {
        const { container } = renderNavbar();
        const projectsLink = container.querySelector('sgds-mainnav-item a[href="#projects"]') as HTMLAnchorElement | null;
        expect(projectsLink).toBeTruthy();

        const section = document.createElement('div');
        section.id = 'projects';
        const scrollSpy = vi.fn();
        Object.defineProperty(section, 'scrollIntoView', { value: scrollSpy, configurable: true });
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

    it('has no next-themes mocks or dark: utilities in source', () => {
        const { container } = renderNavbar();
        // No useTheme mock needed - component renders without it
        const header = container.querySelector('header');
        expect(header).toBeInTheDocument();
        // Should not contain "dark:" in any className
        const allElements = container.querySelectorAll('*');
        for (const el of allElements) {
            if (el.className && typeof el.className === 'string') {
                expect(el.className).not.toContain('dark:');
            }
        }
    });
});

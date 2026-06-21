import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, within } from '@testing-library/react';
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

    it('sgds-mainnav uses expand="always" so SGDS does not render its own mobile toggler', () => {
        // expand="always" disables SGDS's native collapse/toggler; mobile behavior is
        // handled by our custom MobileDrawer + CSS hiding, not the SGDS navbar-collapse.
        const { container } = renderNavbar();
        const nav = container.querySelector('sgds-mainnav');
        expect(nav).toHaveAttribute('expand', 'always');
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

    it('inline-nav wrapper has overflow-x-auto class', () => {
        const { container } = renderNavbar();
        const wrapper = container.querySelector('[data-testid="inline-nav-wrapper"]');
        expect(wrapper).toBeInTheDocument();
        expect(wrapper?.className).toContain('overflow-x-auto');
    });

    it('inline-nav wrapper grows into middle space and centers links while preserving overflow-x scroll fallback', () => {
        // NAVBAL-01/02: wrapper must carry a flex-grow utility so it expands into the
        // dead gap between the brand and controls; justify-center centers the links
        // horizontally and items-center keeps them vertically level with the brand and
        // the slot-end controls (the shadow .navbar-nav row stretches slots by default).
        // NAVBAL-03 / NAV-05: overflow-x-auto must coexist with growing so the centered
        // cluster still scrolls horizontally when the 7 links do not all fit.
        const { container } = renderNavbar();
        const wrapper = container.querySelector('[data-testid="inline-nav-wrapper"]');
        expect(wrapper).toBeInTheDocument();
        expect(wrapper?.className).toContain('flex-1');
        expect(wrapper?.className).toContain('items-center');
        expect(wrapper?.className).toContain('justify-center');
        expect(wrapper?.className).toContain('overflow-x-auto');
    });

    it('renders inline nav links with translated text', () => {
        const { container } = renderNavbar();
        const inlineWrapper = container.querySelector('[data-testid="inline-nav-wrapper"]');
        expect(inlineWrapper).toBeInTheDocument();
        expect(within(inlineWrapper as HTMLElement).getByText('About')).toBeInTheDocument();
        expect(within(inlineWrapper as HTMLElement).getByText('Projects')).toBeInTheDocument();
        expect(within(inlineWrapper as HTMLElement).getByText('Contact')).toBeInTheDocument();
    });

    it('hamburger button exists with aria-label', () => {
        renderNavbar();
        const toggleBtn = screen.getByLabelText(/toggle navigation menu/i);
        expect(toggleBtn).toBeInTheDocument();
        expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
        expect(toggleBtn.className).toContain('md:hidden');
    });

    it('drawer is absent from DOM when closed', () => {
        renderNavbar();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('hamburger click opens drawer with all 7 section labels and close button', async () => {
        renderNavbar();
        const user = userEvent.setup();
        await user.click(screen.getByLabelText(/toggle navigation menu/i));
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(within(dialog).getByText('About')).toBeInTheDocument();
        expect(within(dialog).getByText('Experience')).toBeInTheDocument();
        expect(within(dialog).getByText('Education')).toBeInTheDocument();
        expect(within(dialog).getByText('Skills')).toBeInTheDocument();
        expect(within(dialog).getByText('Projects')).toBeInTheDocument();
        expect(within(dialog).getByText('Certifications')).toBeInTheDocument();
        expect(within(dialog).getByText('Contact')).toBeInTheDocument();
        expect(within(dialog).getByLabelText('Close menu')).toBeInTheDocument();
    });

    it('close button inside drawer closes the drawer and returns focus to the hamburger', async () => {
        renderNavbar();
        const user = userEvent.setup();
        const toggleBtn = screen.getByLabelText(/toggle navigation menu/i);
        await user.click(toggleBtn);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await user.click(screen.getByLabelText('Close menu'));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(document.activeElement).toBe(toggleBtn);
    });

    it('clicking the backdrop closes the drawer and returns focus to the hamburger', async () => {
        renderNavbar();
        const user = userEvent.setup();
        const toggleBtn = screen.getByLabelText(/toggle navigation menu/i);
        await user.click(toggleBtn);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await user.click(screen.getByTestId('drawer-backdrop'));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(document.activeElement).toBe(toggleBtn);
    });

    it('clicking a drawer link calls scrollIntoView, pushState, and closes the drawer', async () => {
        renderNavbar();
        const user = userEvent.setup();

        const section = document.createElement('div');
        section.id = 'projects';
        const scrollSpy = vi.fn();
        Object.defineProperty(section, 'scrollIntoView', { value: scrollSpy, configurable: true });
        document.body.appendChild(section);
        const pushSpy = vi.spyOn(history, 'pushState');

        const toggleBtn = screen.getByLabelText(/toggle navigation menu/i);
        await user.click(toggleBtn);
        const dialog = screen.getByRole('dialog');
        await user.click(within(dialog).getByRole('link', { name: 'Projects' }));

        expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' });
        expect(pushSpy).toHaveBeenCalledWith(null, '', '#projects');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(document.activeElement).toBe(toggleBtn);

        section.remove();
        pushSpy.mockRestore();
    });

    it('pressing Escape closes the drawer and returns focus to the hamburger', async () => {
        renderNavbar();
        const user = userEvent.setup();
        const toggleBtn = screen.getByLabelText(/toggle navigation menu/i);
        await user.click(toggleBtn);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await user.keyboard('{Escape}');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(document.activeElement).toBe(toggleBtn);
    });

    it('applies scroll class when window scrolls past 20px', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        renderNavbar();
        const header = document.querySelector('header') as HTMLElement;
        expect(header).toBeInTheDocument();
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

    it('clicking a desktop nav link scrolls to section and updates hash', async () => {
        const { container } = renderNavbar();
        const projectsLink = container.querySelector(
            '[data-testid="inline-nav-wrapper"] a[href="#projects"]'
        ) as HTMLAnchorElement | null;
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
        pushSpy.mockRestore();
    });

    it('has no dark: utilities in navbar source', () => {
        const { container } = renderNavbar();
        const header = container.querySelector('header');
        expect(header).toBeInTheDocument();
        const allElements = Array.from(container.querySelectorAll('*'));
        for (const el of allElements) {
            if (el.className && typeof el.className === 'string') {
                expect(el.className).not.toContain('dark:');
            }
        }
    });
});

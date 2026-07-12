import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import Navbar, { NAV_KEYS } from './Navbar';

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
    it('renders the JK_ logo linking back to the hero', () => {
        const { container } = renderNavbar();
        const logo = container.querySelector('a.site-nav__logo');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('href', '#hero');
        expect(logo?.textContent).toBe('JK_');
    });

    it('exposes six nav sections in design order (no certifications)', () => {
        expect(NAV_KEYS).toEqual([
            'about',
            'experience',
            'skills',
            'projects',
            'education',
            'contact',
        ]);
    });

    it('renders desktop nav links with translated text and hash hrefs', () => {
        const { container } = renderNavbar();
        const wrapper = container.querySelector('.site-nav__links') as HTMLElement;
        expect(wrapper).toBeInTheDocument();
        for (const key of NAV_KEYS) {
            const label = messages.nav[key as keyof typeof messages.nav];
            const link = within(wrapper).getByText(label);
            expect(link).toHaveAttribute('href', `#${key}`);
        }
    });

    it('renders theme and language controls', async () => {
        renderNavbar();
        expect(screen.getByRole('group', { name: /switch language/i })).toBeInTheDocument();
        expect(
            await screen.findByRole('button', { name: /switch to (light|dark) mode/i }),
        ).toBeInTheDocument();
    });

    it('hamburger button exists with aria-label and closed state', () => {
        renderNavbar();
        const toggleBtn = screen.getByLabelText(/toggle navigation menu/i);
        expect(toggleBtn).toBeInTheDocument();
        expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
    });

    it('drawer is absent from DOM when closed', () => {
        renderNavbar();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('hamburger click opens drawer with all section labels and close button', async () => {
        renderNavbar();
        const user = userEvent.setup();
        await user.click(screen.getByLabelText(/toggle navigation menu/i));
        const dialog = screen.getByRole('dialog');
        for (const key of NAV_KEYS) {
            const label = messages.nav[key as keyof typeof messages.nav];
            expect(within(dialog).getByText(label)).toBeInTheDocument();
        }
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

    it('clicking a desktop nav link scrolls to section and updates hash', async () => {
        const { container } = renderNavbar();
        const projectsLink = container.querySelector(
            '.site-nav__links a[href="#projects"]',
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
});

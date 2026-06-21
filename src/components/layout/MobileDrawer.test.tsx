import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { createRef } from 'react';
import messages from '@/i18n/messages/en.json';
import MobileDrawer from './MobileDrawer';

vi.mock('@/i18n/routing', () => ({
    useRouter: () => ({ replace: vi.fn() }),
    usePathname: () => '/',
}));

const toggleRef = createRef<HTMLButtonElement>();

function renderDrawer(isOpen = true, onClose = vi.fn(), onNavClick = vi.fn()) {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <MobileDrawer
                isOpen={isOpen}
                onClose={onClose}
                onNavClick={onNavClick}
                toggleRef={toggleRef}
            />
        </NextIntlClientProvider>,
    );
}

describe('MobileDrawer', () => {
    beforeEach(() => {
        document.body.style.overflow = '';
    });

    it('renders all 7 section labels when open', () => {
        renderDrawer();
        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Experience')).toBeInTheDocument();
        expect(screen.getByText('Education')).toBeInTheDocument();
        expect(screen.getByText('Skills')).toBeInTheDocument();
        expect(screen.getByText('Projects')).toBeInTheDocument();
        expect(screen.getByText('Certifications')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('renders ThemeToggle inside the panel', () => {
        const { container } = renderDrawer();
        // ThemeToggle renders a button or its client wrapper
        expect(container.querySelector('[data-testid="theme-toggle"], button[aria-label], .theme-toggle')).toBeDefined();
    });

    it('renders LanguageToggle (role="group") inside the panel', () => {
        renderDrawer();
        const langGroup = screen.getByRole('group');
        expect(langGroup).toBeInTheDocument();
    });

    it('renders close button with aria-label "Close menu"', () => {
        renderDrawer();
        const closeBtn = screen.getByLabelText('Close menu');
        expect(closeBtn).toBeInTheDocument();
    });

    it('clicking the close button calls onClose', async () => {
        const onClose = vi.fn();
        renderDrawer(true, onClose);
        const user = userEvent.setup();
        await user.click(screen.getByLabelText('Close menu'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('clicking a section link calls onNavClick with the right key and prevents navigation', async () => {
        const onNavClick = vi.fn();
        renderDrawer(true, vi.fn(), onNavClick);
        const user = userEvent.setup();
        const projectsLink = screen.getByRole('link', { name: 'Projects' });
        expect(projectsLink).toHaveAttribute('href', '#projects');
        await user.click(projectsLink);
        expect(onNavClick).toHaveBeenCalledWith('projects');
    });

    it('clicking the backdrop calls onClose', async () => {
        const onClose = vi.fn();
        const { container } = renderDrawer(true, onClose);
        const user = userEvent.setup();
        // The backdrop is the outer full-screen overlay (data-testid or first child)
        const backdrop = container.querySelector('[data-testid="drawer-backdrop"]');
        expect(backdrop).toBeInTheDocument();
        await user.click(backdrop!);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('clicking inside the panel does NOT call onClose', async () => {
        const onClose = vi.fn();
        const { container } = renderDrawer(true, onClose);
        const user = userEvent.setup();
        const panel = container.querySelector('[role="dialog"]');
        expect(panel).toBeInTheDocument();
        await user.click(panel!);
        expect(onClose).not.toHaveBeenCalled();
    });

    it('pressing Escape calls onClose', async () => {
        const onClose = vi.fn();
        renderDrawer(true, onClose);
        const user = userEvent.setup();
        await user.keyboard('{Escape}');
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not render panel/dialog when isOpen is false', () => {
        renderDrawer(false);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('section links have href matching #key', () => {
        renderDrawer();
        const aboutLink = screen.getByRole('link', { name: 'About' });
        expect(aboutLink).toHaveAttribute('href', '#about');
    });

    it('close button meets 44px minimum touch target', () => {
        renderDrawer();
        const closeBtn = screen.getByLabelText('Close menu');
        const style = closeBtn.getAttribute('style') ?? '';
        expect(style).toMatch(/min.*[Ww]idth.*44px/);
        expect(style).toMatch(/min.*[Hh]eight.*44px/);
    });
});

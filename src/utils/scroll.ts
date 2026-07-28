export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Read at call time rather than cached: the OS setting can change mid-session,
 * and every caller here runs in response to a click, so there is no cost to
 * asking again. Falls back to false where matchMedia is missing (SSR, old
 * WebViews) — the animated path is the safe default there.
 */
export function prefersReducedMotion(): boolean {
    return globalThis.matchMedia?.(REDUCED_MOTION_QUERY).matches ?? false;
}

function scrollBehavior(): ScrollBehavior {
    return prefersReducedMotion() ? 'auto' : 'smooth';
}

/**
 * Scrolls a section into view and records it in the URL, honouring the visitor's
 * reduced-motion preference. `globals.css` sets `scroll-behavior: smooth` on
 * <html> and turns it off under the same query; passing an explicit behavior
 * here covers the programmatic path, which that declaration does not reach.
 */
export function scrollToSection(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior() });
    history.pushState(null, '', `#${id}`);
}

export function scrollToTop(): void {
    globalThis.scrollTo({ top: 0, behavior: scrollBehavior() });
}

/**
 * Read rather than hardcoded: `--navbar-height` is the single source of truth
 * for the fixed bar's footprint, and CLAUDE.md forbids duplicating the 64px.
 */
function navbarHeight(): number {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(
        '--navbar-height',
    );
    return Number.parseInt(raw, 10) || 64;
}

/**
 * The section currently under the navbar line, or undefined above the first one.
 *
 * `ids` is in document order, so the last section whose top has passed the line
 * is the one being read. Used by the language toggle to carry the reading
 * position across a locale change instead of dropping the visitor at the top.
 */
export function currentSectionId(ids: readonly string[]): string | undefined {
    const line = navbarHeight() + 1;
    let current: string | undefined;
    for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line) current = id;
    }
    return current;
}

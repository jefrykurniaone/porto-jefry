import '@testing-library/jest-dom';

/**
 * Tag names that SGDS migration plans 05-02 through 05-07 use in components.
 * Register each tag only when `customElements.get(tag)` is absent so Vitest
 * can render direct `<sgds-*>` JSX without unknown-element warnings.
 *
 * Note: jsdom requires a unique constructor per custom-element tag name,
 * so each tag gets its own anonymous HTMLElement subclass.
 */
const SGDS_TEST_TAGS = [
    'sgds-button',
    'sgds-icon-button',
    'sgds-mainnav',
    'sgds-mainnav-item',
    'sgds-card',
    'sgds-badge',
    'sgds-alert',
    'sgds-icon',
    'sgds-link',
    'sgds-footer',
    'sgds-icon-card',
] as const;

for (const tag of SGDS_TEST_TAGS) {
    if (!customElements.get(tag)) {
        customElements.define(
            tag,
            class extends HTMLElement {
                constructor() {
                    super();
                }
            },
        );
    }
}

afterEach(() => {
    document.documentElement.classList.remove('sgds-night-theme');
    localStorage.clear();
});

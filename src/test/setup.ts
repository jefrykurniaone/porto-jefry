import '@testing-library/jest-dom';

/** Minimal HTMLElement subclass for registering SGDS custom-element tags in jsdom. */
class SgdsTestElement extends HTMLElement {
    constructor() {
        super();
    }
}

/**
 * Tag names that SGDS migration plans 05-02 through 05-07 use in components.
 * Register each tag only when `customElements.get(tag)` is absent so Vitest
 * can render direct `<sgds-*>` JSX without unknown-element warnings.
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
        customElements.define(tag, SgdsTestElement);
    }
}

afterEach(() => {
    document.documentElement.classList.remove('sgds-night-theme');
    localStorage.clear();
});

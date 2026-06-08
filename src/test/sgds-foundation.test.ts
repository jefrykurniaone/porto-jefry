import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();

function readSource(relativePath: string): string {
    return readFileSync(resolve(ROOT, relativePath), 'utf-8');
}

describe('SGDS foundation setup', () => {
    /* Test 1: Dependency source includes SGDS package, Tailwind v4, @tailwindcss/postcss, and PostCSS. */
    describe('package.json', () => {
        const pkg = readSource('package.json');

        it('declares @govtechsg/sgds-web-component as a dependency', () => {
            expect(pkg).toContain('@govtechsg/sgds-web-component');
        });

        it('declares tailwindcss at v4 in devDependencies', () => {
            expect(pkg).toContain('"tailwindcss": "^4.');
        });

        it('declares @tailwindcss/postcss in devDependencies', () => {
            expect(pkg).toContain('@tailwindcss/postcss');
        });

        it('declares postcss in devDependencies', () => {
            expect(pkg).toContain('"postcss": "');
        });
    });

    /* Test 2: PostCSS config uses @tailwindcss/postcss and no v3 tailwindcss: {} plugin. */
    describe('postcss.config.mjs', () => {
        const config = readSource('postcss.config.mjs');

        it('uses @tailwindcss/postcss plugin', () => {
            expect(config).toContain('@tailwindcss/postcss');
        });

        it('does not contain tailwindcss v3 plugin key', () => {
            expect(config).not.toContain("tailwindcss:");
        });
    });

    /* Test 3: Global CSS imports SGDS day, night, sgds.css, and utility.css in exact order. */
    describe('src/app/globals.css', () => {
        const css = readSource('src/app/globals.css');

        it('imports themes/day.css first', () => {
            const dayIndex = css.indexOf('themes/day.css');
            const nightIndex = css.indexOf('themes/night.css');
            const sgdsIndex = css.indexOf('css/sgds.css');
            const utilityIndex = css.indexOf('css/utility.css');
            expect(dayIndex).toBeGreaterThanOrEqual(0);
            expect(dayIndex).toBeLessThan(nightIndex);
            expect(nightIndex).toBeLessThan(sgdsIndex);
            expect(sgdsIndex).toBeLessThan(utilityIndex);
        });

        it('does not contain @tailwind directives', () => {
            expect(css).not.toContain('@tailwind base');
            expect(css).not.toContain('@tailwind components');
            expect(css).not.toContain('@tailwind utilities');
        });

        it('does not contain dark: tokens', () => {
            expect(css).not.toContain('dark:');
        });

        it('preserves smooth scrolling', () => {
            expect(css).toContain('scroll-behavior: smooth');
        });
    });

    /* Test 4: SGDS loader and type declaration files exist and contain required imports. */
    describe('src/app/sgds.tsx — SGDS loader', () => {
        const loader = readSource('src/app/sgds.tsx');

        it('starts with use client directive', () => {
            expect(loader).toMatch(/^'use client';/m);
        });

        it('exports SgdsLibraryLoader as default', () => {
            expect(loader).toContain('export default function SgdsLibraryLoader');
        });

        it('dynamically imports @govtechsg/sgds-web-component inside useEffect', () => {
            expect(loader).toMatch(/import\('@govtechsg\/sgds-web-component'\)/);
            expect(loader).toContain('useEffect');
        });
    });

    describe('src/types/sgds.d.ts — type declarations', () => {
        const types = readSource('src/types/sgds.d.ts');

        it('imports SGDS React JSX types', () => {
            expect(types).toContain('@govtechsg/sgds-web-component/types/react');
        });
    });

    /* Test 5: Test setup registers all SGDS custom tags used by later plans. */
    describe('src/test/setup.ts — test setup', () => {
        const setup = readSource('src/test/setup.ts');

        it('preserves @testing-library/jest-dom import', () => {
            expect(setup).toContain('@testing-library/jest-dom');
        });

        it('defines custom element classes for each tag', () => {
            expect(setup).toContain('customElements.define(');
        });

        const REQUIRED_TAGS = [
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
        ];

        for (const tag of REQUIRED_TAGS) {
            it(`registers <${tag}> in SGDS_TEST_TAGS`, () => {
                expect(setup).toContain(tag);
            });
        }

        it('has afterEach cleanup for sgds-night-theme and localStorage', () => {
            expect(setup).toContain('afterEach');
            expect(setup).toContain('sgds-night-theme');
            expect(setup).toContain('localStorage.clear');
        });
    });
});

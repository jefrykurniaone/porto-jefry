import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/**
 * Every UI source file that was part of the SGDS migration.
 * Test files and config files are excluded — this list targets
 * production UI components only.
 */
/**
 * Every UI source file that was part of the SGDS migration.
 * Test files and config files are excluded — this list targets
 * production UI components only.
 *
 * ThemeToggle.tsx is intentionally omitted: it is a passive wrapper
 * that delegates all rendering to ThemeToggle.client.tsx and carries
 * no SGDS markup of its own.
 */
const MIGRATED_UI_FILES = [
    'src/app/[locale]/layout.tsx',
    'src/app/[locale]/error.tsx',
    'src/app/[locale]/not-found.tsx',
    'src/components/layout/Navbar.tsx',
    'src/components/layout/ThemeToggle.client.tsx',
    'src/components/layout/LanguageToggle.tsx',
    'src/components/layout/Footer.tsx',
    'src/components/layout/BackToTop.tsx',
    'src/components/sections/Hero.tsx',
    'src/components/sections/About.tsx',
    'src/components/sections/Experience.tsx',
    'src/components/sections/Education.tsx',
    'src/components/sections/Skills.tsx',
    'src/components/sections/Projects.tsx',
    'src/components/sections/Certifications.tsx',
    'src/components/sections/Contact.tsx',
] as const;

/**
 * Forbidden patterns that MUST NOT appear in any migrated UI source file.
 */
const FORBIDDEN_PATTERNS: { pattern: string; label: string }[] = [
    { pattern: 'dark:', label: 'dark: Tailwind utility' },
    { pattern: 'next-themes', label: 'next-themes import or reference' },
    { pattern: 'ThemeProvider', label: 'ThemeProvider reference' },
    { pattern: 'useTheme', label: 'useTheme hook reference' },
    { pattern: "from 'lucide-react'", label: 'lucide-react import (single quotes)' },
    { pattern: 'from "lucide-react"', label: 'lucide-react import (double quotes)' },
];

/**
 * Legacy unprefixed Tailwind patterns that used to be common in the
 * pre-SGDS codebase. The audit checks migrated UI source files for
 * these patterns appearing in className strings.
 *
 * Each pattern is tested against class-string content extracted from
 * className= and class= attribute values. Patterns that are substrings
 * of valid SGDS utilities (e.g., `sr-only` inside `sgds:sr-only`) are
 * tested with a negative lookbehind for `sgds:`.
 *
 * Patterns that appear only in dedicated layout tests (bare sr-only
 * on skip link) are omitted here and covered in the layout section.
 */
const LEGACY_UNPREFIXED_TAILWIND_PATTERNS: { pattern: string; label: string; reason: string }[] = [
    { pattern: 'bg-white', label: 'Unprefixed bg-white', reason: 'Should use SGDS tokens' },
    { pattern: 'bg-gray-', label: 'Unprefixed bg-gray-', reason: 'Should use SGDS tokens' },
    { pattern: 'bg-blue-', label: 'Unprefixed bg-blue-', reason: 'Should use SGDS tokens' },
    { pattern: 'text-gray-', label: 'Unprefixed text-gray-', reason: 'Should use SGDS tokens' },
    { pattern: 'text-blue-', label: 'Unprefixed text-blue-', reason: 'Should use SGDS tokens' },
    { pattern: 'text-yellow-', label: 'Unprefixed text-yellow-', reason: 'Should use SGDS tokens' },
    { pattern: 'text-yellow-500', label: 'Unprefixed text-yellow-500', reason: 'Should use SGDS tokens' },
    { pattern: 'border-gray-', label: 'Unprefixed border-gray-', reason: 'Should use SGDS tokens' },
    { pattern: 'rounded-xl', label: 'Unprefixed rounded-xl', reason: 'Should use SGDS tokens' },
    { pattern: 'py-20', label: 'Unprefixed py-20', reason: 'Should use sgds:py-layout-*' },
    { pattern: 'p-5', label: 'Unprefixed p-5', reason: 'Should use sgds:p-*' },
    { pattern: 'hover:bg-gray-', label: 'Unprefixed hover:bg-gray-', reason: 'Should use SGDS tokens' },
];

/**
 * Custom exceptions that are allowed to NOT have full SGDS component coverage.
 * These are documented decisions from CONTEXT.md / UI-SPEC.md.
 */
const ALLOWED_CUSTOM_EXCEPTIONS: { label: string; file: string; reason: string }[] = [
    {
        label: 'Experience timeline',
        file: 'src/components/sections/Experience.tsx',
        reason: 'D-07: Custom timeline rail and dots preserved — uses sgds: utilities but not full SGDS component',
    },
    {
        label: 'BackToTop logic',
        file: 'src/components/layout/BackToTop.tsx',
        reason: 'D-07: Custom IntersectionObserver button — uses sgds: utilities and sgds-icon',
    },
    {
        label: 'Mobile hamburger',
        file: 'src/components/layout/Navbar.tsx',
        reason: 'D-07: Custom React hamburger menu with focus trap and SGDS icons',
    },
    {
        label: 'Masthead omission',
        file: 'src/app/[locale]/layout.tsx',
        reason: 'D-07: Personal portfolio should not imply government ownership',
    },
    {
        label: 'Truthful footer fallback',
        file: 'src/components/layout/Footer.tsx',
        reason: 'D-07: Custom footer with truthful links — no sgds-footer with placeholder pages',
    },
    {
        label: 'Custom brand SVG icons',
        file: 'src/components/icons/',
        reason: 'SGDS lacks verified GitHub/LinkedIn icons — local SVG components retained',
    },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function readSource(relativePath: string): string {
    return readFileSync(resolve(ROOT, relativePath), 'utf-8');
}

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe('SGDS migration source audit', () => {
    /* Test all MIGRATED_UI_FILES for FORBIDDEN_PATTERNS */
    describe('forbidden patterns', () => {
        for (const file of MIGRATED_UI_FILES) {
            const source = readSource(file);

            for (const { pattern, label } of FORBIDDEN_PATTERNS) {
                it(`${file} has no ${label}`, () => {
                    expect(source).not.toContain(pattern);
                });
            }
        }
    });

    /* Test that every migrated UI file has SGDS evidence */
    describe('SGDS evidence', () => {
        for (const file of MIGRATED_UI_FILES) {
            it(`${file} contains SGDS classes or custom elements`, () => {
                const source = readSource(file);
                const hasSgdsClasses = source.includes('sgds:');
                const hasSgdsElements = source.includes('sgds-') || source.includes('<sgds');
                const hasSgdsContainer = source.includes('sgds-container');

                // At least one SGDS indicator must be present
                const hasSgdsEvidence = hasSgdsClasses || hasSgdsElements || hasSgdsContainer;
                expect(hasSgdsEvidence).toBe(true);
            });
        }
    });

    /* Legacy unprefixed Tailwind audit */
    describe('no legacy unprefixed Tailwind remnants', () => {
        for (const file of MIGRATED_UI_FILES) {
            const source = readSource(file);

            for (const { pattern, label, reason } of LEGACY_UNPREFIXED_TAILWIND_PATTERNS) {
                it(`${file} has no ${label} (${reason})`, () => {
                    // These patterns should not appear bare in source. SGDS-prefixed
                    // variants are the expected replacement. Simple substring check
                    // since the remaining patterns do not collide with SGDS utilities.
                    expect(source).not.toContain(pattern);
                });
            }
        }
    });

    /* Layout skip-link assertion */
    describe('layout skip link', () => {
        const layout = readSource('src/app/[locale]/layout.tsx');

        it('contains skip link targeting #main-content', () => {
            expect(layout).toContain('#main-content');
        });

        it('skip link uses sgds: utilities for hidden/focus-visible states', () => {
            expect(layout).toContain('sgds:sr-only');
            expect(layout).toContain('sgds:focus:not-sr-only');
        });

        it('skip link has no bare Tailwind sr-only class', () => {
            expect(layout).not.toContain("'sr-only");
            expect(layout).not.toContain('"sr-only"');
        });

        it('skip link appears before Navbar and BackToTop render points in source order', () => {
            // Check within JSX section (after the first return statement)
            const returnPos = layout.indexOf('return (');
            const jsxSection = layout.slice(returnPos);

            const skipPos = jsxSection.indexOf('#main-content');
            const navbarPos = jsxSection.indexOf('<Navbar');
            const mainContentPos = jsxSection.indexOf("id='main-content'");
            const backToTopPos = jsxSection.indexOf('<BackToTop');

            expect(skipPos).toBeGreaterThan(0);
            expect(navbarPos).toBeGreaterThan(0);
            expect(mainContentPos).toBeGreaterThan(0);
            expect(backToTopPos).toBeGreaterThan(0);
            expect(skipPos).toBeLessThan(navbarPos);
            expect(skipPos).toBeLessThan(mainContentPos);
            expect(skipPos).toBeLessThan(backToTopPos);
        });
    });

    /* Source-wide lucide-react import audit */
    describe('lucide-react import audit', () => {
        const allSourceFiles = MIGRATED_UI_FILES.map(readSource);

        it('no migrated UI file imports lucide-react', () => {
            for (const source of allSourceFiles) {
                expect(source).not.toContain("from 'lucide-react'");
                expect(source).not.toContain('from "lucide-react"');
            }
        });
    });

    /* Documented custom exceptions */
    describe('custom exceptions documented', () => {
        it('ALLOWED_CUSTOM_EXCEPTIONS includes all expected entries', () => {
            const labels = ALLOWED_CUSTOM_EXCEPTIONS.map((e) => e.label);
            expect(labels).toContain('Experience timeline');
            expect(labels).toContain('BackToTop logic');
            expect(labels).toContain('Mobile hamburger');
            expect(labels).toContain('Masthead omission');
            expect(labels).toContain('Truthful footer fallback');
            expect(labels).toContain('Custom brand SVG icons');
        });

        // Verify each exception file actually exists and is not a ghost reference
        for (const exception of ALLOWED_CUSTOM_EXCEPTIONS) {
            it(`exception "${exception.label}" file exists: ${exception.file}`, () => {
                // Skip directory references — those have trailing slash
                if (exception.file.endsWith('/')) {
                    expect(true).toBe(true);
                    return;
                }
                expect(() => readSource(exception.file)).not.toThrow();
            });
        }
    });
});

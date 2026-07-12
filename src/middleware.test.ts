import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { buildCsp } from './middleware';

const TEST_NONCE = 'test-nonce-abc123';

/** Extract THEME_INIT_SCRIPT from the locale layout and hash it the CSP way. */
function themeInitScriptHash(): string {
    const layout = fs.readFileSync('src/app/[locale]/layout.tsx', 'utf-8');
    const match = /const THEME_INIT_SCRIPT = `([^`]+)`/.exec(layout);
    if (!match) throw new Error('THEME_INIT_SCRIPT not found in locale layout');
    const digest = createHash('sha256').update(match[1], 'utf8').digest('base64');
    return `'sha256-${digest}'`;
}

describe('buildCsp — SEC-02 CSP re-audit', () => {
    let originalNodeEnv: string | undefined;

    beforeEach(() => {
        originalNodeEnv = process.env.NODE_ENV;
    });

    afterEach(() => {
        // Restore NODE_ENV; cast to mutable to work around TypeScript read-only declaration
        (process.env as Record<string, string | undefined>).NODE_ENV = originalNodeEnv;
    });

    describe('SEC-02-a: fonts.googleapis.com must NOT appear in any branch', () => {
        it('dev branch: style-src must not contain fonts.googleapis.com', () => {
            (process.env as Record<string, string>).NODE_ENV = 'development';
            const csp = buildCsp(TEST_NONCE);
            expect(csp).not.toContain('fonts.googleapis.com');
        });

        it('prod branch: style-src must not contain fonts.googleapis.com', () => {
            (process.env as Record<string, string>).NODE_ENV = 'production';
            const csp = buildCsp(TEST_NONCE);
            expect(csp).not.toContain('fonts.googleapis.com');
        });
    });

    describe('SEC-02-b: fonts.gstatic.com must NOT appear in any branch', () => {
        it('dev branch: font-src must not contain fonts.gstatic.com', () => {
            (process.env as Record<string, string>).NODE_ENV = 'development';
            const csp = buildCsp(TEST_NONCE);
            expect(csp).not.toContain('fonts.gstatic.com');
        });

        it('prod branch: font-src must not contain fonts.gstatic.com', () => {
            (process.env as Record<string, string>).NODE_ENV = 'production';
            const csp = buildCsp(TEST_NONCE);
            expect(csp).not.toContain('fonts.gstatic.com');
        });
    });

    describe('SEC-02-c: prod branch must carry the hash of the CURRENT theme-init script', () => {
        it('prod branch: script-src contains the hash computed from THEME_INIT_SCRIPT', () => {
            (process.env as Record<string, string>).NODE_ENV = 'production';
            const csp = buildCsp(TEST_NONCE);
            expect(csp).toContain(themeInitScriptHash());
        });

        it('prod branch: script-src does NOT contain stale hashes from earlier designs', () => {
            (process.env as Record<string, string>).NODE_ENV = 'production';
            const csp = buildCsp(TEST_NONCE);
            expect(csp).not.toContain(
                `'sha256-1lsbnEG5y+jDum9W3sr9rXc9EniVVZtsPUtyiDRfsik='`,
            );
            expect(csp).not.toContain(
                `'sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc='`,
            );
        });
    });

    describe('SEC-02-d: Vercel Analytics domains and unsafe-inline style-src must be preserved', () => {
        it('dev branch: script-src preserves https://va.vercel-scripts.com', () => {
            (process.env as Record<string, string>).NODE_ENV = 'development';
            const csp = buildCsp(TEST_NONCE);
            expect(csp).toContain('https://va.vercel-scripts.com');
        });

        it('prod branch: script-src preserves https://va.vercel-scripts.com', () => {
            (process.env as Record<string, string>).NODE_ENV = 'production';
            const csp = buildCsp(TEST_NONCE);
            expect(csp).toContain('https://va.vercel-scripts.com');
        });

        it('dev branch: connect-src preserves https://vitals.vercel-insights.com', () => {
            (process.env as Record<string, string>).NODE_ENV = 'development';
            const csp = buildCsp(TEST_NONCE);
            expect(csp).toContain('https://vitals.vercel-insights.com');
        });

        it('prod branch: connect-src preserves https://vitals.vercel-insights.com', () => {
            (process.env as Record<string, string>).NODE_ENV = 'production';
            const csp = buildCsp(TEST_NONCE);
            expect(csp).toContain('https://vitals.vercel-insights.com');
        });

        it('dev branch: style-src contains unsafe-inline', () => {
            (process.env as Record<string, string>).NODE_ENV = 'development';
            const csp = buildCsp(TEST_NONCE);
            expect(csp).toContain(`'unsafe-inline'`);
        });

        it('prod branch: style-src contains unsafe-inline', () => {
            (process.env as Record<string, string>).NODE_ENV = 'production';
            const csp = buildCsp(TEST_NONCE);
            expect(csp).toContain(`'unsafe-inline'`);
        });

        it('dev branch: style-src directive does NOT contain a nonce- token', () => {
            (process.env as Record<string, string>).NODE_ENV = 'development';
            const csp = buildCsp(TEST_NONCE);
            // Extract the style-src directive and verify no nonce token is present
            const styleSrcMatch = csp.match(/style-src[^;]*/);
            expect(styleSrcMatch).not.toBeNull();
            expect(styleSrcMatch![0]).not.toContain('nonce-');
        });

        it('prod branch: style-src directive does NOT contain a nonce- token', () => {
            (process.env as Record<string, string>).NODE_ENV = 'production';
            const csp = buildCsp(TEST_NONCE);
            // Extract the style-src directive and verify no nonce token is present
            const styleSrcMatch = csp.match(/style-src[^;]*/);
            expect(styleSrcMatch).not.toBeNull();
            expect(styleSrcMatch![0]).not.toContain('nonce-');
        });
    });
});

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { buildCsp } from './middleware';

const TEST_NONCE = 'test-nonce-abc123';

describe('buildCsp — SEC-02 CSP re-audit', () => {
    let originalNodeEnv: string | undefined;

    beforeEach(() => {
        originalNodeEnv = process.env.NODE_ENV;
    });

    afterEach(() => {
        if (originalNodeEnv === undefined) {
            delete process.env.NODE_ENV;
        } else {
            (process.env as Record<string, string>).NODE_ENV = originalNodeEnv;
        }
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

    describe('SEC-02-c: prod branch must carry the recomputed hash (not the stale one)', () => {
        it('prod branch: script-src contains the correct recomputed hash', () => {
            (process.env as Record<string, string>).NODE_ENV = 'production';
            const csp = buildCsp(TEST_NONCE);
            expect(csp).toContain(
                `'sha256-UP1BueuQLAxSqOAov3ToK+6YXLsA7kaU6Mw54dT10dc='`,
            );
        });

        it('prod branch: script-src does NOT contain the stale next-themes hash', () => {
            (process.env as Record<string, string>).NODE_ENV = 'production';
            const csp = buildCsp(TEST_NONCE);
            expect(csp).not.toContain(
                `'sha256-1lsbnEG5y+jDum9W3sr9rXc9EniVVZtsPUtyiDRfsik='`,
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

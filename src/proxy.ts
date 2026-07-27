import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

// sha256 of THEME_INIT_SCRIPT in src/app/[locale]/layout.tsx. Both policies
// carry it: `headers().get('x-nonce')` resolves to null in the layout, so the
// theme script is emitted without a nonce and the hash is what authorizes it.
// Any edit to THEME_INIT_SCRIPT — even whitespace — requires recomputing this.
const THEME_SCRIPT_HASH = "'sha256-1MXRx0kCy3uHCgfa+PdHahiZbeaCWj44cA01CgOMqRc='";

export function buildCsp(nonce: string): string {
    const isDev = process.env.NODE_ENV === 'development';

    // Development: relaxed CSP to allow hot reload and eval
    if (isDev) {
        return [
            "default-src 'self'",
            `script-src 'self' 'unsafe-eval' 'nonce-${nonce}' ${THEME_SCRIPT_HASH} https://va.vercel-scripts.com`,
            `style-src 'self' 'unsafe-inline'`,
            "font-src 'self'",
            "img-src 'self' data: blob:",
            "connect-src 'self' https://vitals.vercel-insights.com ws: wss:",
            "frame-ancestors 'none'",
        ].join('; ');
    }

    // Production: strict CSP — hash authorizes theme-init inline script (x-nonce is null on Vercel at runtime)
    return [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${THEME_SCRIPT_HASH} https://va.vercel-scripts.com`,
        `style-src 'self' 'unsafe-inline'`,
        "font-src 'self'",
        "img-src 'self' data: blob:",
        "connect-src 'self' https://vitals.vercel-insights.com",
        "frame-ancestors 'none'",
    ].join('; ');
}

export default function proxy(request: NextRequest) {
    const intlResponse = intlMiddleware(request);
    const nonce = Buffer.from(
        crypto.getRandomValues(new Uint8Array(16)),
    ).toString('base64');
    const csp = buildCsp(nonce);

    // For redirects: just attach CSP and return — layout is not rendered
    if (REDIRECT_STATUSES.has(intlResponse.status)) {
        intlResponse.headers.set('Content-Security-Policy', csp);
        return intlResponse;
    }

    // For non-redirects: create NextResponse.next() with nonce in request headers
    // so server components can read it via headers() and Next.js auto-nonces its scripts
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);

    const response = NextResponse.next({
        request: { headers: requestHeaders },
    });
    response.headers.set('Content-Security-Policy', csp);

    // Forward internal Next.js headers from intl middleware (rewrites, locale cookie, etc.)
    intlResponse.headers.forEach((value, key) => {
        if (key.startsWith('x-middleware-') || key.startsWith('set-cookie')) {
            response.headers.set(key, value);
        }
    });
    for (const cookie of intlResponse.cookies.getAll()) {
        response.cookies.set(cookie);
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'], // NOSONAR: Next.js requires static string literals in config; String.raw cannot be used here
};

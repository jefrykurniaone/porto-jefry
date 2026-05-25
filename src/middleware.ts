import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { randomBytes } from 'node:crypto';

const intlMiddleware = createIntlMiddleware(routing);

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

function buildCsp(nonce: string): string {
    return [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://va.vercel-scripts.com`,
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob:",
        "connect-src 'self' https://vitals.vercel-insights.com",
        "frame-ancestors 'none'",
    ].join('; ');
}

export default function middleware(request: NextRequest) {
    const intlResponse = intlMiddleware(request);
    const nonce = randomBytes(16).toString('base64');
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

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set('Content-Security-Policy', csp);

    // Forward internal Next.js headers from intl middleware (rewrites, locale cookie, etc.)
    for (const [key, value] of intlResponse.headers.entries()) {
        if (key.startsWith('x-middleware-') || key.startsWith('set-cookie')) {
            response.headers.set(key, value);
        }
    }
    for (const cookie of intlResponse.cookies.getAll()) {
        response.cookies.set(cookie);
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'], // NOSONAR: Next.js requires static string literals in config; String.raw cannot be used here
};

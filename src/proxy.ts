import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

export function buildCsp(nonce: string): string {
    const isDev = process.env.NODE_ENV === 'development';

    // Development: relaxed CSP to allow hot reload and eval
    if (isDev) {
        return [
            "default-src 'self'",
            `script-src 'self' 'unsafe-eval' 'nonce-${nonce}' https://va.vercel-scripts.com`,
            `style-src 'self' 'unsafe-inline'`,
            "font-src 'self'",
            "img-src 'self' data: blob:",
            "connect-src 'self' https://vitals.vercel-insights.com ws: wss:",
            "frame-ancestors 'none'",
        ].join('; ');
    }

    return buildProductionCsp(nonce, isVercelPreview());
}

// Vercel injects its toolbar, an iframe from vercel.live, into preview
// deployments only, so previews need the sources Vercel documents for it
// (vercel.com/docs/vercel-toolbar/managing-toolbar). Previews sit behind
// Vercel Authentication, which bounds who receives the wider policy. The
// comparison is exact on purpose so that it fails closed: an unset, unknown
// or 'production' value yields the unchanged production policy.
function isVercelPreview(): boolean {
    return process.env.VERCEL_ENV === 'preview';
}

// Production: strict CSP. No inline-script hash is needed — the theme is
// rendered server-side from a cookie, so the app ships no inline scripts of
// its own. Next's own tags carry this per-request nonce. With `toolbar` off
// the output is exactly the production policy; with it on, the toolbar's
// sources are appended to their directives and frame-src is added.
function buildProductionCsp(nonce: string, toolbar: boolean): string {
    const add = (sources: string): string => (toolbar ? ` ${sources}` : '');
    const directives = [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://va.vercel-scripts.com${add('https://vercel.live')}`,
        `style-src 'self' 'unsafe-inline'${add('https://vercel.live')}`,
        `font-src 'self'${add('https://vercel.live https://assets.vercel.com')}`,
        `img-src 'self' data: blob:${add('https://vercel.live https://vercel.com')}`,
        `connect-src 'self' https://vitals.vercel-insights.com${add('https://vercel.live wss://ws-us3.pusher.com')}`,
        "frame-ancestors 'none'",
    ];
    if (toolbar) {
        directives.push("frame-src 'self' https://vercel.live");
    }
    return directives.join('; ');
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

import { renderToBuffer, DocumentProps } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import sharp from 'sharp';
import { ipAddress } from '@vercel/functions';
import CvDocument from '@/components/cv/CvDocument';
import { cvFileName } from '@/utils/cv';
import enMessages from '@/i18n/messages/en.json';
import idMessages from '@/i18n/messages/id.json';

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

// Rate-limit store: in-memory Map, resets on cold start.
// Accepted risk (SEC-03): distributed limiting (e.g., Upstash Redis) is not implemented.
// Rationale: portfolio-scale traffic is low; CV PDF is module-cached per locale
// (CV_BUFFER_CACHE), so the expensive render path runs at most once per instance
// lifetime — the per-instance limit guards the only costly operation adequately.
// Revisit if Vercel Analytics shows sustained abusive traffic to this endpoint.
// Tracking: REQUIREMENTS.md SEC-03 (closed, accepted-risk).
const rateLimitStore = new Map<
    string,
    { count: number; windowStart: number }
>();

function evictExpiredEntries(): void {
    const now = Date.now();
    rateLimitStore.forEach((entry, key) => {
        if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
            rateLimitStore.delete(key);
        }
    });
}

function checkRateLimit(ip: string): boolean {
    evictExpiredEntries();
    const now = Date.now();
    const entry = rateLimitStore.get(ip);
    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitStore.set(ip, { count: 1, windowStart: now });
        return true;
    }
    if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return false;
    entry.count += 1;
    return true;
}

const SUPPORTED_LOCALES = ['en', 'id'] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const MESSAGES_MAP: Record<SupportedLocale, typeof enMessages> = {
    en: enMessages,
    id: idMessages,
};

const CV_PHOTO_PATH = join(process.cwd(), 'public', 'cv-photo.webp');

const JPEG_QUALITY = 90;

interface CachedPdf {
    bytes: Uint8Array<ArrayBuffer>;
    etag: string;
}

// Module-level caches — reset on cold start; one render per locale per process lifetime
const CV_BUFFER_CACHE = new Map<string, CachedPdf>();
let cachedPhotoSrc: string | undefined;
let photoSrcResolved = false;

async function getPhotoSrc(): Promise<string | undefined> {
    if (photoSrcResolved) return cachedPhotoSrc;

    try {
        await access(CV_PHOTO_PATH, constants.R_OK);
        const raw = await readFile(CV_PHOTO_PATH);
        // @react-pdf/renderer only supports JPEG and PNG — convert to JPEG via sharp
        const jpeg = await sharp(raw)
            .jpeg({ quality: JPEG_QUALITY })
            .toBuffer();
        cachedPhotoSrc = `data:image/jpeg;base64,${jpeg.toString('base64')}`;
    } catch {
        // File absent or unreadable — proceed without photo
        cachedPhotoSrc = undefined;
    }

    photoSrcResolved = true;
    return cachedPhotoSrc;
}

// max-age=0 + must-revalidate rather than a long max-age. The expensive work
// (renderToBuffer) is already cached server-side in CV_BUFFER_CACHE, so a long
// browser/CDN cache buys nothing except stale CVs: a plain fetch() honours it
// and will not contact the server at all, which means a content change stays
// invisible to anyone who downloaded inside the window — including Vercel's
// edge after a deploy. The ETag keeps repeat downloads cheap via a 304.
const CACHE_CONTROL = 'public, max-age=0, must-revalidate';

// Locale-suffixed, from the same function the client names the saved file with.
// The download path overrides this with `link.download`, but anyone who opens
// the endpoint directly — or fetches it with curl -O — gets whatever is here,
// and one fixed name meant an ID download silently overwrote an EN one.
function buildPdfHeaders(etag: string, locale: SupportedLocale): HeadersInit {
    return {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cvFileName(locale)}"`,
        'Cache-Control': CACHE_CONTROL,
        ETag: etag,
    };
}

/** Content-derived, so any change to the rendered document invalidates it. */
function etagFor(bytes: Uint8Array): string {
    return `"${createHash('sha256').update(bytes).digest('base64url')}"`;
}

function resolveLocale(rawLocale: string): SupportedLocale {
    return SUPPORTED_LOCALES.includes(rawLocale as SupportedLocale)
        ? (rawLocale as SupportedLocale)
        : 'en';
}

function rateLimitGuard(ip: string): NextResponse | null {
    if (checkRateLimit(ip)) return null;
    const entry = rateLimitStore.get(ip)!;
    const retryAfterSeconds = Math.max(
        1,
        Math.ceil((entry.windowStart + RATE_LIMIT_WINDOW_MS - Date.now()) / 1000),
    );
    return new NextResponse('Too Many Requests', {
        status: 429,
        headers: { 'Retry-After': String(retryAfterSeconds) },
    });
}

async function loadCv(locale: SupportedLocale): Promise<CachedPdf> {
    const cached = CV_BUFFER_CACHE.get(locale);
    if (cached) return cached;

    const messages = MESSAGES_MAP[locale];
    const photoSrc = await getPhotoSrc();

    const buffer = await renderToBuffer(
        createElement(CvDocument, {
            messages,
            photoSrc,
            locale,
        }) as ReactElement<DocumentProps>,
    );

    // Copy into a fresh ArrayBuffer-backed Uint8Array (TypeScript 5.x BodyInit compatibility)
    const bytes = new Uint8Array(buffer.length);
    bytes.set(buffer);
    const entry: CachedPdf = { bytes, etag: etagFor(bytes) };
    CV_BUFFER_CACHE.set(locale, entry);
    return entry;
}

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const rawLocale = searchParams.get('locale') ?? 'en';
    const locale = resolveLocale(rawLocale);

    const ip = ipAddress(req) ?? '127.0.0.1';
    const rateLimitResponse = rateLimitGuard(ip);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        const { bytes, etag } = await loadCv(locale);

        if (req.headers.get('if-none-match') === etag) {
            return new NextResponse(null, {
                status: 304,
                headers: { 'Cache-Control': CACHE_CONTROL, ETag: etag },
            });
        }

        return new NextResponse(bytes, {
            status: 200,
            headers: buildPdfHeaders(etag, locale),
        });
    } catch (error) {
        console.error('[generate-cv] Failed to render CV PDF', {
            locale,
            error,
        });
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

import { renderToBuffer, DocumentProps } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import CvDocument from '@/components/cv/CvDocument';
import enMessages from '@/i18n/messages/en.json';
import idMessages from '@/i18n/messages/id.json';

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

// Module-level rate-limit store (resets on cold start)
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
const CACHE_MAX_AGE_SECONDS = 3600;

// Module-level caches — reset on cold start; one render per locale per process lifetime
const CV_BUFFER_CACHE = new Map<string, Uint8Array<ArrayBuffer>>();
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

function buildPdfHeaders(): HeadersInit {
    return {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Jefry_Kurniawan_CV.pdf"',
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE_SECONDS}`,
    };
}

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const rawLocale = searchParams.get('locale') ?? 'en';

    const locale: SupportedLocale = SUPPORTED_LOCALES.includes(
        rawLocale as SupportedLocale,
    )
        ? (rawLocale as SupportedLocale)
        : 'en';

    const ip =
        req.headers.get('x-real-ip') ??
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        '127.0.0.1'; // local dev fallback — rate-limits localhost rather than erroring
    if (!checkRateLimit(ip)) {
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

    const cached = CV_BUFFER_CACHE.get(locale);
    if (cached) {
        return new NextResponse(cached, {
            status: 200,
            headers: buildPdfHeaders(),
        });
    }

    try {
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
        const pdfArray = new Uint8Array(buffer.length);
        pdfArray.set(buffer);
        CV_BUFFER_CACHE.set(locale, pdfArray);
        return new NextResponse(pdfArray, {
            status: 200,
            headers: buildPdfHeaders(),
        });
    } catch (error) {
        console.error('[generate-cv] Failed to render CV PDF', {
            locale,
            error,
        });
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

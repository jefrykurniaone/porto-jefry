import { renderToBuffer, DocumentProps } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import CvDocument from '@/components/cv/CvDocument';
import enMessages from '@/i18n/messages/en.json';
import idMessages from '@/i18n/messages/id.json';

const SUPPORTED_LOCALES = ['en', 'id'] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const messagesMap: Record<SupportedLocale, typeof enMessages> = {
    en: enMessages,
    id: idMessages,
};

const CV_PHOTO_PATH = join(process.cwd(), 'public', 'cv-photo.jpg');

function getPhotoSrc(): string | undefined {
    if (!existsSync(CV_PHOTO_PATH)) return undefined;
    const data = readFileSync(CV_PHOTO_PATH).toString('base64');
    return `data:image/jpeg;base64,${data}`;
}

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const rawLocale = searchParams.get('locale') ?? 'en';

    const locale: SupportedLocale = SUPPORTED_LOCALES.includes(rawLocale as SupportedLocale)
        ? (rawLocale as SupportedLocale)
        : 'en';

    const messages = messagesMap[locale];
    const photoSrc = getPhotoSrc();

    const buffer = await renderToBuffer(
        createElement(CvDocument, { messages, photoSrc }) as ReactElement<DocumentProps>,
    );

    return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="Jefry_Kurniawan_CV.pdf"',
            'Cache-Control': 'no-store',
        },
    });
}

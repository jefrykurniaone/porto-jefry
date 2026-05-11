import { renderToBuffer, DocumentProps } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import { NextRequest, NextResponse } from 'next/server';
import CvDocument from '@/components/cv/CvDocument';
import enMessages from '@/i18n/messages/en.json';
import idMessages from '@/i18n/messages/id.json';

const SUPPORTED_LOCALES = ['en', 'id'] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const messagesMap: Record<SupportedLocale, typeof enMessages> = {
    en: enMessages,
    id: idMessages,
};

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const rawLocale = searchParams.get('locale') ?? 'en';

    const locale: SupportedLocale = SUPPORTED_LOCALES.includes(rawLocale as SupportedLocale)
        ? (rawLocale as SupportedLocale)
        : 'en';

    const messages = messagesMap[locale];

    const buffer = await renderToBuffer(
        createElement(CvDocument, { messages }) as ReactElement<DocumentProps>,
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

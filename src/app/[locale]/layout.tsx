import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { BASE_URL } from '@/utils/constants';
import '@/app/globals.css';

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: '--font-mono',
});

// Stamps data-theme on <html> before first paint (dark is the default).
// Changing this string requires recomputing the CSP sha256 hash in
// src/middleware.ts buildCsp().
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('porto-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}})()`;

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'hero' });

    return {
        title: `${t('name')} – ${t('title')}`,
        description: t('subtitle'),
        openGraph: {
            type: 'website',
            url: `${BASE_URL}/${locale}`,
            title: `${t('name')} – ${t('title')}`,
            description: t('subtitle'),
            images: [{ url: `${BASE_URL}/cv-photo.webp`, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${t('name')} – ${t('title')}`,
            description: t('subtitle'),
            images: [`${BASE_URL}/cv-photo.webp`],
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    if (!routing.locales.includes(locale as 'en' | 'id')) notFound();
    const messages = await getMessages();
    const t = await getTranslations({ locale, namespace: 'nav' });
    const nonce = (await headers()).get('x-nonce') ?? undefined;

    return (
        <html
            lang={locale}
            className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
            suppressHydrationWarning>
            <body>
                <script
                    nonce={nonce}
                    dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
                />
                <NextIntlClientProvider messages={messages}>
                    <a href='#main-content' className='skip-link'>
                        {t('skip_to_content')}
                    </a>
                    <Navbar />
                    <main id='main-content'>{children}</main>
                    <Footer />
                    <BackToTop />
                </NextIntlClientProvider>
                <Analytics />
            </body>
        </html>
    );
}

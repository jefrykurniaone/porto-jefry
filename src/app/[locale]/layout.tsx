import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { routing } from '@/i18n/routing';
import { DEFAULT_THEME, isTheme, THEME_COOKIE } from '@/utils/theme';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { BASE_URL } from '@/utils/constants';
import PersonJsonLd from '@/components/seo/PersonJsonLd';
import '@/app/globals.css';

// Self-hosted so the build never downloads fonts. Each file is the Latin-subset
// variable WOFF2 that the Google Fonts CSS2 API serves to desktop Chrome,
// retrieved 2026-11-14 (take the WOFF2 the `/* latin */` block points at):
//   https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400..700&display=swap
//   https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400..600&display=swap
// The files sit in src/app/fonts, not public/fonts: next.config.mjs traces
// public/fonts into the CV function, and the raw files need no public path.
// Each family's OFL text sits beside its file.
const spaceGrotesk = localFont({
    src: '../fonts/SpaceGrotesk-latin-wght.woff2',
    weight: '400 700',
    style: 'normal',
    display: 'swap',
    variable: '--font-sans',
    adjustFontFallback: 'Arial',
});

const jetbrainsMono = localFont({
    src: '../fonts/JetBrainsMono-latin-wght.woff2',
    weight: '400 600',
    style: 'normal',
    display: 'swap',
    variable: '--font-mono',
    adjustFontFallback: 'Arial',
});

// The proxy mints a fresh CSP nonce per request and production CSP uses
// 'strict-dynamic', where host sources like 'self' are ignored — so Next's own
// script tags are only authorized by that per-request nonce. Prerendering would
// freeze one nonce into the HTML and every later request would reject it, so
// this route has to render per request. It already did, via a headers() read;
// this states the requirement instead of depending on that side effect.
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

// Entry is almost always an external link (LinkedIn, a CV, an application), so
// the locale pair has to be declared on the page itself — sitemap.ts alone does
// not stop the wrong locale being served to a recruiter.
function localeAlternates(locale: string): Metadata['alternates'] {
    return {
        canonical: `${BASE_URL}/${locale}`,
        languages: {
            en: `${BASE_URL}/en`,
            id: `${BASE_URL}/id`,
            'x-default': `${BASE_URL}/en`,
        },
    };
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
        alternates: localeAlternates(locale),
        openGraph: {
            type: 'website',
            url: `${BASE_URL}/${locale}`,
            title: `${t('name')} – ${t('title')}`,
            description: t('subtitle'),
            // Real 1200x630 PNG — see scripts/gen-og-image.mjs. Do not point
            // this at cv-photo.webp: it is square, and WebP previews render
            // inconsistently on LinkedIn and Slack.
            images: [
                {
                    url: `${BASE_URL}/og-image.png`,
                    width: 1200,
                    height: 630,
                    type: 'image/png',
                    alt: `${t('name')} – ${t('title')}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${t('name')} – ${t('title')}`,
            description: t('subtitle'),
            images: [`${BASE_URL}/og-image.png`],
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
    const hero = await getTranslations({ locale, namespace: 'hero' });
    const cookieTheme = (await cookies()).get(THEME_COOKIE)?.value;
    const theme = isTheme(cookieTheme) ? cookieTheme : DEFAULT_THEME;

    // data-scroll-behavior opts route transitions out of the smooth scrolling
    // globals.css sets on <html>.
    return (
        <html
            lang={locale}
            data-theme={theme}
            data-scroll-behavior='smooth'
            className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
            suppressHydrationWarning>
            <body>
                <PersonJsonLd locale={locale} jobTitle={hero('title')} description={hero('subtitle')} />
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

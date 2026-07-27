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
import PersonJsonLd from '@/components/seo/PersonJsonLd';
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
// src/proxy.ts buildCsp().
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('porto-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}})()`;

/**
 * Must stay a raw <script>: it has to run during initial HTML parse, before
 * first paint. `next/script` with `beforeInteractive` only does that in the
 * root layout — here it degrades to a queued script that Next injects after
 * hydration starts, which brings the theme flash back.
 *
 * React 19 logs "Encountered a script tag while rendering React component"
 * whenever it renders this on the client, which a locale switch does. That
 * warning is dev-only and harmless: the script has already done its job at
 * parse time, and the effect in `useTheme` keeps `data-theme` correct across
 * client navigations.
 */
function ThemeInitScript({ nonce }: Readonly<{ nonce?: string }>) {
    return (
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
    );
}

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
    const nonce = (await headers()).get('x-nonce') ?? undefined;

    return (
        <html
            lang={locale}
            className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
            suppressHydrationWarning>
            <body>
                <ThemeInitScript nonce={nonce} />
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

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

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
    const BASE_URL = 'https://jefrykurniawan.vercel.app';

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

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={inter.className}>
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
                        <a
                            href='#main-content'
                            className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-blue-600 focus:rounded-lg focus:ring-2 focus:ring-blue-600'>
                            {t('skip_to_content')}
                        </a>
                        <Navbar />
                        <main id='main-content'>{children}</main>
                        <Footer />
                    </ThemeProvider>
                </NextIntlClientProvider>
                <Analytics />
            </body>
        </html>
    );
}

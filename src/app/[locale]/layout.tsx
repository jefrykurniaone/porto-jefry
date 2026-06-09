import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { BASE_URL } from '@/utils/constants';
import SgdsLibraryLoader from '@/app/sgds';
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
        <html lang={locale} suppressHydrationWarning>
            <body className={inter.className}>
                <script
                    nonce={nonce}
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('sgds-theme');if(t==='night'){document.documentElement.classList.add('sgds-night-theme')}}catch(e){console.error('[SGDS] theme init:',e)}})()`,
                    }}
                />
                <SgdsLibraryLoader />
                <NextIntlClientProvider messages={messages}>
                    <a
                        href='#main-content'
                        className='sgds:sr-only sgds:focus:not-sr-only sgds:focus:absolute sgds:focus:top-4 sgds:focus:left-4 sgds:focus:z-50 sgds:focus:rounded-sm sgds:focus:bg-surface-raised sgds:focus:px-component-sm sgds:focus:py-component-xs sgds:focus:text-body-md sgds:focus:text-default sgds:focus:outline-none sgds:focus:ring-2 sgds:focus:ring-primary'>
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

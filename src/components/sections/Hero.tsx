'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { ArrowDownIcon, DownloadIcon, MailIcon } from 'lucide-react';

interface HeroCtaButtonsProps {
    locale: string;
    ctaWork: string;
    ctaCv: string;
    ctaContact: string;
    ctaDownloading: string;
    t: (key: string, values?: Record<string, string | number>) => string;
}

function HeroCtaButtons({ locale, ctaWork, ctaCv, ctaContact, ctaDownloading, t }: Readonly<HeroCtaButtonsProps>) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const scrollTo = (id: string) =>
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    const scrollToWithHash = (id: string) => {
        scrollTo(id);
        history.pushState(null, '', `#${id}`);
    };

    const handleDownload = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        setErrorMessage(null); // Clear any previous error
        try {
            const res = await fetch(`/api/generate-cv?${new URLSearchParams({ locale })}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Jefry_Kurniawan_CV.pdf';
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            // Extract HTTP status code from error message
            const statusMatch = err instanceof Error ? err.message.match(/HTTP (\d+)/) : null;
            const status = statusMatch ? statusMatch[1] : 'unknown';
            setErrorMessage(t('cv_error', { status }));
            // Auto-dismiss after 5 seconds
            setTimeout(() => setErrorMessage(null), 5000);
            // eslint-disable-next-line no-console
            console.error('[CV Download] failed:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className='flex flex-wrap justify-center gap-4'>
            <a
                href='#projects'
                onClick={(e) => { e.preventDefault(); scrollToWithHash('projects'); }}
                className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors'>
                <ArrowDownIcon size={18} aria-hidden='true' />
                {ctaWork}
            </a>
            <button
                type='button'
                onClick={handleDownload}
                disabled={isDownloading}
                className='inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900 text-white font-medium rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed'>
                {isDownloading ? (
                    <>
                        <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-gray-900 dark:border-t-transparent' />
                        {ctaDownloading}
                    </>
                ) : (
                    <>
                        <DownloadIcon size={18} aria-hidden='true' />
                        {ctaCv}
                    </>
                )}
            </button>
            <a
                href='#contact'
                onClick={(e) => { e.preventDefault(); scrollToWithHash('contact'); }}
                className='inline-flex items-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 font-medium rounded-xl transition-colors'>
                <MailIcon size={18} aria-hidden='true' />
                {ctaContact}
            </a>
        </div>
    );
}

export default function Hero() {
    const t = useTranslations('hero');
    const locale = useLocale();

    return (
        <section id='hero' className='min-h-screen flex items-center justify-center px-4 pt-16'>
            <div className='max-w-3xl mx-auto text-center'>
                <div className='mb-8 flex justify-center'>
                    <div className='w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-500/30 ring-offset-4 ring-offset-white dark:ring-offset-gray-950'>
                        <Image
                            src='/cv-photo.webp'
                            alt={t('photo_alt')}
                            width={128}
                            height={128}
                            className='w-full h-full object-cover'
                            priority
                        />
                    </div>
                </div>
                <p className='text-blue-600 dark:text-blue-400 font-medium mb-2'>{t('greeting')}</p>
                <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4'>
                    {t('name')}
                </h1>
                <h2 className='text-xl sm:text-2xl font-semibold text-gray-500 dark:text-gray-400 mb-6'>
                    {t('title')}
                </h2>
                <p className='text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed'>
                    {t('subtitle')}
                </p>
                <HeroCtaButtons
                    locale={locale}
                    ctaWork={t('cta_work')}
                    ctaCv={t('cta_cv')}
                    ctaContact={t('cta_contact')}
                    ctaDownloading={t('downloading_cv')}
                    t={t}
                />
            </div>
        </section>
    );
}

'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';

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
        setErrorMessage(null);
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
            const statusMatch = err instanceof Error ? err.message.match(/HTTP (\d+)/) : null;
            const status = statusMatch ? statusMatch[1] : 'unknown';
            setErrorMessage(t('cv_error', { status }));
            setTimeout(() => setErrorMessage(null), 5000);
            // eslint-disable-next-line no-console
            console.error('[CV Download] failed:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <>
            <div className='hero-cta-group sgds:flex sgds:flex-wrap sgds:justify-center sgds:items-center'>
                <a
                    href='#projects'
                    onClick={(e) => { e.preventDefault(); scrollToWithHash('projects'); }}
                    className='hero-cta-link hero-cta-link-primary sgds:inline-flex sgds:items-center sgds:justify-center sgds:gap-sm sgds:font-semibold sgds:text-white sgds:no-underline'>
                    <sgds-icon name='arrow-down' aria-hidden='true' suppressHydrationWarning />
                    {ctaWork}
                </a>
                {isDownloading ? (
                    <span className='hero-download-button'>
                        <sgds-button type='button' loading suppressHydrationWarning>
                            {ctaDownloading}
                        </sgds-button>
                    </span>
                ) : (
                    <span className='hero-download-button'>
                        <sgds-button type='button' onClick={handleDownload} suppressHydrationWarning>
                            <sgds-icon slot='start' name='download' aria-hidden='true' suppressHydrationWarning />
                            {ctaCv}
                        </sgds-button>
                    </span>
                )}
                <a
                    href='#contact'
                    onClick={(e) => { e.preventDefault(); scrollToWithHash('contact'); }}
                    className='hero-cta-link hero-cta-link-outline sgds:inline-flex sgds:items-center sgds:justify-center sgds:gap-sm sgds:font-semibold sgds:text-primary sgds:no-underline'>
                    <sgds-icon name='mail' aria-hidden='true' suppressHydrationWarning />
                    {ctaContact}
                </a>
            </div>
            {errorMessage && (
                <sgds-alert variant='danger' show suppressHydrationWarning>
                    <sgds-icon slot='icon' name='exclamation-circle-fill' aria-hidden='true' suppressHydrationWarning />
                    <p role='alert' aria-live='polite' className='sgds:mb-0'>
                        {errorMessage}
                    </p>
                </sgds-alert>
            )}
        </>
    );
}

export default function Hero() {
    const t = useTranslations('hero');
    const locale = useLocale();

    return (
        <section id='hero' className='sgds:min-h-screen sgds:flex sgds:items-center sgds:justify-center sgds:bg-default'>
            <div className='sgds-container hero-content sgds:text-center sgds:py-layout-lg'>
                <div className='sgds:mb-xl sgds:flex sgds:justify-center'>
                    <div className='sgds:w-32 sgds:h-32 sgds:rounded-full sgds:overflow-hidden sgds:ring-4 sgds:ring-primary sgds:ring-offset-4'>
                        <Image
                            src='/cv-photo.webp'
                            alt={t('photo_alt')}
                            width={128}
                            height={128}
                            className='sgds:w-full sgds:h-full sgds:object-cover'
                            priority
                        />
                    </div>
                </div>
                <p className='sgds:text-primary sgds:font-semibold sgds:mb-component-xs sgds:text-body-md'>
                    {t('greeting')}
                </p>
                <h1 className='sgds:text-display-md sgds:font-semibold sgds:leading-2-xl sgds:tracking-tighter sgds:text-display-default sgds:mb-component-sm hero-name'>
                    {t('name')}
                </h1>
                <h2 className='sgds:text-heading-lg sgds:font-semibold sgds:text-muted sgds:mb-component-md'>
                    {t('title')}
                </h2>
                <p className='hero-subtitle sgds:text-body-md sgds:text-muted sgds:mx-auto sgds:mb-xl sgds:leading-xs'>
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

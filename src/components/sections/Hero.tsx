'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { useCvDownload } from '@/hooks/use-cv-download';

interface HeroCtaButtonsProps {
    locale: string;
    ctaWork: string;
    ctaCv: string;
    ctaContact: string;
    ctaDownloading: string;
    t: (key: string, values?: Record<string, string | number>) => string;
}

interface HeroCtaLinksProps {
    ctaWork: string;
    ctaCv: string;
    ctaContact: string;
    ctaDownloading: string;
    isDownloading: boolean;
    onDownload: () => void;
    onScrollToProjects: () => void;
    onScrollToContact: () => void;
}

function HeroCtaLinks({
    ctaWork, ctaCv, ctaContact, ctaDownloading,
    isDownloading, onDownload, onScrollToProjects, onScrollToContact,
}: Readonly<HeroCtaLinksProps>) {
    return (
        <div className='hero-cta-group sgds:flex sgds:flex-wrap sgds:justify-center sgds:items-center'>
            <a
                href='#projects'
                onClick={(e) => { e.preventDefault(); onScrollToProjects(); }}
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
                    <sgds-button type='button' onClick={onDownload} suppressHydrationWarning>
                        <sgds-icon slot='start' name='download' aria-hidden='true' suppressHydrationWarning />
                        {ctaCv}
                    </sgds-button>
                </span>
            )}
            <a
                href='#contact'
                onClick={(e) => { e.preventDefault(); onScrollToContact(); }}
                className='hero-cta-link hero-cta-link-outline sgds:inline-flex sgds:items-center sgds:justify-center sgds:gap-sm sgds:font-semibold sgds:text-primary sgds:no-underline'>
                <sgds-icon name='mail' aria-hidden='true' suppressHydrationWarning />
                {ctaContact}
            </a>
        </div>
    );
}

function HeroCtaButtons({ locale, ctaWork, ctaCv, ctaContact, ctaDownloading, t }: Readonly<HeroCtaButtonsProps>) {
    const { isDownloading, errorMessage, handleDownload } = useCvDownload(locale, t);
    const scrollTo = (id: string) =>
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    const scrollToWithHash = (id: string) => {
        scrollTo(id);
        history.pushState(null, '', `#${id}`);
    };
    return (
        <>
            <HeroCtaLinks
                ctaWork={ctaWork}
                ctaCv={ctaCv}
                ctaContact={ctaContact}
                ctaDownloading={ctaDownloading}
                isDownloading={isDownloading}
                onDownload={handleDownload}
                onScrollToProjects={() => scrollToWithHash('projects')}
                onScrollToContact={() => scrollToWithHash('contact')}
            />
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

interface HeroPhotoHeadingProps {
    photoAlt: string;
    greeting: string;
    name: string;
    title: string;
    subtitle: string;
}

function HeroPhotoHeading({ photoAlt, greeting, name, title, subtitle }: Readonly<HeroPhotoHeadingProps>) {
    return (
        <>
            <div className='sgds:mb-xl sgds:flex sgds:justify-center'>
                <div className='sgds:w-32 sgds:h-32 sgds:rounded-full sgds:overflow-hidden sgds:ring-2 sgds:ring-primary sgds:ring-offset-4'>
                    <Image
                        src='/cv-photo.webp'
                        alt={photoAlt}
                        width={128}
                        height={128}
                        className='sgds:w-full sgds:h-full sgds:object-cover'
                        priority
                    />
                </div>
            </div>
            <p className='sgds:text-primary sgds:font-semibold sgds:mb-component-xs sgds:text-body-md'>
                {greeting}
            </p>
            <h1 className='sgds:text-display-md sgds:font-semibold sgds:leading-2-xl sgds:tracking-tighter sgds:text-display-default sgds:mb-component-sm hero-name'>
                {name}
            </h1>
            <h2 className='sgds:text-heading-lg sgds:font-semibold sgds:text-muted sgds:mb-component-md'>
                {title}
            </h2>
            <p className='hero-subtitle sgds:text-body-md sgds:text-muted sgds:mx-auto sgds:mb-xl sgds:leading-xs'>
                {subtitle}
            </p>
        </>
    );
}

export default function Hero() {
    const t = useTranslations('hero');
    const locale = useLocale();
    return (
        <section id='hero' className='sgds:min-h-screen sgds:flex sgds:items-center sgds:justify-center sgds:bg-default'>
            <div className='sgds-container hero-content sgds:text-center sgds:py-layout-lg'>
                <HeroPhotoHeading
                    photoAlt={t('photo_alt')}
                    greeting={t('greeting')}
                    name={t('name')}
                    title={t('title')}
                    subtitle={t('subtitle')}
                />
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

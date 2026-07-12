'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { useCvDownload } from '@/hooks/use-cv-download';
import { useTypedRoles } from '@/hooks/use-typed-roles';
import ParticleCanvas from '@/components/ui/ParticleCanvas';

const ROLES = [
  'Backend Developer',
  '.NET Specialist',
  'React & Next.js Builder',
  'Vibe Engineer',
] as const;

interface HeroCtasProps {
  ctaWork: string;
  ctaCv: string;
  ctaContact: string;
  ctaDownloading: string;
  isDownloading: boolean;
  onDownload: () => void;
  onScrollTo: (id: string) => void;
}

function HeroCtas({
  ctaWork,
  ctaCv,
  ctaContact,
  ctaDownloading,
  isDownloading,
  onDownload,
  onScrollTo,
}: Readonly<HeroCtasProps>) {
  return (
    <div className='hero__ctas'>
      <a
        href='#projects'
        onClick={(e) => {
          e.preventDefault();
          onScrollTo('projects');
        }}
        className='btn-primary'>
        {ctaWork} ↓
      </a>
      <button
        type='button'
        onClick={onDownload}
        disabled={isDownloading}
        className='btn-outline'>
        {isDownloading ? ctaDownloading : ctaCv}
      </button>
      <a
        href='#contact'
        onClick={(e) => {
          e.preventDefault();
          onScrollTo('contact');
        }}
        className='btn-outline'>
        {ctaContact}
      </a>
    </div>
  );
}

function HeroStatusPill({ statusPill }: Readonly<{ statusPill: string }>) {
  return (
    <div className='status-pill'>
      <span className='status-pill__dot' />
      {statusPill}
    </div>
  );
}

function HeroHeading({
  statusPill,
  photoAlt,
  greeting,
  name,
  subtitle,
  typed,
}: Readonly<{
  statusPill: string;
  photoAlt: string;
  greeting: string;
  name: string;
  subtitle: string;
  typed: string;
}>) {
  return (
    <>
      <HeroStatusPill statusPill={statusPill} />
      <div className='hero__photo'>
        <Image
          src='/cv-photo.webp'
          alt={photoAlt}
          width={116}
          height={116}
          priority
        />
      </div>
      <p className='hero__kicker'>{`// ${greeting}`}</p>
      <h1 className='hero__name'>{name}</h1>
      <h2 className='hero__typed'>
        <span className='hero__typed-prompt'>&gt;</span> {typed}
        <span className='typed-cursor' aria-hidden='true'>
          ▌
        </span>
      </h2>
      <p className='hero__subtitle'>{subtitle}</p>
    </>
  );
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  history.pushState(null, '', `#${id}`);
}

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const typed = useTypedRoles(ROLES);
  const { isDownloading, errorMessage, handleDownload } = useCvDownload(
    locale,
    t,
  );

  return (
    <section id='hero' className='hero'>
      <ParticleCanvas className='hero__canvas' />
      <div className='hero__grid-overlay' />
      <div className='hero__content'>
        <HeroHeading
          statusPill={t('status_pill')}
          photoAlt={t('photo_alt')}
          greeting={t('greeting')}
          name={t('name')}
          subtitle={t('subtitle')}
          typed={typed}
        />
        <HeroCtas
          ctaWork={t('cta_work')}
          ctaCv={t('cta_cv')}
          ctaContact={t('cta_contact')}
          ctaDownloading={t('downloading_cv')}
          isDownloading={isDownloading}
          onDownload={handleDownload}
          onScrollTo={scrollToSection}
        />
        {errorMessage && (
          <p role='alert' aria-live='polite' className='hero__alert'>
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  );
}

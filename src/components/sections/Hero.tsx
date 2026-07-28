'use client';

import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { useCvDownload } from '@/hooks/use-cv-download';
import { useTypedRoles } from '@/hooks/use-typed-roles';
import { scrollToSection } from '@/utils/scroll';
import ParticleCanvas from '@/components/ui/ParticleCanvas';

interface HeroCtasProps {
  ctaWork: string;
  ctaCv: string;
  ctaContact: string;
  ctaDownloading: string;
  isDownloading: boolean;
  onDownload: () => void;
  onScrollTo: (id: string) => void;
}

/**
 * The CV takes the primary fill: it is the artifact the visitor came for and the
 * handoff into their own workflow. "View My Work" is a scroll they were going to
 * make anyway, so it drops to an outline.
 */
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
      <button
        type='button'
        onClick={onDownload}
        disabled={isDownloading}
        className='btn-primary'>
        {isDownloading ? ctaDownloading : ctaCv}
      </button>
      <a
        href='#projects'
        onClick={(e) => {
          e.preventDefault();
          onScrollTo('projects');
        }}
        className='btn-outline'>
        {ctaWork} ↓
      </a>
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

interface HeroHeadingProps {
  statusPill: string;
  photoAlt: string;
  greeting: string;
  name: string;
  subtitle: string;
  typed: string;
  roles: string[];
}

function HeroHeading({
  statusPill,
  photoAlt,
  greeting,
  name,
  subtitle,
  typed,
  roles,
}: Readonly<HeroHeadingProps>) {
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
      <h1 id='hero-title' className='hero__name'>{name}</h1>
      {/* Decorative: the ticker's text is mid-keystroke at any given moment.
          It used to be an <h2>, which put fragments like "> .NET Spec▌" into
          the heading outline. Hidden from assistive tech, with the complete
          role list exposed once, statically, beside it. */}
      <p className='hero__typed' aria-hidden='true'>
        <span className='hero__typed-prompt'>&gt;</span> {typed}
        <span className='typed-cursor'>▌</span>
      </p>
      <p className='visually-hidden'>{roles.join(' · ')}</p>
      <p className='hero__subtitle'>{subtitle}</p>
    </>
  );
}

interface HeroNoticesProps {
  errorMessage?: string | null;
  successMessage?: string | null;
}

/**
 * `role='alert'` already implies `aria-live='assertive'`; declaring 'polite'
 * alongside it is a contradiction some screen readers resolve badly. Success
 * takes `role='status'` instead — a confirmation is polite news, and an
 * assertive region would interrupt a reader mid-sentence to announce a file the
 * visitor just asked for.
 */
function HeroNotices({ errorMessage, successMessage }: Readonly<HeroNoticesProps>) {
  if (!errorMessage && !successMessage) return null;
  return (
    <div className='hero__notices'>
      {errorMessage && (
        <p role='alert' className='notice notice--fault'>
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p role='status' className='notice notice--ok'>
          {successMessage}
        </p>
      )}
    </div>
  );
}

/**
 * Localised role list for the typewriter. `t.raw()` returns a fresh array on
 * every render and `useTypedRoles` keys its effect on array identity, so this
 * has to be memoised or the typewriter restarts continuously.
 */
function useHeroRoles(): string[] {
  const t = useTranslations('hero');
  return useMemo(() => t.raw('roles') as string[], [t]);
}

export default function Hero() {
  const t = useTranslations('hero');
  const tCv = useTranslations('cv');
  const locale = useLocale();
  const roles = useHeroRoles();
  const typed = useTypedRoles(roles);
  const { isDownloading, errorMessage, successMessage, handleDownload } =
    useCvDownload(locale, tCv);

  return (
    <section id='hero' aria-labelledby='hero-title' className='hero'>
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
          roles={roles}
        />
        <HeroCtas
          ctaWork={t('cta_work')}
          ctaCv={tCv('download')}
          ctaContact={t('cta_contact')}
          ctaDownloading={tCv('generating')}
          isDownloading={isDownloading}
          onDownload={handleDownload}
          onScrollTo={scrollToSection}
        />
        <HeroNotices
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </div>
    </section>
  );
}

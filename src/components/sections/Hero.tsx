'use client';

import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useCvDownload } from '@/hooks/use-cv-download';
import { useTypedRoles } from '@/hooks/use-typed-roles';
import { scrollToSection } from '@/utils/scroll';

/**
 * The giant mark. Decorative: the name is the `<h1>` below it, so the letters
 * are hidden from assistive technology. Each letter is its own box because the
 * scroll transition moves J and K apart independently.
 */
function HeroLetters() {
    return (
        <div className='hero-intro__letters' aria-hidden='true'>
            <span className='hero-intro__letter hero-intro__letter--j'>J</span>
            <span className='hero-intro__letter hero-intro__letter--k'>K</span>
        </div>
    );
}

interface HeroIdentityProps {
    statusPill: string;
    name: string;
    typed: string;
    roles: string[];
}

function HeroIdentity({ statusPill, name, typed, roles }: Readonly<HeroIdentityProps>) {
    return (
        <div className='hero-intro__id'>
            <p className='status-pill'>
                <span className='status-pill__dot' aria-hidden='true' />
                {statusPill}
            </p>
            <h1 id='hero-title' className='hero-intro__name'>{name}</h1>
            {/* Decorative: the ticker's text is mid-keystroke at any given moment,
                so it is hidden from assistive tech and the complete role list is
                exposed once, statically, beside it. */}
            <p className='hero-intro__ticker' aria-hidden='true'>
                {typed}
                <span className='typed-cursor'>▌</span>
            </p>
            <p className='visually-hidden'>{roles.join(' · ')}</p>
        </div>
    );
}

interface HeroCtasProps {
    ctaWork: string;
    ctaCv: string;
    ctaDownloading: string;
    isDownloading: boolean;
    onDownload: () => void;
}

/**
 * The CV takes the primary fill: it is the artifact the visitor came for.
 * "View my work" is a scroll they were going to make anyway, so it is an outline.
 */
function HeroCtas({
    ctaWork,
    ctaCv,
    ctaDownloading,
    isDownloading,
    onDownload,
}: Readonly<HeroCtasProps>) {
    return (
        <div className='hero-intro__ctas'>
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
                    scrollToSection('projects');
                }}
                className='btn-outline'>
                {ctaWork}
            </a>
        </div>
    );
}

interface HeroNoticesProps {
    errorMessage?: string | null;
    successMessage?: string | null;
}

/**
 * `role='alert'` already implies `aria-live='assertive'`. Success takes
 * `role='status'` instead: a confirmation is polite news, and an assertive
 * region would interrupt a reader to announce a file they just asked for.
 */
function HeroNotices({ errorMessage, successMessage }: Readonly<HeroNoticesProps>) {
    if (!errorMessage && !successMessage) {
        return null;
    }
    return (
        <div className='hero-intro__notices'>
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

/** A visual cue only; keyboard and screen-reader users scroll on their own. */
function HeroScrollHint({ label }: Readonly<{ label: string }>) {
    return (
        <p className='hero-intro__hint' aria-hidden='true'>
            <span className='hero-intro__hint-arrow'>↓</span> {label}
        </p>
    );
}

/**
 * Localised role list for the ticker. `t.raw()` returns a fresh array on every
 * render and `useTypedRoles` keys its effect on array identity, so this has to
 * be memoised or the ticker restarts continuously.
 */
function useHeroRoles(): string[] {
    const t = useTranslations('hero');
    return useMemo(() => t.raw('roles') as string[], [t]);
}

function HeroActions() {
    const t = useTranslations('hero');
    const tCv = useTranslations('cv');
    const locale = useLocale();
    const { isDownloading, errorMessage, successMessage, handleDownload } =
        useCvDownload(locale, tCv);

    return (
        <div className='hero-intro__actions'>
            <HeroCtas
                ctaWork={t('cta_work')}
                ctaCv={tCv('download')}
                ctaDownloading={tCv('generating')}
                isDownloading={isDownloading}
                onDownload={handleDownload}
            />
            <HeroNotices errorMessage={errorMessage} successMessage={successMessage} />
            <HeroScrollHint label={t('scroll_hint')} />
        </div>
    );
}

/**
 * The intro screen of the hero stage: the letters in a row of their own, and
 * below them the copy band (identity on the left, actions on the right from
 * 900px wide). The two are separate grid rows, so they cannot overlap.
 */
export default function Hero() {
    const t = useTranslations('hero');
    const roles = useHeroRoles();
    const typed = useTypedRoles(roles);

    return (
        <div className='hero-intro'>
            <HeroLetters />
            <div className='hero-intro__band'>
                <HeroIdentity
                    statusPill={t('status_pill')}
                    name={t('name')}
                    typed={typed}
                    roles={roles}
                />
                <HeroActions />
            </div>
        </div>
    );
}

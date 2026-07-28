'use client';

import { useRouter, usePathname } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { currentSectionId } from '@/utils/scroll';
import { SECTION_IDS } from '@/utils/sections';

const LOCALES = ['en', 'id'] as const;
type Locale = typeof LOCALES[number];

export default function LanguageToggle() {
    const locale = useLocale() as Locale;
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('lang');

    /**
     * Carries the reading position across the locale change. A bare
     * `router.replace(pathname)` lands every switch at scrollY 0 — on a phone
     * that is sixteen screens of scroll discarded for choosing the other
     * language, which makes ID read as a penalty rather than as parity.
     *
     * The hash does the work: `section { scroll-margin-top: var(--navbar-height) }`
     * in globals.css already offsets anchor landings past the fixed bar, so no
     * scroll code is needed on the far side.
     */
    const handleLocaleClick = (nextLocale: Locale) => {
        if (nextLocale === locale) return;
        const section = currentSectionId(SECTION_IDS);
        const target =
            section && section !== 'hero' ? `${pathname}#${section}` : pathname;
        router.replace(target, { locale: nextLocale });
    };

    return (
        <div role="group" aria-label={t('switch')} className='lang-pill'>
            {LOCALES.map((l) => (
                <button
                    key={l}
                    type="button"
                    className='lang-pill__btn'
                    aria-pressed={locale === l}
                    onClick={() => { handleLocaleClick(l); }}
                >
                    {l.toUpperCase()}
                </button>
            ))}
        </div>
    );
}

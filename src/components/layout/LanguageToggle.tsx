'use client';

import { useRouter, usePathname } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';

const LOCALES = ['en', 'id'] as const;
type Locale = typeof LOCALES[number];

export default function LanguageToggle() {
    const locale = useLocale() as Locale;
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('lang');

    const handleLocaleClick = (nextLocale: Locale) => {
        if (nextLocale === locale) return;
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <div
            role="group"
            aria-label={t('switch')}
            className='lang-pill'
            suppressHydrationWarning
        >
            {LOCALES.map((l) => (
                <button
                    key={l}
                    type="button"
                    className='lang-pill__btn'
                    aria-pressed={locale === l}
                    onClick={() => { handleLocaleClick(l); }}
                    suppressHydrationWarning
                >
                    {l.toUpperCase()}
                </button>
            ))}
        </div>
    );
}

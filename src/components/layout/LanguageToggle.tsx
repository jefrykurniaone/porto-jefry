'use client';

import { useRouter, usePathname } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';

export default function LanguageToggle() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('lang');

    const toggleLocale = () => {
        const nextLocale = locale === 'en' ? 'id' : 'en';
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <sgds-button
            type="button"
            variant="outline"
            tone="neutral"
            size="sm"
            onClick={toggleLocale}
            aria-label={t('switch')}
            suppressHydrationWarning
        >
            {locale === 'en' ? 'EN' : 'ID'}
        </sgds-button>
    );
}

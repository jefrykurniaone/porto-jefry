'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

export default function LanguageToggle() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('lang');

    const toggleLocale = () => {
        const nextLocale = locale === 'en' ? 'id' : 'en';
        // Replace the locale prefix in the current path
        const segments = pathname.split('/');
        segments[1] = nextLocale;
        router.push(segments.join('/') || '/');
    };

    return (
        <button
            onClick={toggleLocale}
            aria-label={t('switch')}
            className='px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
            {locale === 'en' ? 'EN' : 'ID'}
        </button>
    );
}

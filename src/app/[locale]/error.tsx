'use client';

import { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    const t = useTranslations('error');
    const locale = useLocale();

    useEffect(() => {
        // Log error to console for debugging (not exposed to user)
        // eslint-disable-next-line no-console
        console.error('[Error Boundary]', error);
    }, [error]);

    return (
        <div className='fullpage-center'>
            <div>
                <p className='fullpage-center__glyph' aria-hidden='true'>[!]</p>
                <h1 className='fullpage-center__title'>{t('title')}</h1>
                <p className='fullpage-center__message'>{t('message')}</p>
                <div className='fullpage-center__actions'>
                    <button type='button' onClick={reset} className='btn-primary'>
                        {t('tryAgain')}
                    </button>
                    <Link href={`/${locale}`} className='btn-outline'>
                        {t('returnHome')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

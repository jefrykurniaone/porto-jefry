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
        <div className='sgds:min-h-screen sgds:flex sgds:items-center sgds:justify-center sgds:px-4 sgds:bg-default'>
            <div className='sgds:text-center'>
                <sgds-icon
                    name='exclamation-triangle-fill'
                    aria-hidden='true'
                    suppressHydrationWarning
                    style={{ width: '64px', height: '64px' }}
                />
                <h1 className='sgds:text-heading-lg sgds:font-semibold sgds:mt-4 sgds:mb-4 sgds:text-default'>
                    {t('title')}
                </h1>
                <p className='sgds:text-body-md sgds:text-muted sgds:mb-8'>
                    {t('message')}
                </p>
                <div className='sgds:flex sgds:gap-layout-sm sgds:justify-center'>
                    <sgds-button type='button' onClick={reset} suppressHydrationWarning>
                        {t('tryAgain')}
                    </sgds-button>
                    <Link href={`/${locale}`}>
                        <sgds-button
                            type='button'
                            variant='outline'
                            suppressHydrationWarning
                        >
                            {t('returnHome')}
                        </sgds-button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

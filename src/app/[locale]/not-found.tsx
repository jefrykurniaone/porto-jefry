'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function NotFound() {
    const t = useTranslations('notFound');

    return (
        <div className='sgds:min-h-screen sgds:flex sgds:items-center sgds:justify-center sgds:px-4 sgds:bg-default'>
            <div className='sgds:text-center'>
                <sgds-icon
                    name='question-circle'
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
                <Link href='/'>
                    <sgds-button type='button' suppressHydrationWarning>
                        {t('returnHome')}
                    </sgds-button>
                </Link>
            </div>
        </div>
    );
}

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function NotFound() {
    const t = useTranslations('notFound');

    return (
        <div className='fullpage-center'>
            <div>
                <p className='fullpage-center__glyph' aria-hidden='true'>404_</p>
                <h1 className='fullpage-center__title'>{t('title')}</h1>
                <p className='fullpage-center__message'>{t('message')}</p>
                <div className='fullpage-center__actions'>
                    <Link href='/' className='btn-primary'>
                        {t('returnHome')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

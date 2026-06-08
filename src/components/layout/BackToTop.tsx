'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function BackToTop() {
    const t = useTranslations('nav');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const about = document.getElementById('about');
        if (!about) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
            },
            { threshold: 0 },
        );

        observer.observe(about);
        return () => observer.disconnect();
    }, []);

    const handleClick = () => {
        globalThis.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!visible) return null;

    return (
        <button
            type='button'
            onClick={handleClick}
            aria-label={t('back_to_top')}
            className='sgds:fixed sgds:bottom-6 sgds:right-6 sgds:z-50 sgds:flex sgds:items-center sgds:justify-center sgds:rounded-full sgds:bg-primary sgds:text-white sgds:shadow-md hover:sgds:bg-primary-dark focus-visible:sgds:outline-none focus-visible:sgds:ring-2 focus-visible:sgds:ring-primary focus-visible:sgds:ring-offset-2'
            style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}
        >
            <sgds-icon name="arrow-up" suppressHydrationWarning />
        </button>
    );
}

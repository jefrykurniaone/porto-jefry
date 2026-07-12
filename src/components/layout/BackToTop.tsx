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
            className='back-to-top'>
            ↑
        </button>
    );
}

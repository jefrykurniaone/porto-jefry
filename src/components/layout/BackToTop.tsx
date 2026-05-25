'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpIcon } from 'lucide-react';

export default function BackToTop() {
    const t = useTranslations('nav');
    const [visible, setVisible] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const about = document.getElementById('about');
        if (!about) return;

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                setVisible(entry.isIntersecting || entry.boundingClientRect.top < 0);
            },
            { threshold: 0 },
        );
        observerRef.current.observe(about);

        return () => {
            observerRef.current?.disconnect();
        };
    }, []);

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            type='button'
            onClick={handleClick}
            aria-label={t('back_to_top')}
            className={[
                'fixed bottom-6 right-6 z-50',
                'flex items-center justify-center',
                'w-10 h-10 rounded-full',
                'bg-blue-600 dark:bg-blue-500 text-white shadow-md',
                'hover:bg-blue-700 dark:hover:bg-blue-600 focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
                'transition-opacity duration-300',
                visible ? 'opacity-100' : 'opacity-0 pointer-events-none',
            ].join(' ')}>
            <ArrowUpIcon size={18} aria-hidden='true' />
        </button>
    );
}

'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { ArrowDownIcon, DownloadIcon, MailIcon } from 'lucide-react';

export default function Hero() {
    const t = useTranslations('hero');
    const locale = useLocale();

    return (
        <section
            id='hero'
            className='min-h-screen flex items-center justify-center px-4 pt-16'>
            <div className='max-w-3xl mx-auto text-center'>
                {/* Profile photo */}
                <div className='mb-8 flex justify-center'>
                    <div className='w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-500/30 ring-offset-4 ring-offset-white dark:ring-offset-gray-950'>
                        <Image
                            src='/cv-photo.png'
                            alt='Jefry Kurniawan'
                            width={128}
                            height={128}
                            className='w-full h-full object-cover'
                            priority
                        />
                    </div>
                </div>

                <p className='text-blue-600 dark:text-blue-400 font-medium mb-2'>
                    {t('greeting')}
                </p>
                <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4'>
                    {t('name')}
                </h1>
                <h2 className='text-xl sm:text-2xl font-semibold text-gray-500 dark:text-gray-400 mb-6'>
                    {t('title')}
                </h2>
                <p className='text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed'>
                    {t('subtitle')}
                </p>

                {/* CTA Buttons */}
                <div className='flex flex-wrap justify-center gap-4'>
                    <button
                        onClick={() =>
                            document
                                .getElementById('projects')
                                ?.scrollIntoView({ behavior: 'smooth' })
                        }
                        className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors'>
                        <ArrowDownIcon size={18} />
                        {t('cta_work')}
                    </button>
                    <a
                        href={`/api/generate-cv?locale=${locale}`}
                        download='Jefry_Kurniawan_CV.pdf'
                        className='inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors'>
                        <DownloadIcon size={18} />
                        {t('cta_cv')}
                    </a>
                    <button
                        onClick={() =>
                            document
                                .getElementById('contact')
                                ?.scrollIntoView({ behavior: 'smooth' })
                        }
                        className='inline-flex items-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 font-medium rounded-xl transition-colors'>
                        <MailIcon size={18} />
                        {t('cta_contact')}
                    </button>
                </div>
            </div>
        </section>
    );
}

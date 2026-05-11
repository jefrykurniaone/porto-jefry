'use client';

import { useTranslations, useMessages } from 'next-intl';
import { experiences } from '@/data/experience';
import { BriefcaseIcon } from 'lucide-react';

interface ExperienceMessages {
    items: Array<{ bullets: string[] }>;
}

export default function Experience() {
    const t = useTranslations('experience');
    const messages = useMessages();
    const expItems = (messages.experience as unknown as ExperienceMessages).items;

    return (
        <section
            id='experience'
            className='py-20 px-4 bg-gray-50 dark:bg-gray-900/50'>
            <div className='max-w-4xl mx-auto'>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center'>
                    {t('title')}
                </h2>
                <div className='relative'>
                    {/* Vertical line */}
                    <div className='absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700' />

                    <div className='flex flex-col gap-10'>
                        {experiences.map((exp, i) => (
                            <div
                                key={`${exp.company}-${exp.period}`}
                                className='relative flex gap-6 md:gap-10'>
                                {/* Icon */}
                                <div className='shrink-0 z-10 flex items-start'>
                                    <div className='w-8 h-8 md:w-16 md:h-16 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center border-2 border-white dark:border-gray-950'>
                                        <BriefcaseIcon
                                            size={14}
                                            className='text-blue-600 dark:text-blue-400 md:hidden'
                                        />
                                        <BriefcaseIcon
                                            size={20}
                                            className='text-blue-600 dark:text-blue-400 hidden md:block'
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className='flex-1 pb-2'>
                                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1'>
                                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                                            {exp.role}
                                        </h3>
                                        <span className='text-sm text-blue-600 dark:text-blue-400 font-medium shrink-0'>
                                            {exp.period}
                                        </span>
                                    </div>
                                    <p className='text-gray-500 dark:text-gray-400 font-medium mb-3'>
                                        {exp.company}
                                    </p>
                                    <ul className='space-y-1.5 mb-4'>
                                        {(expItems[i]?.bullets ?? []).map((b) => (
                                            <li
                                                key={b}
                                                className='text-gray-600 dark:text-gray-300 text-sm flex gap-2'>
                                                <span className='text-blue-500 mt-1.5 shrink-0'>
                                                    •
                                                </span>
                                                <span>{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {exp.tech && (
                                        <div className='flex flex-wrap gap-2'>
                                            {exp.tech.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className='text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium'>
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { experiences, type ExperienceItem } from '@/data/experience';
import { translatePeriod } from '@/utils/translate-period';

const MAX_BULLETS = 3;

export interface ExperienceMessages {
    items: Record<string, { bullets: string[] }>;
}

interface ExperienceRowProps {
    exp: ExperienceItem;
    bullets: string[];
    period: string;
}

function ExpandableBullets({ bullets }: Readonly<{ bullets: string[] }>) {
    const t = useTranslations('experience');
    const [isOpen, setIsOpen] = useState(false);
    const visibleBullets = isOpen ? bullets : bullets.slice(0, MAX_BULLETS);
    const hiddenCount = bullets.length - MAX_BULLETS;

    if (bullets.length === 0) return null;

    return (
        <>
            <ul className='exp-bullets'>
                {visibleBullets.map((b) => (
                    <li key={b} className='exp-bullet'>
                        <span className='exp-bullet__marker' aria-hidden='true'>▸</span>
                        <span>{b}</span>
                    </li>
                ))}
            </ul>
            {hiddenCount > 0 && (
                <button
                    type='button'
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    className='exp-more-btn'>
                    {isOpen ? t('show_less') : t('show_more', { count: hiddenCount })}
                </button>
            )}
        </>
    );
}

function ExperienceRow({ exp, bullets, period }: Readonly<ExperienceRowProps>) {
    return (
        <div className='exp-row'>
            <div>
                <p className='exp-period'>{period}</p>
                <p className='exp-location'>{exp.location}</p>
            </div>
            <div>
                <h3 className='exp-role'>{exp.role}</h3>
                <p className='exp-company'>{exp.company}</p>
                <ExpandableBullets bullets={bullets} />
                {exp.tech && (
                    <div className='chip-row'>
                        {exp.tech.map((tech) => (
                            <span key={tech} className='chip'>{tech}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Experience() {
    const t = useTranslations('experience');
    const nav = useTranslations('nav');
    const locale = useLocale();

    const expItems = (t.raw('items') as ExperienceMessages['items']) ?? {};

    return (
        <section id='experience' className='section-band'>
            <div className='container-page section-inner'>
                <p className='section-kicker'>02 / {nav('experience')}</p>
                <h2 className='section-title'>{t('title')}</h2>
                <div>
                    {experiences.map((exp) => (
                        <ExperienceRow
                            key={exp.id}
                            exp={exp}
                            bullets={expItems[exp.id]?.bullets ?? []}
                            period={translatePeriod(
                                exp.period.replace('Present', t('present')),
                                locale,
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

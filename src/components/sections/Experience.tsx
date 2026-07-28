'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { experiences, type ExperienceItem } from '@/data/experience';
import { translatePeriod } from '@/utils/translate-period';
import SectionHeader from '@/components/ui/SectionHeader';

const MAX_BULLETS = 3;

/**
 * Start of the earliest role. Read from the data rather than written down, so
 * the header cannot drift from the array beneath it. Entries are newest-first,
 * and every period is authored as `MMM YYYY – MMM YYYY`.
 */
function careerStart(): string {
    return experiences.at(-1)?.period.split('–')[0].trim() ?? '';
}

/**
 * Every role so far is in Indonesia, so the rail printed `INDONESIA` six times
 * down ~210px of the best scanning space on the page while saying nothing. The
 * fact now lives once, authoritatively, in the hero status pill. Derived rather
 * than deleted: add a role in another country and the column returns by itself.
 */
const LOCATIONS_VARY = new Set(experiences.map((exp) => exp.location)).size > 1;

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
                {LOCATIONS_VARY && (
                    <p className='exp-location'>{exp.location}</p>
                )}
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
    const locale = useLocale();

    const expItems = (t.raw('items') as ExperienceMessages['items']) ?? {};

    return (
        <section
            id='experience'
            aria-labelledby='experience-title'
            className='section-band'>
            <div className='container-page section-inner'>
                <SectionHeader
                    command='history --work'
                    title={t('title')}
                    titleId='experience-title'
                    output={t('summary', {
                        roles: experiences.length,
                        since: translatePeriod(careerStart(), locale),
                    })}
                />
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

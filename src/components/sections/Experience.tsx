'use client';

import { useTranslations, useLocale } from 'next-intl';
import { experiences, type ExperienceItem } from '@/data/experience';
import { translatePeriod } from '@/utils/translate-period';
import { TechList } from '@/components/ui/TechList';

export interface ExperienceMessages {
    items: Record<string, { bullets: string[] }>;
}

interface ExperienceCardProps {
    exp: ExperienceItem;
    bullets: string[];
    presentLabel: string;
    locale: string;
}

function ExperienceBulletList({ bullets }: Readonly<{ bullets: string[] }>) {
    return (
        <ul className='experience-bullet-list sgds:mb-lg'>
            {bullets.map((b) => (
                <li
                    key={b}
                    className='experience-bullet-item readable-muted sgds:text-body-md sgds:flex'>
                    <span className='readable-muted sgds:mt-1.5 sgds:shrink-0'>
                        •
                    </span>
                    <span>{b}</span>
                </li>
            ))}
        </ul>
    );
}

function ExperienceCard({
    exp,
    bullets,
    presentLabel,
    locale,
}: Readonly<ExperienceCardProps>) {
    const period = translatePeriod(
        exp.period.replace('Present', presentLabel),
        locale,
    );
    return (
        <div className='timeline-item'>
            <sgds-card suppressHydrationWarning>
                <div slot='title' className='sgds:flex sgds:flex-col sgds:sm:flex-row sgds:sm:items-center sgds:sm:justify-between sgds:gap-component-xs'>
                    <h3 className='sgds:text-heading-sm sgds:font-semibold sgds:text-heading-default'>
                        {exp.role}
                    </h3>
                    <span className='sgds:text-label-sm sgds:text-primary sgds:font-semibold sgds:shrink-0'>
                        {period}
                    </span>
                </div>
                <div slot='description'>
                    <p className='readable-muted sgds:font-semibold sgds:mb-component-xs sgds:text-body-md'>
                        {exp.company}
                    </p>
                    {bullets.length > 0 && <ExperienceBulletList bullets={bullets} />}
                    {exp.tech && <TechList items={exp.tech} />}
                </div>
            </sgds-card>
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
            className='sgds:py-layout-lg sgds:bg-default'>
            <div className='sgds-container'>
                <h2 className='sgds:text-heading-lg sgds:font-semibold sgds:text-heading-default sgds:mb-layout-md sgds:text-center'>
                    {t('title')}
                </h2>
                <div className='timeline-shell sgds:relative sgds:mx-auto'>
                    <div className='timeline-list sgds:flex sgds:flex-col'>
                        {experiences.map((exp) => (
                            <ExperienceCard
                                key={exp.id}
                                exp={exp}
                                bullets={expItems[exp.id]?.bullets ?? []}
                                presentLabel={t('present')}
                                locale={locale}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

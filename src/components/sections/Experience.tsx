'use client';

import { useTranslations, useMessages, useLocale } from 'next-intl';
import { experiences, type ExperienceItem } from '@/data/experience';
import { translatePeriod } from '@/utils/translate-period';

interface ExperienceCardProps {
    exp: ExperienceItem;
    bullets: string[];
    presentLabel: string;
    locale: string;
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
        <div className='timeline-item sgds:relative sgds:flex'>
            <div className='sgds:shrink-0 sgds:z-10 sgds:flex sgds:items-start'>
                <div className='timeline-dot sgds:rounded-full sgds:flex sgds:items-center sgds:justify-center'>
                    <sgds-icon
                        name='briefcase'
                        aria-hidden='true'
                        suppressHydrationWarning
                        className='sgds:md:sr-only'
                    />
                    <sgds-icon
                        name='briefcase'
                        aria-hidden='true'
                        suppressHydrationWarning
                        className='sgds:sr-only sgds:md:not-sr-only'
                    />
                </div>
            </div>
            <div className='experience-card-wrapper sgds:flex-1'>
                <sgds-card className='compact-card' suppressHydrationWarning>
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
                        {bullets.length > 0 && (
                            <ul className='experience-bullet-list sgds:mb-lg'>
                                {bullets.map((b) => (
                                    <li
                                        key={b}
                                        className='experience-bullet-item readable-muted sgds:text-body-md sgds:flex'>
                                        <span className='sgds:text-primary sgds:mt-1.5 sgds:shrink-0'>
                                            •
                                        </span>
                                        <span>{b}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {exp.tech && (
                            <div className='experience-badge-list sgds:flex sgds:flex-wrap'>
                                {exp.tech.map((tech) => (
                                    <span key={tech}>
                                        <sgds-badge outlined suppressHydrationWarning>
                                            {tech}
                                        </sgds-badge>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </sgds-card>
            </div>
        </div>
    );
}

export default function Experience() {
    const t = useTranslations('experience');
    const locale = useLocale();
    const messages = useMessages();

    interface ExperienceMessages {
        items: Record<string, { bullets: string[] }>;
    }
    const expMessages = messages.experience as unknown as ExperienceMessages;
    const expItems = expMessages?.items ?? {};

    return (
        <section
            id='experience'
            className='sgds:py-layout-lg sgds:bg-default'>
            <div className='sgds-container'>
                <h2 className='sgds:text-heading-lg sgds:font-semibold sgds:text-heading-default sgds:mb-layout-md sgds:text-center'>
                    {t('title')}
                </h2>
                <div className='timeline-shell sgds:relative sgds:mx-auto'>
                    {/* Timeline rail — custom per D-07 */}
                    <div className='timeline-rail' />
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

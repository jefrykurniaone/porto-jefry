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
        <div className='sgds:relative sgds:flex sgds:gap-layout-md'>
            <div className='sgds:shrink-0 sgds:z-10 sgds:flex sgds:items-start'>
                <div className='sgds:w-8 sgds:h-8 md:sgds:w-16 md:sgds:h-16 sgds:rounded-full sgds:bg-primary-subtle sgds:flex sgds:items-center sgds:justify-center sgds:border-2 sgds:border-default'>
                    <sgds-icon
                        name='briefcase'
                        aria-hidden='true'
                        suppressHydrationWarning
                        className='md:sgds:sr-only'
                    />
                    <sgds-icon
                        name='briefcase'
                        aria-hidden='true'
                        suppressHydrationWarning
                        className='sgds:sr-only md:sgds:not-sr-only'
                    />
                </div>
            </div>
            <div className='sgds:flex-1 sgds:pb-component-sm'>
                <sgds-card suppressHydrationWarning>
                    <div slot='title' className='sgds:flex sgds:flex-col sm:sgds:flex-row sm:sgds:items-center sm:sgds:justify-between sgds:gap-component-xs'>
                        <h3 className='sgds:text-heading-sm sgds:font-semibold sgds:text-heading-default'>
                            {exp.role}
                        </h3>
                        <span className='sgds:text-label-sm sgds:text-primary sgds:font-semibold sgds:shrink-0'>
                            {period}
                        </span>
                    </div>
                    <span slot='description'>
                        <p className='sgds:text-muted sgds:font-semibold sgds:mb-component-xs sgds:text-body-md'>
                            {exp.company}
                        </p>
                        {bullets.length > 0 && (
                            <ul className='sgds:space-y-component-xs sgds:mb-component-md'>
                                {bullets.map((b) => (
                                    <li
                                        key={b}
                                        className='sgds:text-body-md sgds:text-muted sgds:flex sgds:gap-component-xs'>
                                        <span className='sgds:text-primary sgds:mt-1.5 sgds:shrink-0'>
                                            •
                                        </span>
                                        <span>{b}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {exp.tech && (
                            <div className='sgds:flex sgds:flex-wrap sgds:gap-component-xs'>
                                {exp.tech.map((tech) => (
                                    <span key={tech}>
                                        <sgds-badge outlined suppressHydrationWarning>
                                            {tech}
                                        </sgds-badge>
                                    </span>
                                ))}
                            </div>
                        )}
                    </span>
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
                <div className='sgds:relative sgds:max-w-3xl sgds:mx-auto'>
                    {/* Timeline rail — custom per D-07 */}
                    <div className='sgds:absolute sgds:left-4 md:sgds:left-8 sgds:top-0 sgds:bottom-0 sgds:w-px sgds:bg-border-default' />
                    <div className='sgds:flex sgds:flex-col sgds:gap-layout-md'>
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

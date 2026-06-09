import { useTranslations, useLocale } from 'next-intl';
import { education, type EducationItem } from '@/data/education';
import { translatePeriod } from '@/utils/translate-period';

interface EducationCardProps {
    edu: EducationItem;
    gpaLabel: string;
    locale: string;
}

function EducationCard({ edu, gpaLabel, locale }: Readonly<EducationCardProps>) {
    return (
        <div className='sgds-col-4 sgds-col-sm-4 sgds-col-lg-4'>
            <sgds-card suppressHydrationWarning>
                <span slot='title' className='sgds:text-heading-sm sgds:font-semibold sgds:text-heading-default'>
                    {edu.institution}
                </span>
                <div slot='description'>
                    <p className='sgds:text-label-sm sgds:text-primary sgds:font-semibold sgds:mb-component-xs'>
                        {translatePeriod(edu.period, locale)}
                    </p>
                    <p className='sgds:text-body-md sgds:text-body-default'>
                        {edu.degree}{edu.major && ` — ${edu.major}`}
                    </p>
                    {edu.gpa && (
                        <p className='sgds:text-label-sm sgds:text-muted sgds:mt-component-xs'>
                            {gpaLabel}: {edu.gpa}
                        </p>
                    )}
                </div>
            </sgds-card>
        </div>
    );
}

interface EducationGroupProps {
    title: string;
    items: EducationItem[];
    gpaLabel: string;
    locale: string;
}

function EducationGroup({ title, items, gpaLabel, locale }: Readonly<EducationGroupProps>) {
    if (items.length === 0) return null;
    return (
        <div>
            <h3 className='sgds:text-heading-sm sgds:font-semibold sgds:text-heading-default sgds:mb-layout-sm'>
                {title}
            </h3>
            <div className='sgds-grid'>
                {items.map((edu) => (
                    <EducationCard key={edu.institution} edu={edu} gpaLabel={gpaLabel} locale={locale} />
                ))}
            </div>
        </div>
    );
}

export default function Education() {
    const t = useTranslations('education');
    const locale = useLocale();
    const formal = education.filter((e) => e.type === 'formal');
    const informal = education.filter((e) => e.type === 'informal');

    return (
        <section id='education' className='sgds:py-layout-lg sgds:bg-alternate'>
            <div className='sgds-container'>
                <h2 className='sgds:text-heading-lg sgds:font-semibold sgds:text-heading-default sgds:mb-layout-md sgds:text-center'>
                    {t('title')}
                </h2>
                <div className='sgds:space-y-layout-md sgds:max-w-4xl sgds:mx-auto'>
                    <EducationGroup title={t('formal')} items={formal} gpaLabel={t('gpa')} locale={locale} />
                    <EducationGroup title={t('informal')} items={informal} gpaLabel={t('gpa')} locale={locale} />
                </div>
            </div>
        </section>
    );
}

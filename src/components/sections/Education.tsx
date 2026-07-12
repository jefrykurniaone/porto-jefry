import { useTranslations, useLocale } from 'next-intl';
import { education, type EducationItem } from '@/data/education';
import { translatePeriod } from '@/utils/translate-period';

interface EducationCardProps {
    edu: EducationItem;
    kindLabel: string;
    degree: string;
    gpaLabel: string;
    locale: string;
}

function EducationCard({ edu, kindLabel, degree, gpaLabel, locale }: Readonly<EducationCardProps>) {
    return (
        <div className='panel-card edu-card'>
            <p className='card-eyebrow'>{kindLabel}</p>
            <h3 className='edu-card__institution'>{edu.institution}</h3>
            <p className='edu-card__degree'>{degree}</p>
            <p className='card-period'>{translatePeriod(edu.period, locale)}</p>
            {edu.gpa && (
                <p className='edu-card__gpa'>
                    {gpaLabel}: {edu.gpa}
                </p>
            )}
        </div>
    );
}

interface EducationDegreeMessages {
    items?: Record<string, { degree?: string }>;
}

export default function Education() {
    const t = useTranslations('education');
    const nav = useTranslations('nav');
    const locale = useLocale();
    const degreeItems = (t.raw('items') as EducationDegreeMessages['items']) ?? {};
    const fallbackDegree = (edu: EducationItem) =>
        edu.major ? `${edu.degree} in ${edu.major}` : edu.degree;

    return (
        <section id='education' className='section-band section-band--alt'>
            <div className='container-page section-inner'>
                <p className='section-kicker'>05 / {nav('education')}</p>
                <h2 className='section-title'>{t('combined_title')}</h2>
                <div className='edu-grid'>
                    {education.map((edu) => (
                        <EducationCard
                            key={edu.id}
                            edu={edu}
                            kindLabel={edu.type === 'formal' ? t('kind_formal') : t('kind_cert')}
                            degree={degreeItems[edu.id]?.degree ?? fallbackDegree(edu)}
                            gpaLabel={t('gpa')}
                            locale={locale}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

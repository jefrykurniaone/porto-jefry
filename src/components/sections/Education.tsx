import { useTranslations, useLocale } from 'next-intl';
import { education, type EducationItem } from '@/data/education';
import { translatePeriod } from '@/utils/translate-period';
import SectionHeader from '@/components/ui/SectionHeader';

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

interface CertificationCardProps {
    kindLabel: string;
    cert: { name: string; issuer: string; period: string; description: string };
    locale: string;
}

/**
 * Certifications have no data file — `messages.certifications` is their single
 * record, shared with the PDF's Certifications block. The issuer takes the
 * institution slot so this card keeps the same rhythm as its neighbours.
 */
function CertificationCard({ kindLabel, cert, locale }: Readonly<CertificationCardProps>) {
    return (
        <div className='panel-card edu-card'>
            <p className='card-eyebrow'>{kindLabel}</p>
            <h3 className='edu-card__institution'>{cert.issuer}</h3>
            <p className='edu-card__degree'>{cert.name}</p>
            <p className='card-period'>{translatePeriod(cert.period, locale)}</p>
            <p className='edu-card__degree'>{cert.description}</p>
        </div>
    );
}

interface EducationDegreeMessages {
    items?: Record<string, { degree?: string }>;
}

/** One certification, held in `messages.certifications` rather than a data file. */
const CERTIFICATION_COUNT = 1;

function EducationGrid() {
    const t = useTranslations('education');
    const cert = useTranslations('certifications');
    const locale = useLocale();
    const degreeItems = (t.raw('items') as EducationDegreeMessages['items']) ?? {};
    const fallbackDegree = (edu: EducationItem) =>
        edu.major ? `${edu.degree} in ${edu.major}` : edu.degree;

    return (
        <div className='edu-grid'>
            {education.map((edu) => (
                <EducationCard
                    key={edu.id}
                    edu={edu}
                    kindLabel={t('kind_formal')}
                    degree={degreeItems[edu.id]?.degree ?? fallbackDegree(edu)}
                    gpaLabel={t('gpa')}
                    locale={locale}
                />
            ))}
            <CertificationCard
                kindLabel={t('kind_cert')}
                cert={cert.raw('coding_id')}
                locale={locale}
            />
        </div>
    );
}

export default function Education() {
    const t = useTranslations('education');

    return (
        <section
            id='education'
            aria-labelledby='education-title'
            className='section-band section-band--alt'>
            <div className='container-page section-inner'>
                <SectionHeader
                    command='cat credentials.md'
                    title={t('combined_title')}
                    titleId='education-title'
                    output={t('summary', {
                        degrees: education.length,
                        certifications: CERTIFICATION_COUNT,
                    })}
                />
                <EducationGrid />
            </div>
        </section>
    );
}

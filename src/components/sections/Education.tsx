import { useTranslations, useLocale } from 'next-intl';
import { education, type EducationItem } from '@/data/education';
import { translatePeriod } from '@/utils/translate-period';
import SectionHeader from '@/components/ui/SectionHeader';
import Reveal from '@/components/ui/Reveal';

interface EduRowProps {
    period: string;
    kindLabel: string;
    institution: string;
    degree: string;
    gpaLabel?: string;
    gpa?: string;
    description?: string;
}

/**
 * The Experience row shape: period as a Label in the left column, degree and
 * institution at large size on the right. Shared by both formal-education
 * rows and the certification row.
 */
function EduRow({ period, kindLabel, institution, degree, gpaLabel, gpa, description }: Readonly<EduRowProps>) {
    return (
        <div className='edu-row'>
            <div className='edu-row__meta'>
                <p className='edu-period'>{period}</p>
                <p className='edu-kind'>{kindLabel}</p>
            </div>
            <div>
                <h3 className='edu-institution'>{institution}</h3>
                <p className='edu-degree'>{degree}</p>
                {description && <p className='edu-description'>{description}</p>}
                {gpa && (
                    <p className='edu-gpa'>
                        {gpaLabel}: {gpa}
                    </p>
                )}
            </div>
        </div>
    );
}

interface EducationDegreeMessages {
    items?: Record<string, { degree?: string }>;
}

interface CertificationMessage {
    name: string;
    issuer: string;
    period: string;
    description: string;
}

/** One certification, held in `messages.certifications` rather than a data file. */
const CERTIFICATION_COUNT = 1;

/**
 * Certifications have no data file — `messages.certifications` is their single
 * record, shared with the PDF's Certifications block. The issuer takes the
 * institution slot so this row keeps the same shape as its neighbours.
 */
function EducationRows() {
    const t = useTranslations('education');
    const certT = useTranslations('certifications');
    const locale = useLocale();
    const degreeItems = (t.raw('items') as EducationDegreeMessages['items']) ?? {};
    const fallbackDegree = (edu: EducationItem) =>
        edu.major ? `${edu.degree} in ${edu.major}` : edu.degree;
    const cert = certT.raw('coding_id') as CertificationMessage;

    return (
        <Reveal className='edu-rows'>
            {education.map((edu) => (
                <EduRow
                    key={edu.id}
                    period={translatePeriod(edu.period, locale)}
                    kindLabel={t('kind_formal')}
                    institution={edu.institution}
                    degree={degreeItems[edu.id]?.degree ?? fallbackDegree(edu)}
                    gpaLabel={t('gpa')}
                    gpa={edu.gpa}
                />
            ))}
            <EduRow
                period={translatePeriod(cert.period, locale)}
                kindLabel={t('kind_cert')}
                institution={cert.issuer}
                degree={cert.name}
                description={cert.description}
            />
        </Reveal>
    );
}

export default function Education() {
    const t = useTranslations('education');

    return (
        <section
            id='education'
            aria-labelledby='education-title'
            className='section-band'>
            <div className='container-page section-inner'>
                <SectionHeader
                    title={t('combined_title')}
                    titleId='education-title'
                    output={t('summary', {
                        degrees: education.length,
                        certifications: CERTIFICATION_COUNT,
                    })}
                />
                <EducationRows />
            </div>
        </section>
    );
}

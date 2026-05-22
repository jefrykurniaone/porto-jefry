import { useTranslations, useLocale } from 'next-intl';
import { education, type EducationItem } from '@/data/education';
import { translatePeriod } from '@/utils/translate-period';
import { GraduationCapIcon } from 'lucide-react';

interface EducationCardProps {
    edu: EducationItem;
    gpaLabel: string;
    locale: string;
}

function EducationCard({ edu, gpaLabel, locale }: Readonly<EducationCardProps>) {
    return (
        <div className='p-5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors'>
            <p className='text-blue-600 dark:text-blue-400 text-sm font-medium mb-1'>
                {translatePeriod(edu.period, locale)}
            </p>
            <h4 className='text-gray-900 dark:text-white font-semibold'>{edu.institution}</h4>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>
                {edu.degree}{edu.major && ` — ${edu.major}`}
            </p>
            {edu.gpa && (
                <p className='text-gray-500 dark:text-gray-500 text-sm mt-1'>
                    {gpaLabel}: {edu.gpa}
                </p>
            )}
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
    return (
        <div>
            <h3 className='text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2'>
                <GraduationCapIcon size={20} className='text-blue-500' />
                {title}
            </h3>
            <div className='grid sm:grid-cols-2 gap-4'>
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
        <section id='education' className='py-20 px-4'>
            <div className='max-w-4xl mx-auto'>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center'>
                    {t('title')}
                </h2>
                <div className='space-y-10'>
                    <EducationGroup title={t('formal')} items={formal} gpaLabel={t('gpa')} locale={locale} />
                    <EducationGroup title={t('informal')} items={informal} gpaLabel={t('gpa')} locale={locale} />
                </div>
            </div>
        </section>
    );
}

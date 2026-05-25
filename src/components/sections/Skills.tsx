import { useTranslations } from 'next-intl';
import { skillCategories } from '@/data/skills';

export default function Skills() {
    const t = useTranslations('skills');

    return (
        <section
            id='skills'
            className='py-20 px-4 bg-gray-50 dark:bg-gray-900/50'>
            <div className='max-w-4xl mx-auto'>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center'>
                    {t('title')}
                </h2>
                <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {skillCategories.map((cat) => (
                        <div
                            key={cat.category}
                            className='p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800'>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider'>
                                {t(`categories.${cat.category}`)}
                            </h3>
                            <div className='flex flex-wrap gap-2'>
                                {cat.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className='text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900'>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

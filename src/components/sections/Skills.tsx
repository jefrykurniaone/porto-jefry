import { useTranslations } from 'next-intl';
import { skillCategories } from '@/data/skills';

export default function Skills() {
    const t = useTranslations('skills');

    return (
        <section id='skills' className='sgds:py-layout-lg sgds:bg-default'>
            <div className='sgds-container'>
                <h2 className='sgds:text-heading-lg sgds:font-semibold sgds:text-heading-default sgds:mb-layout-md sgds:text-center'>
                    {t('title')}
                </h2>
                <div className='sgds-grid'>
                    {skillCategories.map((cat) => (
                        <div key={cat.category} className='sgds-col-12 sm:sgds-col-6 lg:sgds-col-4'>
                            <sgds-card suppressHydrationWarning>
                                <span slot='title' className='sgds:text-heading-sm sgds:font-semibold sgds:text-heading-default'>
                                    {t(`categories.${cat.category}`)}
                                </span>
                                <span slot='description'>
                                    <div className='sgds:flex sgds:flex-wrap sgds:gap-component-xs'>
                                        {cat.skills.map((skill) => (
                                            <span key={skill}>
                                                <sgds-badge outlined suppressHydrationWarning>
                                                    {skill}
                                                </sgds-badge>
                                            </span>
                                        ))}
                                    </div>
                                </span>
                            </sgds-card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

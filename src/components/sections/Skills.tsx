import { useTranslations } from 'next-intl';
import { skillCategories } from '@/data/skills';
import { TechList } from '@/components/ui/TechList';

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
                        <div key={cat.category} className='tidy-grid-item sgds-col-4 sgds-col-sm-4 sgds-col-lg-4'>
                            <sgds-card suppressHydrationWarning>
                                <span slot='title' className='sgds:text-heading-sm sgds:font-semibold sgds:text-heading-default'>
                                    {t(`categories.${cat.category}`)}
                                </span>
                                <div slot='description'>
                                    <TechList items={cat.skills} />
                                </div>
                            </sgds-card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

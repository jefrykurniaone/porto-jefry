import { useTranslations } from 'next-intl';
import { skillCategories } from '@/data/skills';

const AI_CATEGORY = 'ai_emerging';

export default function Skills() {
    const t = useTranslations('skills');
    const nav = useTranslations('nav');

    return (
        <section id='skills' className='section-band section-band--alt'>
            <div className='container-page section-inner'>
                <p className='section-kicker'>03 / {nav('skills')}</p>
                <h2 className='section-title'>{t('title')}</h2>
                <div className='skills-grid'>
                    {skillCategories.map((cat) => (
                        <div key={cat.category} className='panel-card skill-card'>
                            <div className='skill-card__head'>
                                <h3 className='skill-card__label'>
                                    {t(`categories.${cat.category}`)}
                                </h3>
                                {cat.category === AI_CATEGORY && (
                                    <span className='ai-badge'>{t('ai_badge')}</span>
                                )}
                            </div>
                            <div className='chip-row'>
                                {cat.skills.map((skill) => (
                                    <span key={skill} className='chip skill-card__chip'>
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

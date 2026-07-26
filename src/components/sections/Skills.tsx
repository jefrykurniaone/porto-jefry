import { useTranslations } from 'next-intl';
import { skillCategories, type SkillCategory } from '@/data/skills';

const AI_CATEGORY = 'ai_workflow';

interface SkillCardProps {
    cat: SkillCategory;
    label: string;
    aiBadge: string;
    workingLabel: string;
}

function SkillCard({ cat, label, aiBadge, workingLabel }: Readonly<SkillCardProps>) {
    return (
        <div className='panel-card skill-card'>
            <div className='skill-card__head'>
                <h3 className='skill-card__label'>{label}</h3>
                {cat.category === AI_CATEGORY && (
                    <span className='ai-badge'>{aiBadge}</span>
                )}
            </div>
            <div className='chip-row'>
                {cat.skills.map((skill) => (
                    <span key={skill} className='chip skill-card__chip'>
                        {skill}
                    </span>
                ))}
            </div>
            {cat.working && cat.working.length > 0 && (
                <>
                    <p className='skill-card__sublabel'>{workingLabel}</p>
                    <div className='chip-row'>
                        {cat.working.map((skill) => (
                            <span
                                key={skill}
                                className='chip skill-card__chip skill-card__chip--working'>
                                {skill}
                            </span>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default function Skills() {
    const t = useTranslations('skills');
    const nav = useTranslations('nav');

    return (
        <section id='skills' className='section-band section-band--alt'>
            <div className='container-page section-inner'>
                <p className='section-kicker'>03 / {nav('skills')}</p>
                <h2 className='section-title'>{t('title')}</h2>
                <p className='skills-note'>{t('working_note')}</p>
                <div className='skills-grid'>
                    {skillCategories.map((cat) => (
                        <SkillCard
                            key={cat.category}
                            cat={cat}
                            label={t(`categories.${cat.category}`)}
                            aiBadge={t('ai_badge')}
                            workingLabel={t('working_label')}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

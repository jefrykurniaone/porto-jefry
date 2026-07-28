import { useTranslations } from 'next-intl';
import { skillCategories, type SkillCategory } from '@/data/skills';
import SectionHeader from '@/components/ui/SectionHeader';

const AI_CATEGORY = 'ai_workflow';

const countBy = (pick: (cat: SkillCategory) => string[] | undefined) =>
    skillCategories.reduce((total, cat) => total + (pick(cat)?.length ?? 0), 0);

interface SkillCardProps {
    cat: SkillCategory;
    label: string;
    aiBadge: string;
    workingLabel: string;
}

function SkillCard({ cat, label, aiBadge, workingLabel }: Readonly<SkillCardProps>) {
    return (
        <div className='panel-card panel-card--lift skill-card'>
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
                    {/* `#` reads the sublabel as a comment on the list above,
                        the same code-comment device as the hero's `// Hi, I'm`. */}
                    <p className='skill-card__sublabel'>
                        <span aria-hidden='true'>#</span> {workingLabel}
                    </p>
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

    return (
        <section
            id='skills'
            aria-labelledby='skills-title'
            className='section-band section-band--alt'>
            <div className='container-page section-inner'>
                <SectionHeader
                    command='ls --production'
                    title={t('title')}
                    titleId='skills-title'
                    output={t('summary', {
                        categories: skillCategories.length,
                        production: countBy((cat) => cat.skills),
                        working: countBy((cat) => cat.working),
                    })}
                />
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

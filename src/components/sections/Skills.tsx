import { useTranslations } from 'next-intl';
import { skillCategories, type SkillCategory } from '@/data/skills';
import SectionHeader from '@/components/ui/SectionHeader';
import Reveal from '@/components/ui/Reveal';

const AI_CATEGORY = 'ai_workflow';

const countBy = (pick: (cat: SkillCategory) => string[] | undefined) =>
    skillCategories.reduce((total, cat) => total + (pick(cat)?.length ?? 0), 0);

interface SkillItemListProps {
    items: string[];
    /** Quieter styling for the "working knowledge" list, never colour alone —
        it always follows its own `working_label` heading. */
    quiet?: boolean;
}

function SkillItemList({ items, quiet }: Readonly<SkillItemListProps>) {
    return (
        <ul className={quiet ? 'skill-list skill-list--working' : 'skill-list'}>
            {items.map((skill) => (
                <li key={skill}>{skill}</li>
            ))}
        </ul>
    );
}

interface SkillRowProps {
    cat: SkillCategory;
    label: string;
    aiBadge: string;
    workingLabel: string;
}

function SkillRow({ cat, label, aiBadge, workingLabel }: Readonly<SkillRowProps>) {
    return (
        <div className='skill-row'>
            <div className='skill-row__meta'>
                <p className='skill-row__label'>{label}</p>
                {cat.category === AI_CATEGORY && (
                    <span className='ai-badge'>{aiBadge}</span>
                )}
            </div>
            <div>
                <SkillItemList items={cat.skills} />
                {cat.working && cat.working.length > 0 && (
                    <>
                        <p className='skill-row__working-label'>{workingLabel}</p>
                        <SkillItemList items={cat.working} quiet />
                    </>
                )}
            </div>
        </div>
    );
}

export default function Skills() {
    const t = useTranslations('skills');

    return (
        <section
            id='skills'
            aria-labelledby='skills-title'
            className='section-band'>
            <div className='container-page section-inner'>
                <SectionHeader
                    title={t('title')}
                    titleId='skills-title'
                    output={t('summary', {
                        categories: skillCategories.length,
                        production: countBy((cat) => cat.skills),
                        working: countBy((cat) => cat.working),
                    })}
                />
                <p className='skills-note'>{t('working_note')}</p>
                <Reveal className='skill-rows'>
                    {skillCategories.map((cat) => (
                        <SkillRow
                            key={cat.category}
                            cat={cat}
                            label={t(`categories.${cat.category}`)}
                            aiBadge={t('ai_badge')}
                            workingLabel={t('working_label')}
                        />
                    ))}
                </Reveal>
            </div>
        </section>
    );
}

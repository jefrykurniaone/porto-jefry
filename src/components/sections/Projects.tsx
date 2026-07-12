import { useTranslations, useLocale, useMessages } from 'next-intl';
import { projects, type ProjectItem } from '@/data/projects';
import { translatePeriod } from '@/utils/translate-period';

interface ProjectCardProps {
    project: ProjectItem;
    period: string;
    description?: string;
}

function ProjectCard({ project, period, description }: Readonly<ProjectCardProps>) {
    return (
        <div className='panel-card panel-card--lift project-card'>
            <p className='card-eyebrow'>{project.company}</p>
            <h3 className='project-card__name'>{project.name}</h3>
            <p className='card-period'>{period}</p>
            {description && <p className='project-card__desc'>{description}</p>}
            <div className='chip-row project-card__tech'>
                {project.tech.map((tech) => (
                    <span key={tech} className='chip'>{tech}</span>
                ))}
            </div>
        </div>
    );
}

function resolveProjectDescription(
    messages: ReturnType<typeof useMessages>,
    projectId: string,
): string | undefined {
    const items = (messages as Record<string, unknown>)?.projects;
    if (!items || typeof items !== 'object') return undefined;
    const itemsMap = (items as Record<string, unknown>)?.items;
    if (!itemsMap || typeof itemsMap !== 'object') return undefined;
    const projectEntry = (itemsMap as Record<string, unknown>)[projectId];
    if (!projectEntry || typeof projectEntry !== 'object') return undefined;
    const desc = (projectEntry as Record<string, unknown>).description;
    return typeof desc === 'string' && desc.length > 0 ? desc : undefined;
}

export default function Projects() {
    const t = useTranslations('projects');
    const nav = useTranslations('nav');
    const locale = useLocale();
    const messages = useMessages();

    return (
        <section id='projects' className='section-band'>
            <div className='container-page section-inner'>
                <p className='section-kicker'>04 / {nav('projects')}</p>
                <h2 className='section-title'>{t('title')}</h2>
                <div className='projects-grid'>
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            period={translatePeriod(
                                project.period.replace('Present', t('present')),
                                locale,
                            )}
                            description={resolveProjectDescription(messages, project.id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

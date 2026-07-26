import { useTranslations, useLocale, useMessages } from 'next-intl';
import { projects, type ProjectItem } from '@/data/projects';
import { translatePeriod } from '@/utils/translate-period';

interface ProjectLinksProps {
    project: ProjectItem;
    viewSiteLabel: string;
    viewSourceLabel: string;
}

function ProjectLinks({
    project,
    viewSiteLabel,
    viewSourceLabel,
}: Readonly<ProjectLinksProps>) {
    const links = [
        { href: project.url, label: viewSiteLabel },
        { href: project.repoUrl, label: viewSourceLabel },
    ].filter((link): link is { href: string; label: string } =>
        Boolean(link.href),
    );

    if (links.length === 0) return null;

    return (
        <div className='project-card__links'>
            {links.map((link) => (
                <a
                    key={link.href}
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={`${link.label}: ${project.name}`}
                    className='project-card__link'>
                    {link.label}
                    <span aria-hidden='true'> ↗</span>
                </a>
            ))}
        </div>
    );
}

interface ProjectCardProps {
    project: ProjectItem;
    company: string;
    period: string;
    description?: string;
    viewSiteLabel: string;
    viewSourceLabel: string;
}

function ProjectCard({
    project,
    company,
    period,
    description,
    viewSiteLabel,
    viewSourceLabel,
}: Readonly<ProjectCardProps>) {
    return (
        <div className='panel-card panel-card--lift project-card'>
            <p className='card-eyebrow'>{company}</p>
            <h3 className='project-card__name'>{project.name}</h3>
            <p className='card-period'>{period}</p>
            {description && <p className='project-card__desc'>{description}</p>}
            <div className='chip-row project-card__tech'>
                {project.tech.map((tech) => (
                    <span key={tech} className='chip'>{tech}</span>
                ))}
            </div>
            <ProjectLinks
                project={project}
                viewSiteLabel={viewSiteLabel}
                viewSourceLabel={viewSourceLabel}
            />
        </div>
    );
}

/**
 * Reads `projects.items.<id>.<field>` defensively — a missing id or key falls
 * back to the data file rather than throwing, matching how the rest of the
 * data/messages join degrades.
 */
function resolveProjectField(
    messages: ReturnType<typeof useMessages>,
    projectId: string,
    field: 'description' | 'company',
): string | undefined {
    const projectsMsg = (messages as Record<string, unknown>)?.projects;
    if (!projectsMsg || typeof projectsMsg !== 'object') return undefined;
    const itemsMap = (projectsMsg as Record<string, unknown>)?.items;
    if (!itemsMap || typeof itemsMap !== 'object') return undefined;
    const entry = (itemsMap as Record<string, unknown>)[projectId];
    if (!entry || typeof entry !== 'object') return undefined;
    const value = (entry as Record<string, unknown>)[field];
    return typeof value === 'string' && value.length > 0 ? value : undefined;
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
                            company={
                                resolveProjectField(messages, project.id, 'company') ??
                                project.company
                            }
                            period={translatePeriod(
                                project.period.replace('Present', t('present')),
                                locale,
                            )}
                            description={resolveProjectField(
                                messages,
                                project.id,
                                'description',
                            )}
                            viewSiteLabel={t('view_site')}
                            viewSourceLabel={t('view_source')}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

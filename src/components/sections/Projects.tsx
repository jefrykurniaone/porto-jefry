import { useTranslations, useLocale, useMessages } from 'next-intl';
import { projects, hasPublicUrl, type ProjectItem } from '@/data/projects';
import { translatePeriod } from '@/utils/translate-period';
import SectionHeader from '@/components/ui/SectionHeader';
import ProjectArchive, { type ProjectSummary } from './ProjectArchive';

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

/**
 * Card titles are h4: the section's h2 now has an h3 group heading between it
 * and the cards ("Live public work" / the archive), so dropping a level keeps
 * the outline contiguous.
 */
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
            <h4 className='project-card__name'>{project.name}</h4>
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

interface ResolvedCard {
    project: ProjectItem;
    company: string;
    period: string;
    description?: string;
}

/** The data + messages join, resolved once and split into the two groups. */
function useResolvedProjects(): {
    live: ResolvedCard[];
    archive: ProjectSummary[];
} {
    const t = useTranslations('projects');
    const locale = useLocale();
    const messages = useMessages();

    const company = (p: ProjectItem) =>
        resolveProjectField(messages, p.id, 'company') ?? p.company;
    const period = (p: ProjectItem) =>
        translatePeriod(p.period.replace('Present', t('present')), locale);

    return {
        live: projects.filter(hasPublicUrl).map((project) => ({
            project,
            company: company(project),
            period: period(project),
            description: resolveProjectField(messages, project.id, 'description'),
        })),
        archive: projects.filter((p) => !hasPublicUrl(p)).map((p) => ({
            id: p.id,
            name: p.name,
            company: company(p),
            period: period(p),
            tech: p.tech,
        })),
    };
}

function LiveProjectGrid({ cards }: Readonly<{ cards: ResolvedCard[] }>) {
    const t = useTranslations('projects');
    return (
        <div className='projects-grid'>
            {cards.map((card) => (
                <ProjectCard
                    key={card.project.id}
                    project={card.project}
                    company={card.company}
                    period={card.period}
                    description={card.description}
                    viewSiteLabel={t('view_site')}
                    viewSourceLabel={t('view_source')}
                />
            ))}
        </div>
    );
}

export default function Projects() {
    const t = useTranslations('projects');
    const { live, archive } = useResolvedProjects();

    return (
        <section
            id='projects'
            aria-labelledby='projects-title'
            className='section-band'>
            <div className='container-page section-inner'>
                <SectionHeader
                    command='ls -la ~/work'
                    title={t('title')}
                    titleId='projects-title'
                    output={t('summary', {
                        total: projects.length,
                        live: live.length,
                    })}
                />
                <h3 className='project-group__title'>{t('group_live')}</h3>
                <p className='project-group__note'>{t('group_live_note')}</p>
                <LiveProjectGrid cards={live} />
                <ProjectArchive
                    items={archive}
                    heading={t('group_archive')}
                    note={t('group_archive_note')}
                    showLabel={t('archive_show', { count: archive.length })}
                    hideLabel={t('archive_hide')}
                />
            </div>
        </section>
    );
}

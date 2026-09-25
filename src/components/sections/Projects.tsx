import { useTranslations, useLocale, useMessages } from 'next-intl';
import { partitionProjects, type ProjectItem } from '@/data/projects';
import { translatePeriod } from '@/utils/translate-period';
import SectionHeader from '@/components/ui/SectionHeader';
import Reveal from '@/components/ui/Reveal';
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
        <div className='project-item__links'>
            {links.map((link) => (
                <a
                    key={link.href}
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={`${link.label}: ${project.name}`}
                    className='project-item__link'>
                    {link.label}
                    <span aria-hidden='true'> ↗</span>
                </a>
            ))}
        </div>
    );
}

/** Period and company as Labels, directly under the title — same role as
 * `.exp-period` / `.exp-company` in the Experience row. */
function ProjectMeta({
    period,
    company,
}: Readonly<{ period: string; company: string }>) {
    return (
        <div className='project-item__meta'>
            <p className='project-item__period'>{period}</p>
            <p className='project-item__company'>{company}</p>
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
 * and the cards (live public work / in progress / the archive), so dropping a
 * level keeps the outline contiguous.
 *
 * The item itself carries no box: a hairline rule on top marks it off, the
 * title takes the lead size and picks up --accent-ink on hover, the
 * description is Reading text, and period/company/stack are Labels.
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
        <div className='project-item'>
            <h4 className='project-item__title'>{project.name}</h4>
            <ProjectMeta period={period} company={company} />
            {description && <p className='project-item__desc'>{description}</p>}
            {project.tech.length > 0 && (
                <ul className='chip-row project-item__tech'>
                    {project.tech.map((tech) => (
                        <li key={tech} className='chip'>{tech}</li>
                    ))}
                </ul>
            )}
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

/**
 * The per-item half of the data + messages join, built once by the hook and
 * shared by all three groups. Bundling it keeps the two mappers below at module
 * level, so the hook itself stays a short partition rather than three inline
 * `.map` bodies fighting the 40-line-per-function ceiling.
 */
interface ProjectLocalizer {
    company: (project: ProjectItem) => string;
    period: (project: ProjectItem) => string;
    description: (project: ProjectItem) => string | undefined;
}

function toResolvedCard(
    project: ProjectItem,
    localize: ProjectLocalizer,
): ResolvedCard {
    return {
        project,
        company: localize.company(project),
        period: localize.period(project),
        description: localize.description(project),
    };
}

function toProjectSummary(
    project: ProjectItem,
    localize: ProjectLocalizer,
): ProjectSummary {
    return {
        id: project.id,
        name: project.name,
        company: localize.company(project),
        period: localize.period(project),
        tech: project.tech,
    };
}

/**
 * The data + messages join, resolved once over the three groups. The split
 * itself is `partitionProjects()`'s job, not this hook's — the PDF renders the
 * same three groups and the two must not be able to disagree about which
 * project belongs where.
 */
function useResolvedProjects(): {
    live: ResolvedCard[];
    progress: ResolvedCard[];
    archive: ProjectSummary[];
} {
    const t = useTranslations('projects');
    const locale = useLocale();
    const messages = useMessages();

    const localize: ProjectLocalizer = {
        company: (p) => resolveProjectField(messages, p.id, 'company') ?? p.company,
        period: (p) =>
            translatePeriod(p.period.replace('Present', t('present')), locale),
        description: (p) => resolveProjectField(messages, p.id, 'description'),
    };

    const { live, progress, archive } = partitionProjects();

    return {
        live: live.map((p) => toResolvedCard(p, localize)),
        progress: progress.map((p) => toResolvedCard(p, localize)),
        archive: archive.map((p) => toProjectSummary(p, localize)),
    };
}

function ProjectGrid({ cards }: Readonly<{ cards: ResolvedCard[] }>) {
    const t = useTranslations('projects');
    return (
        <Reveal className='projects-grid'>
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
        </Reveal>
    );
}

/**
 * Current work with nothing public to open yet. Full cards like the live group
 * rather than a disclosure like the archive — this is the most recent evidence
 * of what is being built, and hiding it would bury the newest work. Renders
 * nothing at all when empty, so the group's rule and spacing never show up as
 * a stray separator.
 */
function ProgressGroup({ cards }: Readonly<{ cards: ResolvedCard[] }>) {
    const t = useTranslations('projects');

    if (cards.length === 0) return null;

    return (
        <div className='project-group project-group--next'>
            <h3 className='project-group__title'>{t('group_progress')}</h3>
            <p className='project-group__note'>{t('group_progress_note')}</p>
            <ProjectGrid cards={cards} />
        </div>
    );
}

export default function Projects() {
    const t = useTranslations('projects');
    const { live, progress, archive } = useResolvedProjects();

    return (
        <section
            id='projects'
            aria-labelledby='projects-title'
            className='section-band'>
            <div className='container-page section-inner'>
                <SectionHeader
                    title={t('title')}
                    titleId='projects-title'
                    output={t('summary', {
                        total: live.length + progress.length + archive.length,
                        live: live.length,
                    })}
                />
                <h3 className='project-group__title'>{t('group_live')}</h3>
                <p className='project-group__note'>{t('group_live_note')}</p>
                <ProjectGrid cards={live} />
                <ProgressGroup cards={progress} />
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

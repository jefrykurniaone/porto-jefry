import { useTranslations, useLocale, useMessages } from 'next-intl';
import { projects } from '@/data/projects';
import { translatePeriod } from '@/utils/translate-period';
import { TechList } from '@/components/ui/TechList';
import type { ProjectItem } from '@/data/projects';

interface ProjectCardProps {
    project: ProjectItem;
    presentLabel: string;
    locale: string;
    description?: string;
}

function ProjectCard({ project, presentLabel, locale, description }: Readonly<ProjectCardProps>) {
    return (
        <div key={project.id} className='tidy-grid-item sgds-col-4 sgds-col-sm-4 sgds-col-lg-4'>
            <sgds-card suppressHydrationWarning>
                <span slot='title' className='sgds:text-heading-sm sgds:font-semibold sgds:text-heading-default sgds:flex sgds:items-center sgds:justify-between sgds:gap-component-xs'>
                    <span>{project.name}</span>
                    {project.url && (
                        <a
                            href={project.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label={`${project.name} — external link`}
                            className='sgds:shrink-0 sgds:text-link hover:sgds:text-link-hover'>
                            <sgds-icon name='box-arrow-up-right' aria-hidden='true' suppressHydrationWarning />
                        </a>
                    )}
                </span>
                <div slot='description'>
                    <p className='sgds:text-label-sm sgds:text-muted sgds:font-semibold sgds:mb-component-xs'>
                        {project.company}
                    </p>
                    <p className='sgds:text-label-sm sgds:text-primary sgds:font-semibold sgds:mb-component-sm'>
                        {translatePeriod(project.period.replace('Present', presentLabel), locale)}
                    </p>
                    {description && (
                        <p className='sgds:text-body-md sgds:text-body-default sgds:mb-component-sm sgds:leading-xs'>
                            {description}
                        </p>
                    )}
                    <TechList items={project.tech} />
                </div>
            </sgds-card>
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
    const locale = useLocale();
    const messages = useMessages();

    return (
        <section id='projects' className='sgds:py-layout-lg sgds:bg-alternate'>
            <div className='sgds-container'>
                <h2 className='sgds:text-heading-lg sgds:font-semibold sgds:text-heading-default sgds:mb-layout-md sgds:text-center'>
                    {t('title')}
                </h2>
                <div className='sgds-grid'>
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            presentLabel={t('present')}
                            locale={locale}
                            description={resolveProjectDescription(messages, project.id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

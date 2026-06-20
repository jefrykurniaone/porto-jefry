import { useTranslations, useLocale } from 'next-intl';
import { projects } from '@/data/projects';
import { translatePeriod } from '@/utils/translate-period';
import { TechList } from '@/components/ui/TechList';
import type { ProjectItem } from '@/data/projects';

interface ProjectCardProps {
    project: ProjectItem;
    presentLabel: string;
    locale: string;
}

function ProjectCard({ project, presentLabel, locale }: Readonly<ProjectCardProps>) {
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
                    {project.description && (
                        <p className='sgds:text-body-md sgds:text-body-default sgds:mb-component-sm sgds:leading-xs'>
                            {project.description}
                        </p>
                    )}
                    <TechList items={project.tech} />
                </div>
            </sgds-card>
        </div>
    );
}

export default function Projects() {
    const t = useTranslations('projects');
    const locale = useLocale();

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
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

import { View, Text, Link } from '@react-pdf/renderer';
import { projects, hasPublicUrl, isOngoing, type ProjectItem } from '@/data/projects';
import { translatePeriod } from '@/utils/translate-period';
import { styles } from './cv-styles';
import { type Messages } from './cv-types';

/** Bare host for print legibility — a PDF CV is often read on paper. */
function displayUrl(url: string): string {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '');
}

interface ProjectCardProps {
    proj: ProjectItem;
    description?: string;
    company?: string;
    presentLabel: string;
    locale: string;
}

function ProjectCard({
    proj,
    description,
    company,
    presentLabel,
    locale,
}: Readonly<ProjectCardProps>) {
    const localizedPeriod = translatePeriod(
        proj.period.replace('Present', presentLabel),
        locale,
    );

    return (
        <View style={styles.projectCard}>
            <Text style={styles.projectName}>{proj.name}</Text>
            <Text style={styles.projectMeta}>
                {company ?? proj.company} · {localizedPeriod}
            </Text>
            {description && description.length > 0 && (
                <Text style={styles.projectDesc}>{description}</Text>
            )}
            {proj.tech.length > 0 && (
                <View style={styles.tagRow}>
                    {proj.tech.map((tech) => (
                        <Text key={`${proj.name}-${tech}`} style={styles.tag}>
                            {tech}
                        </Text>
                    ))}
                </View>
            )}
            {[proj.url, proj.repoUrl].filter(Boolean).map((href) => (
                <Link key={href} src={href as string} style={styles.projectLink}>
                    {displayUrl(href as string)}
                </Link>
            ))}
        </View>
    );
}

interface ProjectRowProps {
    row: ProjectItem[];
    messages: Pick<Messages, 'projects'>;
    locale: string;
}

function ProjectRow({ row, messages, locale }: Readonly<ProjectRowProps>) {
    return (
        <View wrap={false} style={styles.projectRow}>
            {row.map((proj) => (
                <ProjectCard
                    key={proj.name}
                    proj={proj}
                    description={messages.projects.items[proj.id]?.description}
                    company={messages.projects.items[proj.id]?.company}
                    presentLabel={messages.projects.present}
                    locale={locale}
                />
            ))}
            {/* Spacer to keep single-card rows from stretching full width */}
            {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
    );
}

function toRows(items: ProjectItem[]): ProjectItem[][] {
    const rows: ProjectItem[][] = [];
    for (let i = 0; i < items.length; i += 2) {
        rows.push(items.slice(i, i + 2));
    }
    return rows;
}

interface ProjectGroupProps {
    heading: string;
    items: ProjectItem[];
    messages: Pick<Messages, 'projects'>;
    locale: string;
    /** Section title, rendered above the heading for the first group only. */
    sectionTitle?: string;
}

/**
 * Binds a heading to its first row and nothing more — the same rule
 * CvEducation's groups follow. Holding a whole group together builds an atom
 * taller than a part-used page, which pushes the group over and strands blank
 * paper behind it.
 *
 * The atom and the rows after it are siblings of the section — a fragment, not
 * a wrapping group View. **Do not wrap them.** A group View that opens near a
 * page boundary has its height constrained to whatever is left, and because
 * these cards can shrink, every card in the group is then squeezed into that
 * gap as a title strip with its own description printed on top of it. Without
 * the wrapper, `wrap={false}` moves the atom to the next page as intended.
 */
function ProjectGroup({
    heading,
    items,
    messages,
    locale,
    sectionTitle,
}: Readonly<ProjectGroupProps>) {
    const [firstRow, ...rest] = toRows(items);
    return (
        <>
            <View
                wrap={false}
                style={sectionTitle ? undefined : styles.projectGroupNext}>
                {sectionTitle && <Text style={styles.sectionTitle}>{sectionTitle}</Text>}
                <Text style={styles.subSectionTitle}>{heading}</Text>
                {firstRow && (
                    <ProjectRow row={firstRow} messages={messages} locale={locale} />
                )}
            </View>
            {rest.map((row) => (
                <ProjectRow key={row[0].id} row={row} messages={messages} locale={locale} />
            ))}
        </>
    );
}

interface CvProjectsProps {
    messages: Pick<Messages, 'projects'>;
    locale: string;
}

/**
 * The same three groups the site's Projects section renders, split on the same
 * two predicates and in the same order. On paper every group prints in full —
 * there is no disclosure to hide the internal half behind — so the headings
 * carry the distinction the site's grouping and note lines carry on screen.
 *
 * `hasPublicUrl` is ruled out before `isOngoing` is asked, so ongoing work that
 * does have a live URL stays in the public group.
 */
export default function CvProjects({ messages, locale }: Readonly<CvProjectsProps>) {
    const { title, cv_group_public, cv_group_progress, cv_group_internal } = messages.projects;
    const progress = projects.filter((project) => !hasPublicUrl(project) && isOngoing(project));
    const internal = projects.filter((project) => !hasPublicUrl(project) && !isOngoing(project));

    return (
        <View style={styles.section}>
            <ProjectGroup
                sectionTitle={title}
                heading={cv_group_public}
                items={projects.filter(hasPublicUrl)}
                messages={messages}
                locale={locale}
            />
            {progress.length > 0 && (
                <ProjectGroup
                    heading={cv_group_progress}
                    items={progress}
                    messages={messages}
                    locale={locale}
                />
            )}
            {internal.length > 0 && (
                <ProjectGroup
                    heading={cv_group_internal}
                    items={internal}
                    messages={messages}
                    locale={locale}
                />
            )}
        </View>
    );
}

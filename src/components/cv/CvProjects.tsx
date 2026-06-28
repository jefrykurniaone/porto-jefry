import { View, Text } from '@react-pdf/renderer';
import { projects, type ProjectItem } from '@/data/projects';
import { translatePeriod } from '@/utils/translate-period';
import { styles } from './cv-styles';
import { type Messages } from './cv-types';

interface ProjectCardProps {
    proj: ProjectItem;
    description?: string;
    presentLabel: string;
    locale: string;
}

function ProjectCard({ proj, description, presentLabel, locale }: Readonly<ProjectCardProps>) {
    const localizedPeriod = translatePeriod(
        proj.period.replace('Present', presentLabel),
        locale,
    );

    return (
        <View style={styles.projectCard}>
            <Text style={styles.projectName}>{proj.name}</Text>
            <Text style={styles.projectMeta}>
                {proj.company} · {localizedPeriod}
            </Text>
            {description && description.length > 0 && (
                <Text style={styles.projectDesc}>{description}</Text>
            )}
            <View style={styles.tagRow}>
                {proj.tech.map((tech) => (
                    <Text key={`${proj.name}-${tech}`} style={styles.tag}>
                        {tech}
                    </Text>
                ))}
            </View>
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
                    presentLabel={messages.projects.present}
                    locale={locale}
                />
            ))}
            {/* Spacer to keep single-card rows from stretching full width */}
            {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
    );
}

interface CvProjectsProps {
    messages: Pick<Messages, 'projects'>;
    locale: string;
}

export default function CvProjects({ messages, locale }: Readonly<CvProjectsProps>) {
    const rows: ProjectItem[][] = [];
    for (let i = 0; i < projects.length; i += 2) {
        rows.push(projects.slice(i, i + 2));
    }

    return (
        <View style={styles.section}>
            {/* Title + first row kept together to prevent orphaned heading */}
            <View wrap={false}>
                <Text style={styles.sectionTitle}>{messages.projects.title}</Text>
                {rows[0] && <ProjectRow row={rows[0]} messages={messages} locale={locale} />}
            </View>
            {rows.slice(1).map((row) => (
                <ProjectRow key={row[0].name} row={row} messages={messages} locale={locale} />
            ))}
        </View>
    );
}

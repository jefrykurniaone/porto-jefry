import { View, Text } from '@react-pdf/renderer';
import { projects, type ProjectItem } from '@/data/projects';
import { styles, MAX_PROJECTS, MAX_TECH_TAGS } from './cv-styles';
import { type Messages } from './cv-types';

interface ProjectCardProps {
    proj: ProjectItem;
}

function ProjectCard({ proj }: Readonly<ProjectCardProps>) {
    const visibleTech = proj.tech.slice(0, MAX_TECH_TAGS);
    const hiddenCount = proj.tech.length - MAX_TECH_TAGS;

    return (
        <View style={styles.projectCard}>
            <Text style={styles.projectName}>{proj.name}</Text>
            <Text style={styles.projectMeta}>
                {proj.company} · {proj.period}
            </Text>
            <View style={styles.tagRow}>
                {visibleTech.map((tech) => (
                    <Text key={`${proj.name}-${tech}`} style={styles.tag}>
                        {tech}
                    </Text>
                ))}
                {hiddenCount > 0 && (
                    <Text style={styles.tag}>+{hiddenCount}</Text>
                )}
            </View>
        </View>
    );
}

interface ProjectRowProps {
    row: ProjectItem[];
}

function ProjectRow({ row }: Readonly<ProjectRowProps>) {
    return (
        <View wrap={false} style={styles.projectRow}>
            {row.map((proj) => (
                <ProjectCard key={proj.name} proj={proj} />
            ))}
            {/* Spacer to keep single-card rows from stretching full width */}
            {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
    );
}

interface CvProjectsProps {
    messages: Pick<Messages, 'projects'>;
}

export default function CvProjects({ messages }: Readonly<CvProjectsProps>) {
    const recentProjects = projects.slice(0, MAX_PROJECTS);
    const rows: ProjectItem[][] = [];
    for (let i = 0; i < recentProjects.length; i += 2) {
        rows.push(recentProjects.slice(i, i + 2));
    }

    return (
        <View style={styles.section}>
            {/* Title + first row kept together to prevent orphaned heading */}
            <View wrap={false}>
                <Text style={styles.sectionTitle}>{messages.projects.title}</Text>
                {rows[0] && <ProjectRow row={rows[0]} />}
            </View>
            {rows.slice(1).map((row) => (
                <ProjectRow key={row[0].name} row={row} />
            ))}
        </View>
    );
}

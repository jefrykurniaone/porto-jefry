import { View, Text } from '@react-pdf/renderer';
import { projects } from '@/data/projects';
import { styles, MAX_PROJECTS, MAX_TECH_TAGS } from './cv-styles';
import { type Messages } from './cv-types';

interface ProjectCardProps {
    proj: (typeof projects)[number];
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

interface CvProjectsProps {
    messages: Pick<Messages, 'projects'>;
}

export default function CvProjects({ messages }: Readonly<CvProjectsProps>) {
    const recentProjects = projects.slice(0, MAX_PROJECTS);
    const firstRow = recentProjects.slice(0, 2);
    const remaining = recentProjects.slice(2);

    return (
        <View style={styles.section}>
            {/* Title + first row kept together to prevent orphaned heading */}
            <View wrap={false}>
                <Text style={styles.sectionTitle}>{messages.projects.title}</Text>
                <View style={styles.projectsGrid}>
                    {firstRow.map((proj) => (
                        <ProjectCard key={proj.name} proj={proj} />
                    ))}
                </View>
            </View>
            {/* Remaining project cards flow normally across pages */}
            <View style={styles.projectsGrid}>
                {remaining.map((proj) => (
                    <View key={proj.name} wrap={false}>
                        <ProjectCard proj={proj} />
                    </View>
                ))}
            </View>
        </View>
    );
}

import { View, Text } from '@react-pdf/renderer';
import { experiences } from '@/data/experience';
import { styles } from './cv-styles';
import { type Messages } from './cv-types';

interface ExperienceItemProps {
    exp: (typeof experiences)[number];
    bullets: string[];
    presentLabel: string;
}

function ExperienceItem({ exp, bullets, presentLabel }: Readonly<ExperienceItemProps>) {
    return (
        <View style={styles.expItem}>
            <View style={styles.expHeader}>
                <Text style={styles.expRole}>{exp.role}</Text>
                <Text style={styles.expPeriod}>
                    {exp.period.replace('Present', presentLabel)}
                </Text>
            </View>
            <Text style={styles.expCompany}>{exp.company}</Text>
            {bullets.map((b) => (
                <View
                    key={`${exp.company}-${b.slice(0, 30)}`}
                    wrap={false}
                    style={styles.bulletRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                </View>
            ))}
            {exp.tech && exp.tech.length > 0 && (
                <View style={styles.tagRow}>
                    {exp.tech.map((tech) => (
                        <Text key={`${exp.company}-tech-${tech}`} style={styles.tag}>
                            {tech}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
}

interface CvExperienceProps {
    messages: Pick<Messages, 'experience'>;
}

export default function CvExperience({ messages }: Readonly<CvExperienceProps>) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{messages.experience.title}</Text>
            {experiences.map((exp, i) => (
                <ExperienceItem
                    key={`${exp.company}-${exp.role}`}
                    exp={exp}
                    bullets={messages.experience.items[i]?.bullets ?? []}
                    presentLabel={messages.experience.present}
                />
            ))}
        </View>
    );
}

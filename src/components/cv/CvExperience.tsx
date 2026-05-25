import { View, Text } from '@react-pdf/renderer';
import { experiences } from '@/data/experience';
import { translatePeriod } from '@/utils/translate-period';
import { styles } from './cv-styles';
import { type Messages } from './cv-types';

interface ExperienceItemProps {
    exp: (typeof experiences)[number];
    bullets: string[];
    presentLabel: string;
    locale: string;
}

function ExperienceItem({ exp, bullets, presentLabel, locale }: Readonly<ExperienceItemProps>) {
    const localizedPeriod = translatePeriod(
        exp.period.replace('Present', presentLabel),
        locale,
    );
    return (
        <View style={styles.expItem}>
            <View style={styles.expHeader}>
                <Text style={styles.expRole}>{exp.role}</Text>
                <Text style={styles.expPeriod}>
                    {localizedPeriod}
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
    locale: string;
}

export default function CvExperience({ messages, locale }: Readonly<CvExperienceProps>) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{messages.experience.title}</Text>
            {experiences.map((exp) => (
                <ExperienceItem
                    key={exp.id}
                    exp={exp}
                    bullets={messages.experience.items[exp.id]?.bullets ?? []}
                    presentLabel={messages.experience.present}
                    locale={locale}
                />
            ))}
        </View>
    );
}

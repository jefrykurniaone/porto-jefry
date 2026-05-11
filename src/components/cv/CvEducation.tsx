import { View, Text } from '@react-pdf/renderer';
import { education, type EducationItem } from '@/data/education';
import { styles } from './cv-styles';
import { type Messages } from './cv-types';

interface EducationItemViewProps {
    edu: EducationItem;
    gpaLabel: string;
}

function EducationItemView({ edu, gpaLabel }: Readonly<EducationItemViewProps>) {
    return (
        <View style={styles.eduItem}>
            <View style={styles.eduHeader}>
                <Text style={styles.eduInstitution}>{edu.institution}</Text>
                <Text style={styles.eduPeriod}>{edu.period}</Text>
            </View>
            <Text style={styles.eduDegree}>
                {edu.degree}{edu.major ? ` — ${edu.major}` : ''}
            </Text>
            {edu.gpa && (
                <Text style={styles.eduGpa}>
                    {gpaLabel}: {edu.gpa}
                </Text>
            )}
        </View>
    );
}

interface CvEducationProps {
    messages: Pick<Messages, 'education'>;
}

export default function CvEducation({ messages }: Readonly<CvEducationProps>) {
    const formalEdu = education.filter((e) => e.type === 'formal');
    const informalEdu = education.filter((e) => e.type === 'informal');

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{messages.education.title}</Text>
            <View style={styles.eduGroup}>
                <Text style={styles.subSectionTitle}>{messages.education.formal}</Text>
                {formalEdu.map((edu) => (
                    <EducationItemView
                        key={edu.institution}
                        edu={edu}
                        gpaLabel={messages.education.gpa}
                    />
                ))}
            </View>
            <View style={styles.eduGroup}>
                <Text style={styles.subSectionTitle}>{messages.education.informal}</Text>
                {informalEdu.map((edu) => (
                    <EducationItemView
                        key={edu.institution}
                        edu={edu}
                        gpaLabel={messages.education.gpa}
                    />
                ))}
            </View>
        </View>
    );
}

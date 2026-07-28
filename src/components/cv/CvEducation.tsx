import { View, Text } from '@react-pdf/renderer';
import { education, type EducationItem } from '@/data/education';
import { styles } from './cv-styles';
import { type Messages } from './cv-types';
import CvCertifications from './CvCertifications';

interface EducationItemViewProps {
    edu: EducationItem;
    gpaLabel: string;
}

function EducationItemView({ edu, gpaLabel }: Readonly<EducationItemViewProps>) {
    return (
        <View style={styles.eduItem} wrap={false}>
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

interface EduGroupProps {
    heading: string;
    items: EducationItem[];
    gpaLabel: string;
    /** Section title, rendered above the group heading for the first group only. */
    sectionTitle?: string;
}

/**
 * Keeps a heading with its first entry and nothing more. Binding a heading to
 * its *whole* group makes an atom too tall to fit in a part-used page, which
 * pushes the entire section over and strands ~200pt of blank paper behind it.
 */
function EduGroup({ heading, items, gpaLabel, sectionTitle }: Readonly<EduGroupProps>) {
    const [first, ...rest] = items;
    return (
        <View style={styles.eduGroup}>
            <View wrap={false}>
                {sectionTitle && <Text style={styles.sectionTitle}>{sectionTitle}</Text>}
                <Text style={styles.subSectionTitle}>{heading}</Text>
                {first && <EducationItemView edu={first} gpaLabel={gpaLabel} />}
            </View>
            {rest.map((edu) => (
                <EducationItemView key={edu.institution} edu={edu} gpaLabel={gpaLabel} />
            ))}
        </View>
    );
}

interface CvEducationProps {
    messages: Pick<Messages, 'education' | 'certifications'>;
}

/**
 * "Education & Certification": the formal degrees, then the one certification,
 * matching the single section the site renders under `combined_title`.
 *
 * `education` is still formal education only — the certification comes from
 * `messages.certifications` via CvCertifications, and putting it back into the
 * data array would print it twice, once per group.
 */
export default function CvEducation({ messages }: Readonly<CvEducationProps>) {
    const { combined_title, formal, kind_cert, gpa } = messages.education;

    return (
        <View style={styles.section}>
            <EduGroup
                sectionTitle={combined_title}
                heading={formal}
                items={education}
                gpaLabel={gpa}
            />
            <CvCertifications messages={messages} heading={kind_cert} />
        </View>
    );
}

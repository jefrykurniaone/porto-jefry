import { View, Text } from '@react-pdf/renderer';
import { styles } from './cv-styles';
import { type Messages } from './cv-types';

interface CvCertificationsProps {
    messages: Pick<Messages, 'certifications'>;
    /**
     * Group heading — `education.kind_cert`. This is a group inside "Education
     * & Certification" rather than its own section: as a trailing section it
     * printed a page and a half away from the degrees it belongs with, while
     * the site has always rendered the two together.
     */
    heading: string;
}

/**
 * The issuer takes the institution slot and the credential the degree slot —
 * the same inversion the site's CertificationCard makes, for the same reason:
 * the row has to scan against the formal education rows directly above it,
 * where the organisation is always the heading. The period takes the right
 * rail as it does there.
 */
export default function CvCertifications({
    messages,
    heading,
}: Readonly<CvCertificationsProps>) {
    const { coding_id } = messages.certifications;

    return (
        // Heading plus a single short entry — never worth splitting.
        <View style={styles.eduGroup} wrap={false}>
            <Text style={styles.subSectionTitle}>{heading}</Text>
            <View style={styles.certItem}>
                <View style={styles.eduHeader}>
                    <Text style={styles.eduInstitution}>{coding_id.issuer}</Text>
                    <Text style={styles.eduPeriod}>{coding_id.period}</Text>
                </View>
                <Text style={styles.eduDegree}>{coding_id.name}</Text>
                <Text style={styles.certDesc}>{coding_id.description}</Text>
            </View>
        </View>
    );
}

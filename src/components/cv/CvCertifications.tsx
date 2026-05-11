import { View, Text } from '@react-pdf/renderer';
import { styles } from './cv-styles';
import { type Messages } from './cv-types';

interface CvCertificationsProps {
    messages: Pick<Messages, 'certifications'>;
}

export default function CvCertifications({ messages }: Readonly<CvCertificationsProps>) {
    const { coding_id } = messages.certifications;

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{messages.certifications.title}</Text>
            <View style={styles.certItem}>
                <Text style={styles.certName}>{coding_id.name}</Text>
                <Text style={styles.certMeta}>
                    {coding_id.issuer} · {coding_id.period}
                </Text>
                <Text style={styles.certDesc}>{coding_id.description}</Text>
            </View>
        </View>
    );
}

import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './cv-styles';
import { type CvDocumentProps } from './cv-types';
import CvHeader from './CvHeader';
import CvExperience from './CvExperience';
import CvEducation from './CvEducation';
import CvSkills from './CvSkills';
import CvProjects from './CvProjects';
import CvCertifications from './CvCertifications';

export default function CvDocument({ messages, photoSrc }: Readonly<CvDocumentProps>) {
    return (
        <Document
            title={`${messages.hero.name} - CV`}
            author={messages.hero.name}
            subject='Curriculum Vitae'
            creator='Portfolio Website'>
            <Page size='A4' style={styles.page}>
                <CvHeader messages={messages} photoSrc={photoSrc} />
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{messages.about.title}</Text>
                    <Text style={styles.summaryText}>{messages.about.description}</Text>
                </View>
                <CvExperience messages={messages} />
                <CvEducation messages={messages} />
                <CvSkills messages={messages} />
                <CvProjects messages={messages} />
                <CvCertifications messages={messages} />
            </Page>
        </Document>
    );
}

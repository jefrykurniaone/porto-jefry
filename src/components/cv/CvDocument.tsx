import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './cv-styles';
import { type CvDocumentProps } from './cv-types';
import CvHeader from './CvHeader';
import CvExperience from './CvExperience';
import CvEducation from './CvEducation';
import CvSkills from './CvSkills';
import CvProjects from './CvProjects';

/**
 * Section order mirrors the site: About, Experience, Skills, Projects,
 * Education & Certification. Education used to sit between Experience and
 * Skills with a lone Certifications section trailing the whole document, so
 * the two halves of one credential block sat two pages apart.
 */
export default function CvDocument({ messages, photoSrc, locale = 'en' }: Readonly<CvDocumentProps>) {
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
                    {messages.about.description.map((paragraph) => (
                        <Text key={paragraph} style={styles.summaryText}>{paragraph}</Text>
                    ))}
                </View>
                <CvExperience messages={messages} locale={locale} />
                <CvSkills messages={messages} />
                <CvProjects messages={messages} locale={locale} />
                <CvEducation messages={messages} />
            </Page>
        </Document>
    );
}

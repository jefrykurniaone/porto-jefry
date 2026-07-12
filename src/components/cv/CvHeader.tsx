import { View, Text, Link, Image } from '@react-pdf/renderer';
import {
    styles,
    CONTACT_EMAIL,
    CONTACT_PHONE,
    LINKEDIN_URL,
    LINKEDIN_DISPLAY,
    GITHUB_URL,
    GITHUB_DISPLAY,
} from './cv-styles';
import { type Messages } from './cv-types';

interface CvHeaderProps {
    messages: Pick<Messages, 'hero'>;
    photoSrc?: string;
}

export default function CvHeader({ messages, photoSrc }: Readonly<CvHeaderProps>) {
    return (
        <View style={styles.headerSection}>
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <Text style={styles.name}>{messages.hero.name}</Text>
                    <Text style={styles.titleText}>{messages.hero.title}</Text>
                    <View style={styles.contactRow}>
                        <Link style={styles.contactLink} src={`mailto:${CONTACT_EMAIL}`}>
                            {CONTACT_EMAIL}
                        </Link>
                        <Text style={styles.contactItem}>|</Text>
                        <Text style={styles.contactItem}>{CONTACT_PHONE}</Text>
                    </View>
                    <View style={[styles.contactRow, styles.contactRowSecond]}>
                        <Link style={styles.contactLink} src={LINKEDIN_URL}>
                            {LINKEDIN_DISPLAY}
                        </Link>
                        <Text style={styles.contactItem}>|</Text>
                        <Link style={styles.contactLink} src={GITHUB_URL}>
                            {GITHUB_DISPLAY}
                        </Link>
                    </View>
                </View>
                {photoSrc && (
                    // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image is a PDF primitive, not an HTML <img>
                    <Image src={photoSrc} style={styles.photoImage} />
                )}
            </View>
        </View>
    );
}

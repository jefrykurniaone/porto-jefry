import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Link,
    Image,
} from '@react-pdf/renderer';
import { experiences } from '@/data/experience';
import { education } from '@/data/education';
import { skillCategories } from '@/data/skills';
import { projects } from '@/data/projects';

// ─── Constants ────────────────────────────────────────────────────────────────
const BLUE = '#2563EB';
const DARK = '#111827';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';
const LIGHT_BG = '#F9FAFB';
const MAX_PROJECTS = 6;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 9,
        color: DARK,
        backgroundColor: '#FFFFFF',
        paddingTop: 36,
        paddingBottom: 36,
        paddingHorizontal: 40,
    },
    // Header
    headerSection: {
        marginBottom: 14,
        borderBottomWidth: 2,
        borderBottomColor: BLUE,
        paddingBottom: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerLeft: {
        flex: 1,
        paddingRight: 10,
    },
    photoImage: {
        width: 68,
        height: 68,
        borderRadius: 4,
    },
    name: {
        fontSize: 22,
        fontFamily: 'Helvetica-Bold',
        color: DARK,
        marginBottom: 3,
    },
    titleText: {
        fontSize: 11,
        color: BLUE,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 6,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    contactItem: {
        fontSize: 8,
        color: MUTED,
    },
    contactLink: {
        fontSize: 8,
        color: BLUE,
        textDecoration: 'none',
    },
    // Section
    section: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: BLUE,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
        paddingBottom: 3,
        marginBottom: 7,
    },
    // Summary
    summaryText: {
        fontSize: 9,
        lineHeight: 1.5,
        color: DARK,
    },
    // Experience
    expItem: {
        marginBottom: 9,
    },
    expHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 1,
    },
    expRole: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: DARK,
        flex: 1,
    },
    expPeriod: {
        fontSize: 8,
        color: MUTED,
        textAlign: 'right',
    },
    expCompany: {
        fontSize: 9,
        color: BLUE,
        marginBottom: 4,
    },
    bulletRow: {
        flexDirection: 'row',
        marginBottom: 2,
        paddingLeft: 4,
    },
    bullet: {
        fontSize: 8,
        color: MUTED,
        width: 10,
        marginTop: 1,
    },
    bulletText: {
        fontSize: 8.5,
        color: DARK,
        flex: 1,
        lineHeight: 1.4,
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 4,
    },
    tag: {
        backgroundColor: LIGHT_BG,
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 3,
        paddingHorizontal: 5,
        paddingVertical: 2,
        fontSize: 7.5,
        color: MUTED,
    },
    // Education
    eduItem: {
        marginBottom: 7,
    },
    eduHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    eduInstitution: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: DARK,
        flex: 1,
    },
    eduPeriod: {
        fontSize: 8,
        color: MUTED,
        textAlign: 'right',
    },
    eduDegree: {
        fontSize: 9,
        color: BLUE,
    },
    eduGpa: {
        fontSize: 8,
        color: MUTED,
        marginTop: 1,
    },
    // Skills
    skillRow: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'flex-start',
    },
    skillCategory: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: DARK,
        width: 100,
        flexShrink: 0,
        paddingTop: 1,
    },
    skillList: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    // Projects
    projectsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    projectCard: {
        width: '48%',
        backgroundColor: LIGHT_BG,
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 4,
        padding: 7,
        marginBottom: 2,
    },
    projectName: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: DARK,
        marginBottom: 2,
    },
    projectMeta: {
        fontSize: 8,
        color: MUTED,
        marginBottom: 3,
    },
    // Certifications
    certItem: {
        marginBottom: 5,
    },
    certName: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: DARK,
    },
    certMeta: {
        fontSize: 8.5,
        color: BLUE,
        marginBottom: 2,
    },
    certDesc: {
        fontSize: 8.5,
        color: DARK,
        lineHeight: 1.4,
    },
    subSectionTitle: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: MUTED,
        marginBottom: 5,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    eduGroup: {
        marginBottom: 8,
    },
});

// ─── Types ────────────────────────────────────────────────────────────────────
interface Messages {
    hero: { name: string; title: string };
    about: {
        title: string;
        description: string;
        contact_email: string;
        contact_phone: string;
        contact_linkedin: string;
    };
    experience: { title: string; present: string };
    education: { title: string; formal: string; informal: string; gpa: string };
    skills: { title: string };
    projects: { title: string };
    certifications: {
        title: string;
        coding_id: { name: string; issuer: string; period: string; description: string };
    };
}

interface CvDocumentProps {
    messages: Messages;
    photoSrc?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CvDocument({ messages, photoSrc }: Readonly<CvDocumentProps>) {
    const recentProjects = projects.slice(0, MAX_PROJECTS);
    const formalEdu = education.filter((e) => e.type === 'formal');
    const informalEdu = education.filter((e) => e.type === 'informal');

    return (
        <Document
            title={`${messages.hero.name} - CV`}
            author={messages.hero.name}
            subject='Curriculum Vitae'
            creator='Portfolio Website'>
            <Page size='A4' style={styles.page}>
                {/* ── Header ── */}
                <View style={styles.headerSection}>
                    <View style={styles.headerRow}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.name}>{messages.hero.name}</Text>
                            <Text style={styles.titleText}>{messages.hero.title}</Text>
                            <View style={styles.contactRow}>
                                <Link
                                    style={styles.contactLink}
                                    src='mailto:jefrykurniaone@gmail.com'>
                                    jefrykurniaone@gmail.com
                                </Link>
                                <Text style={styles.contactItem}>|</Text>
                                <Text style={styles.contactItem}>+62 821 26 229 978</Text>
                                <Text style={styles.contactItem}>|</Text>
                                <Link
                                    style={styles.contactLink}
                                    src='https://www.linkedin.com/in/jefry-kurniawan'>
                                    linkedin.com/in/jefry-kurniawan
                                </Link>
                            </View>
                        </View>
                        {photoSrc && (
                            // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image is a PDF primitive, not an HTML <img>
                            <Image src={photoSrc} style={styles.photoImage} />
                        )}
                    </View>
                </View>

                {/* ── Summary ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{messages.about.title}</Text>
                    <Text style={styles.summaryText}>{messages.about.description}</Text>
                </View>

                {/* ── Experience ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{messages.experience.title}</Text>
                    {experiences.map((exp) => (
                        <View key={`${exp.company}-${exp.role}`} style={styles.expItem}>
                            <View style={styles.expHeader}>
                                <Text style={styles.expRole}>{exp.role}</Text>
                                <Text style={styles.expPeriod}>
                                    {exp.period.replace(
                                        'Present',
                                        messages.experience.present,
                                    )}
                                </Text>
                            </View>
                            <Text style={styles.expCompany}>{exp.company}</Text>
                            {exp.bullets.map((b) => (
                                <View key={`${exp.company}-${b.slice(0, 30)}`} wrap={false} style={styles.bulletRow}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.bulletText}>{b}</Text>
                                </View>
                            ))}
                            {exp.tech && exp.tech.length > 0 && (
                                <View style={styles.tagRow}>
                                    {exp.tech.map((tech) => (
                                        <Text key={`${exp.company}-tech-${tech}`} style={styles.tag}>{tech}</Text>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                {/* ── Education ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{messages.education.title}</Text>

                    <View style={styles.eduGroup}>
                        <Text style={styles.subSectionTitle}>{messages.education.formal}</Text>
                        {formalEdu.map((edu) => (
                            <View key={edu.institution} style={styles.eduItem}>
                                <View style={styles.eduHeader}>
                                    <Text style={styles.eduInstitution}>{edu.institution}</Text>
                                    <Text style={styles.eduPeriod}>{edu.period}</Text>
                                </View>
                                <Text style={styles.eduDegree}>
                                    {edu.degree}{edu.major ? ` — ${edu.major}` : ''}
                                </Text>
                                {edu.gpa && (
                                    <Text style={styles.eduGpa}>
                                        {messages.education.gpa}: {edu.gpa}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>

                    <View style={styles.eduGroup}>
                        <Text style={styles.subSectionTitle}>{messages.education.informal}</Text>
                        {informalEdu.map((edu) => (
                            <View key={edu.institution} style={styles.eduItem}>
                                <View style={styles.eduHeader}>
                                    <Text style={styles.eduInstitution}>{edu.institution}</Text>
                                    <Text style={styles.eduPeriod}>{edu.period}</Text>
                                </View>
                                <Text style={styles.eduDegree}>{edu.degree}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ── Skills ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{messages.skills.title}</Text>
                    {skillCategories.map((cat) => (
                        <View key={cat.category} style={styles.skillRow}>
                            <Text style={styles.skillCategory}>{cat.category}</Text>
                            <View style={styles.skillList}>
                                {cat.skills.map((s) => (
                                    <Text key={`${cat.category}-${s}`} style={styles.tag}>{s}</Text>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>

                {/* ── Projects ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{messages.projects.title}</Text>
                    <View style={styles.projectsGrid}>
                        {recentProjects.map((proj) => (
                            <View key={proj.name} wrap={false} style={styles.projectCard}>
                                <Text style={styles.projectName}>{proj.name}</Text>
                                <Text style={styles.projectMeta}>
                                    {proj.company} · {proj.period}
                                </Text>
                                <View style={styles.tagRow}>
                                    {proj.tech.slice(0, 5).map((tech) => (
                                        <Text key={`${proj.name}-${tech}`} style={styles.tag}>{tech}</Text>
                                    ))}
                                    {proj.tech.length > 5 && (
                                        <Text style={styles.tag}>+{proj.tech.length - 5}</Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ── Certifications ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{messages.certifications.title}</Text>
                    <View style={styles.certItem}>
                        <Text style={styles.certName}>{messages.certifications.coding_id.name}</Text>
                        <Text style={styles.certMeta}>
                            {messages.certifications.coding_id.issuer} · {messages.certifications.coding_id.period}
                        </Text>
                        <Text style={styles.certDesc}>{messages.certifications.coding_id.description}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
}

import { StyleSheet } from '@react-pdf/renderer';

// ─── Color Constants ──────────────────────────────────────────────────────────
export const BLUE = '#2563EB';
export const DARK = '#111827';
export const MUTED = '#6B7280';
export const BORDER = '#E5E7EB';
export const LIGHT_BG = '#F9FAFB';

// ─── Layout Constants ─────────────────────────────────────────────────────────
export const PHOTO_SIZE = 68;

// ─── Contact Constants (re-exported from shared data) ────────────────────────
export {
    CONTACT_EMAIL,
    CONTACT_PHONE_INTL as CONTACT_PHONE,
    CONTACT_LINKEDIN_URL as LINKEDIN_URL,
    CONTACT_LINKEDIN_DISPLAY as LINKEDIN_DISPLAY,
    CONTACT_GITHUB_URL as GITHUB_URL,
    CONTACT_GITHUB_DISPLAY as GITHUB_DISPLAY,
} from '@/data/contact';

// ─── Styles ───────────────────────────────────────────────────────────────────
export const styles = StyleSheet.create({
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
        width: PHOTO_SIZE,
        height: PHOTO_SIZE,
        borderRadius: 4,
        objectFit: 'cover',
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
    projectRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 6,
    },
    projectCard: {
        flex: 1,
        backgroundColor: LIGHT_BG,
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 4,
        padding: 7,
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
    projectDesc: {
        fontSize: 8.5,
        color: DARK,
        lineHeight: 1.4,
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

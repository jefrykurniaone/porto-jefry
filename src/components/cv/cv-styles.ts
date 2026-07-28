import { StyleSheet } from '@react-pdf/renderer';
import { fontBody, fontBold } from './cv-fonts';

// Colours, PHOTO_SIZE, and the contact re-exports live in cv-tokens and are
// re-exported here so every cv/* component keeps importing from one place.
export * from './cv-tokens';
import { ACCENT, DARK, MUTED, BORDER, LIGHT_BG, PHOTO_SIZE } from './cv-tokens';

// ─── Styles ───────────────────────────────────────────────────────────────────
export const styles = StyleSheet.create({
    page: {
        ...fontBody,
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
        // The document's masthead rule and its one deliberate departure from
        // the site's 1px-hairline-everywhere structure: on paper this is the
        // only division strong enough to survive a laser printer.
        borderBottomColor: ACCENT,
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
        ...fontBold,
        color: DARK,
        marginBottom: 3,
    },
    titleText: {
        fontSize: 11,
        color: ACCENT,
        ...fontBold,
        marginBottom: 6,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // The four items plus three separators measure 405.7pt in Space
        // Grotesk 8pt against headerLeft's 437.28pt of usable width, so the six
        // gaps have 31.5pt to share. 4pt spends 24 of it and keeps ~7.6pt of
        // slack; the old 8pt (tuned for the narrower Helvetica) overflows and
        // wraps the GitHub handle onto a second line. Re-measure if the face,
        // the size, or any handle changes.
        gap: 4,
    },
    contactItem: {
        fontSize: 8,
        color: MUTED,
    },
    contactLink: {
        fontSize: 8,
        color: ACCENT,
        textDecoration: 'none',
    },
    // Section
    section: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 10,
        ...fontBold,
        color: ACCENT,
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
        ...fontBold,
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
        color: ACCENT,
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
        ...fontBold,
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
        color: ACCENT,
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
        ...fontBold,
        color: DARK,
        width: 112,
        flexShrink: 0,
        paddingRight: 6,
        paddingTop: 1,
    },
    skillList: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    // Working-knowledge tags: dashed border + muted text so the distinction
    // survives a greyscale print, where a colour-only cue would vanish.
    tagWorking: {
        borderWidth: 1,
        borderColor: BORDER,
        borderStyle: 'dashed',
        borderRadius: 3,
        paddingHorizontal: 5,
        paddingVertical: 2,
        fontSize: 7.5,
        color: MUTED,
    },
    skillsNote: {
        fontSize: 7.5,
        color: MUTED,
        marginBottom: 6,
    },
    // Projects
    // The second group opens against the bottom of the first group's last card
    // rather than against a section title, so it buys its own air: 14pt above
    // the heading against subSectionTitle's 5pt below it, because a heading
    // belongs to what follows it.
    projectGroupNext: {
        marginTop: 14,
    },
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
        ...fontBold,
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
    projectLink: {
        fontSize: 7.5,
        color: ACCENT,
        textDecoration: 'none',
        marginTop: 4,
    },
    // Certifications
    certItem: {
        marginBottom: 5,
    },
    // The certification reuses eduInstitution / eduPeriod / eduDegree for its
    // name, period, and issuer: it is a group inside Education now, and the row
    // has to scan against the degree rows directly above it.
    certDesc: {
        fontSize: 8.5,
        color: DARK,
        lineHeight: 1.4,
    },
    subSectionTitle: {
        fontSize: 9,
        ...fontBold,
        color: MUTED,
        marginBottom: 5,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    eduGroup: {
        marginBottom: 8,
    },
});

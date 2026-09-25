// ─── Colour Constants ─────────────────────────────────────────────────────────
// The CV is the site's light theme resolved to opaque hex. It is printed on
// white paper, so the light theme — not the dark default — is the correct
// source, and every value below is a real token from globals.css rather than a
// PDF-local invention. Keep them in step: a colour that changes there and not
// here puts the handoff artifact out of system again.
//
// The `color-mix()` and `rgba()` the stylesheet uses are resolved here because
// @react-pdf/renderer takes plain colours only.

/** Light theme --accent-ink, 9.3:1 on white (8.4:1 on --bg). The Ink Rule —
 *  raw --accent (light #6f5c3a) is a fill, and would only reach 5.8:1 as
 *  text, so accent-coloured text uses accent-ink instead. */
export const ACCENT = '#54452b';

/** Light theme --text. */
export const DARK = '#151515';

/** Light theme --muted (the Label colour), 6.1:1 AA. */
export const MUTED = '#5d5b56';

/** Light theme --line. */
export const BORDER = '#d8d5cd';

/** Light theme --bg. The page itself is --panel (#ffffff), so tinted blocks
 *  sit one tonal step below it — the same panel-over-field relationship the
 *  site uses, inverted for paper. */
export const LIGHT_BG = '#f4f3ef';

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

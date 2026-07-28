// ─── Colour Constants ─────────────────────────────────────────────────────────
// The CV is the site's light theme resolved to opaque hex. It is printed on
// white paper, so the light theme — not the dark default — is the correct
// source, and every value below is a real token from globals.css rather than a
// PDF-local invention. Keep them in step: a colour that changes there and not
// here puts the handoff artifact out of system again.
//
// The `color-mix()` and `rgba()` the stylesheet uses are resolved here because
// @react-pdf/renderer takes plain colours only.

/** --accent-ink: color-mix(in oklab, #9d7bff 58%, black). 9.95:1 on paper.
 *  The Ink Rule — raw --accent (#9d7bff) is a fill, never a text colour, and
 *  would fail contrast on white. */
export const ACCENT = '#49377a';

/** --text */
export const DARK = '#16161f';

/** --muted */
export const MUTED = '#5c5c70';

/** --line: rgba(12, 12, 36, 0.11) composited on white. */
export const BORDER = '#e4e4e7';

/** --bg. The page itself is --panel (#ffffff), so tinted blocks sit one tonal
 *  step below it — the same panel-over-field relationship the site uses,
 *  inverted for paper. */
export const LIGHT_BG = '#f7f7fb';

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

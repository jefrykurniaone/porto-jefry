import { Font } from '@react-pdf/renderer';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Registers the site's display face with @react-pdf/renderer so the PDF CV is
 * set in the same type as the site rather than the PDF-standard Helvetica.
 *
 * react-pdf accepts TTF/OTF only — it cannot read the WOFF2 that `next/font`
 * caches — so the two static instances are vendored under `public/fonts/`
 * (SIL Open Font License, text alongside them). `next.config.mjs` traces that
 * directory into the serverless bundle for this route.
 *
 * Registration is guarded: if the files are missing or unreadable the CV falls
 * back to Helvetica rather than throwing. The CV is the handoff artifact into
 * a recruiter's workflow — it degrades, it does not 500.
 */
const FONT_DIR = join(process.cwd(), 'public', 'fonts');
const REGULAR = join(FONT_DIR, 'SpaceGrotesk-Regular.ttf');
const BOLD = join(FONT_DIR, 'SpaceGrotesk-Bold.ttf');

export const CV_FONT_FAMILY = 'Space Grotesk';

function registerCvFonts(): boolean {
    if (!existsSync(REGULAR) || !existsSync(BOLD)) {
        console.warn('[cv-fonts] Space Grotesk not found in public/fonts — falling back to Helvetica');
        return false;
    }
    try {
        Font.register({
            family: CV_FONT_FAMILY,
            fonts: [
                { src: REGULAR, fontWeight: 400 },
                { src: BOLD, fontWeight: 700 },
            ],
        });
        return true;
    } catch (error) {
        console.error('[cv-fonts] Space Grotesk registration failed', error);
        return false;
    }
}

const isRegistered = registerCvFonts();

interface FontStyle {
    fontFamily: string;
    fontWeight?: 'bold';
}

/** Spread into a style to set the CV's body face. */
export const fontBody: FontStyle = {
    fontFamily: isRegistered ? CV_FONT_FAMILY : 'Helvetica',
};

/** Spread into a style to set the CV's bold face. */
export const fontBold: FontStyle = isRegistered
    ? { fontFamily: CV_FONT_FAMILY, fontWeight: 'bold' }
    : { fontFamily: 'Helvetica-Bold' };

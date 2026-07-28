/**
 * Locale-suffixed, because the PDF's language silently follows the site locale.
 * One fixed name meant an ID download overwrote an EN one already sitting in the
 * visitor's Downloads folder, with nothing on screen explaining why.
 *
 * It lives here rather than inside `use-cv-download` because the contact section
 * prints the name *before* the click, as the offer's metadata line — the promise
 * and the confirmation have to come from the same function or they will drift.
 */
export function cvFileName(locale: string): string {
    return `Jefry_Kurniawan_CV_${locale.toUpperCase()}.pdf`;
}

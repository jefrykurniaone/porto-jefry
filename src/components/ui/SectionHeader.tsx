import ScrambleTitle from '@/components/ui/ScrambleTitle';

interface SectionHeaderProps {
    /**
     * Ignored. The terminal-prompt kicker it fed is gone; the prop stays
     * optional only until every caller has dropped it, then it is removed (#80).
     */
    command?: string;
    /** Localized section name. Also the accessible name of the section. */
    title: string;
    /** Id for the `<section aria-labelledby>` that wraps this header. */
    titleId: string;
    /**
     * A derived, localized summary line, set as a Label under the title. Real
     * numbers read from the data arrays, never hand-maintained, so the line
     * cannot drift from the content beneath it.
     */
    output?: string;
}

/**
 * A display-type section title that scrambles into place once, on first entry,
 * with the optional summary line under it. The `<h2>`'s accessible text is the
 * real title at all times; see `ScrambleTitle` for how the two layers split.
 * Stays a server-renderable component: only `ScrambleTitle` runs on the client.
 */
export default function SectionHeader({
    title,
    titleId,
    output,
}: Readonly<SectionHeaderProps>) {
    return (
        <header className='section-header'>
            <h2 id={titleId} className='section-title'>
                <ScrambleTitle text={title} />
            </h2>
            {output && <p className='section-output'>{output}</p>}
        </header>
    );
}

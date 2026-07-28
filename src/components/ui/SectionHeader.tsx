interface SectionHeaderProps {
    /**
     * The shell command this section stands for. Deliberately untranslated —
     * commands are code, exactly like `$ whoami` inside the About terminal, and
     * the localized name of the section is the `<h2>` directly below it.
     */
    command: string;
    /** Localized section name. Also the accessible name of the section. */
    title: string;
    /** Id for the `<section aria-labelledby>` that wraps this header. */
    titleId: string;
    /**
     * The command's "output": a derived, localized count line. Real numbers read
     * from the data arrays, never hand-maintained, so the line cannot drift from
     * the content beneath it.
     */
    output?: string;
}

/**
 * Replaces the `01 /`, `02 /` numbered eyebrows. The sequence carried no
 * information a reader needed, and it left the terminal voice stranded in the
 * hero and About while five sections below spoke in generic portfolio grammar.
 * The prompt glyph is `aria-hidden`: it is punctuation for the eye, and a screen
 * reader announcing "dollar sign" before every section name is noise.
 */
export default function SectionHeader({
    command,
    title,
    titleId,
    output,
}: Readonly<SectionHeaderProps>) {
    return (
        <header>
            <p className='section-kicker'>
                <span className='section-kicker__prompt' aria-hidden='true'>$</span>{' '}
                {command}
            </p>
            {output && <p className='section-output'>{output}</p>}
            <h2 id={titleId} className='section-title'>{title}</h2>
        </header>
    );
}

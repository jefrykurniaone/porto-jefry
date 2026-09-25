import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

/**
 * The highlighted word in the statement. An inline-block, not a plain inline:
 * an inline's background covers the font's whole content area and paints over
 * the descenders of the line above, which the prototype hit.
 */
function renderMark(chunks: ReactNode) {
    return <mark className='manifesto__mark'>{chunks}</mark>;
}

/** The About paragraphs, as Reading text. One entry point per paragraph. */
function ManifestoProse({ paragraphs }: Readonly<{ paragraphs: string[] }>) {
    return (
        <div className='manifesto__prose'>
            {paragraphs.map((paragraph) => (
                <p key={paragraph} className='manifesto__para'>{paragraph}</p>
            ))}
        </div>
    );
}

/**
 * The manifesto: the About section as one oversized statement, then the About
 * prose and the profile photo in black and white. A server component, so the
 * prose ships as HTML. It carries no `id`: `HeroStage` owns the `#about` anchor.
 */
export default function About() {
    const t = useTranslations('about');
    const tNav = useTranslations('nav');
    const tHero = useTranslations('hero');

    return (
        <section aria-labelledby='about-title' className='manifesto'>
            <div className='manifesto__inner'>
                <header className='manifesto__opener'>
                    <h2 id='about-title' className='manifesto__kicker'>{tNav('about')}</h2>
                    <p className='manifesto__statement'>{t.rich('statement', { mark: renderMark })}</p>
                </header>
                <div className='manifesto__body'>
                    <Image
                        src='/cv-photo.webp'
                        alt={tHero('photo_alt')}
                        width={180}
                        height={180}
                        className='manifesto__photo'
                    />
                    <ManifestoProse paragraphs={t.raw('description') as string[]} />
                </div>
            </div>
        </section>
    );
}

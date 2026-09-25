import type { CSSProperties } from 'react';
import { experiences } from '@/data/experience';
import { skillCategories } from '@/data/skills';

/**
 * Advance of one marquee character in em: JetBrains Mono's 0.6em advance plus
 * the strip's 0.14em letter-spacing. Must match `.hero-marquee` in hero.css.
 */
const CHAR_EM = 0.74;
/** Horizontal padding of one item in em, both sides. Matches hero.css. */
const ITEM_PADDING_EM = 4;

/**
 * Every company once, in the order the experience data lists them, then every
 * skill item (shipped, then working) category by category. Read from the data
 * files so the strip can never drift from Experience and Skills.
 */
function marqueeItems(): string[] {
    const companies = experiences.map((item) => item.company);
    const skills = skillCategories.flatMap((cat) => [...cat.skills, ...(cat.working ?? [])]);
    return [...new Set([...companies, ...skills])];
}

/**
 * Width of one copy of the list in em, computed from character counts rather
 * than measured: the font is monospaced, so the estimate holds on the server
 * and the loop's duration can be set in the HTML with no client code.
 */
function copyWidthEm(items: readonly string[]): number {
    const em = items.reduce((total, item) => total + item.length * CHAR_EM + ITEM_PADDING_EM, 0);
    return Math.round(em * 100) / 100;
}

function MarqueeCopy({ items }: Readonly<{ items: readonly string[] }>) {
    return items.map((item) => (
        <span key={item} className='hero-marquee__item'>{item}</span>
    ));
}

/**
 * The strip along the bottom of the intro screen. The list is rendered twice
 * and the track slides by exactly one copy, so the loop is seamless whatever
 * the real width. Its speed is constant in pixels per second: the track's
 * `--marquee-length` (one copy, in em) feeds the animation duration in CSS, so
 * a longer list loops more slowly rather than faster.
 *
 * Hidden from assistive technology: every word in it is repeated in Experience
 * and Skills. Under reduced motion the track does not move.
 */
export default function HeroMarquee() {
    const items = marqueeItems();
    const style = { '--marquee-length': String(copyWidthEm(items)) } as CSSProperties;

    return (
        <div className='hero-marquee' aria-hidden='true'>
            <div className='hero-marquee__track' style={style}>
                <MarqueeCopy items={items} />
                <MarqueeCopy items={items} />
            </div>
        </div>
    );
}

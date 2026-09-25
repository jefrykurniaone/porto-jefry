'use client';

import type { ReactNode } from 'react';

interface HeroStageProps {
    /** The intro: giant letters row and copy band (`Hero`, a client component). */
    intro: ReactNode;
    /** The strip along the bottom of the first screen (`HeroMarquee`, server). */
    marquee: ReactNode;
    /** The manifesto (`About`, server). Passed in so its prose ships as HTML. */
    children: ReactNode;
}

/**
 * The hero stage: the intro screen, then the manifesto. Everything inside is
 * rendered by its own component and handed in as slots, so the server-rendered
 * parts (marquee, manifesto) stay server components under a client wrapper.
 *
 * This is the stacked layout that reduced-motion and no-JS visitors keep. The
 * stage owns both anchors: `id="hero"` on itself, and `id="about"` on the
 * manifesto slot, whose top is where an `#about` arrival lands here. The sticky
 * scroll transition moves that marker; the content components never carry it.
 */
export default function HeroStage({ intro, marquee, children }: Readonly<HeroStageProps>) {
    return (
        <section id='hero' aria-labelledby='hero-title' className='hero-stage'>
            <div className='hero-stage__screen'>
                {intro}
                {marquee}
            </div>
            <div id='about' className='hero-stage__manifesto'>
                {children}
            </div>
        </section>
    );
}

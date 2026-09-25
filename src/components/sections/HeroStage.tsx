'use client';

import { useRef, type ReactNode, type RefObject } from 'react';
import { gsap, registerMotion, useGSAP, MOTION_OK } from '@/utils/motion';

/**
 * The query that picks the sticky layout in hero.css; keep the two identical.
 * `scripting: enabled` always holds while this code runs, except in a browser
 * that does not know the feature, where CSS keeps the stacked layout: asking
 * for it here keeps the timeline off that layout too. It narrows MOTION_OK, so
 * GSAP still reverts everything built under it when reduced motion turns on.
 */
const STAGE_MOTION = `${MOTION_OK} and (scripting: enabled)`;

/** Always matches, so one matchMedia callback serves both layouts and re-runs when they swap. */
const ANY_MEDIA = 'all';

/** The attribute the navbar styles itself against (layout.css). */
const INK_ATTRIBUTE = 'data-header-ink';
const INK_HERO = 'hero';
/** Below this timeline progress the header still sits over the intro. */
const INK_FLIP = 0.75;

/** 150% of the reference box always reaches its farthest corner from any centre inside it. */
const CIRCLE_OPEN = '150%';
const CIRCLE_CLOSED = '0%';

/** Everything the transition moves, found by class inside the stage. */
const PART_SELECTORS = {
    screen: '.hero-stage__screen',
    marker: '.hero-stage__marker',
    manifesto: '.hero-stage__manifesto',
    letterJ: '.hero-intro__letter--j',
    letterK: '.hero-intro__letter--k',
    band: '.hero-intro__band',
    actions: '.hero-intro__actions',
    marquee: '.hero-marquee',
    opener: '.manifesto__opener',
    body: '.manifesto__body',
} as const;

type StageParts = Record<keyof typeof PART_SELECTORS, HTMLElement>;

function readStage(stage: HTMLElement): StageParts | null {
    const parts: Partial<StageParts> = {};
    for (const [name, selector] of Object.entries(PART_SELECTORS)) {
        const element = stage.querySelector<HTMLElement>(selector);
        if (!element) {
            return null;
        }
        parts[name as keyof StageParts] = element;
    }
    return parts as StageParts;
}

/**
 * Sets or clears the ink signal. Reads the live attribute rather than a cached
 * flag, so a write only happens on a real change and React re-rendering <html>
 * cannot leave it stale.
 */
function setInk(onHero: boolean): void {
    const root = document.documentElement;
    if (root.hasAttribute(INK_ATTRIBUTE) === onHero) {
        return;
    }
    if (onHero) {
        root.setAttribute(INK_ATTRIBUTE, INK_HERO);
    } else {
        root.removeAttribute(INK_ATTRIBUTE);
    }
}

/**
 * The header is over the intro while both the scroll position and the drawn
 * frame are short of INK_FLIP; before the stage both are 0. Taking the larger
 * of the two matters while the 1s scrub is catching up: jumping past the stage
 * drops the hero ink at once, and scrolling back sets it only once the frame
 * has actually rewound. The non-hero bar has its own backdrop, so erring
 * towards it never costs legibility.
 */
function syncInk(timeline: gsap.core.Timeline): void {
    const scrolled = timeline.scrollTrigger?.progress ?? 0;
    setInk(Math.max(scrolled, timeline.progress()) < INK_FLIP);
}

/** Layout offset of `element` inside `ancestor`: untouched by any transform. */
function offsetWithin(element: HTMLElement, ancestor: HTMLElement): { left: number; top: number } {
    let left = 0;
    let top = 0;
    let node: HTMLElement | null = element;
    while (node && node !== ancestor) {
        left += node.offsetLeft;
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
    }
    return { left, top };
}

/**
 * The circle, centred between the J and K at the letters' middle height. The
 * offsets ignore the transforms the timeline puts on the letters, so a refresh
 * mid-scroll measures the resting position. The manifesto layer overlaps the
 * screen from the same top-left corner, so px from the screen apply to it.
 */
function circleAt(radius: string, parts: StageParts): string {
    const j = offsetWithin(parts.letterJ, parts.screen);
    const k = offsetWithin(parts.letterK, parts.screen);
    const x = (j.left + k.left + parts.letterK.offsetWidth) / 2;
    const y = j.top + parts.letterJ.offsetHeight / 2;
    return `circle(${radius} at ${x}px ${y}px)`;
}

/**
 * Spec #64's sequence, in progress units: the timeline is exactly 1 long, so
 * the `start` and `end` labels are progress 0 and 1. Opacity, never autoAlpha,
 * on text: `visibility: hidden` would drop the name and the About prose from
 * the accessibility tree. The buttons are the exception, hidden once the copy
 * has gone so a keyboard user never tabs onto a control nobody can see.
 */
function addSequence(timeline: gsap.core.Timeline, parts: StageParts): void {
    const circle = (radius: string) => () => circleAt(radius, parts);
    timeline
        .addLabel('start', 0)
        .to(parts.band, { y: -60, opacity: 0, duration: 0.3 }, 0)
        .set(parts.actions, { visibility: 'hidden' }, 0.3)
        .to(parts.marquee, { yPercent: 100, opacity: 0, duration: 0.25 }, 0)
        .to(parts.letterJ, { xPercent: -75, scale: 1.9, duration: 0.85, ease: 'power1.in' }, 0)
        .to(parts.letterK, { xPercent: 75, scale: 1.9, duration: 0.85, ease: 'power1.in' }, 0)
        .fromTo(
            parts.manifesto,
            { clipPath: circle(CIRCLE_CLOSED) },
            { clipPath: circle(CIRCLE_OPEN), duration: 0.62, ease: 'power2.in' },
            0.28,
        )
        .fromTo(
            [parts.opener, parts.body],
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.22, stagger: 0.06, ease: 'power2.out' },
            0.72,
        )
        .addLabel('end', 1);
}

/**
 * Scrubs the transition across the stage. Nothing is pinned: hero.css holds
 * the layers with `position: sticky` and reserves the scroll distance in the
 * server HTML (ADR 0001). The range runs from the stage's top to the `#about`
 * marker's, so the timeline ends exactly where an `#about` arrival lands.
 */
function playStage(stage: HTMLElement, parts: StageParts): () => void {
    const timeline: gsap.core.Timeline = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: () => syncInk(timeline),
        scrollTrigger: {
            trigger: stage,
            start: 'top top',
            endTrigger: parts.marker,
            end: 'top top',
            scrub: 1,
            snap: {
                snapTo: 'labelsDirectional',
                duration: { min: 0.35, max: 0.9 },
                delay: 0.05,
                ease: 'power2.inOut',
            },
            invalidateOnRefresh: true,
            onUpdate: () => syncInk(timeline),
            // A refresh lands the frame on the scroll position at once instead
            // of scrubbing there over a second, so arriving by anchor (a hash
            // on load, a locale switch) shows the revealed manifesto directly.
            onRefresh: (self) => {
                self.endAnimation();
                syncInk(timeline);
            },
        },
    });
    addSequence(timeline, parts);
    return () => setInk(false);
}

function navbarHeight(): number {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--navbar-height');
    return Number.parseFloat(raw) || 0;
}

/**
 * The stacked layout's ink: set while the intro still covers the whole navbar,
 * that is while it reaches below the bar's bottom edge. The root is the
 * viewport minus the bar, so the intro intersects it exactly then.
 */
function followIntro(screen: HTMLElement): () => void {
    const observer = new IntersectionObserver(
        (entries) => {
            const latest = entries.at(-1);
            if (latest) {
                setInk(latest.isIntersecting);
            }
        },
        { rootMargin: `-${navbarHeight()}px 0px 0px 0px` },
    );
    observer.observe(screen);
    return () => {
        observer.disconnect();
        setInk(false);
    };
}

/**
 * One matchMedia callback, re-run whenever the layout swaps: the timeline
 * under the sticky layout, the intro observer under the stacked one. Scoped by
 * useGSAP, so unmounting (a locale switch) kills the ScrollTrigger, reverts
 * every inline style, disconnects the observer and clears the ink signal.
 */
function useStageMotion(stageRef: RefObject<HTMLElement | null>): void {
    useGSAP(() => {
        registerMotion();
        const stage = stageRef.current;
        const parts = stage ? readStage(stage) : null;
        if (!stage || !parts) {
            return;
        }
        gsap.matchMedia().add({ motion: STAGE_MOTION, any: ANY_MEDIA }, (context) =>
            context.conditions?.motion ? playStage(stage, parts) : followIntro(parts.screen),
        );
    });
}

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
 * hero.css picks one of two layouts at first paint, from media queries alone:
 *
 * - Stacked (reduced motion, no JavaScript): the screen, then the manifesto.
 * - Sticky: both layers held in place while the stage scrolls through a
 *   reserved distance, the manifesto clipped to a zero circle over the intro
 *   until the timeline opens it.
 *
 * The stage owns both anchors: `id="hero"` on itself, and `id="about"` on an
 * empty marker between the two layers. Stacked, the marker sits on the
 * manifesto's top edge. Sticky, it sits where the timeline ends, so every
 * `#about` arrival lands on the revealed manifesto. The hold element after the
 * manifesto is the reserved scroll distance.
 */
export default function HeroStage({ intro, marquee, children }: Readonly<HeroStageProps>) {
    const stageRef = useRef<HTMLElement>(null);
    useStageMotion(stageRef);

    return (
        <section ref={stageRef} id='hero' aria-labelledby='hero-title' className='hero-stage'>
            <div className='hero-stage__screen'>
                {intro}
                {marquee}
            </div>
            <div id='about' className='hero-stage__marker' />
            <div className='hero-stage__manifesto'>
                {children}
            </div>
            <div className='hero-stage__hold' />
        </section>
    );
}

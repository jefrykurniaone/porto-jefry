'use client';

import { useRef, type ReactNode, type RefObject } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '@/utils/motion';

/** Viewports where the intro fits one screen; derived in hero.css. */
const STAGE_FITS = ['(min-width: 900px) and (min-height: 37.5em)', '(min-height: 45em)'];

/**
 * The query that picks the sticky layout in hero.css; keep the two identical.
 * Each branch narrows MOTION_OK, so GSAP reverts it all when reduced motion
 * turns on. ANY_MEDIA always matches: one callback serves both layouts.
 */
const STAGE_MOTION = STAGE_FITS.map((fits) => `${MOTION_OK} and (scripting: enabled) and ${fits}`).join(', ');
const ANY_MEDIA = 'all';

/** The attribute the navbar styles itself against (layout.css). */
const INK_ATTRIBUTE = 'data-header-ink';
/** Below this timeline progress the header still sits over the intro. */
const INK_FLIP = 0.75;

/** The ticket's snap: to a label, in the scroll's direction, 0.35–0.9 s, 0.05 s after it ends. */
const SNAP = { min: 0.35, max: 0.9, delay: 0.05, ease: 'power2.inOut' } as const;
/** This close to a label (in progress) counts as on it: ScrollTrigger's own tolerance. */
const ON_LABEL = 1e-3;
/** Any of these hands the scroll back to the visitor. Passive: never prevented. */
const TAKEOVER_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
/** A snap step found this far from where it was set means something else scrolled. */
const TAKEOVER_PX = 3;

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

/** Sets or clears the ink signal, reading the live attribute so a write happens only on change. */
function setInk(onHero: boolean): void {
    const root = document.documentElement;
    if (root.hasAttribute(INK_ATTRIBUTE) === onHero) {
        return;
    }
    if (onHero) {
        root.setAttribute(INK_ATTRIBUTE, 'hero');
    } else {
        root.removeAttribute(INK_ATTRIBUTE);
    }
}

/** Hero ink while scroll and drawn frame are both short of INK_FLIP; errs to the always-legible bar. */
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

/** The circle between J and K at the letters' middle, in px from the screen's corner, which the manifesto shares. */
function circleAt(radius: string, parts: StageParts): string {
    const j = offsetWithin(parts.letterJ, parts.screen);
    const k = offsetWithin(parts.letterK, parts.screen);
    const x = (j.left + k.left + parts.letterK.offsetWidth) / 2;
    const y = j.top + parts.letterJ.offsetHeight / 2;
    return `circle(${radius} at ${x}px ${y}px)`;
}

/**
 * Spec #64's sequence in progress units (the timeline is exactly 1 long).
 * Opacity on text keeps it in the accessibility tree; only the buttons hide.
 * Two fromTo tweens, not one staggered: that re-renders only its first target.
 * The circle opens to 150%, which reaches the farthest corner from any centre.
 */
function addSequence(timeline: gsap.core.Timeline, parts: StageParts): void {
    const circle = (radius: string) => () => circleAt(radius, parts);
    const rise = { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out', immediateRender: true };
    timeline
        .addLabel('start', 0)
        .to(parts.band, { y: -60, opacity: 0, duration: 0.3 }, 0)
        .set(parts.actions, { visibility: 'hidden' }, 0.3)
        .to(parts.marquee, { yPercent: 100, opacity: 0, duration: 0.25 }, 0)
        .to(parts.letterJ, { xPercent: -75, scale: 1.9, duration: 0.85, ease: 'power1.in' }, 0)
        .to(parts.letterK, { xPercent: 75, scale: 1.9, duration: 0.85, ease: 'power1.in' }, 0)
        .fromTo(parts.manifesto, { clipPath: circle('0%') },
            { clipPath: circle('150%'), duration: 0.62, ease: 'power2.in' }, 0.28)
        .fromTo(parts.opener, { opacity: 0, y: 40 }, rise, 0.72)
        .fromTo(parts.body, { opacity: 0, y: 40 }, rise, 0.78)
        .addLabel('end', 1);
}

/** Scrolls from where the page rests to the label the scroll was heading for. */
function snapTween(trigger: ScrollTrigger, at: number, stop: () => void): gsap.core.Tween {
    const to = trigger.direction > 0 ? 1 : 0;
    const proxy = { y: trigger.scroll() };
    let last = proxy.y;
    return gsap.to(proxy, {
        y: trigger.start + to * (trigger.end - trigger.start),
        duration: gsap.utils.clamp(SNAP.min, SNAP.max, Math.abs(to - at) * SNAP.max),
        ease: SNAP.ease,
        onUpdate: () => {
            if (Math.abs(window.scrollY - last) > TAKEOVER_PX) {
                stop();
                return;
            }
            last = proxy.y;
            window.scrollTo({ top: proxy.y, behavior: 'instant' });
        },
    });
}

/** The snap for a scroll that ended at `endedAt`, if the page is still there and inside the stage. */
function settleAt(trigger: ScrollTrigger, endedAt: number, stop: () => void): gsap.core.Tween | undefined {
    const at = (endedAt - trigger.start) / (trigger.end - trigger.start);
    const inside = at > ON_LABEL && at < 1 - ON_LABEL;
    return trigger.scroll() === endedAt && inside ? snapTween(trigger, at, stop) : undefined;
}

/**
 * Snaps only a scroll that ended inside the stage: `scrollend` fires once no
 * update is pending and the gesture is released, so one passing through ends
 * outside the range. One cut short by a ScrollTrigger refresh
 * (ScrollTrigger.js:500–551) is left alone. No `scrollend`, no snap.
 */
function snapOnScrollEnd(trigger: ScrollTrigger): () => void {
    if (!('onscrollend' in window)) {
        return () => undefined;
    }
    let pending: gsap.core.Tween | undefined;
    let tween: gsap.core.Tween | undefined;
    let interrupted = false;
    const stop = () => {
        pending?.kill();
        tween?.kill();
        pending = tween = undefined;
    };
    const markInterrupted = () => { interrupted ||= ScrollTrigger.isScrolling(); };
    const onScrollEnd = () => {
        const skip = interrupted || Boolean(tween?.isActive());
        const endedAt = trigger.scroll();
        interrupted = false;
        pending?.kill();
        pending = skip ? undefined : gsap.delayedCall(SNAP.delay, () => {
            tween = settleAt(trigger, endedAt, stop);
        });
    };
    window.addEventListener('scrollend', onScrollEnd);
    ScrollTrigger.addEventListener('refreshInit', markInterrupted);
    for (const type of TAKEOVER_EVENTS) {
        window.addEventListener(type, stop, { passive: true });
    }
    return () => {
        stop();
        window.removeEventListener('scrollend', onScrollEnd);
        ScrollTrigger.removeEventListener('refreshInit', markInterrupted);
        for (const type of TAKEOVER_EVENTS) {
            window.removeEventListener(type, stop);
        }
    };
}

/**
 * Scrubs the transition across the stage; hero.css holds the layers by sticky
 * (ADR 0001), nothing is pinned. The range ends at the `#about` marker's top,
 * exactly where an `#about` arrival lands.
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
            invalidateOnRefresh: true,
            onUpdate: () => syncInk(timeline),
            // Land on the scroll position at once rather than scrub there.
            onRefresh: (self) => {
                self.endAnimation();
                syncInk(timeline);
            },
        },
    });
    addSequence(timeline, parts);
    // A timeline's first refresh waits a tick behind a one-shot update() (ScrollTrigger.js:1934–1947);
    // call it now, filled, so every block shows its state for this scroll from the first frame.
    const trigger = timeline.scrollTrigger;
    trigger?.update();
    const stopSnap = trigger ? snapOnScrollEnd(trigger) : () => undefined;
    return () => {
        stopSnap();
        setInk(false);
    };
}

/** Stacked layout's ink: set while the intro reaches below the navbar's bottom edge. */
function followIntro(screen: HTMLElement): () => void {
    const navbar = getComputedStyle(document.documentElement).getPropertyValue('--navbar-height');
    const observer = new IntersectionObserver(
        (entries) => setInk(entries.at(-1)?.isIntersecting ?? false),
        { rootMargin: `-${Number.parseFloat(navbar) || 0}px 0px 0px 0px` },
    );
    observer.observe(screen);
    return () => {
        observer.disconnect();
        setInk(false);
    };
}

/** Timeline when sticky, intro observer when stacked; useGSAP undoes either on unmount (a locale switch). */
function useStageMotion(stageRef: RefObject<HTMLElement | null>): void {
    useGSAP(() => {
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
 * The intro screen, then the manifesto, as slots so the server parts stay
 * server components; hero.css picks stacked or sticky at first paint. The
 * empty `#about` marker sits on the manifesto's top edge when stacked and where
 * the timeline ends when sticky; the hold element is the reserved scroll.
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

'use client';

import { useEffect, useRef } from 'react';
import { createColourReader, createScene, destroyScene, drawScene, openContext, type DotFrame, type DotScene, type Rgb } from '@/components/ui/dot-field-gl';
import { REDUCED_MOTION_QUERY } from '@/utils/scroll';

/** About 10,000 points, or about 4,000 on a narrow screen (about.css's single column) or a coarse pointer. */
const POINTS_FULL = 10_000;
const POINTS_COMPACT = 4000;
const COMPACT_QUERY = '(max-width: 700px), (pointer: coarse)';
const MAX_DPR = 2; // drawing-buffer px per CSS px, at most
const QUIET_MARGIN = 18; // CSS px around the Reading text that stay quiet too
const MAX_STEP_MS = 50; // the most one frame advances the field, so a resumed loop does not jump
const LEAN_RATE = 6; // per second: how fast the lean fades in over the canvas and out off it
/** The positioned section the field fills; text is measured against it. */
const HOST = '.manifesto';
/** HeroStage's reveal layer: while its circle has zero radius, none of the field shows. */
const CLIP_LAYER = '.hero-stage__manifesto';
const STATEMENT = '.manifesto__statement';
const PROSE = '.manifesto__prose';
/** Far outside any canvas: the quiet zone when there is no Reading text. */
const NOWHERE = -1e6;

/** What a frame takes from the page's layout, in CSS px from the canvas's top left. */
type Layout = Pick<DotFrame, 'size' | 'center' | 'quiet'>;

/** Layout offset of `element` inside `ancestor`: transforms (the reveal's rise) do not move it. */
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

/** The tunnel's centre halfway between the statement and the Reading text; the quiet zone around the latter. */
function measureLayout(canvas: HTMLCanvasElement, host: HTMLElement): Layout {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const statement = host.querySelector<HTMLElement>(STATEMENT);
    const prose = host.querySelector<HTMLElement>(PROSE);
    if (!statement || !prose) {
        return { size: [width, height], center: [width / 2, height / 2], quiet: [NOWHERE, NOWHERE, NOWHERE, NOWHERE] };
    }
    const said = offsetWithin(statement, host);
    const read = offsetWithin(prose, host);
    const right = read.left + prose.offsetWidth;
    const bottom = read.top + prose.offsetHeight;
    return {
        size: [width, height],
        center: [said.left + statement.offsetWidth / 2, (said.top + statement.offsetHeight + read.top) / 2],
        quiet: [read.left - QUIET_MARGIN, read.top - QUIET_MARGIN, right + QUIET_MARGIN, bottom + QUIET_MARGIN],
    };
}

/** False while the layer's clip is a zero-radius circle. GSAP's inline style is read first: no style recalc. */
function isClipOpen(layer: HTMLElement | null): boolean {
    const clip = layer ? layer.style.clipPath || getComputedStyle(layer).clipPath : 'none';
    const radius = /circle\(\s*([\d.]+)/.exec(clip);
    return !radius || Number.parseFloat(radius[1]) > 0;
}

/**
 * One field on one canvas. It animates only while motion is allowed, the canvas
 * intersects the viewport, the reveal clip is open and the document is visible.
 * Under reduced motion it draws one still frame, redrawn only when its inputs change.
 */
class DotFieldRuntime {
    private readonly clipLayer: HTMLElement | null;
    private readonly readColour = createColourReader();
    private readonly motion = matchMedia(REDUCED_MOTION_QUERY);
    private readonly finePointer = matchMedia('(pointer: fine)').matches;
    private readonly budget = matchMedia(COMPACT_QUERY).matches ? POINTS_COMPACT : POINTS_FULL;
    private readonly pointer = { clientX: 0, clientY: 0, present: false, lean: 0 };
    private readonly teardown: (() => void)[] = [];
    private scene: DotScene | null = null;
    private layout: Layout | null = null;
    private colours: readonly [Rgb, Rgb] = [[0, 0, 0], [0, 0, 0]];
    private time = 0;
    private last = 0;
    private frame = 0;
    private looping = false;
    private dirty = true;
    private inView = false;
    private clipOpen = true;

    /** Starts at once. Sizing waits for the ResizeObserver's first call, so the first frame is drawn once. */
    constructor(private readonly gl: WebGL2RenderingContext, private readonly canvas: HTMLCanvasElement, private readonly host: HTMLElement) {
        this.clipLayer = canvas.closest<HTMLElement>(CLIP_LAYER);
        this.scene = createScene(gl, this.budget);
        this.readColours();
        this.listen();
        this.observe();
    }

    /** Frees the GL objects and the buffer. Not WEBGL_lose_context: forcing a loss logs a warning. */
    stop(): void {
        cancelAnimationFrame(this.frame);
        for (const undo of this.teardown.splice(0)) {
            undo();
        }
        if (this.scene && !this.gl.isContextLost()) {
            destroyScene(this.gl, this.scene);
        }
        this.canvas.width = 1;
        this.canvas.height = 1;
    }

    private canAnimate(): boolean {
        const live = this.scene !== null && this.layout !== null && !this.gl.isContextLost();
        const seen = this.inView && this.clipOpen && document.visibilityState === 'visible';
        return live && seen && !this.motion.matches;
    }

    /** Starts or stops the loop to match canAnimate(), and asks for a still frame when stopped. */
    private readonly sync = (): void => {
        const animate = this.canAnimate();
        if (animate && !this.looping) {
            cancelAnimationFrame(this.frame);
            this.looping = true;
            this.last = performance.now();
            this.frame = requestAnimationFrame(this.tick);
        } else if (!animate && this.looping) {
            cancelAnimationFrame(this.frame);
            this.looping = false;
            this.frame = 0;
        }
        if (!animate) {
            this.requestStill();
        }
    };

    private readonly invalidate = (): void => {
        this.dirty = true;
        this.sync();
    };

    /** One frame, and no loop, when reduced motion is on and something changed. */
    private requestStill(): void {
        if (!this.motion.matches || !this.dirty || this.frame !== 0 || !this.scene || !this.layout) {
            return;
        }
        this.frame = requestAnimationFrame(() => {
            this.frame = 0;
            this.dirty = false;
            this.draw();
        });
    }

    private readonly tick = (now: number): void => {
        const step = Math.max(0, Math.min(now - this.last, MAX_STEP_MS)) / 1000;
        this.last = now;
        this.time += step;
        this.pointer.lean += (Number(this.pointerOver()) - this.pointer.lean) * (1 - Math.exp(-step * LEAN_RATE));
        this.dirty = false;
        this.draw();
        this.frame = requestAnimationFrame(this.tick);
    };

    private pointerOver(): boolean {
        const { clientX: x, clientY: y, present } = this.pointer;
        const rect = present ? this.canvas.getBoundingClientRect() : null;
        return rect !== null && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }

    private draw(): void {
        const { gl, scene, layout, pointer } = this;
        if (!scene || !layout || gl.isContextLost()) {
            return;
        }
        const rect = this.canvas.getBoundingClientRect();
        // A still frame never leans: the lean is motion, and it only eases while the loop runs.
        const lean = this.looping ? pointer.lean : 0;
        drawScene(gl, scene, {
            ...layout,
            time: this.time,
            pointer: [pointer.clientX - rect.left, pointer.clientY - rect.top, lean],
            dot: this.colours[0],
            accent: this.colours[1],
        });
    }

    /** Sizes the buffer to the canvas at the capped pixel ratio and re-measures the text. */
    private readonly resize = (): void => {
        const layout = measureLayout(this.canvas, this.host);
        const dpr = Math.min(globalThis.devicePixelRatio || 1, MAX_DPR);
        this.canvas.width = Math.max(1, Math.round(layout.size[0] * dpr));
        this.canvas.height = Math.max(1, Math.round(layout.size[1] * dpr));
        this.layout = layout;
        this.clipOpen = isClipOpen(this.clipLayer);
        this.invalidate();
    };

    /** Re-reads --dot and --accent, which follow `data-theme` and switch without a reload. */
    private readonly readColours = (): void => {
        const style = getComputedStyle(this.canvas);
        const next = [this.readColour(style, '--dot'), this.readColour(style, '--accent')] as const;
        if (next.flat().join() !== this.colours.flat().join()) {
            this.colours = next;
            this.invalidate();
        }
    };

    /** A lost context's objects are gone, so nothing is deleted; preventing the default asks for a restore. */
    private readonly onContext = (event: Event): void => {
        if (event.type === 'webglcontextlost') {
            event.preventDefault();
            this.scene = null;
        } else {
            this.scene = createScene(this.gl, this.budget);
        }
        this.invalidate();
    };

    /** Tracks mouse and pen only: the lean is for fine pointers. */
    private readonly onPointer = (event: Event): void => {
        const { type, pointerType, clientX, clientY } = event as PointerEvent;
        if (pointerType !== 'touch') {
            Object.assign(this.pointer, { clientX, clientY, present: type === 'pointermove' });
        }
    };

    private on(target: EventTarget, type: string, handler: (event: Event) => void, passive = true): void {
        target.addEventListener(type, handler, { passive });
        this.teardown.push(() => target.removeEventListener(type, handler));
    }

    private listen(): void {
        this.on(this.canvas, 'webglcontextlost', this.onContext, false);
        this.on(this.canvas, 'webglcontextrestored', this.onContext);
        this.on(document, 'visibilitychange', this.sync);
        this.on(this.motion, 'change', this.invalidate);
        if (this.finePointer) {
            this.on(window, 'pointermove', this.onPointer);
            this.on(document.documentElement, 'pointerleave', this.onPointer);
        }
    }

    private observe(): void {
        const sizes = new ResizeObserver(this.resize);
        for (const target of [this.canvas, ...this.host.querySelectorAll(`${STATEMENT}, ${PROSE}`)]) {
            sizes.observe(target);
        }
        const view = new IntersectionObserver((entries) => {
            this.inView = entries.at(-1)?.isIntersecting ?? false;
            this.sync();
        });
        view.observe(this.canvas);
        const theme = new MutationObserver(this.readColours);
        theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        const clip = new MutationObserver(() => {
            this.clipOpen = isClipOpen(this.clipLayer);
            this.sync();
        });
        if (this.clipLayer) {
            clip.observe(this.clipLayer, { attributes: true, attributeFilter: ['style'] });
        }
        this.teardown.push(() => {
            for (const observer of [sizes, view, theme, clip]) {
                observer.disconnect();
            }
        });
    }
}

/** Starts the field on this canvas and returns its teardown. Without WebGL2 the canvas stays blank. */
function startDotField(canvas: HTMLCanvasElement): (() => void) | undefined {
    const host = canvas.closest<HTMLElement>(HOST);
    const gl = host ? openContext(canvas) : null;
    if (!host || !gl) {
        return undefined;
    }
    const runtime = new DotFieldRuntime(gl, canvas, host);
    return () => runtime.stop();
}

/**
 * A WebGL2 point tunnel behind the manifesto. aria-hidden rides the wrapper: the a11y rules
 * count <canvas> as interactive and reject aria-hidden (S6825) and role='presentation' (S6843) on it.
 */
export default function DotField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        return canvas ? startDotField(canvas) : undefined;
    }, []);
    return (
        <div className='dot-field' aria-hidden='true'>
            <canvas ref={canvasRef} className='dot-field__canvas' />
        </div>
    );
}

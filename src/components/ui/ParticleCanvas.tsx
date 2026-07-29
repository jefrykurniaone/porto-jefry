'use client';

import { useEffect, useRef } from 'react';
import { REDUCED_MOTION_QUERY } from '@/utils/scroll';

const PARTICLE_COUNT = 55;
const MAX_LINK_DISTANCE = 0.14;
const MAX_LINK_DISTANCE_SQ = MAX_LINK_DISTANCE * MAX_LINK_DISTANCE;
const ACCENT_RGB = '157,123,255'; // --accent #9D7BFF
// Beyond 2x the extra backing-store pixels are invisible but the fill cost is
// real — a 3x phone would otherwise clear and repaint ~2.1M px every frame.
const MAX_DPR = 2;
// Link opacity is quantised into this many buckets so each frame issues a
// handful of stroke() calls instead of one per link (up to ~200 at rest).
const ALPHA_BUCKETS = 5;
const RESIZE_DEBOUNCE_MS = 150;

interface Point {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

// The field is decorative, so the randomness is not security-relevant — but
// Math.random() is a Sonar hotspot (S2245) and one getRandomValues() call for
// the whole field costs nothing at this point count.
function createPoints(count: number): Point[] {
    const seed = new Uint32Array(count * 4);
    crypto.getRandomValues(seed);
    const unit = (i: number) => seed[i] / 2 ** 32;
    return Array.from({ length: count }, (_, i) => ({
        x: unit(i * 4),
        y: unit(i * 4 + 1),
        vx: (unit(i * 4 + 2) - 0.5) * 0.00045,
        vy: (unit(i * 4 + 3) - 0.5) * 0.00045,
    }));
}

function advance(pts: Point[]): void {
    for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
    }
}

/** Groups links by quantised opacity so each bucket strokes as a single path. */
function buildLinkPaths(pts: Point[], w: number, h: number): (Path2D | null)[] {
    const buckets: (Path2D | null)[] = Array.from({ length: ALPHA_BUCKETS }, () => null);
    for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            // Compared squared, so the root is only taken for the pairs that
            // actually link — most of the ~1.5k pairs per frame fail here.
            const dSq = dx * dx + dy * dy;
            if (dSq >= MAX_LINK_DISTANCE_SQ) continue;
            const strength = 1 - Math.sqrt(dSq) / MAX_LINK_DISTANCE;
            const bucket = Math.min(ALPHA_BUCKETS - 1, Math.floor(strength * ALPHA_BUCKETS));
            const path = (buckets[bucket] ??= new Path2D());
            path.moveTo(pts[i].x * w, pts[i].y * h);
            path.lineTo(pts[j].x * w, pts[j].y * h);
        }
    }
    return buckets;
}

function drawFrame(
    ctx: CanvasRenderingContext2D,
    pts: Point[],
    w: number,
    h: number,
    light: boolean,
    dpr: number,
): void {
    ctx.clearRect(0, 0, w, h);
    advance(pts);

    const peakAlpha = light ? 0.14 : 0.16;
    ctx.lineWidth = dpr;
    buildLinkPaths(pts, w, h).forEach((path, bucket) => {
        if (!path) return;
        const alpha = (peakAlpha * (bucket + 0.5)) / ALPHA_BUCKETS;
        ctx.strokeStyle = `rgba(${ACCENT_RGB},${alpha})`;
        ctx.stroke(path);
    });

    const nodes = new Path2D();
    for (const p of pts) {
        nodes.moveTo(p.x * w + 1.6 * dpr, p.y * h);
        nodes.arc(p.x * w, p.y * h, 1.6 * dpr, 0, Math.PI * 2);
    }
    ctx.fillStyle = `rgba(${ACCENT_RGB},${light ? 0.4 : 0.55})`;
    ctx.fill(nodes);
}

/** Wires the canvas up to its own size, and returns a teardown. */
function attachSizing(canvas: HTMLCanvasElement, dpr: number, onSize: (w: number, h: number) => void) {
    let timer: ReturnType<typeof setTimeout>;
    const size = () => {
        const r = canvas.getBoundingClientRect();
        canvas.width = r.width * dpr;
        canvas.height = r.height * dpr;
        onSize(canvas.width, canvas.height);
    };
    const debounced = () => {
        clearTimeout(timer);
        timer = setTimeout(size, RESIZE_DEBOUNCE_MS);
    };
    size();
    window.addEventListener('resize', debounced);
    return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', debounced);
    };
}

function runNetwork(canvas: HTMLCanvasElement): (() => void) | undefined {
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const dpr = Math.min(globalThis.devicePixelRatio || 1, MAX_DPR);
    const pts = createPoints(PARTICLE_COUNT);
    let w = 0;
    let h = 0;
    let raf = 0;

    const stopSizing = attachSizing(canvas, dpr, (nw, nh) => {
        w = nw;
        h = nh;
    });

    const loop = () => {
        const light = document.documentElement.dataset.theme === 'light';
        drawFrame(ctx, pts, w, h, light, dpr);
        raf = requestAnimationFrame(loop);
    };

    // The hero is one viewport tall, so this loop would otherwise keep running
    // for the whole session against a canvas nobody can see.
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && raf === 0) {
            loop();
        } else if (!entry.isIntersecting && raf !== 0) {
            cancelAnimationFrame(raf);
            raf = 0;
        }
    });
    observer.observe(canvas);

    return () => {
        observer.disconnect();
        cancelAnimationFrame(raf);
        stopSizing();
    };
}

function useParticleNetwork(canvasRef: React.RefObject<HTMLCanvasElement | null>): void {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const query = globalThis.matchMedia(REDUCED_MOTION_QUERY);
        let stop: (() => void) | undefined;

        const sync = () => {
            stop?.();
            stop = undefined;
            // Allocate nothing at all under reduced motion — the canvas simply
            // stays empty rather than freezing on a first frame.
            if (!query.matches) stop = runNetwork(canvas);
        };

        sync();
        query.addEventListener('change', sync);
        return () => {
            query.removeEventListener('change', sync);
            stop?.();
        };
    }, [canvasRef]);
}

/** Animated particle-network background for the hero. Decorative only. */
export default function ParticleCanvas({ className }: Readonly<{ className?: string }>) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useParticleNetwork(canvasRef);
    // aria-hidden rides the wrapper, not the canvas: the a11y rules count
    // <canvas> as interactive, so both aria-hidden (S6825) and role
    // ='presentation' (S6843) are rejected on it. Hiding the subtree from
    // assistive tech is equivalent, and the wrapper keeps the caller's class so
    // positioning is unchanged.
    return (
        <div className={className} aria-hidden='true'>
            <canvas ref={canvasRef} className='particle-canvas__surface' />
        </div>
    );
}

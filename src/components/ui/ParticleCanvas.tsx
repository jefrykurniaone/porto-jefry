'use client';

import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 55;
const MAX_LINK_DISTANCE = 0.14;
const ACCENT_RGB = '157,123,255'; // --accent #9D7BFF

interface Point {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

function createPoints(count: number): Point[] {
    return Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.00045,
        vy: (Math.random() - 0.5) * 0.00045,
    }));
}

function drawFrame(
    ctx: CanvasRenderingContext2D,
    pts: Point[],
    w: number,
    h: number,
    light: boolean,
): void {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
    }
    for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < MAX_LINK_DISTANCE) {
                const alpha = (1 - d / MAX_LINK_DISTANCE) * (light ? 0.14 : 0.16);
                ctx.strokeStyle = `rgba(${ACCENT_RGB},${alpha})`;
                ctx.lineWidth = devicePixelRatio;
                ctx.beginPath();
                ctx.moveTo(pts[i].x * w, pts[i].y * h);
                ctx.lineTo(pts[j].x * w, pts[j].y * h);
                ctx.stroke();
            }
        }
    }
    for (const p of pts) {
        ctx.fillStyle = `rgba(${ACCENT_RGB},${light ? 0.4 : 0.55})`;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 1.6 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
    }
}

function useParticleNetwork(canvasRef: React.RefObject<HTMLCanvasElement>): void {
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        let w = 0;
        let h = 0;
        const size = () => {
            const r = canvas.getBoundingClientRect();
            w = canvas.width = r.width * devicePixelRatio;
            h = canvas.height = r.height * devicePixelRatio;
        };
        size();
        window.addEventListener('resize', size);

        const pts = createPoints(PARTICLE_COUNT);
        let raf = 0;
        const loop = () => {
            const light = document.documentElement.dataset.theme === 'light';
            drawFrame(ctx, pts, w, h, light);
            raf = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', size);
        };
    }, [canvasRef]);
}

/** Animated particle-network background for the hero. Decorative only. */
export default function ParticleCanvas({ className }: Readonly<{ className?: string }>) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useParticleNetwork(canvasRef);
    return <canvas ref={canvasRef} className={className} aria-hidden='true' />;
}

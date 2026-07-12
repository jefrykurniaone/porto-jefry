import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import ParticleCanvas from './ParticleCanvas';

function makeFakeContext() {
    return {
        clearRect: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        strokeStyle: '',
        fillStyle: '',
        lineWidth: 0,
    } as unknown as CanvasRenderingContext2D;
}

function mockReducedMotion(matches: boolean) {
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation((query: string) => ({
        matches,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    }));
}

let rafCallbacks: FrameRequestCallback[];

beforeEach(() => {
    mockReducedMotion(false);
    rafCallbacks = [];
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
        rafCallbacks.push(cb);
        return rafCallbacks.length;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('ParticleCanvas', () => {
    it('renders a decorative canvas with the given class', () => {
        const { container } = render(<ParticleCanvas className='hero__canvas' />);
        const canvas = container.querySelector('canvas');
        expect(canvas).toBeInTheDocument();
        expect(canvas).toHaveClass('hero__canvas');
        expect(canvas).toHaveAttribute('aria-hidden', 'true');
    });

    it('does nothing when the 2D context is unavailable (jsdom default)', () => {
        render(<ParticleCanvas />);
        expect(rafCallbacks).toHaveLength(0);
    });

    it('starts the animation loop and draws frames when a context exists', () => {
        const ctx = makeFakeContext();
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
            ctx as unknown as RenderingContext,
        );

        render(<ParticleCanvas />);
        expect(ctx.clearRect).toHaveBeenCalledTimes(1);
        expect(rafCallbacks.length).toBe(1);

        act(() => rafCallbacks[0](16));
        expect(ctx.clearRect).toHaveBeenCalledTimes(2);
        // 55 particles drawn as dots every frame
        expect(ctx.arc).toHaveBeenCalled();
    });

    it('skips the animation under prefers-reduced-motion', () => {
        mockReducedMotion(true);
        const ctx = makeFakeContext();
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
            ctx as unknown as RenderingContext,
        );

        render(<ParticleCanvas />);
        expect(ctx.clearRect).not.toHaveBeenCalled();
        expect(rafCallbacks).toHaveLength(0);
    });

    it('cancels the animation frame and removes the resize listener on unmount', () => {
        const ctx = makeFakeContext();
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
            ctx as unknown as RenderingContext,
        );
        const removeSpy = vi.spyOn(window, 'removeEventListener');

        const { unmount } = render(<ParticleCanvas />);
        unmount();

        expect(cancelAnimationFrame).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
        removeSpy.mockRestore();
    });
});

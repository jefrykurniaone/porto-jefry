import '@testing-library/jest-dom';
import { vi } from 'vitest';

/**
 * jsdom does not implement window.matchMedia. Components use it to honour
 * prefers-reduced-motion (typed hero roles, particle canvas); tests run with
 * no reduced-motion preference by default.
 */
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

/**
 * jsdom has no canvas implementation; getContext logs "not implemented" and
 * returns null. Stub it to return null quietly — ParticleCanvas guards on a
 * null context. Individual tests may override with a fake 2D context.
 */
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(
    null,
) as unknown as HTMLCanvasElement['getContext'];

afterEach(() => {
    delete document.documentElement.dataset.theme;
    localStorage.clear();
});

import { describe, it, expect } from 'vitest';
import { projects } from './projects';

describe('projects data', () => {
    it('is a non-empty array', () => {
        expect(projects.length).toBeGreaterThan(0);
    });

    it('every entry has required fields as non-empty strings', () => {
        projects.forEach((item) => {
            expect(item.id.length).toBeGreaterThan(0);
            expect(item.name.length).toBeGreaterThan(0);
            expect(item.company.length).toBeGreaterThan(0);
            expect(item.period.length).toBeGreaterThan(0);
        });
    });

    it('IDs are unique', () => {
        const ids = projects.map((p) => p.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('every entry has at least one tech', () => {
        projects.forEach((item) => {
            expect(item.tech.length).toBeGreaterThan(0);
        });
    });

    it('optional url, when present, is a valid URL', () => {
        projects.forEach((item) => {
            if (item.url) {
                expect(item.url).toMatch(/^https?:\/\/.+/);
            }
        });
    });
});

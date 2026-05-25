import { describe, it, expect } from 'vitest';
import { experiences } from './experience';

describe('experiences data', () => {
    it('is a non-empty array', () => {
        expect(experiences.length).toBeGreaterThan(0);
    });

    it('every entry has required fields as non-empty strings', () => {
        experiences.forEach((item) => {
            expect(item.id.length).toBeGreaterThan(0);
            expect(item.company.length).toBeGreaterThan(0);
            expect(item.role.length).toBeGreaterThan(0);
            expect(item.period.length).toBeGreaterThan(0);
            expect(item.location.length).toBeGreaterThan(0);
        });
    });

    it('IDs are unique', () => {
        const ids = experiences.map((e) => e.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('optional tech array, when present, contains non-empty strings', () => {
        experiences.forEach((item) => {
            if (item.tech) {
                expect(item.tech.length).toBeGreaterThan(0);
                item.tech.forEach((t) => expect(t.length).toBeGreaterThan(0));
            }
        });
    });
});

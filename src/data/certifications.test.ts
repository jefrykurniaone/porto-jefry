import { describe, it, expect } from 'vitest';
import { certifications } from './certifications';

describe('certifications data', () => {
    it('is a non-empty array', () => {
        expect(certifications.length).toBeGreaterThan(0);
    });

    it('every entry has a non-empty id string', () => {
        certifications.forEach((item) => {
            expect(typeof item.id).toBe('string');
            expect(item.id.length).toBeGreaterThan(0);
        });
    });

    it('IDs are unique', () => {
        const ids = certifications.map((c) => c.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});

import { describe, it, expect } from 'vitest';
import { education } from './education';

const VALID_TYPES = ['formal', 'informal'] as const;

describe('education data', () => {
    it('is a non-empty array', () => {
        expect(education.length).toBeGreaterThan(0);
    });

    it('every entry has required fields as non-empty strings', () => {
        education.forEach((item) => {
            expect(item.institution.length).toBeGreaterThan(0);
            expect(item.degree.length).toBeGreaterThan(0);
            expect(item.period.length).toBeGreaterThan(0);
        });
    });

    it('every entry has a valid type field', () => {
        education.forEach((item) => {
            expect(VALID_TYPES).toContain(item.type);
        });
    });

    it('optional gpa, when present, matches N.NN / N.NN format', () => {
        education.forEach((item) => {
            if (item.gpa) {
                expect(item.gpa).toMatch(/^\d+\.\d+ \/ \d+\.\d+$/);
            }
        });
    });
});

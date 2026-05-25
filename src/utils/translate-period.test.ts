import { describe, it, expect } from 'vitest';
import { translatePeriod } from './translate-period';

describe('translatePeriod', () => {
    it('returns the original string for locale "en"', () => {
        expect(translatePeriod('Jan 2024 – May 2024', 'en')).toBe('Jan 2024 – May 2024');
    });

    it('translates May → Mei for locale "id"', () => {
        expect(translatePeriod('May 2024 – Present', 'id')).toBe('Mei 2024 – Present');
    });

    it('translates Aug → Agu for locale "id"', () => {
        expect(translatePeriod('Aug 2023', 'id')).toBe('Agu 2023');
    });

    it('translates Oct → Okt for locale "id"', () => {
        expect(translatePeriod('Oct 2022', 'id')).toBe('Okt 2022');
    });

    it('translates Dec → Des for locale "id"', () => {
        expect(translatePeriod('Dec 2021', 'id')).toBe('Des 2021');
    });

    it('leaves untranslated months unchanged for locale "id"', () => {
        expect(translatePeriod('Jan 2024 – Mar 2024', 'id')).toBe('Jan 2024 – Mar 2024');
    });

    it('handles period string with no month names', () => {
        expect(translatePeriod('2020 – 2022', 'id')).toBe('2020 – 2022');
    });
});

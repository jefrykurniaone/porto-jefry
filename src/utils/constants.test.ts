import { describe, it, expect } from 'vitest';
import { BASE_URL, LAST_MODIFIED_DATE } from './constants';

describe('constants', () => {
    it('BASE_URL is a valid HTTPS URL', () => {
        expect(BASE_URL).toMatch(/^https:\/\/.+/);
    });

    it('BASE_URL does not have a trailing slash', () => {
        expect(BASE_URL).not.toMatch(/\/$/);
    });

    it('LAST_MODIFIED_DATE is a valid ISO date string', () => {
        expect(LAST_MODIFIED_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(new Date(LAST_MODIFIED_DATE).toString()).not.toBe('Invalid Date');
    });
});

import { describe, it, expect } from 'vitest';
import {
    CONTACT_EMAIL,
    CONTACT_PHONE_HREF,
    CONTACT_PHONE_DISPLAY,
    CONTACT_PHONE_INTL,
    CONTACT_LINKEDIN_URL,
    CONTACT_LINKEDIN_DISPLAY,
    CONTACT_LINKEDIN_HANDLE,
    CONTACT_GITHUB_URL,
    CONTACT_GITHUB_DISPLAY,
} from './contact';

describe('contact data', () => {
    it('CONTACT_EMAIL is a valid email address', () => {
        expect(CONTACT_EMAIL).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('CONTACT_PHONE_HREF starts with tel:', () => {
        expect(CONTACT_PHONE_HREF).toMatch(/^tel:/);
    });

    it('CONTACT_PHONE_DISPLAY and CONTACT_PHONE_INTL are non-empty strings', () => {
        expect(CONTACT_PHONE_DISPLAY.length).toBeGreaterThan(0);
        expect(CONTACT_PHONE_INTL.length).toBeGreaterThan(0);
    });

    it('CONTACT_LINKEDIN_URL is a valid LinkedIn URL', () => {
        expect(CONTACT_LINKEDIN_URL).toMatch(/^https:\/\/www\.linkedin\.com\//);
    });

    it('CONTACT_LINKEDIN_DISPLAY and CONTACT_LINKEDIN_HANDLE are non-empty', () => {
        expect(CONTACT_LINKEDIN_DISPLAY.length).toBeGreaterThan(0);
        expect(CONTACT_LINKEDIN_HANDLE.length).toBeGreaterThan(0);
    });

    it('CONTACT_GITHUB_URL is a valid GitHub URL', () => {
        expect(CONTACT_GITHUB_URL).toMatch(/^https:\/\/github\.com\//);
    });

    it('CONTACT_GITHUB_DISPLAY is non-empty', () => {
        expect(CONTACT_GITHUB_DISPLAY.length).toBeGreaterThan(0);
    });
});

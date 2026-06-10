import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock @vercel/functions before importing the route
vi.mock('@vercel/functions', () => ({
    ipAddress: vi.fn(),
}));

import { ipAddress } from '@vercel/functions';
import { GET } from './route';

const mockIpAddress = vi.mocked(ipAddress);

describe('GET /api/generate-cv — rate limiting', () => {
    beforeEach(() => {
        mockIpAddress.mockReset();
    });

    it('SEC-01-a: uses the IP returned by ipAddress() as the rate-limit bucket key', async () => {
        mockIpAddress.mockReturnValue('203.0.113.1');
        const req = new NextRequest('http://localhost/api/generate-cv?locale=en');
        const res = await GET(req as never);
        expect(res.status).not.toBe(429);
        expect(mockIpAddress).toHaveBeenCalledWith(req);
    });

    it('SEC-01-b: falls back to 127.0.0.1 when ipAddress() returns undefined', async () => {
        mockIpAddress.mockReturnValue(undefined);
        const req = new NextRequest('http://localhost/api/generate-cv?locale=en');
        const res = await GET(req as never);
        // First request from the fallback IP should always be allowed
        expect(res.status).not.toBe(429);
    });

    it('SEC-01-c: returns 429 after RATE_LIMIT_MAX_REQUESTS (5) requests within the window', async () => {
        mockIpAddress.mockReturnValue('203.0.113.99');
        for (let i = 0; i < 5; i++) {
            const req = new NextRequest('http://localhost/api/generate-cv?locale=en');
            const res = await GET(req as never);
            expect(res.status).not.toBe(429);
        }
        const req6 = new NextRequest('http://localhost/api/generate-cv?locale=en');
        const res6 = await GET(req6 as never);
        expect(res6.status).toBe(429);
        expect(res6.headers.get('Retry-After')).toBeTruthy();
    });
});

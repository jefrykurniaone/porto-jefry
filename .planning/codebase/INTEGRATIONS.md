# Integrations & External Services

**Analysis Date:** 2026-05-25

## APIs & External Services

- **Vercel Analytics** — web analytics injected via `<Analytics />` component from `@vercel/analytics/next`
  - Script source: `https://va.vercel-scripts.com` (whitelisted in CSP `script-src`)
  - Vitals endpoint: `https://vitals.vercel-insights.com` (whitelisted in CSP `connect-src`)
  - Usage: `src/app/[locale]/layout.tsx`

- **Google Fonts** — `Inter` font loaded via `next/font/google` at build time
  - Stylesheet source: `https://fonts.googleapis.com` (whitelisted in CSP `style-src`)
  - Font files: `https://fonts.gstatic.com` (whitelisted in CSP `font-src`)
  - Usage: `src/app/[locale]/layout.tsx`

- **Internal PDF API** — `/api/generate-cv?locale={locale}`
  - Route: `src/app/api/generate-cv/route.ts`
  - Triggered by: `src/components/sections/Hero.tsx` via `fetch('/api/generate-cv?locale=...')`
  - Generates a PDF buffer using `@react-pdf/renderer` and returns it as `application/pdf`
  - Supports locales: `en`, `id`
  - Rate-limited: 5 requests per minute per IP (in-memory store, resets on cold start)
  - Function timeout: 10 seconds (configured in `vercel.json`)

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|---------|
| *(none detected)* | No `process.env` references found in source — all config is static or build-time | — |

> No `.env` files found in the workspace. The application has no runtime environment variable dependencies beyond what Next.js/Vercel injects automatically.

## Third-party Libraries (non-framework)

| Library | Purpose |
|---------|---------|
| `@react-pdf/renderer` | Generates PDF CV document server-side; supports JPEG/PNG images only (WEBP converted via `sharp`) |
| `sharp` | Converts `public/cv-photo.webp` to JPEG (base64) for embedding in the PDF |
| `lucide-react` | SVG icon set used across UI components |
| `next-themes` | Dark / light / system theme management via CSS class toggling |
| `next-intl` | Locale-aware routing, message translation, and `<NextIntlClientProvider>` context |

## Authentication / Identity

- **None.** The portfolio is a fully public static site with no login, sessions, or user identity.

## Storage / Database

- **None.** All content is stored as static TypeScript data files under `src/data/`:
  - `src/data/contact.ts`
  - `src/data/education.ts`
  - `src/data/experience.ts`
  - `src/data/projects.ts`
  - `src/data/skills.ts`
- CV photo served from `public/cv-photo.webp` (local filesystem, read at request time by the API route)

## Deployment / Hosting

- **Vercel** — primary deployment platform
  - Production URL: `https://jefrykurniawan.vercel.app` (hardcoded in `src/app/[locale]/layout.tsx` metadata)
  - Config: `vercel.json` (function-level `maxDuration` for the PDF API route)
  - Security headers applied globally via `next.config.mjs`:
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: DENY`
    - `X-XSS-Protection: 1; mode=block`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy` (camera, microphone, geolocation disabled)
    - `Content-Security-Policy` (strict allowlist)

---

*Integration audit: 2026-05-25*

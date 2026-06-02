# External Integrations
_Last mapped: 2026-06-02_

## APIs & Services

**Vercel Analytics**
- Package: `@vercel/analytics` `^2.0.1`
- Integration: `<Analytics />` component rendered in `src/app/[locale]/layout.tsx`
- Outbound beacon: `https://vitals.vercel-insights.com` (allow-listed in CSP `connect-src`)
- Script origin: `https://va.vercel-scripts.com` (allow-listed in CSP `script-src`)
- No API key required at build time — auto-detected by Vercel's hosting environment

**Google Fonts**
- Integration: `next/font/google` — `Inter` font loaded in `src/app/[locale]/layout.tsx`
- Fonts fetched from `https://fonts.googleapis.com` / `https://fonts.gstatic.com` (allow-listed in CSP `style-src` and `font-src`)
- Self-hosted at build time by Next.js font optimization — no runtime Google dependency in production

**CV PDF Generation (internal API route)**
- Endpoint: `GET /api/generate-cv?locale=en|id`
- File: `src/app/api/generate-cv/route.ts`
- Behaviour: server-side only; no external HTTP call — renders `@react-pdf/renderer` in-process
- Rate limit: 5 requests/minute per IP (in-memory; resets on cold start)
- Cache: per-locale in-process `Map`; 1-hour `Cache-Control` header
- Vercel function timeout: 10 s (`vercel.json`)

## Databases

**None.** The site is fully static (SSG). All portfolio content lives as typed TypeScript arrays in `src/data/`. No database driver, ORM, or connection string is present.

## Auth

**None.** No authentication provider is used. The portfolio is publicly accessible with no login-gated content.

## Other Integrations

**Deployment Platform — Vercel**
- Configured via `vercel.json` (function max duration)
- Production URL: `https://porto-jefry.vercel.app` (`BASE_URL` in `src/utils/constants.ts`)
- Static pages generated for `en` and `id` locales via `generateStaticParams` in `src/app/[locale]/layout.tsx`
- Sitemap at `src/app/sitemap.ts` — references `BASE_URL`, alternate `hreflang` links for both locales

**i18n Routing — next-intl**
- Config: `src/i18n/routing.ts`, `src/i18n/request.ts`
- Middleware: `src/middleware.ts` (combines intl routing with nonce-based CSP)
- Message catalogs: `src/i18n/messages/en.json`, `src/i18n/messages/id.json`
- No external translation service — all strings are static JSON committed to the repo

**Security Headers (middleware)**
- File: `src/middleware.ts`
- Per-request cryptographic nonce injected into `Content-Security-Policy`
- Nonce forwarded to server components via `x-nonce` request header
- Additional headers set in `next.config.mjs`: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`

**Open Graph / Twitter Cards**
- Configured in `src/app/[locale]/layout.tsx` via `generateMetadata`
- Uses `BASE_URL` for image URL (`/cv-photo.webp`), locale-aware title/description from next-intl
- No third-party social SDK

**Sitemap / SEO**
- `src/app/sitemap.ts` — Next.js built-in `MetadataRoute.Sitemap`
- Serves `/sitemap.xml` automatically via Next.js; no external SEO service

---

_Integration audit: 2026-06-02_

# Architecture

**Analysis Date:** 2026-05-25

## Overview

```text
┌──────────────────────────────────────────────────────────────┐
│                    Browser / Client                          │
│   Sections (Client Components) + ThemeToggle + LangToggle   │
└───────────────────┬──────────────────────────────────────────┘
                    │  HTTP
┌───────────────────▼──────────────────────────────────────────┐
│                  Next.js App Router (SSR/SSG)                │
│   src/middleware.ts  →  locale detection & redirect          │
│   src/app/[locale]/layout.tsx  →  app shell (providers)     │
│   src/app/[locale]/page.tsx    →  single-page sections       │
├──────────────────────────────────────────────────────────────┤
│   src/app/api/generate-cv/route.ts  →  PDF generation API   │
└───────────────────┬──────────────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────────────┐
│                  Data / Content Layer                        │
│   src/data/*.ts  (static TypeScript modules)                 │
│   src/i18n/messages/{en,id}.json  (translation strings)      │
└──────────────────────────────────────────────────────────────┘
```

## Architecture Pattern

**Next.js App Router — Single-Page Portfolio with Locale Routing**

The application is a server-rendered portfolio site where all content lives on one scrollable page segmented into named sections. Navigation is anchor-scroll based. Two languages (EN/ID) are served as separate locale-prefixed routes (`/en`, `/id`) via `next-intl` middleware.

## Application Layers

**Routing / Middleware Layer:**
- Purpose: Intercept all non-asset requests, detect or redirect to a supported locale
- Location: `src/middleware.ts`
- Depends on: `src/i18n/routing.ts`

**App Shell Layer:**
- Purpose: Provide HTML document, global providers (i18n, theme), Navbar, and Footer
- Location: `src/app/[locale]/layout.tsx`
- Contains: `NextIntlClientProvider`, `ThemeProvider`, `<Navbar>`, `<Footer>`, skip-to-content link, Vercel Analytics
- Root layout `src/app/layout.tsx` is a minimal passthrough (just `<html>` + `<body>`)

**Page Layer:**
- Purpose: Compose portfolio section components in order
- Location: `src/app/[locale]/page.tsx`
- All sections are imported and rendered sequentially — no dynamic routing within the locale

**Section / Component Layer:**
- Purpose: Render individual portfolio sections; most are Client Components
- Location: `src/components/sections/`
- Client components use `useTranslations`, `useLocale`, `useMessages` from next-intl
- Sub-components within a section receive props (no prop drilling beyond parent→card)

**Layout Component Layer:**
- Purpose: Persistent UI chrome (navigation, footer, toggles)
- Location: `src/components/layout/`
- `Navbar.tsx` — sticky nav with anchor links, mobile hamburger, theme/language toggles
- `Footer.tsx` — minimal footer
- `ThemeToggle.tsx` — wraps next-themes `useTheme`
- `LanguageToggle.tsx` — uses locale-aware router from `src/i18n/routing.ts`

**CV / PDF Layer:**
- Purpose: Render a downloadable PDF CV using `@react-pdf/renderer`
- Location: `src/components/cv/`
- Components: `CvDocument`, `CvHeader`, `CvExperience`, `CvEducation`, `CvSkills`, `CvProjects`, `CvCertifications`
- Types: `src/components/cv/cv-types.ts` — `Messages` interface, `CvDocumentProps`
- Styles: `src/components/cv/cv-styles.ts` — StyleSheet definitions for react-pdf

**API Layer:**
- Purpose: Server-side PDF generation endpoint
- Location: `src/app/api/generate-cv/route.ts`
- Accepts `?locale=en|id` query param
- Applies in-memory rate limiting (5 req/min per IP, resets on cold start)
- Converts `public/cv-photo.webp` to JPEG via `sharp` before passing to react-pdf
- Returns `application/pdf` response

**Data Layer:**
- Purpose: Static, typed content consumed by both section components and the CV API
- Location: `src/data/`
- Files: `experience.ts`, `education.ts`, `projects.ts`, `skills.ts`, `certifications.ts`, `contact.ts`
- All files export plain TypeScript arrays/objects — no runtime fetching

**i18n Layer:**
- Purpose: Locale routing definition and server request configuration
- Location: `src/i18n/`
- `routing.ts` — defines supported locales (`en`, `id`), default locale (`en`), exports locale-aware `Link`, `redirect`, `usePathname`, `useRouter`
- `request.ts` — next-intl server config; loads JSON messages by locale with fallback to `defaultLocale`
- `messages/en.json`, `messages/id.json` — all user-facing strings; keyed by section namespace

**Utility Layer:**
- Purpose: Pure helper functions
- Location: `src/utils/`
- `translate-period.ts` — maps English month abbreviations to Indonesian equivalents for date string display

## Data Flow

### Page Render (SSR)

1. Request hits `src/middleware.ts` — locale validated/redirected
2. Next.js resolves `src/app/[locale]/layout.tsx` — `generateStaticParams` pre-generates `/en` and `/id`
3. `getMessages()` loads `src/i18n/messages/{locale}.json` on the server
4. `NextIntlClientProvider` serializes messages to the client bundle
5. `src/app/[locale]/page.tsx` renders section components in order
6. Client components hydrate and call `useTranslations(namespace)` for strings

### CV Download Flow

1. User clicks "Download CV" in `src/components/sections/Hero.tsx` (Client Component)
2. `fetch('/api/generate-cv?locale=en')` is called with locale
3. `src/app/api/generate-cv/route.ts` validates rate limit by IP
4. API reads `src/i18n/messages/{locale}.json` directly (static import)
5. API reads and converts `public/cv-photo.webp` → JPEG buffer via `sharp`
6. `CvDocument` React element created with `createElement`, rendered to buffer via `renderToBuffer`
7. `application/pdf` response returned; browser triggers download

### Language Switch

1. User clicks `LanguageToggle` in Navbar
2. `router.replace(pathname, { locale: nextLocale })` from `src/i18n/routing.ts`
3. next-intl performs client-side navigation to the alternate locale URL (`/en` ↔ `/id`)
4. Page re-renders with new locale messages

## Routing

| Route | Description |
|-------|-------------|
| `/` | Redirected by middleware to `/en` |
| `/en` | English portfolio page |
| `/id` | Indonesian portfolio page |
| `/api/generate-cv?locale=en\|id` | PDF generation endpoint |
| `/sitemap.xml` | Generated by `src/app/sitemap.ts` |
| `/robots.txt` | Static file at `public/robots.txt` |

Middleware matcher: `/((?!api|_next|_vercel|.*\\..*).*)` — applies locale detection to all non-asset, non-API routes.

## State Management

No global state library. State is limited to component-level `useState`:
- `HeroCtaButtons` (`src/components/sections/Hero.tsx`) — `isDownloading` boolean
- `Navbar` (`src/components/layout/Navbar.tsx`) — `isMenuOpen` boolean, `isScrolled` boolean for sticky shadow

Theme state is managed by `next-themes` (reads/writes to `localStorage` via `class` attribute on `<html>`).

Locale state is managed by next-intl (URL-based; no client store).

## Rendering Strategy

- **SSG (Static Site Generation):** `generateStaticParams` in `src/app/[locale]/layout.tsx` pre-generates `/en` and `/id` at build time
- **Server Components:** Layout and metadata generation (`generateMetadata`) run on the server
- **Client Components:** All section components marked `'use client'` — they access `useTranslations`, `useState`, DOM APIs
- **API Route:** Edge-compatible Node.js route handler (not Edge runtime — uses `node:fs/promises` and `sharp`)

## Key Architectural Decisions

- **next-intl for i18n:** Provides both server and client translation hooks, locale-aware navigation, and middleware integration with minimal configuration
- **URL-based locale:** Locale is embedded in the URL path (`/en`, `/id`) rather than stored in cookies or headers, making pages independently shareable and SEO-friendly
- **Static data files:** Portfolio content is hardcoded TypeScript modules rather than a CMS or database — appropriate for a personal portfolio; avoids runtime data fetching
- **Shared messages for web + PDF:** The same `messages/{locale}.json` files power both the web UI and the CV PDF generation, ensuring consistency
- **In-memory rate limiting:** The CV API uses a module-level Map for rate limiting; this resets on every cold start and does not work across serverless instances — acceptable for low-traffic personal portfolio
- **CSP headers:** Strict Content-Security-Policy configured in `next.config.mjs` with `frame-ancestors 'none'` and restrictive `script-src`
- **`@react-pdf/renderer` for CV:** PDF rendered server-side as a React tree, keeping CV layout co-located with other components and benefiting from the same type system

## Architectural Constraints

- **No database:** All content is static; adding dynamic content would require introducing a data store
- **Rate limit is per-instance:** Serverless deployments may run multiple instances; the in-memory rate limit store in `src/app/api/generate-cv/route.ts` is not shared across them
- **Client components hydrate all sections:** Because sections use `useTranslations`, they are all Client Components — this increases client JS bundle size compared to a pure Server Component approach
- **Single route, anchor navigation:** All sections are on one page; there are no sub-routes within the locale (no individual project or post pages)

---

*Architecture analysis: 2026-05-25*

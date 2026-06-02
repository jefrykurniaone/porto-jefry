# Architecture
_Last mapped: 2026-06-02_

## Pattern

**Single-page portfolio with Next.js 14 App Router — static i18n layered architecture.**

The site is a statically-generated single-page portfolio. All content lives under one locale-parameterized route (`/en` or `/id`). The page renders a vertical stack of section components; there is no routing between "pages." The architecture separates concerns into four clear layers: middleware/infrastructure, presentation (sections + layout), data (typed static arrays), and i18n (message catalogs + routing config).

```
Browser Request
      │
      ▼
┌─────────────────────────────────────────────────────┐
│  src/middleware.ts                                   │
│  next-intl routing + nonce-based CSP injection       │
└────────────┬────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────┐
│  src/app/[locale]/layout.tsx  (Server Component)     │
│  ThemeProvider, NextIntlClientProvider, Navbar,      │
│  Footer, BackToTop, Analytics                        │
└────────────┬────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────┐
│  src/app/[locale]/page.tsx  (Server Component)       │
│  Composes all 8 section components in order          │
└────────────┬────────────────────────────────────────┘
             │
      ┌──────┴──────────────────────────────────┐
      ▼                                         ▼
┌──────────────────────┐           ┌────────────────────────┐
│  src/components/     │           │  src/data/*.ts          │
│    sections/         │  imports  │  Typed static arrays:   │
│    layout/           │◄──────────│  experiences, projects, │
│    icons/            │           │  skills, education, etc.│
└──────────────────────┘           └────────────────────────┘
      │
      │ fetch (client-side, on demand)
      ▼
┌─────────────────────────────────────────────────────┐
│  src/app/api/generate-cv/route.ts  (API Route)       │
│  Renders @react-pdf/renderer PDF, rate-limited 5/min │
│  in-memory cache per locale, sharp for photo convert │
└──────────────────────────────────────────────────────┘
      │ uses
      ▼
┌──────────────────────────────────────────────────────┐
│  src/components/cv/  (PDF-only components)            │
│  CvDocument, CvHeader, CvExperience, etc.             │
│  Uses @react-pdf/renderer primitives — no HTML/Tailwind│
└──────────────────────────────────────────────────────┘
```

## Entry Points

| Entry Point | File | Purpose |
|-------------|------|---------|
| Middleware | `src/middleware.ts` | Runs on every non-asset request: i18n locale routing + nonce-based CSP header injection. Passes `x-nonce` to server components via request headers. |
| Root layout | `src/app/layout.tsx` | Does not exist — root delegates immediately to locale layout. |
| Locale layout | `src/app/[locale]/layout.tsx` | Server component. Validates locale, provides `NextIntlClientProvider`, `ThemeProvider`, wraps page in `<main>` with skip-link, Navbar, Footer, BackToTop. Exports `generateStaticParams` for `['en', 'id']`. |
| Home page | `src/app/[locale]/page.tsx` | Composes all 8 section components in display order: `Hero → About → Experience → Education → Skills → Projects → Certifications → Contact`. |
| CV API route | `src/app/api/generate-cv/route.ts` | `GET /api/generate-cv?locale=en|id`. Validates input, checks in-memory rate limit (5 req/min per IP), checks buffer cache, converts photo via sharp, renders PDF via `renderToBuffer`. |
| Sitemap | `src/app/sitemap.ts` | Returns two entries (`/en`, `/id`) with `hreflang` alternates. |
| i18n config | `src/i18n/request.ts` | Consumed by `next.config.mjs` via `createNextIntlPlugin`. Resolves locale and dynamically imports the matching message JSON. |

## Data Flow

### Page Render (SSG)

1. `next build` calls `generateStaticParams` in `src/app/[locale]/layout.tsx` → produces `[{locale:'en'}, {locale:'id'}]`
2. For each locale, `src/i18n/request.ts` imports `src/i18n/messages/{locale}.json` at build time
3. `src/app/[locale]/layout.tsx` calls `getMessages()` + `getTranslations()` (server-side) → passes messages bundle to `NextIntlClientProvider`
4. `src/app/[locale]/page.tsx` renders 8 section components; each client component hydrates with `useTranslations(namespace)` from the provider
5. Section components read structural data (dates, tech stacks, URLs) from `src/data/*.ts` typed arrays directly — no fetch, no API

### CV Download (Runtime)

1. User clicks "Download CV" button in `src/components/sections/Hero.tsx` (`HeroCtaButtons`)
2. `fetch('/api/generate-cv?locale=<current>')` is called from the browser
3. `src/middleware.ts` routes request (excluded from intl middleware via `matcher`)
4. `src/app/api/generate-cv/route.ts` → rate-limit check (in-memory `rateLimitStore` Map) → cache check (`CV_BUFFER_CACHE` Map)
5. On cache miss: `getPhotoSrc()` reads `public/cv-photo.webp` → converts to JPEG base64 via `sharp`
6. `renderToBuffer(createElement(CvDocument, { messages, photoSrc, locale }))` renders the PDF tree from `src/components/cv/`
7. Result is stored in `CV_BUFFER_CACHE` and returned as `application/pdf` with `Content-Disposition: attachment`

### i18n Translation

- **Server components/layouts**: `getTranslations({ locale, namespace })` from `next-intl/server`
- **Client components**: `useTranslations('namespace')` hook (receives messages via `NextIntlClientProvider`)
- **Period translation utility**: `src/utils/translate-period.ts` — string-replaces English month abbreviations with Indonesian equivalents when `locale === 'id'`

## Key Abstractions

**Section Component (`src/components/sections/*.tsx`)**
- One file per portfolio section (8 total)
- Always `'use client'` — consume `useTranslations` and optionally `useMessages`, `useLocale`
- Structural/static data (dates, tech) from `src/data/*.ts`; user-facing text from i18n messages
- Co-located test: `SectionName.test.tsx` in same directory
- Pattern: large sections decompose into smaller sub-components within the same file (e.g., `ExperienceCard` inside `Experience.tsx`, `HeroCtaButtons` inside `Hero.tsx`)

**Data Module (`src/data/*.ts`)**
- Each file exports a typed interface (`ExperienceItem`, `ProjectItem`, etc.) and a typed `const` array
- Contains structural data only: IDs, company names, dates, tech tags, URLs
- User-facing translatable text (bullets, descriptions) lives in `src/i18n/messages/` and is keyed by the data item's `id` field
- Co-located test: `filename.test.ts`

**CV Component Tree (`src/components/cv/`)**
- Uses `@react-pdf/renderer` primitives (`Document`, `Page`, `View`, `Text`, `Image`) — no HTML, no Tailwind
- Styles defined in `src/components/cv/cv-styles.ts` using `StyleSheet.create()`
- Types defined in `src/components/cv/cv-types.ts` (`Messages`, `CvDocumentProps`)
- Receives pre-resolved `messages` object and `photoSrc` (base64 JPEG string) as props
- Excluded from Vitest coverage

**i18n Routing (`src/i18n/routing.ts`)**
- Single source of truth for `locales: ['en', 'id']` and `defaultLocale: 'en'`
- Exports typed `Link`, `redirect`, `usePathname`, `useRouter` via `createNavigation` — use these instead of `next/navigation` equivalents

## Layers

**Infrastructure / Middleware**
- Files: `src/middleware.ts`, `next.config.mjs`
- Runs before every page render. Handles locale detection/redirection (next-intl), nonce generation, CSP header assembly, and security header injection.
- The nonce is forwarded to server components via `x-nonce` request header for script/style CSP compliance.

**i18n / Message Layer**
- Files: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/messages/en.json`, `src/i18n/messages/id.json`
- All user-facing strings live in the two JSON files, keyed by namespace and field.
- `routing.ts` is the locale config; `request.ts` resolves messages per request for next-intl server integration.

**Data Layer**
- Files: `src/data/experience.ts`, `src/data/projects.ts`, `src/data/skills.ts`, `src/data/education.ts`, `src/data/certifications.ts`, `src/data/contact.ts`
- Plain TypeScript constants. No async, no API calls. Exported typed arrays consumed directly by components.

**Presentation Layer — Layout**
- Files: `src/app/[locale]/layout.tsx`, `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/BackToTop.tsx`, `src/components/layout/ThemeToggle.tsx`, `src/components/layout/LanguageToggle.tsx`
- Persistent chrome (navbar, footer) and theme/locale controls. Navbar uses a focus-trapped mobile menu with keyboard navigation.

**Presentation Layer — Sections**
- Files: `src/components/sections/Hero.tsx`, `About.tsx`, `Experience.tsx`, `Education.tsx`, `Skills.tsx`, `Projects.tsx`, `Certifications.tsx`, `Contact.tsx`
- All `'use client'`. Each is a self-contained section rendered inside `<section id="...">` with a matching anchor ID for scroll navigation.

**PDF / CV Layer**
- Files: `src/components/cv/CvDocument.tsx`, `CvHeader.tsx`, `CvExperience.tsx`, `CvEducation.tsx`, `CvSkills.tsx`, `CvProjects.tsx`, `CvCertifications.tsx`, `cv-styles.ts`, `cv-types.ts`
- Consumed exclusively by `src/app/api/generate-cv/route.ts`. Not rendered to the browser DOM.

**API Layer**
- Files: `src/app/api/generate-cv/route.ts`
- Single GET endpoint. Stateless with in-process caching (resets on cold start). Input validation, rate limiting, and error handling all within the route handler.

**Utility Layer**
- Files: `src/utils/constants.ts`, `src/utils/translate-period.ts`
- `constants.ts`: `BASE_URL`, `LAST_MODIFIED_DATE` — used in layout metadata and sitemap
- `translate-period.ts`: EN→ID month abbreviation mapper for period strings

## Error Handling

- **API route** (`src/app/api/generate-cv/route.ts`): returns `429` with `Retry-After` header on rate limit; catches `renderToBuffer` errors, logs with `console.error('[generate-cv] Failed...')`, returns `500 Internal Server Error` — no stack trace exposed to client.
- **Locale validation** (`src/app/[locale]/layout.tsx`): calls `notFound()` from `next/navigation` for invalid locales — triggers Next.js 404 page.
- **CV download** (`src/components/sections/Hero.tsx` `handleDownload`): catches fetch errors, logs `[CV Download] failed:` with error context, silently recovers UI (re-enables button via `finally`).
- **Photo loading** (`src/app/api/generate-cv/route.ts` `getPhotoSrc`): empty catch — proceeds without photo rather than failing the PDF render.

## Anti-Patterns

### Importing from `next/navigation` directly
**What happens:** Using `next/navigation`'s `Link`, `redirect`, `useRouter`, `usePathname` bypasses locale awareness.
**Why it's wrong:** Routes won't include the locale prefix; locale-aware navigation breaks.
**Do this instead:** Always import from `src/i18n/routing.ts` — `import { Link, redirect, usePathname, useRouter } from '@/i18n/routing'`.

### Hardcoding user-facing strings in components
**What happens:** Placing literal text directly in JSX or TypeScript logic.
**Why it's wrong:** Breaks EN/ID parity; content is not translatable without code changes.
**Do this instead:** Add strings to both `src/i18n/messages/en.json` and `src/i18n/messages/id.json`, then consume via `useTranslations` or `getTranslations`.

### Using HTML/Tailwind in CV components
**What happens:** Adding `<div>`, `className`, or Tailwind utilities inside `src/components/cv/`.
**Why it's wrong:** `@react-pdf/renderer` renders to a PDF canvas, not a DOM — HTML elements and CSS classes are silently ignored or throw errors.
**Do this instead:** Use only `View`, `Text`, `Image`, `Page`, `Document` from `@react-pdf/renderer` with styles from `StyleSheet.create()` in `src/components/cv/cv-styles.ts`.

---

*Architecture analysis: 2026-06-02*

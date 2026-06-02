<!-- GSD:project-start source:PROJECT.md -->

## Project

**porto-jefry**

A personal portfolio website for Jefry, built with Next.js 14 App Router, TypeScript (strict), and Tailwind CSS. Deployed on Vercel. Supports EN/ID localization via next-intl, dark/light mode via next-themes, and includes a CV PDF download feature powered by @react-pdf/renderer.

**Core Value:** A fast, accessible, bilingual portfolio that accurately represents Jefry's work and makes it easy for recruiters and collaborators to download his CV and reach him.

### Constraints

- **Tech stack:** Next.js 14 App Router — no downgrade or migration
- **Localization:** All user-facing strings must be in both `en.json` and `id.json`
- **CV components:** Use only `@react-pdf/renderer` primitives — no HTML/Tailwind in `src/components/cv/`
- **File length:** Max 300 lines per file; max 40 lines per function
- **Testing:** New code must maintain 80% coverage thresholds
- **Routing:** Must import Link/redirect/useRouter from `@/i18n/routing`, not `next/navigation`
- **Deployment:** Vercel — no custom server required

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Runtime & Language

- **TypeScript** `^5` (strict mode) — all source files under `src/`
- **Node.js** `>=20.0.0` — enforced via `package.json` `engines` field and `.nvmrc` (`20`)
- **Target runtime:** Vercel Edge / Node.js serverless functions

## Frameworks & Libraries

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | `14.2.35` | App Router framework — SSG with `generateStaticParams` for `en`/`id` locales |
| `react` / `react-dom` | `^18` | UI rendering |
| `next-intl` | `^4.11.1` | EN/ID i18n — routing, message resolution, server + client translation hooks |
| `next-themes` | `^0.4.6` | Dark mode via `attribute='class'`; system default; `dark:` Tailwind variants |
| `tailwindcss` | `^3.4.1` | Utility-first CSS; `darkMode: 'class'`; config at `tailwind.config.ts` |
| `lucide-react` | `^1.14.0` | Icon library (SVG-based React components) |
| `@react-pdf/renderer` | `^4.5.1` | PDF generation for CV download — renders `CvDocument` via `src/app/api/generate-cv/route.ts` |
| `sharp` | `^0.34.5` | Converts `cv-photo.webp` → JPEG for `@react-pdf/renderer` (JPEG/PNG only) |
| `@vercel/analytics` | `^2.0.1` | Vercel Analytics — injected as `<Analytics />` in `src/app/[locale]/layout.tsx` |

## Key Dependencies

- `next/font/google` (built-in) — `Inter` font loaded via `src/app/[locale]/layout.tsx`, served via Google Fonts CDN
- `@react-pdf/renderer` — used exclusively in `src/components/cv/` and `src/app/api/generate-cv/route.ts`
- `sharp` — image processing in the CV API route only; not used in UI rendering
- `vitest` `^4.1.7` — test runner; config at `vitest.config.ts`
- `@vitejs/plugin-react` `^6.0.2` — React JSX transform for Vitest
- `vite-tsconfig-paths` `^6.1.1` — resolves `@/` alias inside Vitest
- `@testing-library/react` `^16.3.2` — component testing
- `@testing-library/jest-dom` `^6.9.1` — DOM matchers
- `@testing-library/user-event` `^14.6.1` — user interaction simulation
- `@vitest/coverage-v8` `^4.1.7` — V8-based coverage; thresholds: 80% lines/functions/statements, 65% branches
- `jsdom` `^29.1.1` — DOM environment for Vitest
- `eslint` `^8` + `eslint-config-next` `14.2.35` — linting; config at `.eslintrc.json`
- `postcss` `^8` — PostCSS pipeline; config at `postcss.config.mjs`

## Configuration

| File | Purpose |
|------|---------|
| `next.config.mjs` | Next.js config — wraps `withNextIntl`, sets security response headers (CSP, X-Frame-Options, etc.) |
| `tsconfig.json` | TypeScript strict mode; `@/*` → `src/*` path alias; `moduleResolution: bundler` |
| `tailwind.config.ts` | Tailwind content paths, `darkMode: 'class'`, no custom theme extensions |
| `vitest.config.ts` | Vitest with jsdom, coverage via V8, excludes `src/components/cv/**` and infra files |
| `postcss.config.mjs` | PostCSS (Tailwind integration) |
| `.eslintrc.json` | Extends `next/core-web-vitals` + `next/typescript` |
| `.nvmrc` | Node `20` |
| `vercel.json` | `maxDuration: 10s` for `src/app/api/generate-cv/route.ts` |
| `src/middleware.ts` | next-intl routing + per-request nonce-based CSP injection; passes nonce via `x-nonce` header |
| `src/i18n/routing.ts` | Defines `locales: ['en', 'id']`, `defaultLocale: 'en'`; exports typed `Link`, `redirect`, `usePathname`, `useRouter` |
| `src/i18n/request.ts` | next-intl server-side config consumed by `next.config.mjs` via `createNextIntlPlugin` |
| `src/i18n/messages/en.json` | English message catalog |
| `src/i18n/messages/id.json` | Indonesian message catalog |
| `src/utils/constants.ts` | `BASE_URL` (`https://porto-jefry.vercel.app`), `LAST_MODIFIED_DATE` |

## Package Manager

- **npm** `>=8.0.0` — enforced via `engines` in `package.json`
- Lockfile: `package-lock.json` ✅ present and committed

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Code Style

- Config: `.eslintrc.json` — extends `next/core-web-vitals` and `next/typescript`
- Zero warnings policy — all lint errors must be resolved before merge
- Inline suppression only when unavoidable (e.g., `// eslint-disable-next-line no-console` on intentional `console.error` calls)

## Naming

## Patterns

### Client Components

### Sub-component Extraction

### Props Interfaces with `Readonly`

### Data Module Pattern

### i18n: Always Use Translation Hooks

- **Client components:** `useTranslations('namespace')` from `next-intl`
- **Server components/layouts:** `getTranslations({ locale, namespace })` from `next-intl/server`
- Never hardcode user-facing strings — all text lives in `src/i18n/messages/en.json` and `src/i18n/messages/id.json`

### Routing

### Path Alias

### `useCallback` for Stable Event Handlers

### CV Components

### Dark Mode

### Accessibility

### NOSONAR Comments

## Error Handling

- **Never use empty catch blocks** — always handle or log.
- **Log with context:** Prefix with `[Location]` to identify the source:
- **Inline ESLint suppression** when `console.error` is intentional:
- **Guard with early return** before async work:
- **HTTP errors:** Check `res.ok` and throw a descriptive error before consuming the response body:
- **Never expose** stack traces or internal errors to end users.

## TypeScript

- **Strict mode** enforced via `tsconfig.json` — no implicit `any`, no implicit returns.
- **Interfaces over types** for object shapes (component props, data models).
- **Exported interfaces** always co-located with their data/component file.
- **Optional fields** with `?` — always guard before use:
- **`as const`** for readonly string/tuple literals used as discriminated unions or iteration keys.
- **`ReturnType<typeof ...>`** for inferred mock types in tests:
- **`React.ImgHTMLAttributes<HTMLImageElement>`** for typed HTML attribute spreads in mocks.
- **No `any`** — prefer `unknown` or specific union types.
- **Path alias `@/*`** resolves to `./src/*` (configured in `tsconfig.json` `paths`).

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## Pattern

```

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

### CV Download (Runtime)

### i18n Translation

- **Server components/layouts**: `getTranslations({ locale, namespace })` from `next-intl/server`
- **Client components**: `useTranslations('namespace')` hook (receives messages via `NextIntlClientProvider`)
- **Period translation utility**: `src/utils/translate-period.ts` — string-replaces English month abbreviations with Indonesian equivalents when `locale === 'id'`

## Key Abstractions

- One file per portfolio section (8 total)
- Always `'use client'` — consume `useTranslations` and optionally `useMessages`, `useLocale`
- Structural/static data (dates, tech) from `src/data/*.ts`; user-facing text from i18n messages
- Co-located test: `SectionName.test.tsx` in same directory
- Pattern: large sections decompose into smaller sub-components within the same file (e.g., `ExperienceCard` inside `Experience.tsx`, `HeroCtaButtons` inside `Hero.tsx`)
- Each file exports a typed interface (`ExperienceItem`, `ProjectItem`, etc.) and a typed `const` array
- Contains structural data only: IDs, company names, dates, tech tags, URLs
- User-facing translatable text (bullets, descriptions) lives in `src/i18n/messages/` and is keyed by the data item's `id` field
- Co-located test: `filename.test.ts`
- Uses `@react-pdf/renderer` primitives (`Document`, `Page`, `View`, `Text`, `Image`) — no HTML, no Tailwind
- Styles defined in `src/components/cv/cv-styles.ts` using `StyleSheet.create()`
- Types defined in `src/components/cv/cv-types.ts` (`Messages`, `CvDocumentProps`)
- Receives pre-resolved `messages` object and `photoSrc` (base64 JPEG string) as props
- Excluded from Vitest coverage
- Single source of truth for `locales: ['en', 'id']` and `defaultLocale: 'en'`
- Exports typed `Link`, `redirect`, `usePathname`, `useRouter` via `createNavigation` — use these instead of `next/navigation` equivalents

## Layers

- Files: `src/middleware.ts`, `next.config.mjs`
- Runs before every page render. Handles locale detection/redirection (next-intl), nonce generation, CSP header assembly, and security header injection.
- The nonce is forwarded to server components via `x-nonce` request header for script/style CSP compliance.
- Files: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/messages/en.json`, `src/i18n/messages/id.json`
- All user-facing strings live in the two JSON files, keyed by namespace and field.
- `routing.ts` is the locale config; `request.ts` resolves messages per request for next-intl server integration.
- Files: `src/data/experience.ts`, `src/data/projects.ts`, `src/data/skills.ts`, `src/data/education.ts`, `src/data/certifications.ts`, `src/data/contact.ts`
- Plain TypeScript constants. No async, no API calls. Exported typed arrays consumed directly by components.
- Files: `src/app/[locale]/layout.tsx`, `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/BackToTop.tsx`, `src/components/layout/ThemeToggle.tsx`, `src/components/layout/LanguageToggle.tsx`
- Persistent chrome (navbar, footer) and theme/locale controls. Navbar uses a focus-trapped mobile menu with keyboard navigation.
- Files: `src/components/sections/Hero.tsx`, `About.tsx`, `Experience.tsx`, `Education.tsx`, `Skills.tsx`, `Projects.tsx`, `Certifications.tsx`, `Contact.tsx`
- All `'use client'`. Each is a self-contained section rendered inside `<section id="...">` with a matching anchor ID for scroll navigation.
- Files: `src/components/cv/CvDocument.tsx`, `CvHeader.tsx`, `CvExperience.tsx`, `CvEducation.tsx`, `CvSkills.tsx`, `CvProjects.tsx`, `CvCertifications.tsx`, `cv-styles.ts`, `cv-types.ts`
- Consumed exclusively by `src/app/api/generate-cv/route.ts`. Not rendered to the browser DOM.
- Files: `src/app/api/generate-cv/route.ts`
- Single GET endpoint. Stateless with in-process caching (resets on cold start). Input validation, rate limiting, and error handling all within the route handler.
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

### Hardcoding user-facing strings in components

### Using HTML/Tailwind in CV components

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.github/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

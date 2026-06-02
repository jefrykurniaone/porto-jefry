# Tech Stack
_Last mapped: 2026-06-02_

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

**Production:**
- `next/font/google` (built-in) — `Inter` font loaded via `src/app/[locale]/layout.tsx`, served via Google Fonts CDN
- `@react-pdf/renderer` — used exclusively in `src/components/cv/` and `src/app/api/generate-cv/route.ts`
- `sharp` — image processing in the CV API route only; not used in UI rendering

**Dev / Build:**
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

---

_Stack analysis: 2026-06-02_

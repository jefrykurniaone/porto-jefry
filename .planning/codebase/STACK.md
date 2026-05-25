# Technology Stack

**Analysis Date:** 2026-05-25

## Runtime & Language

- **TypeScript** `^5` — primary language across all source files
- **Node.js** — server runtime (Next.js API routes, image processing, PDF generation)
- **ESNext** module target with `bundler` module resolution (`tsconfig.json`)

## Framework

- **Next.js** `14.2.35` — App Router, SSR, ISR, API routes
  - Config: `next.config.mjs`
  - i18n integration via `next-intl` plugin wrapping `withNextIntl`
  - Static param generation for locales: `generateStaticParams()` in `src/app/[locale]/layout.tsx`
  - Font: `next/font/google` (Inter, latin subset)

## Styling

- **Tailwind CSS** `^3.4.1` — utility-first CSS
  - Config: `tailwind.config.ts`
  - Dark mode: `class` strategy
  - Content paths: `src/pages/**`, `src/components/**`, `src/app/**`
- **PostCSS** `^8` — Tailwind CSS transformation pipeline
  - Config: `postcss.config.mjs`
- **Global CSS**: `src/app/globals.css`

## Internationalization

- **next-intl** `^4.11.1` — i18n routing and translation
  - Routing config: `src/i18n/routing.ts`
  - Request config: `src/i18n/request.ts`
  - Supported locales: `en`, `id` (default: `en`)
  - Message files: `src/i18n/messages/en.json`, `src/i18n/messages/id.json`
  - Middleware: `src/middleware.ts` (path-based locale detection)

## Build & Tooling

- **ESLint** `^8` with `eslint-config-next` `14.2.35` — linting
- **TypeScript** strict mode enabled; `noEmit: true`; path alias `@/*` → `./src/*`
- **Vercel CLI / vercel.json** — deployment and function config

## Package Manager

- **npm** (inferred from `package.json`; no alternative lockfile present)

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | `14.2.35` | App framework (SSR, routing, API) |
| `react` | `^18` | UI rendering |
| `react-dom` | `^18` | DOM rendering |
| `next-intl` | `^4.11.1` | i18n routing and translations |
| `next-themes` | `^0.4.6` | Dark/light/system theme switching |
| `@react-pdf/renderer` | `^4.5.1` | Server-side PDF generation for CV export |
| `sharp` | `^0.34.5` | Server-side image processing (WEBP→JPEG for PDF embedding) |
| `lucide-react` | `^1.14.0` | Icon components |
| `@vercel/analytics` | `^2.0.1` | Vercel web analytics integration |

## Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | `^5` | Type checking |
| `@types/node` | `^20` | Node.js type definitions |
| `@types/react` | `^18` | React type definitions |
| `@types/react-dom` | `^18` | React DOM type definitions |
| `@types/sharp` | `^0.31.1` | Sharp type definitions |
| `eslint` | `^8` | Linting |
| `eslint-config-next` | `14.2.35` | Next.js ESLint rule set |
| `tailwindcss` | `^3.4.1` | CSS utility framework |
| `postcss` | `^8` | CSS transformation pipeline |

---

*Stack analysis: 2026-05-25*

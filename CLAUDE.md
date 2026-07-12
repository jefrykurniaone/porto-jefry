# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run lint         # Run ESLint
npm run test         # Run tests once (vitest run)
npm run test:watch   # Watch mode
npm run test:coverage # Run with coverage report
npx tsc --noEmit     # Type-check without building
```

Run a single test file: `npx vitest run src/components/sections/Hero.test.tsx`

CI pipeline order: lint → typecheck → test → build.

## Architecture

**Porto-Jefry** is a bilingual (EN/ID) personal portfolio site built with Next.js 14 App Router, TypeScript, and next-intl. Deployed on Vercel. Styling is a custom token-based CSS design system (no component library): design tokens live in `src/app/globals.css` (`--bg`, `--panel`, `--accent`, …) with dark as the default theme and light overrides via `:root[data-theme="light"]`; component styles are in `src/app/styles/`. Fonts are Space Grotesk (sans) and JetBrains Mono (mono) via `next/font`, exposed as `--font-sans` / `--font-mono`.

### Request flow

```
Request → src/middleware.ts (i18n redirect + CSP nonce + security headers)
  ↓
src/app/[locale]/layout.tsx (NextIntlClientProvider + ThemeProvider + Analytics)
  ↓
src/app/[locale]/page.tsx (composes all section components)
  ↓
src/components/sections/*.tsx (consume data from src/data/*.ts and translations from src/i18n/messages/)
```

### Content model

All portfolio content (experience, education, skills, projects, certifications, contact) lives as TypeScript objects in `src/data/`. No database — data is version-controlled. Sections import and render this data directly.

### Internationalization

- Locales: `en` (default) and `id` (Indonesian). Configured in `src/i18n/routing.ts`.
- Middleware detects locale and redirects; all routes are under `/<locale>/`.
- Server-side messages loaded in `src/i18n/request.ts`. Client messages provided by `NextIntlClientProvider` in locale layout.
- All user-facing strings must go through `useTranslations()` / `getTranslations()`, never hardcoded.

### PDF CV generation (`/api/generate-cv`)

- GET endpoint; query param `locale` (en | id, defaults to en).
- Uses `@react-pdf/renderer` to render `CvDocument` (in `src/components/cv/`).
- Profile photo is read from `public/cv-photo.webp`, converted to JPEG via sharp for PDF compatibility.
- Rate limit: 5 requests / IP / 60 s — module-level Map (resets on cold start).
- Rendered PDF is cached per locale at module level; HTTP response sets `Cache-Control: max-age=3600`.

### Security

- CSP with per-request nonce injected in middleware; nonce passed to `<Script>` and `<style>` tags.
- HTTP security headers defined in `next.config.mjs` headers config.
- Locale parameter validated against whitelist before use; invalid values default to `"en"`.
- Rate limiter evicts stale entries on each request to prevent unbounded memory growth.

### Testing

- Vitest + React Testing Library, jsdom environment. Setup file: `src/test/setup.ts`.
- Tests are co-located with source files (`*.test.tsx` / `*.test.ts`).
- Coverage thresholds: 80% lines/functions/statements, 65% branches.
- CV components (`src/components/cv/`), API routes, middleware, and i18n files are excluded from coverage requirements.
- Test behavior, not implementation details.

## Coding standards

From `.github/copilot-instructions.md`:

- Max 300 lines per file, 40 lines per function.
- Naming: `camelCase` for variables/functions, `PascalCase` for components/types, `SCREAMING_SNAKE_CASE` for constants.
- No empty catch blocks; log errors with context.
- Accessibility: semantic HTML, `alt` text on images, keyboard navigation, WCAG AA contrast (4.5:1).
- Git: feature branches (`feat/`, `fix/`, `chore/`, `hotfix/`), Conventional Commits, no direct push to `main`.
- Each GSD phase gets its own branch (branching_strategy: "phase" in `.planning/config.json`). Branch name uses the phase slug.
- After PR merge: delete both the remote branch (`git push origin --delete <branch>`) and the local branch (`git branch -d <branch>`, or `-D` if it was squash-merged).

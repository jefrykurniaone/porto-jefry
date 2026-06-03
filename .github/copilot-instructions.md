# Porto-Jefry Development Guide

Bilingual (EN/ID) personal portfolio site built with Next.js 14 App Router, TypeScript, Tailwind CSS, and next-intl. Deployed on Vercel.

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

**Run a single test file:**  
`npx vitest run src/components/sections/Hero.test.tsx`

**CI pipeline order:** lint → typecheck → test → build

## Architecture

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

All portfolio content (experience, education, skills, projects, certifications, contact) lives as TypeScript objects in `src/data/`. **No database** — data is version-controlled. Sections import and render this data directly.

### Internationalization

- Locales: `en` (default) and `id` (Indonesian). Configured in `src/i18n/routing.ts`.
- Middleware detects locale and redirects; all routes are under `/<locale>/`.
- Server-side messages loaded in `src/i18n/request.ts`. Client messages provided by `NextIntlClientProvider` in locale layout.
- **All user-facing strings must go through `useTranslations()` / `getTranslations()`, never hardcoded.**

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

## Key Conventions

### Navigation imports

Always import `Link`, `redirect`, `usePathname`, `useRouter` from `src/i18n/routing.ts`, **not** from `next/navigation`:
```ts
// ✅ Correct
import { Link, usePathname } from '@/i18n/routing';

// ❌ Wrong
import { Link, usePathname } from 'next/navigation';
```

### Path alias

Always use `@/` — never use relative `../` that climbs more than one directory:
```ts
// ✅ Correct
import { experiences } from '@/data/experience';

// ❌ Wrong
import { experiences } from '../../../data/experience';
```

### Data module pattern

Each data file in `src/data/` exports an interface and a typed array together:
```ts
// src/data/experience.ts
export interface ExperienceItem { id: string; company: string; ... }
export const experiences: ExperienceItem[] = [ ... ];
```

### Sub-component extraction

Split large components into private named sub-components within the same file to stay under the 40-line function limit:
```ts
// src/components/layout/Navbar.tsx
function DesktopNavLinks({ onNavClick }: Readonly<NavLinksProps>) { ... }
function MobileNavLinks({ onNavClick, id, menuRef }: Readonly<MobileNavLinksProps>) { ... }
export default function Navbar() { ... }
```

### CV components

Components under `src/components/cv/` use `@react-pdf/renderer` primitives (`View`, `Text`, `StyleSheet`), **not** HTML or Tailwind. Styles live in `src/components/cv/cv-styles.ts` using `StyleSheet.create()`.

### Dark mode

Use `next-themes` with `attribute='class'`. Apply `dark:` Tailwind variants directly:
```tsx
className='bg-white dark:bg-gray-950 text-gray-900 dark:text-white'
```

## Coding Standards

### Code Quality
- Follow SonarQube coding standards (clean code, no code smells)
- Target: 0 warnings, 0 vulnerabilities, 0 deprecated components
- Fix all lint/type errors before considering a task done
- Lint checks enforced via pre-commit hook (e.g., Husky + lint-staged)
- Maximum function length: 40 lines; maximum file length: 300 lines
- Avoid deep nesting (max 3 levels) — prefer early return pattern
- No magic numbers; use named constants

### Naming Convention
- Variables & functions: camelCase
- Classes & React components: PascalCase
- Constants: SCREAMING_SNAKE_CASE
- Component files: PascalCase → `UserCard.tsx`
- Utility/hook files: kebab-case → `use-auth.ts`, `format-date.ts`
- Boolean variables: prefix with `is`, `has`, `should`

### Error Handling
- Never use empty catch blocks
- Always log errors with context (location, input, message)
- User-facing errors must be localized and human-readable
- Never expose stack traces or internal errors to end users

### Testing
- Unit tests required for all utility functions and business logic
- Minimum coverage: 80%
- Co-locate test files with source files
- Test behavior, not implementation details

### Internationalization (i18n)
- New apps must support minimum 2 languages: Indonesian (ID) and English (EN)
- Default language is English unless explicitly requested otherwise
- Single-language projects default to English
- All user-facing strings must go through the i18n system — no hardcoded text

### Git & Collaboration
- Branch naming: `feat/`, `fix/`, `chore/`, `hotfix/`
- Commit format: Conventional Commits
- No direct commit/push to `main`/`master` — always create feature branch first before commit and merge to main via Pull Request
- PR must pass all CI checks before merge

### Dependencies
- Evaluate bundle size, maintenance status, and license before adding packages
- Avoid packages with known CVEs
- Remove unused dependencies before merging

### Accessibility (a11y)
- All interactive elements must be keyboard-navigable
- Images must have descriptive alt text
- Minimum color contrast: 4.5:1 (WCAG AA)
- Use semantic HTML elements

### Security
- Follow OWASP Top 10 practices
- Validate all inputs at every entry point (API, forms, URL params)
- Prefer modern, non-deprecated APIs and components
- Avoid libraries with no updates for 2+ years without justification

<!-- GSD Configuration — managed by get-shit-done installer -->
# Instructions for GSD

- Use the get-shit-done skill when the user asks for GSD or uses a `gsd-*` command.
- Treat `/gsd-...` or `gsd-...` as command invocations and load the matching file from `.github/skills/gsd-*`.
- When a command says to spawn a subagent, prefer a matching custom agent from `.github/agents`.
- Do not apply GSD workflows unless the user explicitly asks for them.
- After completing any `gsd-*` command (or any deliverable it triggers: feature, bug fix, tests, docs, etc.), ALWAYS: (1) offer the user the next step by prompting via `ask_user`; repeat this feedback loop until the user explicitly indicates they are done.
- No direct commit/push to `main`/`master` — always create feature branch first before commit and merge to main via Pull Request
- PR must pass all CI checks before merge
<!-- /GSD Configuration -->

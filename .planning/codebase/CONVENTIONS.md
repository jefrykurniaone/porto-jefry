# Coding Conventions

**Analysis Date:** 2026-05-25

## TypeScript Usage

**Strictness:**
- `strict: true` enabled in `tsconfig.json` — all strict checks active
- `noEmit: true`, `isolatedModules: true`, `esModuleInterop: true`
- `moduleResolution: "bundler"` (Next.js 14 style)

**Interfaces vs Types:**
- Prefer `interface` for component props and data shapes: `ExperienceItem`, `CvDocumentProps`, `Messages`, `NavLinksProps`
- Use `type` keyword for union/literal narrowing only (e.g., `type SupportedLocale`)
- Use `import type` for type-only imports: `import type { Metadata } from 'next'`, `import { type CvDocumentProps } from './cv-types'`

**Readonly Pattern:**
- All component props wrapped in `Readonly<>`: `function CvDocument({ ... }: Readonly<CvDocumentProps>)`
- Tuple arrays declared `as const`: `const NAV_KEYS = ['about', ...] as const`, `const SUPPORTED_LOCALES = ['en', 'id'] as const`

**Path Alias:**
- `@/*` maps to `./src/*` — use for all internal imports: `import Navbar from '@/components/layout/Navbar'`

## Component Patterns

**File Structure:**
- One public default-exported component per file
- Private sub-components extracted within the same file and declared before the main export
  - Example: `HeroCtaButtons` in `src/components/sections/Hero.tsx`
  - Example: `DesktopNavLinks`, `MobileNavLinks` in `src/components/layout/Navbar.tsx`
- Sub-components accept typed props via `Readonly<InterfaceName>`

**Client vs Server:**
- `'use client'` directive at the top of any component using hooks or browser APIs
- Server components (no directive): `src/app/[locale]/layout.tsx`, `src/components/sections/About.tsx`
- Client components: `src/components/sections/Hero.tsx`, `src/components/layout/Navbar.tsx`, `src/components/layout/ThemeToggle.tsx`

**Hydration Guard:**
- Components depending on client-only state (e.g., theme) use `isMounted` guard pattern:
  ```tsx
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return <div className='w-9 h-9' />;
  ```
  Example: `src/components/layout/ThemeToggle.tsx`

**Event Handlers:**
- Named `handle[Action]` (e.g., `handleDownload`, `handleScroll`)
- Inline arrow functions used only for simple one-liners
- `type='button'` explicitly set on non-submit buttons

## Naming Conventions

**Files:**
- PascalCase for component files: `Hero.tsx`, `Navbar.tsx`, `ThemeToggle.tsx`, `CvDocument.tsx`
- kebab-case for utility/style/type files: `cv-styles.ts`, `cv-types.ts`, `translate-period.ts`
- camelCase for data files: `experience.ts`, `contact.ts`, `education.ts`

**Components:**
- PascalCase: `Hero`, `Navbar`, `DesktopNavLinks`, `CvDocument`

**Variables and Functions:**
- camelCase for functions, variables, and hooks: `handleDownload`, `scrollTo`, `getPhotoSrc`, `isDownloading`
- Boolean variables/state prefixed with `is`/`has`/`should`: `isDownloading`, `isOpen`, `isScrolled`, `isMounted`

**Constants:**
- SCREAMING_SNAKE_CASE for module-level constants: `CONTACT_EMAIL`, `BLUE`, `DARK`, `MAX_PROJECTS`, `RATE_LIMIT_WINDOW_MS`, `NAV_KEYS`
- Named export pattern for constants: `export const CONTACT_EMAIL = '...'`

**Interfaces:**
- PascalCase with descriptive suffix: `ExperienceItem`, `CvDocumentProps`, `NavLinksProps`, `Messages`

## Import Patterns

**Order (observed):**
1. External framework imports (`react`, `next/*`, `next-intl`, `lucide-react`, `next-themes`)
2. Internal `@/` alias imports (components, data, utils, i18n)
3. CSS/style imports last (`@/app/globals.css`)

**Examples from `src/app/[locale]/layout.tsx`:**
```ts
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import type { Metadata } from 'next';
import '@/app/globals.css';
```

## Styling Conventions

**Framework:** Tailwind CSS v3 exclusively — no CSS Modules, no inline `style` objects (except PDF renderer)

**Patterns:**
- Single-quoted class strings in JSX
- `dark:` variants for all dark mode styles
- `transition-colors` for hover/focus transitions
- Consistent color scheme: blue-600 primary, gray-900/white for dark/light text
- Border radius: `rounded-xl` for buttons/inputs, `rounded-2xl` for cards
- `inline-flex items-center gap-{n}` pattern for icon+text buttons
- `sr-only` + skip link for accessibility: `src/app/[locale]/layout.tsx`
- Responsive: `hidden md:flex` / `md:hidden` for mobile/desktop visibility

**PDF Styles (`src/components/cv/cv-styles.ts`):**
- `StyleSheet.create({})` from `@react-pdf/renderer`
- Color constants extracted at top of file (`BLUE`, `DARK`, `MUTED`, etc.)
- Style object keys in camelCase matching React PDF API

## i18n Conventions

**Library:** `next-intl` v4

**Locales:** `['en', 'id']` — English is default (`src/i18n/routing.ts`)

**Client components:**
```ts
const t = useTranslations('namespace');
t('key')
```

**Server components:**
```ts
const t = await getTranslations({ locale, namespace: 'hero' });
```

**Message files:** `src/i18n/messages/en.json`, `src/i18n/messages/id.json`

**Namespace convention:** Matches section name (e.g., `'nav'`, `'hero'`, `'about'`, `'theme'`)

**Locale validation:** Middleware at `src/middleware.ts` using `createMiddleware(routing)`; layout validates locale and calls `notFound()` for invalid values

## Data / Types Patterns

**Data files (`src/data/`):**
- Export typed arrays with co-located interface: interface defined first, then array
- IDs use kebab-case: `'xtremax-2025'`, `'arkamaya-2024'`
- Optional fields use `?`: `tech?: string[]`

**Contact constants (`src/data/contact.ts`):**
- Each constant individually named and exported: `CONTACT_EMAIL`, `CONTACT_PHONE_HREF`, `CONTACT_PHONE_DISPLAY`
- Different formats provided as separate constants (display vs href vs intl)

**Utility functions (`src/utils/`):**
- Pure functions with explicit return types
- `Object.entries().reduce()` preferred over for-loops for transformations
- Example: `translatePeriod(period, locale)` in `src/utils/translate-period.ts`

**CV types (`src/components/cv/cv-types.ts`):**
- Separate file for shared PDF component types
- Interfaces closely mirror JSON message structure

**API route (`src/app/api/generate-cv/route.ts`):**
- In-memory module-level caches for cold-start performance
- Named constants for magic numbers: `RATE_LIMIT_WINDOW_MS`, `JPEG_QUALITY`, `CACHE_MAX_AGE_SECONDS`
- Rate limiting implemented with module-level `Map`

## Anti-patterns Observed

- **Module-level mutable rate-limit state**: `const rateLimitStore = new Map(...)` in `src/app/api/generate-cv/route.ts` resets on every cold start; not safe for multi-instance serverless deployments
- **Single `eslint-disable-next-line no-console`**: `console.error` in `src/components/sections/Hero.tsx` is suppressed inline rather than using a proper logger — acceptable for a portfolio but not scalable
- **No Prettier config**: Formatting is enforced only by ESLint (`next/core-web-vitals`, `next/typescript`); no `.prettierrc` present, so editor formatting consistency depends on individual IDE settings
- **Data and display logic mixed in data files**: `src/data/experience.ts` stores display strings like `'Jul 2025 – Present'` instead of structured date fields, requiring `translatePeriod()` workaround for i18n

---

*Convention analysis: 2026-05-25*

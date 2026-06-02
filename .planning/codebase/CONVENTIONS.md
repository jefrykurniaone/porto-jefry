# Code Conventions
_Last mapped: 2026-06-02_

## Code Style

**Formatter:** Prettier (enforced via pre-commit hook with lint-staged)

**Linter:** ESLint via `next lint`
- Config: `.eslintrc.json` — extends `next/core-web-vitals` and `next/typescript`
- Zero warnings policy — all lint errors must be resolved before merge
- Inline suppression only when unavoidable (e.g., `// eslint-disable-next-line no-console` on intentional `console.error` calls)

**TypeScript:** Strict mode enabled (`"strict": true` in `tsconfig.json`). `noEmit: true`, `isolatedModules: true`.

**File length:** Max 300 lines per file.

**Function length:** Max 40 lines per function.

**Nesting depth:** Max 3 levels — prefer early return pattern.

**No magic numbers:** All constants use named `SCREAMING_SNAKE_CASE` identifiers.

---

## Naming

**Variables & functions:** `camelCase`
```ts
const isDownloading = false;
function handleDownload() { ... }
const scrollTo = (id: string) => ...
```

**React components & classes:** `PascalCase`
```ts
export default function Hero() { ... }
function HeroCtaButtons({ ... }: ...) { ... }
```

**Constants:** `SCREAMING_SNAKE_CASE`
```ts
// src/utils/constants.ts
export const BASE_URL = 'https://porto-jefry.vercel.app';
export const LAST_MODIFIED_DATE = '2026-05-25';

// src/components/cv/cv-styles.ts
export const BLUE = '#2563EB';
export const MAX_PROJECTS = 6;
```

**Boolean variables:** Prefix with `is`, `has`, or `should`
```ts
const [isOpen, setIsOpen] = useState(false);
const [isScrolled, setIsScrolled] = useState(false);
const [isDownloading, setIsDownloading] = useState(false);
```

**Component files:** `PascalCase.tsx` → `Hero.tsx`, `Navbar.tsx`, `ThemeToggle.tsx`

**Utility/hook files:** `kebab-case.ts` → `translate-period.ts`, `constants.ts`

**Constant arrays (tuple types):** `as const`
```ts
// src/components/layout/Navbar.tsx
const NAV_KEYS = ['about', 'experience', ...] as const;
```

---

## Patterns

### Client Components
Mark with `'use client'` directive at the top of the file when using hooks or browser APIs:
```ts
// src/components/sections/Hero.tsx
'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
```

### Sub-component Extraction
Split large components into private named sub-components within the same file to stay under the 40-line function limit:
```ts
// src/components/layout/Navbar.tsx
function DesktopNavLinks({ onNavClick }: Readonly<NavLinksProps>) { ... }
function MobileNavLinks({ onNavClick, id, menuRef }: Readonly<MobileNavLinksProps>) { ... }
export default function Navbar() { ... }
```

### Props Interfaces with `Readonly`
Define a named interface for every component's props; wrap with `Readonly<>` on sub-components:
```ts
interface HeroCtaButtonsProps {
    locale: string;
    ctaWork: string;
    isDownloading: boolean;
}
function HeroCtaButtons({ locale, ctaWork }: Readonly<HeroCtaButtonsProps>) { ... }
```

### Data Module Pattern
Each data file in `src/data/` exports an interface and a typed array together:
```ts
// src/data/experience.ts
export interface ExperienceItem { id: string; company: string; ... }
export const experiences: ExperienceItem[] = [ ... ];
```

### i18n: Always Use Translation Hooks
- **Client components:** `useTranslations('namespace')` from `next-intl`
- **Server components/layouts:** `getTranslations({ locale, namespace })` from `next-intl/server`
- Never hardcode user-facing strings — all text lives in `src/i18n/messages/en.json` and `src/i18n/messages/id.json`

### Routing
Always import `Link`, `redirect`, `usePathname`, `useRouter` from `src/i18n/routing.ts`, **not** from `next/navigation`:
```ts
// src/i18n/routing.ts — re-exports typed navigation
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

### Path Alias
Always use `@/` — never use relative `../` that climbs more than one directory:
```ts
import messages from '@/i18n/messages/en.json';
import { experiences } from '@/data/experience';
```

### `useCallback` for Stable Event Handlers
Use `useCallback` on handlers passed as props to avoid unnecessary re-renders:
```ts
// src/components/layout/Navbar.tsx
const scrollTo = useCallback((id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}, []);
```

### CV Components
Components under `src/components/cv/` use `@react-pdf/renderer` primitives (`View`, `Text`, `StyleSheet`), **not** HTML or Tailwind. Styles live in `src/components/cv/cv-styles.ts` using `StyleSheet.create()`.

### Dark Mode
Use `next-themes` with `attribute='class'`. Apply `dark:` Tailwind variants directly — never use CSS variables for theming:
```tsx
className='bg-white dark:bg-gray-950 text-gray-900 dark:text-white'
```

### Accessibility
All interactive elements have `aria-label` or visible text. Icons use `aria-hidden='true'`. Focus traps implemented for modal/menu overlays (see `src/components/layout/Navbar.tsx`).

### NOSONAR Comments
Used sparingly to suppress SonarQube false positives with an explanation:
```ts
// NOSONAR: Next.js requires static string literals in config; String.raw cannot be used here
```

---

## Error Handling

- **Never use empty catch blocks** — always handle or log.
- **Log with context:** Prefix with `[Location]` to identify the source:
  ```ts
  // src/components/sections/Hero.tsx
  console.error('[CV Download] failed:', err);
  ```
- **Inline ESLint suppression** when `console.error` is intentional:
  ```ts
  // eslint-disable-next-line no-console
  console.error('[CV Download] failed:', err);
  ```
- **Guard with early return** before async work:
  ```ts
  const handleDownload = async () => {
      if (isDownloading) return;
      setIsDownloading(true);
      try { ... } catch (err) { ... } finally { setIsDownloading(false); }
  };
  ```
- **HTTP errors:** Check `res.ok` and throw a descriptive error before consuming the response body:
  ```ts
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  ```
- **Never expose** stack traces or internal errors to end users.

---

## TypeScript

- **Strict mode** enforced via `tsconfig.json` — no implicit `any`, no implicit returns.
- **Interfaces over types** for object shapes (component props, data models).
- **Exported interfaces** always co-located with their data/component file.
- **Optional fields** with `?` — always guard before use:
  ```ts
  // src/data/experience.ts
  tech?: string[];
  // usage guard:
  if (item.tech) { ... }
  ```
- **`as const`** for readonly string/tuple literals used as discriminated unions or iteration keys.
- **`ReturnType<typeof ...>`** for inferred mock types in tests:
  ```ts
  let fetchMock: ReturnType<typeof vi.fn>;
  ```
- **`React.ImgHTMLAttributes<HTMLImageElement>`** for typed HTML attribute spreads in mocks.
- **No `any`** — prefer `unknown` or specific union types.
- **Path alias `@/*`** resolves to `./src/*` (configured in `tsconfig.json` `paths`).

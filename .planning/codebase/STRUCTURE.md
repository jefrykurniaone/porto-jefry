# Directory Structure
_Last mapped: 2026-06-02_

## Layout

```
porto-jefry/
├── public/                        # Static assets served at root URL
│   ├── cv-photo.webp              # Profile photo (used by Hero section + CV PDF)
│   └── robots.txt                 # Search engine directives
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── [locale]/              # Locale-wrapped routes (en | id)
│   │   │   ├── layout.tsx         # Server component: ThemeProvider, NextIntlClientProvider, Navbar, Footer
│   │   │   └── page.tsx           # Home page: composes all 8 section components
│   │   ├── api/
│   │   │   └── generate-cv/
│   │   │       └── route.ts       # GET /api/generate-cv?locale=en|id — PDF generation endpoint
│   │   ├── favicon.ico
│   │   ├── globals.css            # Tailwind base/reset styles
│   │   └── sitemap.ts             # MetadataRoute.Sitemap — /en and /id with hreflang alternates
│   │
│   ├── components/
│   │   ├── sections/              # One component per portfolio section (all 'use client')
│   │   │   ├── Hero.tsx           # Full-screen intro with photo, CTA buttons, CV download trigger
│   │   │   ├── Hero.test.tsx
│   │   │   ├── About.tsx
│   │   │   ├── About.test.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Experience.test.tsx
│   │   │   ├── Education.tsx
│   │   │   ├── Education.test.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Skills.test.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Projects.test.tsx
│   │   │   ├── Certifications.tsx
│   │   │   ├── Certifications.test.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── Contact.test.tsx
│   │   │
│   │   ├── layout/                # Persistent chrome components (all 'use client')
│   │   │   ├── Navbar.tsx         # Fixed top nav with scroll detection, mobile menu, focus trap
│   │   │   ├── Navbar.test.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Footer.test.tsx
│   │   │   ├── BackToTop.tsx
│   │   │   ├── BackToTop.test.tsx
│   │   │   ├── ThemeToggle.tsx    # Dark/light mode button (next-themes)
│   │   │   ├── ThemeToggle.test.tsx
│   │   │   ├── LanguageToggle.tsx # EN/ID locale switcher
│   │   │   └── LanguageToggle.test.tsx
│   │   │
│   │   ├── cv/                    # PDF-only components — @react-pdf/renderer, no HTML/Tailwind
│   │   │   ├── CvDocument.tsx     # Root PDF Document component (composes all CV sections)
│   │   │   ├── CvHeader.tsx       # Name, title, contact info, photo
│   │   │   ├── CvExperience.tsx
│   │   │   ├── CvEducation.tsx
│   │   │   ├── CvSkills.tsx
│   │   │   ├── CvProjects.tsx
│   │   │   ├── CvCertifications.tsx
│   │   │   ├── cv-styles.ts       # StyleSheet.create() — all PDF styles live here
│   │   │   └── cv-types.ts        # Messages interface + CvDocumentProps
│   │   │
│   │   └── icons/                 # Custom SVG icon components
│   │       ├── GitHubIcon.tsx
│   │       ├── LinkedInIcon.tsx
│   │       └── Icons.test.tsx
│   │
│   ├── data/                      # Static typed portfolio content (no async, no API)
│   │   ├── experience.ts          # ExperienceItem[] — companies, roles, periods, tech stacks
│   │   ├── experience.test.ts
│   │   ├── projects.ts            # ProjectItem[] — title, tech, links
│   │   ├── projects.test.ts
│   │   ├── skills.ts              # SkillItem[] — categories and skill names
│   │   ├── skills.test.ts
│   │   ├── education.ts           # EducationItem[]
│   │   ├── education.test.ts
│   │   ├── certifications.ts      # CertificationItem[]
│   │   ├── certifications.test.ts
│   │   ├── contact.ts             # ContactItem[] — links (GitHub, LinkedIn, email)
│   │   └── contact.test.ts
│   │
│   ├── i18n/
│   │   ├── messages/
│   │   │   ├── en.json            # All English user-facing strings, keyed by namespace
│   │   │   └── id.json            # All Indonesian user-facing strings, keyed by namespace
│   │   ├── routing.ts             # locales: ['en','id'], defaultLocale: 'en'; exports typed Link/redirect/useRouter/usePathname
│   │   └── request.ts             # next-intl server config; dynamically imports messages/{locale}.json
│   │
│   ├── middleware.ts              # next-intl routing + per-request nonce + CSP injection
│   │
│   ├── types/
│   │   └── global.d.ts            # Module declarations (e.g., declare module '*.css')
│   │
│   ├── test/
│   │   ├── setup.ts               # Vitest global setup — imports @testing-library/jest-dom
│   │   └── vitest-env.d.ts        # Vitest type declarations
│   │
│   └── utils/
│       ├── constants.ts           # BASE_URL, LAST_MODIFIED_DATE
│       ├── constants.test.ts
│       ├── translate-period.ts    # translatePeriod(period, locale) — EN→ID month abbreviations
│       └── translate-period.test.ts
│
├── .github/                       # CI config, skills, agents
├── .planning/                     # GSD planning documents
│   └── codebase/                  # Codebase map documents (this file lives here)
├── .eslintrc.json                 # ESLint config (extends next/core-web-vitals)
├── next.config.mjs                # Next.js config — withNextIntl wrapper + security headers
├── next-env.d.ts                  # Auto-generated Next.js types (do not edit)
├── postcss.config.mjs             # PostCSS — Tailwind + autoprefixer
├── tailwind.config.ts             # Tailwind config
├── tsconfig.json                  # TypeScript strict mode; @/* alias → src/*
├── vercel.json                    # Vercel deployment config
└── vitest.config.ts               # Vitest — jsdom, v8 coverage, thresholds 80/80/65/80
```

## Key Locations

**Entry Points:**
- `src/app/[locale]/layout.tsx` — locale shell, providers, persistent chrome
- `src/app/[locale]/page.tsx` — single home page, section composition
- `src/middleware.ts` — first code that runs on every request

**All User-Facing Text:**
- `src/i18n/messages/en.json` — English strings
- `src/i18n/messages/id.json` — Indonesian strings
- Never add text directly to components

**Portfolio Data (structural, non-translatable):**
- `src/data/experience.ts` — work history
- `src/data/projects.ts` — portfolio projects
- `src/data/skills.ts` — skill categories
- `src/data/education.ts` — education history
- `src/data/certifications.ts` — certifications
- `src/data/contact.ts` — social/contact links

**Locale & Navigation Config:**
- `src/i18n/routing.ts` — single source of truth for supported locales; exports typed navigation primitives

**CV / PDF System:**
- `src/app/api/generate-cv/route.ts` — PDF API route (rate limit, cache, sharp conversion)
- `src/components/cv/CvDocument.tsx` — root PDF component
- `src/components/cv/cv-styles.ts` — all PDF styles
- `src/components/cv/cv-types.ts` — shared types for CV components

**Shared Constants:**
- `src/utils/constants.ts` — `BASE_URL`, `LAST_MODIFIED_DATE`

**Test Setup:**
- `src/test/setup.ts` — global Vitest setup
- `vitest.config.ts` — coverage config, thresholds, excluded paths

**Security / CSP:**
- `src/middleware.ts` — nonce generation and CSP header
- `next.config.mjs` — static security headers (X-Frame-Options, Referrer-Policy, etc.)

**Static Assets:**
- `public/cv-photo.webp` — profile photo used by Hero section and CV PDF endpoint
- `public/robots.txt` — search engine rules

## Naming Conventions

**Component files:** PascalCase `.tsx`
```
Hero.tsx         → section component
Navbar.tsx       → layout component
CvDocument.tsx   → PDF component
GitHubIcon.tsx   → icon component
```

**Test files:** Co-located, same name + `.test.tsx` / `.test.ts`
```
Hero.tsx         → Hero.test.tsx
experience.ts    → experience.test.ts
Icons.test.tsx   → shared test for multiple icon components
```

**Data files:** camelCase `.ts` (singular noun matching the domain)
```
experience.ts
projects.ts
skills.ts
```

**Utility files:** kebab-case `.ts`
```
translate-period.ts
constants.ts
```

**Style files (CV):** kebab-case `.ts`
```
cv-styles.ts
cv-types.ts
```

**Directories:** lowercase, plural for collections
```
sections/        ← section components
components/      ← all UI components
messages/        ← i18n JSON files
```

**Variables & functions:** camelCase
**Constants:** SCREAMING_SNAKE_CASE (`BASE_URL`, `LAST_MODIFIED_DATE`, `RATE_LIMIT_WINDOW_MS`)
**Booleans:** prefixed with `is`, `has`, `should` (`isDownloading`, `isScrolled`, `isOpen`)
**Types/Interfaces:** PascalCase (`ExperienceItem`, `CvDocumentProps`, `Messages`)

## Where to Add New Code

**New portfolio section:**
1. Create `src/components/sections/NewSection.tsx` (PascalCase, `'use client'`)
2. Create co-located `src/components/sections/NewSection.test.tsx`
3. Add structural data to a new or existing `src/data/newSection.ts`
4. Add all strings to `src/i18n/messages/en.json` and `src/i18n/messages/id.json` under a new namespace
5. Import and add `<NewSection />` to `src/app/[locale]/page.tsx`

**New data type:**
- Add to `src/data/<domain>.ts` — export interface + typed `const` array
- Create `src/data/<domain>.test.ts`

**New utility function:**
- Add to `src/utils/<kebab-case>.ts`
- Create `src/utils/<kebab-case>.test.ts`

**New CV section:**
- Add component to `src/components/cv/Cv<Section>.tsx` using only `@react-pdf/renderer` primitives
- Add styles to `src/components/cv/cv-styles.ts`
- Import and compose in `src/components/cv/CvDocument.tsx`
- Add message types to `src/components/cv/cv-types.ts`

**New string (any language):**
- Add to both `src/i18n/messages/en.json` and `src/i18n/messages/id.json` under the appropriate namespace
- Consume via `useTranslations('namespace')` in client components or `getTranslations({ locale, namespace })` in server components

**New shared constant:**
- Add to `src/utils/constants.ts` as `SCREAMING_SNAKE_CASE`

---

*Structure analysis: 2026-06-02*

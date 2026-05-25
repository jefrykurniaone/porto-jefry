# Codebase Structure

**Analysis Date:** 2026-05-25

## Root Layout

```
porto-jefry/
├── src/                    # All application source code
├── public/                 # Static assets served at root
├── _tmp_backup/            # Temporary backup (not committed to production)
├── next.config.mjs         # Next.js config (next-intl plugin, CSP headers)
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript config (strict, @/* alias → src/*)
├── postcss.config.mjs      # PostCSS config (used by Tailwind)
├── package.json            # Dependencies and scripts
├── vercel.json             # Vercel deployment configuration
├── next-env.d.ts           # Auto-generated Next.js type declarations
└── README.md               # Project documentation
```

## Source Tree

```
src/
├── middleware.ts                      # next-intl locale middleware (entry for all page requests)
│
├── app/                               # Next.js App Router
│   ├── layout.tsx                     # Root layout — minimal html/body passthrough
│   ├── globals.css                    # Global CSS (Tailwind base + custom overrides)
│   ├── sitemap.ts                     # Generates /sitemap.xml for both locales
│   ├── [locale]/                      # Locale-scoped route segment
│   │   ├── layout.tsx                 # Full app shell: providers, Navbar, Footer, metadata
│   │   └── page.tsx                   # Home page — assembles all section components
│   └── api/
│       └── generate-cv/
│           └── route.ts               # POST/GET handler — renders CV PDF via react-pdf
│
├── components/
│   ├── cv/                            # PDF CV components (react-pdf)
│   │   ├── CvDocument.tsx             # Root PDF document — composes all CV sections
│   │   ├── CvHeader.tsx               # CV header: name, photo, contact info
│   │   ├── CvExperience.tsx           # CV work experience section
│   │   ├── CvEducation.tsx            # CV education section
│   │   ├── CvSkills.tsx               # CV skills section
│   │   ├── CvProjects.tsx             # CV projects section
│   │   ├── CvCertifications.tsx       # CV certifications section
│   │   ├── cv-types.ts                # Shared types: Messages, CvDocumentProps
│   │   └── cv-styles.ts               # react-pdf StyleSheet definitions
│   ├── icons/
│   │   └── LinkedInIcon.tsx           # LinkedIn SVG icon component
│   ├── layout/                        # Persistent UI chrome
│   │   ├── Navbar.tsx                 # Sticky navigation with anchor links + toggles
│   │   ├── Footer.tsx                 # Footer component
│   │   ├── ThemeToggle.tsx            # Dark/light theme toggle (next-themes)
│   │   └── LanguageToggle.tsx         # EN/ID locale switcher (next-intl router)
│   └── sections/                      # Portfolio page sections (all 'use client')
│       ├── Hero.tsx                   # Hero section with CV download button
│       ├── About.tsx                  # About / summary section
│       ├── Experience.tsx             # Work experience timeline
│       ├── Education.tsx              # Education history
│       ├── Skills.tsx                 # Technical skills list
│       ├── Projects.tsx               # Projects showcase
│       ├── Certifications.tsx         # Certifications list
│       └── Contact.tsx                # Contact information section
│
├── data/                              # Static typed content modules
│   ├── experience.ts                  # ExperienceItem[] array
│   ├── education.ts                   # Education data
│   ├── projects.ts                    # Project data
│   ├── skills.ts                      # Skills data
│   ├── certifications.ts              # Certifications data
│   └── contact.ts                     # Contact links/info
│
├── i18n/                              # Internationalization configuration
│   ├── routing.ts                     # Locale routing definition + navigation exports
│   ├── request.ts                     # next-intl server request config (message loading)
│   └── messages/
│       ├── en.json                    # English strings (all namespaces)
│       └── id.json                    # Indonesian strings (all namespaces)
│
└── utils/
    └── translate-period.ts            # Maps English month abbreviations → Indonesian

public/
├── robots.txt                         # Search engine crawl rules
└── cv-photo.webp                      # Profile photo used in CV PDF generation
```

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/app/` | Next.js App Router — pages, layouts, API routes |
| `src/app/[locale]/` | Locale-scoped page tree; pre-generated for `en` and `id` |
| `src/app/api/generate-cv/` | Server-side PDF generation endpoint |
| `src/components/sections/` | Portfolio page sections; all Client Components |
| `src/components/layout/` | Persistent navigation and footer chrome |
| `src/components/cv/` | react-pdf components for downloadable CV |
| `src/data/` | Static TypeScript content modules (no runtime fetching) |
| `src/i18n/` | next-intl routing, server config, and translation messages |
| `src/utils/` | Pure utility functions |
| `public/` | Publicly served static assets |

## File Naming Patterns

**React components:** PascalCase `.tsx` — `CvDocument.tsx`, `Hero.tsx`, `Navbar.tsx`

**Non-component TypeScript:** kebab-case `.ts` — `cv-styles.ts`, `cv-types.ts`, `translate-period.ts`

**Data modules:** kebab-case `.ts` — `experience.ts`, `contact.ts`

**Next.js conventions:** lowercase reserved names — `layout.tsx`, `page.tsx`, `route.ts`, `middleware.ts`, `sitemap.ts`, `globals.css`

**i18n messages:** lowercase locale code `.json` — `en.json`, `id.json`

**Config files:** framework conventions — `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json`

## Module Boundaries

**`src/app/` → `src/components/`:**
Layouts and pages import components; components never import from `src/app/`.

**`src/components/sections/` → `src/data/`:**
Section components import static data directly. Data modules have no dependencies on components.

**`src/components/sections/` → `src/utils/`:**
Sections use utility functions (e.g., `translatePeriod`) for display formatting.

**`src/components/cv/` → `src/i18n/messages/`:**
CV components receive typed `Messages` prop; the API route imports JSON messages directly and passes them down.

**`src/app/api/` → `src/components/cv/` + `src/data/` + `src/i18n/`:**
The API route is the sole consumer of `CvDocument` and directly imports translation messages.

**`src/i18n/routing.ts` → everywhere:**
The navigation exports (`Link`, `redirect`, `usePathname`, `useRouter`) from `src/i18n/routing.ts` are used by layout and layout components instead of raw next-intl or next/navigation imports.

**`src/middleware.ts` → `src/i18n/routing.ts`:**
Middleware wraps the routing definition; it has no other dependencies.

## Where to Add New Code

**New portfolio section:**
- Component: `src/components/sections/NewSection.tsx`
- Import and render in `src/app/[locale]/page.tsx`
- Add nav key to `NAV_KEYS` in `src/components/layout/Navbar.tsx`
- Add translation strings under a new namespace in `src/i18n/messages/en.json` and `src/i18n/messages/id.json`

**New static data type:**
- Create `src/data/new-data.ts` with exported typed array/object

**New utility function:**
- Add to `src/utils/` as a kebab-case `.ts` file

**New CV section:**
- Create `src/components/cv/CvNewSection.tsx`
- Extend `Messages` interface in `src/components/cv/cv-types.ts`
- Import and compose in `src/components/cv/CvDocument.tsx`

**New locale:**
- Add locale string to `locales` array in `src/i18n/routing.ts`
- Add `src/i18n/messages/{locale}.json`
- `generateStaticParams` in `src/app/[locale]/layout.tsx` automatically picks up new locales

**New API route:**
- Create `src/app/api/{route-name}/route.ts` following Next.js Route Handler conventions

---

*Structure analysis: 2026-05-25*

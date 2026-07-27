# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server at localhost:3000
npm run build        # Production build (runs prebuild first — see below)
npm run lint         # ESLint
npx tsc --noEmit     # Type-check
```

CI (`.github/workflows/ci.yml`, Node 20) runs lint → typecheck → build on PRs to `main`. **There is no test suite** — the test runner and tests were removed in #43, so "run the tests" means running those three checks. `/coverage` is still gitignored; that is vestigial.

Next 16 removed the `next lint` command, so `npm run lint` calls `eslint src` directly against `eslint.config.mjs` (flat config). `src` is the deliberate scope — it matches what `next lint` used to cover, and keeps `scripts/` and the root config files out of linting.

`npm run prebuild` executes `scripts/gen-build-meta.mjs`, which **rewrites `src/utils/constants.ts`** — it reads the last git commit date and regenerates the file with only `BASE_URL` (preserved verbatim) plus a generated `LAST_MODIFIED_DATE`. Never hand-edit `LAST_MODIFIED_DATE`, and never add other exports to that file — the codegen will delete them.

## Architecture

**Porto-Jefry** is a bilingual (EN/ID) personal portfolio site: Next.js 16 App Router (Turbopack), React 19, TypeScript, next-intl, deployed on Vercel.

### Request flow

```
Request → src/proxy.ts (i18n redirect + CSP nonce + CSP header)
  ↓
src/app/[locale]/layout.tsx (fonts + theme-init script + NextIntlClientProvider + chrome)
  ↓
src/app/[locale]/page.tsx (composes section components in fixed order)
  ↓
src/components/sections/*.tsx (join src/data/*.ts + src/i18n/messages/*.json)
```

`src/app/layout.tsx` is a bare passthrough root layout — it returns `children` and nothing else. All real layout work happens in `[locale]/layout.tsx`, which owns `<html>` and `<body>` because both need the resolved locale. **The root layout must not also render `<html>`/`<body>`**: that nests `<html>` inside `<body>`, which React 19 reports as a hydration error (React 18 tolerated it silently). Next supplies its own document shell for the built-in `/_not-found`, so the passthrough does not break it. `[locale]/[...rest]/page.tsx` is a catch-all that calls `notFound()`.

### Content model — the data/messages split

This is the most important thing to understand before editing content.

Portfolio content is deliberately split across two places, joined by a stable `id`:

- **`src/data/*.ts`** holds locale-invariant *structure*: ids, company names, roles, institutions, periods, tech-stack arrays, contact URLs. Never translated.
- **`src/i18n/messages/{en,id}.json`** holds translatable *prose*, keyed by the same id: `experience.items.<id>.bullets`, `projects.items.<id>.description`, `education.items.<id>.degree`, `skills.categories.<category>`.

Sections read the data array, then look up prose with `t.raw('items')[item.id]`. Missing keys fall back gracefully (`?? []`, `?? fallbackDegree(edu)`), so a mismatched id fails silently rather than crashing — check both sides when content goes missing.

Data files: `experience.ts`, `projects.ts`, `education.ts`, `skills.ts`, `contact.ts`. Note that **certifications have no data file** — they live entirely in `messages.certifications`, and the site renders them inside the Education section (`education.combined_title`, `kind_cert`), not as a standalone section.

**Adding a portfolio item** means three coordinated edits: append to the `src/data/*.ts` array, then add the matching id block to *both* `en.json` and `id.json`.

Periods are authored in English in the data files (`'Jul 2025 – Present'`). Components localize them at render time by replacing `'Present'` with `t('present')` and then passing the result through `translatePeriod()` (`src/utils/translate-period.ts`), which maps the four month abbreviations that differ in Indonesian.

### PDF CV (`/api/generate-cv`)

A second renderer over the same content. `src/components/cv/` mirrors the section components using `@react-pdf/renderer` primitives, and it performs the **same data + messages join** — e.g. `CvProjects` imports `projects` from `src/data/projects` and pulls descriptions from the passed-in messages object. Content changes must be reflected in both the web section and its CV counterpart, or the PDF silently drifts from the site.

- GET, query param `locale` (`en` | `id`, whitelist-validated, defaults to `en`).
- `src/components/cv/cv-types.ts` declares a hand-written `Messages` interface — the subset of the message JSON the CV needs. Renaming a message key breaks this at typecheck.
- Profile photo: `public/cv-photo.webp` → JPEG via sharp (react-pdf only accepts JPEG/PNG), cached at module level.
- Rendered PDF cached per locale at module level; rate limit 5 req/IP/60s via an in-memory Map (both reset on cold start — accepted risk, documented inline in the route).
- `vercel.json` caps the function at `maxDuration: 10`.

### Styling

Hand-written CSS with a design-token system — **no component library and no utility framework in practice**. `tailwindcss` + `@tailwindcss/postcss` are installed and wired in `postcss.config.mjs`/`tailwind.config.ts`, but nothing in `src/` imports Tailwind or uses its classes. Don't start using Tailwind utilities without a deliberate decision.

- Tokens in `src/app/globals.css` (`--bg`, `--panel`, `--accent`, `--navbar-height`, …). Dark is the default; light overrides under `:root[data-theme="light"]`.
- `globals.css` `@import`s `src/app/styles/layout.css` (nav, drawer, footer, error/404 states) and `src/app/styles/sections.css` (per-section styles, banner-comment delimited).
- Class naming is BEM-ish: `.skill-card__label`, `.section-band--alt`, plus shared primitives `.container-page`, `.panel-card`, `.chip`, `.section-title`, `.section-kicker`.
- Fonts: Space Grotesk / JetBrains Mono via `next/font`, exposed as `--font-sans` / `--font-mono`.

### Theming and the CSP hash (footgun)

Theme state lives in `data-theme` on `<html>` plus `localStorage['porto-theme']`, managed by the `useTheme` hook (`src/hooks/use-theme.ts`). There is no ThemeProvider component. The hook reads localStorage through `useSyncExternalStore` rather than a mount effect — `react-hooks/set-state-in-effect` (enabled by `next/core-web-vitals` in Next 16) rejects the `useEffect` + `setState` mount pattern. `ThemeToggle` and `useTypedRoles` use the same approach for their mounted / `prefers-reduced-motion` checks.

To avoid a flash before hydration, `[locale]/layout.tsx` inlines `THEME_INIT_SCRIPT` via the `ThemeInitScript` sub-component. `headers().get('x-nonce')` resolves to null in the layout, so the tag ships without a nonce and the **sha256 hash** is what authorizes it. `buildCsp()` puts that hash in *both* the dev and production policies — a single `THEME_SCRIPT_HASH` constant. **Any edit to `THEME_INIT_SCRIPT` — even whitespace — requires recomputing it, or the theme script is silently CSP-blocked.** Both files carry comments saying so.

Two things that look like cleanups but are not:

- **Do not swap the raw `<script>` for `next/script`.** `strategy="beforeInteractive"` only injects into the initial HTML from the *root* layout; from `[locale]/layout.tsx` it degrades to a queued `self.__next_s.push(...)` script that Next runs after hydration starts, which is too late and brings the flash back.
- React 19 logs `Encountered a script tag while rendering React component` whenever it renders that tag on the client, which a locale switch does. It is dev-only and expected. The `useEffect` in `useTheme` reapplies `data-theme` from the store, so navigation stays correct without the script re-running.

### Security

- `buildCsp()` in `src/proxy.ts` returns separate dev (allows `unsafe-eval`, ws:) and production (strict, `strict-dynamic`) policies. The proxy attaches CSP on both the redirect and non-redirect paths, and forwards next-intl's `x-middleware-*` headers and cookies onto its own response.
- Static security headers (`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, …) come from `next.config.mjs`.
- The matcher excludes `api`, `_next`, `_vercel`, and any path containing a dot.
- Next 16 renamed the `middleware` file convention to `proxy`; `src/proxy.ts` is the same interception point under the new name (the build labels it `ƒ Proxy (Middleware)`).
- Because the proxy sets a per-request nonce and the layout reads it via `headers()`, `/[locale]` renders dynamically (`ƒ`) rather than being prerendered. It was reported as SSG under Next 14; Next 16's dynamic-API detection is stricter.

### Dependency overrides (footgun)

`package.json` `overrides` exists to hold `npm audit` at zero. Beyond the `@emnapi/*` pins:

- `postcss: "$postcss"` and `sharp: "$sharp"` hoist the copies nested under `next` (which pins older ones) up to the root versions.
- `brace-expansion: "5.0.8"` — the DoS advisory covers every version `<=5.0.7`, and there is no backport to the 1.x line that `minimatch@3` would normally use.
- `minimatch: "^10.2.5"` — forced by the line above. `brace-expansion@5` exports `{ expand }` instead of a callable default, so `minimatch@3` throws `expand is not a function` against it; v10 is the version that consumes v5 natively.

**The minimatch override is only safe because no enabled rule calls minimatch as a function.** `eslint-plugin-import`, `-react`, and `-jsx-a11y` still `require('minimatch')` in the callable v3 style, but only inside rules `next/core-web-vitals` does not turn on (`import/order`, `react/no-danger`, `jsx-a11y/label-has-associated-control`, …). Enabling one of those will crash lint with `minimatch is not a function`. Drop both overrides once `eslint-config-next` ships plugins that depend on `minimatch@10`.

ESLint is pinned to 9, not 10: `eslint-plugin-react@7.37.5` peer-caps at `^9.7` and calls `context.getFilename()`, which ESLint 10 removed.

## Coding standards

- **ESLint enforces `max-lines: 300` and `max-lines-per-function: 40` as errors.** This is why components are split into many small sub-components in the same file (`ExperienceRow`, `ProjectCard`, `EducationCard`). When a file grows, extract rather than inline. `sonarjs/no-nested-template-literals` is also an error.
- Formatting: 4-space indent, single quotes in TS and JSX attributes.
- Path alias `@/*` → `./src/*`.
- All user-facing strings go through `useTranslations()` / `getTranslations()` — never hardcoded, and always added to both `en.json` and `id.json`.
- Client components are explicit (`'use client'`); sections that need no interactivity stay server components.
- Component props are typed as `Readonly<Props>`.
- No empty catch blocks — either log with context or leave a comment explaining why the failure is safe to swallow (see `use-theme.ts`).
- Accessibility: semantic HTML, `alt` text, keyboard navigation, WCAG AA contrast (4.5:1). Focus-trap and scroll-lock hooks exist for the mobile drawer.

## Git

- Feature branches (`feat/`, `fix/`, `chore/`, `hotfix/`), Conventional Commits, no direct push to `main`. Work lands via squash-merged PRs.
- After a PR merges, delete both remotes: `git push origin --delete <branch>`, then `git branch -D <branch>` (squash-merge means `-d` usually refuses).
- `README.md` is unmodified create-next-app boilerplate — it is not a source of truth about this project.

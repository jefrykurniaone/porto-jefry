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

Data files: `experience.ts`, `projects.ts`, `education.ts`, `skills.ts`, `contact.ts`. Note that **certifications have no data file** — they live entirely in `messages.certifications`, and the site renders them inside the Education section (`education.combined_title`, `kind_cert`), not as a standalone section. `src/data/education.ts` is **formal education only**; the PDF pairs `CvEducation` (that array) with `CvCertifications` (the messages block). Putting a certification back into the education array prints it twice in the CV — under "Informal Education" and again under "Certifications" — which is exactly the bug that removed it.

**Adding a portfolio item** means three coordinated edits: append to the `src/data/*.ts` array, then add the matching id block to *both* `en.json` and `id.json`.

Periods are authored in English in the data files (`'Jul 2025 – Present'`). Components localize them at render time by replacing `'Present'` with `t('present')` and then passing the result through `translatePeriod()` (`src/utils/translate-period.ts`), which maps the four month abbreviations that differ in Indonesian.

### PDF CV (`/api/generate-cv`)

A second renderer over the same content. `src/components/cv/` mirrors the section components using `@react-pdf/renderer` primitives, and it performs the **same data + messages join** — e.g. `CvProjects` imports `projects` from `src/data/projects` and pulls descriptions from the passed-in messages object. Content changes must be reflected in both the web section and its CV counterpart, or the PDF silently drifts from the site.

- GET, query param `locale` (`en` | `id`, whitelist-validated, defaults to `en`).
- `src/components/cv/cv-types.ts` declares a hand-written `Messages` interface — the subset of the message JSON the CV needs. Renaming a message key breaks this at typecheck.
- Profile photo: `public/cv-photo.webp` → JPEG via sharp (react-pdf only accepts JPEG/PNG), cached at module level.
- Rendered PDF cached per locale at module level; rate limit 5 req/IP/60s via an in-memory Map (both reset on cold start — accepted risk, documented inline in the route).
- `vercel.json` caps the function at `maxDuration: 10`.

The endpoint has already broken once in a way that only showed up in production: Next.js 16.2's Turbopack production build traced the `sharp` native addon into the function bundle but not the sibling package carrying the `libvips` shared object that addon dynamically links against, so the module failed to load the first time the route was invoked. The general signature to watch for is a successful build followed by a runtime dynamic-link failure naming a versioned shared-object file, raised from Next's own external-module loader — that pairing means a native package's sibling shared library did not reach the deployed function bundle, not that the dependency is missing from the lockfile (the lockfile carried the correct platform packages the whole time here). It is invisible to local development, to the build, and to CI; only a real deployment surfaces it. Next.js fixed this in 16.3.0 ("Sharp@0.35 tracing fixed", vercel/next.js#94845); the 16.2 line ends at 16.2.12 with no backport, so recovery is an upgrade, not a config change.

### Styling

Hand-written CSS with a design-token system — **no component library and no utility framework in practice**. `tailwindcss` + `@tailwindcss/postcss` are installed and wired in `postcss.config.mjs`/`tailwind.config.ts`, but nothing in `src/` imports Tailwind or uses its classes. Don't start using Tailwind utilities without a deliberate decision.

- Tokens in `src/app/globals.css` (`--bg`, `--panel`, `--accent`, `--navbar-height`, …). Dark is the default; light overrides under `:root[data-theme="light"]`.
- `globals.css` `@import`s `src/app/styles/layout.css` (nav, drawer, footer, error/404 states) and `src/app/styles/sections.css` (per-section styles, banner-comment delimited).
- Class naming is BEM-ish: `.skill-card__label`, `.section-band--alt`, plus shared primitives `.container-page`, `.panel-card`, `.chip`, `.section-title`, `.section-kicker`.
- Fonts: Space Grotesk / JetBrains Mono via `next/font`, exposed as `--font-sans` / `--font-mono`.

**The CSS you write is not the CSS that ships.** Turbopack runs Lightning CSS over `globals.css` and its imports on every build — it reorders declarations, rewrites colours (`transparent` → `#0000`), drops redundant gradient keywords, and **resolves vendor prefixes against its own targets**. That last one has already cost a shipped feature: `.site-nav` declared `backdrop-filter` followed by `-webkit-backdrop-filter`, and Lightning CSS collapsed the pair to the last declaration and emitted the WebKit alias alone. Blink never implemented that alias, so the navbar blur was dead in every Chromium browser while Safari looked fine — invisible in review, because the source was correct. The rule now declares the prefixed form **first**, which survives every target set.

After touching any vendor-prefixed property, check the build output rather than the source:

```powershell
npx next build
Select-String -Path .next\static\chunks\*.css -Pattern 'backdrop-filter'
```

Both spellings must be present. `@tailwindcss/postcss` is not the culprit here — it passes the pair through unchanged; the rewrite happens in Turbopack's own pass, so removing Tailwind would not make this go away.

### Theming

**The theme is rendered server-side. There is no pre-paint inline script and no CSP hash** — if you find notes anywhere claiming otherwise, they are stale.

`[locale]/layout.tsx` reads the `porto-theme` cookie with `cookies()` and renders `data-theme` straight onto `<html>`, so the correct colours are in the first byte of HTML. Shared constants live in `src/utils/theme.ts`. There is no ThemeProvider component.

`useTheme` (`src/hooks/use-theme.ts`) keeps the cookie, `localStorage`, and the DOM attribute in step. It reads through `useSyncExternalStore` rather than a mount effect, because `react-hooks/set-state-in-effect` (enabled by `next/core-web-vitals` in Next 16) rejects `useEffect` + `setState`. `ThemeToggle` and `useTypedRoles` use the same approach for their mounted / `prefers-reduced-motion` checks.

Two traps in that hook:

- **Never persist the `theme` value returned by `useSyncExternalStore` from an effect.** During hydration it is still the *server* snapshot (always `DEFAULT_THEME`), so writing it clobbers a stored `'light'` with `'dark'` before the client snapshot is ever read. The migration effect reads the cookie and localStorage directly for exactly this reason.
- Read order in `readTheme()` is cookie → localStorage → DOM → default, and the middle step matters: a visitor from before the cookie existed has their preference only in localStorage, which the server cannot see, so `data-theme` says `'dark'` while they chose `'light'`. They get one flash on the first load after deploy, then the cookie is written and every later render is correct.

This replaced an inline `THEME_INIT_SCRIPT` authorized by a sha256 CSP hash. Do not reintroduce one: React 19 logs `Encountered a script tag while rendering React component` whenever it renders a script tag on the client, which a locale switch does (`LanguageToggle` uses `router.replace`). Moving it to the root layout does not help either — React refuses to render an inline script outside the main document.

### Security

- `buildCsp()` in `src/proxy.ts` returns separate dev (allows `unsafe-eval`, ws:) and production (strict, `strict-dynamic`) policies. The proxy attaches CSP on both the redirect and non-redirect paths, and forwards next-intl's `x-middleware-*` headers and cookies onto its own response.
- Static security headers (`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, …) come from `next.config.mjs`.
- The matcher excludes `api`, `_next`, `_vercel`, and any path containing a dot.
- Next 16 renamed the `middleware` file convention to `proxy`; `src/proxy.ts` is the same interception point under the new name (the build labels it `ƒ Proxy (Middleware)`).
- The app ships **no inline scripts of its own**, so `script-src` needs no `'sha256-…'`. Next's own tags carry the per-request nonce.
- `/[locale]` sets `export const dynamic = 'force-dynamic'` and this is load-bearing, not a leftover. The proxy mints a fresh nonce per request, and production CSP uses `'strict-dynamic'`, under which host sources like `'self'` are ignored — Next's scripts are authorized *only* by that nonce. Prerendering would freeze one nonce into the HTML and every subsequent request would reject it. Do not "optimize" this route back to static.

### Dependency overrides (footgun)

`package.json` `overrides` exists to collapse duplicate copies of a package that a dependency pins at a different version from the root. It is **not** what holds `npm audit` at zero — the audit reads zero on natural resolution, and the two overrides that were previously justified that way (`brace-expansion` and `minimatch`) had themselves become the source of the last two open advisories. An override is a standing liability: it freezes a version the ecosystem then moves past, and nothing re-checks it. When an advisory appears, take the least-binding remedy that clears it — first let a refreshed parent resolve a patched version on its own, then raise the project's own declared range, and only then add or raise an override.

Two entries remain, and each still does measurable work:

- `postcss: "$postcss"` — `next@16.3.4` depends on `postcss` at the exact version `8.5.23`, while the root `devDependencies` range `^8.5.15` resolves to `8.5.26`. Remove the override and the tree carries both copies; with it, `next` uses the root version.
- `@emnapi/core: "1.11.0"`, `@emnapi/runtime: "1.11.0"`, `@emnapi/wasi-threads: "1.2.2"` — the WebAssembly fallback runtime, reached through four different ranges by `@tailwindcss/oxide-wasm32-wasi`, `@unrs/resolver-binding-wasm32-wasi`, `@img/sharp-wasm32`, and `@napi-rs/wasm-runtime`. Without the pins the tree resolves three copies of `@emnapi/core`, four of `@emnapi/runtime`, and two of `@emnapi/wasi-threads`. No advisory is involved; the pins exist only to collapse that fan-out.

Three overrides have been removed, and the reasoning matters more than the removal:

- `sharp: "$sharp"` hoisted an older `sharp` nested under `next`. `next@16.3.4` now declares `sharp: ^0.35.4` as an optional dependency, which the root `^0.35.4` already satisfies, so the override no longer changed the tree. **The 0.35.0 floor still stands and is not negotiable** — every version below it inherits four high-severity `libvips` advisories, and downgrading to 0.34.4 is the workaround most widely circulated for the native-module tracing failure described under PDF CV above. It does work, at the cost of reopening those advisories. The floor is now carried by the root dependency range and by `next`'s own declaration instead of by an override.
- `brace-expansion: "5.0.8"` pinned a version inside the range of GHSA-rgw5-rvv9-x895 (`>=4.0.0 <5.0.9`), so the override was itself the advisory. Unpinned, `minimatch@10.2.6` — required by `eslint-plugin-sonarjs` and `@typescript-eslint/typescript-estree` — declares `brace-expansion: ^5.0.8` and picks up the patched `5.0.9` on its own.
- `minimatch: "^10.2.5"` existed only to keep `minimatch` on a major that consumes `brace-expansion@5`, because `brace-expansion@5` exports `{ expand }` rather than a callable default and `minimatch@3` throws `expand is not a function` against it. With the `brace-expansion` pin gone that constraint disappears: the `minimatch@3.1.5` copies now resolve `brace-expansion@1.1.18`, which no advisory covers.

That last removal also retires a standing hazard. `eslint-plugin-import@2.32.0`, `eslint-plugin-react@7.37.5`, and `eslint-plugin-jsx-a11y@6.10.2` `require('minimatch')` in the callable v3 style, inside rules `next/core-web-vitals` does not turn on (`import/order`, `react/no-danger`, `jsx-a11y/label-has-associated-control`, …). While the override was in force, enabling any one of those would have crashed lint with `minimatch is not a function`. All three now resolve `minimatch@3.1.5`, the version they are written against, so that failure mode is gone.

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

## Agent skills

### Issue tracker

Issues live in GitHub Issues on `jefrykurniaone/porto-jefry`, driven with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles, each label string equal to its role name. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` plus `docs/adr/` at the repo root, both created lazily. See `docs/agents/domain.md`.

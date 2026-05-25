# Phase 01 — Fix All Concerns + Base URL Update

**Goal:** Address all findings from `.planning/codebase/CONCERNS.md` and update the base URL.

**Scope (by user decision):**
- ✅ Base URL update → https://porto-jefry.vercel.app/
- ✅ CSP: nonce-based (remove `unsafe-inline` from `script-src`)
- ✅ TypeScript: fix unsafe cast in Experience.tsx
- ✅ Certifications: make data-driven
- ✅ GitHub card in Contact section (https://github.com/jefrykurniaone/)
- ✅ About section: use `contact_*` i18n keys as aria-labels
- ✅ Project cards: add optional `description` and `url` fields
- ✅ Hero photo alt text: dedicated `hero.photo_alt` i18n key
- ✅ Scroll nav: update URL hash via `history.pushState`
- ✅ Icons: explicit `aria-hidden="true"` on decorative icons
- ✅ Mobile nav: focus trap
- ✅ API error: generic error message
- ✅ Remove redundant `@types/sharp`

**Out of scope (user decision):**
- ❌ Rate limiting upgrade (in-memory fine for portfolio)
- ❌ Next.js upgrade to v15
- ❌ ESLint v9 upgrade

## Tasks

| # | Task | File(s) | Status |
|---|------|---------|--------|
| 1 | BASE_URL update | `src/app/sitemap.ts`, `src/app/[locale]/layout.tsx` | planned |
| 2 | Nonce CSP middleware | `src/middleware.ts`, `next.config.mjs` | planned |
| 3 | TypeScript cast fix | `src/components/sections/Experience.tsx` | planned |
| 4 | Certifications data-driven | `src/data/certifications.ts`, `src/components/sections/Certifications.tsx` | planned |
| 5 | GitHub card | `src/data/contact.ts`, `src/components/sections/Contact.tsx`, i18n | planned |
| 6 | About aria-labels | `src/components/sections/About.tsx` | planned |
| 7 | ProjectItem description+url | `src/data/projects.ts`, `src/components/sections/Projects.tsx` | planned |
| 8 | Hero photo alt | `src/components/sections/Hero.tsx`, i18n messages | planned |
| 9 | Scroll nav hash | `src/components/layout/Navbar.tsx`, `src/components/sections/Hero.tsx` | planned |
| 10 | aria-hidden icons | `About.tsx`, `Contact.tsx` | planned |
| 11 | Mobile nav focus trap | `src/components/layout/Navbar.tsx` | planned |
| 12 | API generic error | `src/app/api/generate-cv/route.ts` | planned |
| 13 | Remove @types/sharp | `package.json` | planned |

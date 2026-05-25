# Phase 01 — UAT Results

**Phase:** 01-fix-concerns  
**Date:** 2025-07-28  
**Build:** ✅ PASS (`npm run build` clean, `tsc --noEmit` 0 errors)  
**Verdict: ALL PASS**

---

## Test Results

| # | Test | Expected | Result |
|---|------|----------|--------|
| T01 | BASE_URL in sitemap + metadata | `https://porto-jefry.vercel.app` in both files | ✅ PASS |
| T02 | CSP: nonce-based, no `unsafe-inline` in script-src | `script-src 'nonce-...' 'strict-dynamic'` | ✅ PASS |
| T03 | TypeScript compiles without errors | `tsc --noEmit` exits 0 | ✅ PASS |
| T04 | Certifications: data-driven | `src/data/certifications.ts` drives component | ✅ PASS |
| T05 | GitHub card in Contact | `GitHubIcon` rendered, URL = `https://github.com/jefrykurniaone/` | ✅ PASS |
| T06 | About section aria-labels | `aria-label={t('contact_email/phone/linkedin')}` on each link | ✅ PASS |
| T07 | ProjectItem optional description + url | Fields rendered conditionally; ExternalLinkIcon shown when url present | ✅ PASS |
| T08 | Hero photo alt = `photo_alt` i18n key | `alt={t('photo_alt')}` + keys in en.json / id.json | ✅ PASS |
| T09 | Scroll nav updates URL hash | `history.pushState(null, '', '#id')` in Navbar + Hero | ✅ PASS |
| T10 | Decorative icons have `aria-hidden="true"` | All icons in About/Contact/Certifications/Hero/Projects have it | ✅ PASS |
| T11 | Mobile nav focus trap + Escape key | `focusable[]` trap, `Escape` closes menu, returns focus to toggle | ✅ PASS |
| T12 | API returns generic error | Response body `'Internal Server Error'`, status 500 | ✅ PASS |
| T13 | `@types/sharp` removed | Not present in `package.json` devDependencies | ✅ PASS |

---

## Notes

- Extra fixes landed in a follow-up commit (`a702493`) due to 3 TypeScript errors found during build verification:
  1. `Github` not exported from `lucide-react` v1.14.0 → replaced with custom `GitHubIcon.tsx`
  2. `RefObject<HTMLDivElement | null>` incompatible with `LegacyRef<HTMLDivElement>` → narrowed to `RefObject<HTMLDivElement>`
  3. `node:crypto` not available in Edge Runtime → switched to `crypto.getRandomValues()`
- Production build: all 8 static pages generated, middleware 46.1 kB

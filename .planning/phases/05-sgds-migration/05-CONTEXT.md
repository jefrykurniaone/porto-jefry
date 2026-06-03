# Phase 5: SGDS Migration - Context

**Gathered:** 2026-06-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Migrate the entire portfolio UI from hand-crafted Tailwind CSS to SGDS (Singapore Government Design System) web components. This includes installing `@govtechsg/sgds-web-component`, upgrading Tailwind CSS v3 → v4, migrating dark mode from `next-themes` to SGDS theming, and replacing all applicable UI components with `<sgds-*>` custom elements.

**Why:** Showcase SGDS expertise to GovTech Singapore and Singapore government agency recruiters. The portfolio serves as a live demonstration of SGDS proficiency.

**Not in scope:** Changes to `src/data/*.ts` (content layer), `src/components/cv/` (PDF renderer uses only `@react-pdf/renderer` primitives), `src/i18n/` (next-intl remains unchanged), Security Hardening (deferred to Phase 6), Code Quality (deferred to Phase 7).

</domain>

<decisions>
## Implementation Decisions

### Scope
- **D-01:** Full migration — every component with a SGDS equivalent is replaced with `<sgds-*>` web components. No hybrid "partial" approach.
- **D-02:** Tailwind CSS upgrades from v3.4.1 → v4, which is required for `sgds:` utility prefix support.
- **D-03:** Install `@govtechsg/sgds-web-component` package.

### Dark Mode
- **D-04:** Remove `next-themes` entirely. Dark mode is controlled exclusively by toggling the `.sgds-night-theme` class on the `<html>` element.
- **D-05:** `ThemeProvider` (currently wraps `next-themes`) is eliminated. Replace with a minimal custom hook that persists theme preference in `localStorage` and applies/removes `.sgds-night-theme` on mount.
- **D-06:** `ThemeToggle` component is rewritten to call the custom hook. No dependency on `next-themes` API.

### Components Without SGDS Equivalents
- **D-07:** `Experience` timeline (vertical line + circular dots), `BackToTop` FAB, and Navbar mobile hamburger menu stay as custom React components.
- **D-08:** These custom components are styled using `sgds:` utility classes (Tailwind v4 with SGDS prefix), NOT bare Tailwind classes — keeping visual consistency with the SGDS design language.

### Testing
- **D-09:** All existing test files (`*.test.tsx`) are deleted and rewritten from scratch for the new SGDS-based components.
- **D-10:** 80% coverage threshold is maintained after rewrite.
- **D-11:** `src/test/setup.ts` is updated to register/mock `<sgds-*>` custom elements so Vitest (jsdom) doesn't throw `unknown element` errors.

### Phase Priority
- **D-12:** SGDS Migration is Phase 5, executed immediately. Existing Phase 3 (Security Hardening) and Phase 4 (Code Quality) are deferred to Phase 6 and Phase 7 respectively.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### SGDS Skills (read via Skill tool before implementation)
- `sgds-getting-started` skill — 4 mandatory setup steps; run before writing any component code
- `sgds-components` skill — 50+ component reference; check before deciding on custom vs. SGDS component
- `sgds-theming` skill — dark mode via `.sgds-night-theme`; token override patterns
- `sgds-utilities` skill — `sgds:` prefix Tailwind v4 utilities; use for custom components
- `sgds-layouts` skill — `.sgds-container` layout pattern; wraps page sections
- `sgds-getting-started` skill — CSS import order: `themes/day.css` → `sgds.css` → `utility.css`

### Critical Source Files
- `src/middleware.ts` — CSP nonce; may need script/style hash updates for SGDS inline assets
- `src/app/[locale]/layout.tsx` — Provider chain; remove `ThemeProvider`, add SGDS theme init
- `src/components/layout/ThemeToggle.tsx` — Full rewrite target
- `src/components/layout/ThemeToggle.client.tsx` — Full rewrite target
- `src/components/layout/Navbar.tsx` — Migrate to `<sgds-mainnav>` or custom + `sgds:` utilities
- `src/components/layout/Footer.tsx` — Migrate to `<sgds-footer>`
- `src/components/layout/BackToTop.tsx` — Keep logic; restyle with `sgds:` utilities
- `tailwind.config.ts` — Replace/upgrade for Tailwind v4

### SGDS CSS Import Order (MANDATORY — enforced by sgds-getting-started)
```
1. themes/day.css   (base theme tokens)
2. sgds.css         (component styles)
3. utility.css      (sgds: utilities)
```

### Prior Phase Context
- `.planning/phases/03-security-hardening/03-CONTEXT.md` — SEC-01 + SEC-02 decisions; deferred to Phase 6
- `.planning/phases/03-security-hardening/03-LEARNINGS.md` — CSP learnings from ad-hoc hotfixes; relevant for understanding current CSP setup before modifying middleware

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/i18n/request.ts`, `useTranslations()` hook — untouched; all bilingual strings continue through next-intl
- `src/data/*.ts` — all portfolio data (experience, education, skills, projects, certifications, contact) remains as-is
- `src/components/cv/` — entire CV directory excluded from migration; uses `@react-pdf/renderer` primitives only
- `src/app/[locale]/layout.tsx` `NextIntlClientProvider` — keep; only `ThemeProvider` is removed

### Established Patterns
- **Server Component + Client Component split**: Next.js 14 App Router pattern; SGDS web components must be used in `"use client"` files (they interact with DOM)
- **Dynamic import for browser-only code**: Existing pattern in `ThemeToggle.client.tsx` (avoids SSR errors); apply same pattern for SGDS web component imports
- **Locale-aware routing**: All routes under `/[locale]/`; navigation links must use `next-intl` Link or href with locale prefix
- **max 300 lines per file, 40 lines per function**: Enforced by linting; each section component should stay within limits post-migration
- **`type="button"` on all buttons**: Already enforced (Phase 1 fix); carry forward to all `<sgds-button>` usages

### Integration Points
- SGDS dark mode `.sgds-night-theme` class must be added to `<html>` element — this is in `src/app/[locale]/layout.tsx` or via a client-side script
- CSP in `src/middleware.ts` may need inline style hashes if SGDS components inject inline styles (check after install)
- `src/app/globals.css` is where SGDS CSS imports go (after existing Tailwind imports)

</code_context>

<specifics>
## Specific Ideas

- **Showcase intent**: The portfolio is the demo — visual output quality matters as much as correctness. Use SGDS design tokens and color palette as-is (no custom brand overrides) to show clean SGDS usage.
- **Custom component styling**: For Timeline and BackToTop, use `sgds:` utility classes verbatim as documented in `sgds-utilities` skill — this demonstrates understanding of SGDS utilities beyond just web components.
- **SGDS Masthead**: Standard government masthead (`<sgds-masthead>`) may not fit a personal portfolio context — evaluate during Navbar plan and omit if it creates a misleading "government site" impression.

</specifics>

<deferred>
## Deferred Ideas

- **Phase 3 (Security Hardening)**: SEC-01 (replace `x-real-ip`/`x-forwarded-for` with `req.ip`) and SEC-02 (remove Google Fonts from CSP) → Phase 6. SEC-03 (distributed rate limiting) remains explicitly deferred indefinitely.
- **Phase 4 (Code Quality & Type Safety)**: TYPE-01, TYPE-02, QUAL-01, QUAL-02, QUAL-03 → Phase 7.
- **SGDS data visualization (ECharts)**: Not in scope — portfolio has no charts.
- **SGDS masthead**: Evaluate during Phase 5 execution; may be omitted as inappropriate for personal portfolio context.
- **UK English writing standards (sgds-writing)**: EN content already follows plain English. Formal compliance with SGDS writing standards deferred — would require content audit.

</deferred>

---

*Phase: 5-SGDS-Migration*
*Context gathered: 2026-06-04*

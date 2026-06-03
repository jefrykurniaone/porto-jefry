# porto-jefry

## What This Is

A personal portfolio website for Jefry, built with Next.js 14 App Router, TypeScript (strict), and Tailwind CSS. Deployed on Vercel. Supports EN/ID localization via next-intl, dark/light mode via next-themes, and includes a CV PDF download feature powered by @react-pdf/renderer.

## Core Value

A fast, accessible, bilingual portfolio that accurately represents Jefry's work and makes it easy for recruiters and collaborators to download his CV and reach him.

## Requirements

### Validated

<!-- Shipped and confirmed valuable — inferred from existing codebase -->

- ✓ Hero section with full-screen intro, profile photo, and CTA buttons — existing
- ✓ About section with personal summary — existing
- ✓ Work Experience section with company, role, period, and bullets — existing
- ✓ Education section — existing
- ✓ Skills section with categorized skill list — existing
- ✓ Projects section with title, tech stack, and links — existing
- ✓ Certifications section — existing
- ✓ Contact section with social/email links — existing
- ✓ EN/ID bilingual localization via next-intl — existing
- ✓ Dark/light mode toggle via next-themes — existing
- ✓ CV PDF download (GET /api/generate-cv?locale=en|id) — existing
- ✓ Responsive mobile/desktop layout via Tailwind — existing
- ✓ SEO: sitemap, metadata, hreflang alternates — existing
- ✓ Security headers (CSP, X-Frame-Options, nonce-based scripts) — existing
- ✓ Vercel Analytics integration — existing
- ✓ Unit test coverage ≥80% (Vitest + Testing Library) — existing

### Active

<!-- Current scope — addressing known issues, hardening, and UX polish -->

- [ ] User-visible error feedback on CV download failure
- [ ] Custom branded 404 and error pages (locale-aware)
- [ ] Fix `type="button"` missing on LanguageToggle and ThemeToggle
- [ ] Fix Navbar scroll listener missing `passive: true`
- [ ] Fix ThemeToggle layout shift (CLS) during hydration
- [ ] Automate LAST_MODIFIED_DATE from git at build time
- [ ] Improve ExperienceMessages type safety (remove `as unknown as` cast)
- [ ] Security: validate IP headers properly (use platform-provided `req.ip`)
- [ ] Security: remove unused `fonts.googleapis.com` from CSP style-src
- [ ] Add ESLint SonarJS plugin for code quality enforcement
- [ ] Extract shared tech stacks in projects.ts as named constants
- [ ] Fix translatePeriod regex (add word-boundary anchors)
- [ ] Security: replace in-memory rate limiter with distributed store (Upstash Redis/Vercel KV)

### Out of Scope

<!-- Explicit boundaries — prevents scope creep -->

- User authentication / login — portfolio sites don't need accounts
- Database / backend persistence — all content is static by design
- Blog or CMS — content is code-managed for simplicity and version control
- Server-side personalization — static generation is the architecture
- Real-time features (chat, notifications) — unnecessary for a portfolio
- Mobile app — web-first, responsive design is sufficient
- OAuth / social login — no user accounts exist

## Context

- **Deployed at:** https://porto-jefry.vercel.app
- **Runtime:** Vercel Edge/Serverless, Node.js ≥20
- **Codebase map:** Completed 2026-06-02 — see `.planning/codebase/`
- **Known tech debt:** In-memory rate limiter is serverless-unsafe; ExperienceMessages uses double cast; cv-styles.ts approaching 300-line limit; LAST_MODIFIED_DATE is stale
- **Test infrastructure:** Vitest + Testing Library, 80% coverage thresholds enforced
- **Branching:** Feature branches + PRs (no direct push to main)
- **CI:** ESLint + TypeScript checks on every PR

## Constraints

- **Tech stack:** Next.js 14 App Router — no downgrade or migration
- **Localization:** All user-facing strings must be in both `en.json` and `id.json`
- **CV components:** Use only `@react-pdf/renderer` primitives — no HTML/Tailwind in `src/components/cv/`
- **File length:** Max 300 lines per file; max 40 lines per function
- **Testing:** New code must maintain 80% coverage thresholds
- **Routing:** Must import Link/redirect/useRouter from `@/i18n/routing`, not `next/navigation`
- **Deployment:** Vercel — no custom server required

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 14 App Router with generateStaticParams | SSG for /en and /id — no server needed at runtime | ✓ Good |
| next-intl for EN/ID i18n | Tight Next.js integration, typed translations, server+client hooks | ✓ Good |
| @react-pdf/renderer for CV | No external service dependency, runs in-process | ✓ Good |
| In-memory rate limiter | Simple for MVP; does not scale across serverless instances | ⚠️ Revisit |
| `useMessages()` + double cast for Experience bullets | Workaround for untyped AbstractIntlMessages | ⚠️ Revisit |
| Manual LAST_MODIFIED_DATE constant | Simple but requires manual updates | ⚠️ Revisit |

## Invariants

### Comprehensive test coverage provides execution confidence
Test coverage exceeding thresholds (80%+ lines/functions/statements, 65%+ branches) across all components provides immediate confidence that existing implementations are correct and protected against regression. Co-located tests with behavior-focused assertions enable rapid verification without re-implementation.

**Implication:** Before assuming code needs changes, verify test coverage first. High coverage with passing tests often indicates requirements are already met.

**Sources:** Phase 1  
**Promoted:** 2026-06-03

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-02 after initialization*

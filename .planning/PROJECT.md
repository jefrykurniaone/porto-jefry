# porto-jefry

## What This Is

A personal portfolio website for Jefry, built with Next.js 14 App Router, TypeScript (strict), and Tailwind CSS v4. Deployed on Vercel. The UI is built on the Singapore Design System (SGDS) web components with a minimalist monochrome look. Supports EN/ID localization via next-intl, dark/light mode via SGDS theming (`.sgds-night-theme` class, persisted in localStorage), and includes a CV PDF download feature powered by @react-pdf/renderer.

## Core Value

A fast, accessible, bilingual portfolio that accurately represents Jefry's work and makes it easy for recruiters and collaborators to download his CV and reach him.

## Current Milestone: v1.5 Responsive Navigation & Layout Fixes

**Goal:** Make navigation and layout work correctly across phone, tablet, and desktop — a hamburger drawer on phones, a horizontally-scrollable inline nav whenever items overflow (tablet/small windows/zoom), and a hero whose photo and content clear the fixed navbar instead of being clipped.

**Target features:**
- On phones (below the `md` breakpoint) the navbar collapses to brand + hamburger only; `expand="always"` no longer forces the desktop layout on mobile.
- The hamburger opens a right-side `sgds-drawer` listing all 7 sections with large tap targets, plus the theme + language toggles; tapping a link smooth-scrolls and closes the drawer.
- At `md` and above, when the inline nav's items don't all fit (tablet portrait, non-maximized laptop, longer ID labels, zoom) the nav row scrolls horizontally so every section stays reachable; it shows fully without scroll on a wide desktop.
- The hero profile photo and content are fully visible below the fixed header on phones and tablets (no top clipping).
- Responsive polish: no horizontal overflow from 320px through tablet widths, ≥44px tap targets, and an accessible drawer (focus trap, Esc to close, background scroll lock). Validated at 360/390/430 (phone), 768/1024 (tablet), 1280+ (desktop).

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
- ✓ Dark/light mode toggle via SGDS theming (`.sgds-night-theme`) — migrated from next-themes in Phase 5
- ✓ CV PDF download (GET /api/generate-cv?locale=en|id) — existing
- ✓ Responsive mobile/desktop layout via Tailwind — existing
- ✓ SEO: sitemap, metadata, hreflang alternates — existing
- ✓ Security headers (CSP, X-Frame-Options, nonce-based scripts) — existing
- ✓ Vercel Analytics integration — existing
- ✓ Unit test coverage ≥80% (Vitest + Testing Library) — existing
- ✓ Rate-limit identity from trusted `ipAddress(req)` only; spoofed `x-forwarded-for` has no effect (SEC-01) — Phase 3
- ✓ CSP tightened: unused Google Fonts domains removed; theme-init script hash recomputed and verified against the live script (SEC-02) — Phase 3
- ✓ In-memory rate limiter formally closed as accepted-risk (per-instance Map adequate at portfolio scale; CV PDF module-cached) (SEC-03) — Phase 3
- ✓ `LAST_MODIFIED_DATE` auto-generated from the last git commit date at build time via prebuild codegen (QUAL-01) — Phase 4
- ✓ `ExperienceMessages` exported interface; `useMessages()` double-cast removed in favor of `useTranslations` typed access (TYPE-01, TYPE-02) — Phase 4
- ✓ `eslint-plugin-sonarjs` active; `max-lines`, `max-lines-per-function`, and `no-nested-template-literals` enforced at error level (QUAL-02) — Phase 4
- ✓ Shared tech stacks in `projects.ts` extracted as named `TECH_*` constants, no duplicated arrays (QUAL-03) — Phase 4
- ✓ Four latent correctness defects fixed: button types, passive scroll listener, regex anchors, hash encoding (FIX-01..04) — Phase 1
- ✓ User-visible CV download error feedback + branded locale-aware 404/error pages + ThemeToggle CLS fix (UX-01..04) — Phase 2
- ✓ Full UI migrated to SGDS web components; Tailwind v3→v4; dark mode on SGDS theming; minimalist monochrome look (SGDS-01..05) — Phase 5
- ✓ Muted text meets WCAG AA contrast (≥4.5:1) in light + dark via a single `--sgds-color-muted` override (UI-05) — v1.4 Phase 6
- ✓ Hero CTAs equal-sized; "View My Work" never wraps; stack full-width below 512px (UI-06) — v1.4 Phase 6
- ✓ Theme = sun/moon sliding switch; language = segmented EN|ID pill; both compact and in the navbar (UI-07) — v1.4 Phase 6
- ✓ GitHub link moved from Contact to About; URL defined once in `data/contact.ts` (IA-01) — v1.4 Phase 7
- ✓ Core prose humanized (natural, non-buzzword voice) + remote/international + relocation availability signal; EN/ID parity (CONTENT-01) — v1.4 Phase 8
- ✓ 14 bilingual project descriptions via i18n; `Projects.tsx` reads them with a missing-key guard (CONTENT-02) — v1.4 Phase 8
- ✓ Education majors read idiomatic English ("Diploma in Informatics Management", "Bachelor's in Information Systems") (CONTENT-03) — v1.4 Phase 8

### Active

<!-- Current scope — v1.5 Responsive Navigation & Layout Fixes. See .planning/REQUIREMENTS.md for full REQ-IDs. -->

- [ ] Phone navbar collapses to brand + hamburger below `md` (NAV-01)
- [ ] Hamburger opens a right slide-in drawer with all 7 section links (NAV-02)
- [ ] Drawer links smooth-scroll, update the hash, and close the drawer (NAV-03)
- [ ] Theme + language toggles available inside the drawer (NAV-04)
- [ ] Inline nav (≥`md`) scrolls horizontally when items overflow so all 7 stay reachable (NAV-05)
- [ ] Drawer is accessible: focus trap, Esc + backdrop/close, scroll lock, ≥44px targets (A11Y-01..04)
- [ ] Hero photo + content fully visible below the fixed navbar on phones + tablets (LAYOUT-01)
- [ ] No horizontal page overflow from 320px through tablet widths ≤1024px (LAYOUT-02)

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
- **Known tech debt:** In-memory rate limiter is serverless-unsafe (accepted-risk, SEC-03); `cv-styles.ts` approaching 300-line limit. (Resolved in v1.3: ExperienceMessages double-cast removed; LAST_MODIFIED_DATE now build-time codegen.)
- **Owner follow-ups (v1.4):** verify the 14 drafted project descriptions (real client projects); optionally add real metrics to experience bullets
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
| Manual LAST_MODIFIED_DATE constant | Simple but requires manual updates | ✓ Resolved v1.3 (build-time codegen) |
| Humanize prose with free `blader/humanizer`, not the paid HumanizerAI API | Avoids API key, per-word credits, and sending content to a third-party detector-evasion service; a prompt-based voice guide is sufficient | ✓ Good (v1.4) |
| AI narrative = agentic coding workflow (Claude/Copilot/OpenCode), not building AI features (Semantic Kernel/OpenAI) | Reflects how the owner actually works; Docker dropped (never used) | ✓ Good (v1.4) |

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

## Current State

**Shipped:** v1.4 — Polish & International Content (2026-06-21, tag `v1.4`). WCAG-AA muted-text contrast, rebalanced hero CTAs, sliding theme switch + EN|ID language pill, GitHub link moved to About, and a full humanized-prose rewrite (natural voice, AI agentic coding workflow narrative, remote/relocation availability signal) with 14 bilingual project descriptions and idiomatic education terms. Git tags: v1.1, v1.2, v1.3, v1.4.
**In progress:** v1.5 — Responsive Navigation & Layout Fixes. **Both phases now complete and verified (pending ship/merge):** Phase 09 (responsive-navbar) collapsed the nav to a hamburger drawer on phones with all 7 sections + toggles and made the inline tablet/desktop nav horizontally scrollable on overflow (NAV-01–05, A11Y-01–04). Phase 10 (hero-overflow-fixes, completed 2026-06-21) cleared the hero from the fixed header on phones + tablets via a `--navbar-height` token + `.hero-section` top-clearance, and eliminated horizontal overflow 320→1024px (root-cause CTA fix + defensive `overflow-x: clip`) (LAYOUT-01, LAYOUT-02). Originally reported on prod mobile (Samsung Galaxy S8, 360×740): hero photo clipped under the fixed navbar, only 3 of 7 nav links visible, no hamburger.
**Deferred (v2 candidates):** CI Lighthouse/CWV checks, Playwright E2E, Dependabot, blog, testimonials, experience timeline, Core Web Vitals ≥90, progressive image loading.

---
*Last updated: 2026-06-21 — Phase 10 (hero-overflow-fixes) complete; v1.5 fully implemented, pending ship*

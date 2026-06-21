# porto-jefry

## What This Is

A personal portfolio website for Jefry, built with Next.js 14 App Router, TypeScript (strict), and Tailwind CSS v4. Deployed on Vercel. The UI is built on the Singapore Design System (SGDS) web components with a minimalist monochrome look. Supports EN/ID localization via next-intl, dark/light mode via SGDS theming (`.sgds-night-theme` class, persisted in localStorage), and includes a CV PDF download feature powered by @react-pdf/renderer.

## Core Value

A fast, accessible, bilingual portfolio that accurately represents Jefry's work and makes it easy for recruiters and collaborators to download his CV and reach him.

## Current Milestone: None (v1.6 shipped)

No active milestone. **v1.6 Navbar Layout Balance** shipped 2026-06-21 (tag `v1.6`, PR #39). Start the next milestone via `/gsd-new-milestone`.

<details>
<summary>✅ v1.6 Navbar Layout Balance (shipped 2026-06-21)</summary>

**Goal:** Rebalance the desktop navbar so the 7 section links sit centered between the "JK" brand (left) and the theme/language controls (right), removing the large dead gap — without regressing v1.5 responsive behavior (phone hamburger drawer, tablet/desktop horizontal-scroll on overflow).

**Delivered:**
- The `InlineNav` wrapper gains `sgds:flex-1 + sgds:items-center + sgds:justify-center`, growing into the dead gap and centering the 7 desktop links vertically and horizontally between the brand and controls.
- Root cause fixed within the wrapper (no shadow-DOM patching): SGDS `<sgds-mainnav>` packed slotted links left (`justify-content: flex-start`) and pushed `.slot-end` controls right (`margin-left: auto`); the slotted child's own flex props apply through the slot.
- NAV-05 horizontal-scroll overflow fallback preserved (`overflow-x-auto + flex-nowrap`), guarded by a new regression test asserting grow + scroll coexist.
- No regression to the phone hamburger drawer, ≥44px tap targets, or no-horizontal-overflow guarantee 320→1024px. Human UAT 4/4 pass.

</details>

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
- ✓ Phone navbar collapses to brand + hamburger; accessible right-side `MobileDrawer` (7 links + theme/language toggles, focus-trap, scroll-lock, Esc/backdrop, ≥44px targets) (NAV-01..04, A11Y-01..04) — v1.5 Phase 9
- ✓ Inline tablet/desktop nav scrolls horizontally when items overflow so all 7 stay reachable (NAV-05) — v1.5 Phase 9
- ✓ Hero photo + content clear the fixed navbar on phones + tablets via `--navbar-height` token + `.hero-section` (LAYOUT-01); no horizontal page overflow 320→1024px (LAYOUT-02) — v1.5 Phase 10
- ✓ Desktop nav links centered between brand and controls (`InlineNav` flex-1 + items-center + justify-center); balanced gaps, no dead space (NAVBAL-01, NAVBAL-02) — v1.6 Phase 11
- ✓ NAV-05 horizontal-scroll fallback preserved under the centered layout; no regression to phone drawer, ≥44px targets, or 320→1024px overflow (NAVBAL-03, NAVBAL-04) — v1.6 Phase 11

### Active

<!-- No active milestone — v1.6 shipped. Define the next scope via /gsd-new-milestone. -->

(None — define the next milestone via `/gsd-new-milestone`. Deferred v2 candidates are listed under Current State.)

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
| Center the SGDS navbar via flex on the slotted `InlineNav` wrapper (`flex-1 + items-center + justify-center`), not shadow-DOM overrides | Slotted children keep their own flex props through the shadow slot; no `sgds-mainnav` patching or `globals.css` fallback needed | ✓ Good (v1.6) |

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

**Shipped:** v1.6 — Navbar Layout Balance (2026-06-21, tag `v1.6`, PR #39). The desktop inline nav is now centered between the "JK" brand and the theme/language controls — the `InlineNav` wrapper (`Navbar.tsx`) gains `sgds:flex-1 + sgds:items-center + sgds:justify-center` to fill the dead gap and center links vertically + horizontally, while NAV-05 horizontal-scroll overflow and all v1.5 responsive behavior (phone drawer, ≥44px targets, no 320→1024px overflow) are preserved. Root cause: SGDS `<sgds-mainnav>` packs slotted links left (`justify-content:flex-start`) and shoves `.slot-end` controls right (`margin-left:auto`); the slotted child's own flex props apply through the slot. Git tags: v1.1, v1.2, v1.3, v1.4, v1.5, v1.6.
**Previously shipped:** v1.5 — Responsive Navigation & Layout Fixes (2026-06-21, tag `v1.5`, PR #36): phone hamburger + accessible `MobileDrawer` (NAV-01–05, A11Y-01–04), hero clears the fixed navbar (LAYOUT-01), no horizontal overflow 320→1024px (LAYOUT-02). v1.4 — Polish & International Content (tag `v1.4`): WCAG-AA contrast, theme switch + EN|ID pill, GitHub link → About, full humanized-prose rewrite with 14 bilingual project descriptions.
**Next:** No active milestone — start the next one via `/gsd-new-milestone`.
**Deferred (v2 candidates):** CI Lighthouse/CWV checks, Playwright E2E, Dependabot, blog, testimonials, experience timeline, Core Web Vitals ≥90, progressive image loading.

---
*Last updated: 2026-06-22 — after v1.6 (Navbar Layout Balance) milestone*

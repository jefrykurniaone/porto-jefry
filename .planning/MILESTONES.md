# Milestones — porto-jefry

Historical record of shipped milestones. Full archives in `.planning/milestones/`.

> **Versioning note:** Early planning versions diverged from git tags. Git tags are the source of truth for shipped order: `v1.1`, `v1.2` were tagged 2026-05-26. The improvement+SGDS milestone (tracked internally as "v1.0") is aligned and closed here as **v1.3**. The next milestone is **v1.4**.

---

## v1.3 — Improvement & Hardening

**Shipped:** 2026-06-20
**Phases:** 5 (executed 1 → 2 → 5 → 3 → 4) · **Plans:** 21
**Tag:** v1.3
**Archive:** `milestones/v1.3-ROADMAP.md`, `milestones/v1.3-REQUIREMENTS.md`

**Delivered:** Full migration of the portfolio UI to SGDS web components (Tailwind v4, SGDS dark-mode theming, minimalist monochrome look), security hardening (trusted-IP rate limiting, tightened CSP), type-safety and code-quality improvements (exported `ExperienceMessages`, build-time date codegen, sonarjs lint gates), UX polish (CV error feedback, branded 404/error pages), and four quick correctness fixes.

**Key accomplishments:**
- Full SGDS migration + Tailwind v3→v4 + dark mode on SGDS theming (#26, #27)
- Security: `ipAddress()` rate-limit identity, CSP tightened, SEC-03 accepted-risk (#28)
- Type safety & code quality: double-cast removed, automated build date, sonarjs gates (#29)
- UX: inline CV error feedback, locale-aware 404/error pages, ThemeToggle CLS fix
- Production CSP + theme-init smoke test verified against live production (2026-06-20)

**Known deferred items at close:** UK English writing-standards audit; SGDS Masthead (evaluated, not adopted).

---

## v1.2 — Security & API Hardening (Phase 1)

**Shipped:** 2026-05-26 · **Tag:** v1.2
Correct IP extraction, bounded rate-limit Map with lazy eviction, RFC 9110 `Retry-After`, `URLSearchParams` CV URL. (PR #11.) Known deferred at the time: 15 requirements (STAB/PERF/DEBT/TEST/DEP). See the early `milestones/v1.0-*` snapshot, which documents this "Quality & Technical Debt Remediation" scope.

## v1.1 — New Features

**Shipped:** 2026-05-26 · **Tag:** v1.1
Back-to-top button, test suite (79 tests, 83.6% coverage), GitHub Actions CI pipeline. (PR #10.)

---

## Next

- 🔵 **v1.4 — Polish & International Content** (Phases 6-8): contrast/readability, hero CTA rebalance, toggle redesign, GitHub move, humanized international content. See `.planning/ROADMAP.md`.

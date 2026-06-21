---
phase: 10
slug: hero-overflow-fixes
status: verified
threats_open: 0
asvs_level: 1
created: 2026-06-21
---

# Phase 10 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| (none new) | Pure CSS / responsive-layout phase. No new inputs, network calls, auth, data flows, or trust boundaries introduced. Changes limited to `globals.css` styling tokens/rules and one static className in `Hero.tsx`. | None |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-10-01 | Denial of Service (self-inflicted UX) | `overflow-x` root containment | mitigate | `overflow-x: clip` (NOT `hidden`) on `html` and `body` so no scroll container is created and `position: sticky` / anchor `scroll-margin` stay intact; layered as a defensive guard on top of the root-cause CTA fix, so it does not mask a still-broken element. Verified in `src/app/globals.css:62` (html) and `src/app/globals.css:67` (body); no blanket `overflow-x: hidden` present. A11y: clip is horizontal-only and does not hide focus outlines/controls — confirmed in the Task 3 human checkpoint (10-UAT.md). | closed |
| T-10-02 | Information Disclosure | i18n / content | accept | No content, labels, or data changed — layout/styling only. No PII or secret rendered. | closed |
| T-10-SC | Tampering | npm/pip/cargo installs | accept | No new dependencies installed; reuses existing SGDS utilities + plain CSS. Verified: phase 10 commits touch only `src/app/globals.css`, `src/components/sections/Hero.tsx`, `src/components/sections/Hero.test.tsx` — no change to `package.json` or `package-lock.json`. No package-legitimacy checkpoint required. | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-10-01 | T-10-02 | CSS/layout-only change; no content, labels, PII, or secrets rendered or altered. | Jefry Kurniawan | 2026-06-21 |
| AR-10-02 | T-10-SC | No new dependencies added; only existing SGDS utilities + plain CSS used. Verified no `package.json`/lockfile changes in phase commits. | Jefry Kurniawan | 2026-06-21 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-21 | 3 | 3 | 0 | /gsd-secure-phase (plan-time register, short-circuit: all CLOSED) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-21

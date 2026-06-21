---
phase: 11
slug: navbar-layout-balance
status: verified
threats_open: 0
asvs_level: 1
created: 2026-06-22
---

# Phase 11 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

This phase is a client-side, CSS/layout-only change: it adds Tailwind layout utilities
(`sgds:flex-1 sgds:items-center sgds:justify-center`) to the `InlineNav` wrapper in
`src/components/layout/Navbar.tsx` plus a regression test in `Navbar.test.tsx`. No new
trust boundary, no input handling, no network surface, no new dependencies.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| (none new) | No new boundary crossed — only static Tailwind layout utilities on an existing slotted `<div>` | none |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-11-01 | Tampering | `InlineNav` wrapper className / optional globals.css rule | accept | Static className strings only; no dynamic values, input, or script. No `globals.css` rule was added (the Tailwind-only fix won). Verified: no `dangerouslySetInnerHTML`/`innerHTML`/`eval`/`new Function` introduced; diff is layout utilities only. | closed |
| T-11-02 | Denial of Service | NAV-05 horizontal-scroll fallback | mitigate | `sgds:overflow-x-auto` + `sgds:flex-nowrap` retained on the wrapper so the centered cluster scrolls (never clips/overflows) — navigation stays reachable. Verified by grep, UAT Test 2 (overflow scroll) pass, and the regression test asserting `overflow-x-auto`. html/body `overflow-x: clip` guards untouched. | closed |
| T-11-SC | Tampering (supply chain) | npm installs | accept | No package installs in this phase — `package.json`/lockfile unchanged (verified via `git diff --name-only`). Package Legitimacy Gate is N/A. | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-11-01 | T-11-01 | Layout-only static Tailwind utilities on an existing element; no dynamic value, input, script, or shadow-DOM patching. Surface is inert. | Jefry Kurniawan | 2026-06-22 |
| AR-11-02 | T-11-SC | No dependency installs occurred; `package.json` unchanged. Nothing to audit. | Jefry Kurniawan | 2026-06-22 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-22 | 3 | 3 | 0 | gsd-secure-phase (plan-time register, short-circuit verify) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-22

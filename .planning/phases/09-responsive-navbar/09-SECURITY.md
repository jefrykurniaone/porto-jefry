---
phase: 09
slug: responsive-navbar
status: verified
threats_open: 0
asvs_level: 1
created: 2026-06-21
---

# Phase 09 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| user input → DOM | Drawer renders only static i18n labels and fixed `#<key>` hash anchors; no user-supplied or network data crosses into the DOM. | Static translation strings only |
| client → URL hash | `scrollTo` writes `history.pushState(null, '', '#<id>')` where `<id>` comes only from the fixed `NAV_KEYS` allowlist. | Fixed allowlist keys (about…contact) |
| client → DOM scroll | The drawer's scroll lock toggles `document.body` overflow and must always restore on close/unmount. | CSS `overflow` style value only |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-09-01 | Tampering | MobileDrawer link targets | accept | Targets are a fixed `NAV_KEYS` allowlist (about…contact); no dynamic/user-derived hrefs, so no injection vector. | closed |
| T-09-02 | Information Disclosure | i18n labels | accept | All labels are static translation strings in `en.json`/`id.json`; no PII or secrets rendered. | closed |
| T-09-03 | Denial of Service | `useScrollLock` overflow handling | mitigate | `src/hooks/use-scroll-lock.ts` captures and restores the prior `overflow` value (not blindly `''`), is SSR-guarded, and cleans up on unmount — cannot permanently freeze page scroll. Verified by unit tests + code review. | closed |
| T-09-04 | Tampering | `scrollTo` / `pushState` hash | accept | Hash is derived from the hardcoded `NAV_KEYS` allowlist via `getElementById(id)?.scrollIntoView()`; no user input, so no hash-injection or open-redirect risk. | closed |
| T-09-05 | Denial of Service | drawer scroll lock | mitigate | `useScrollLock` restores prior overflow on close/unmount; `Navbar.tsx` makes `onClose` reachable via Esc, close button, and backdrop, so the lock cannot strand the page. Verified in browser (background scroll restored on close). | closed |
| T-09-06 | Elevation of Privilege | focus trap escaping | mitigate | Single focus-trap owner (`MobileDrawer`'s `useFocusTrap`) wraps Tab within the panel and restores focus to the hamburger on every close path (close button, backdrop, link-select, Esc — WR-01 fix, commit 2b195fc); Navbar's duplicate trap was removed. Verified by regression tests in `Navbar.test.tsx`. | closed |
| T-09-SC | Tampering | dependency installs (supply chain) | mitigate | No new dependencies were installed in this phase; reuses existing `next-intl`, SGDS, React, and the Plan 01 hooks. No package-legitimacy checkpoint required. | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| R-09-01 | T-09-01 | Drawer link targets are a fixed `NAV_KEYS` allowlist with no dynamic/user-derived hrefs — no injection vector. | Jefry Kurniawan | 2026-06-21 |
| R-09-02 | T-09-02 | Navbar/drawer render only static i18n strings — no PII or secrets exposed. | Jefry Kurniawan | 2026-06-21 |
| R-09-03 | T-09-04 | `pushState` hash is derived solely from the fixed allowlist — no open-redirect or hash-injection risk. | Jefry Kurniawan | 2026-06-21 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-21 | 7 | 7 | 0 | gsd-secure-phase (plan-time register; threats_open:0, register authored at plan time → short-circuit verification) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-21

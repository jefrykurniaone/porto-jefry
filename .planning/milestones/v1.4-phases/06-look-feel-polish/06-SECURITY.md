---
phase: 06
slug: look-feel-polish
status: verified
threats_open: 0
asvs_level: 1
created: 2026-06-20
---

# Phase 06 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.
> Phase 06 (Look & Feel Polish) is a presentational phase — muted-text contrast
> (UI-05), hero CTA rebalance (UI-06), and theme/language toggle redesign (UI-07).

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Browser ↔ localStorage | Theme preference read/written via `useSgdsTheme` | `sgds-theme` value — closed enum `'day' \| 'night'`, non-sensitive |
| Browser ↔ Next.js router | Locale switch via `router.replace(pathname, { locale })` | Locale — module-level constant tuple `['en','id']`, non-sensitive |

No new network, auth, or server boundaries introduced by this phase.

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-06-01-01 | N/A | CSS muted-color token (`src/app/globals.css`) | accept | Pure CSS value substitution; no runtime data, input, or network surface | closed |
| T-06-02-01 | N/A | Hero CTA markup/CSS (`Hero.tsx`, `globals.css`) | accept | Presentational only; identical `href` targets, scroll handlers, and `onDownload` wiring | closed |
| T-06-03-01 | N/A | Theme/locale toggle UI (`ThemeToggle.client.tsx`, `LanguageToggle.tsx`, `Navbar.tsx`, `globals.css`) | accept | `sgds-change` listener carries no payload + has cleanup; localStorage read guarded by closed-enum `isSgdsTheme`; locale from constant tuple | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

### T-06-03-01 verification detail

- **Event listener:** `switchEl.addEventListener('sgds-change', toggleTheme)` with `removeEventListener` returned from the `useEffect` cleanup. `toggleTheme` ignores the event payload (binary day/night flip) — no untrusted data ingested, no listener leak.
- **localStorage read:** `localStorage.getItem('sgds-theme')` passed through `isSgdsTheme()` guard (`'day' | 'night'` only); poisoned values fall back to `'day'`. Only DOM effect is a boolean `classList.toggle('sgds-night-theme', …)` — not an injection sink. `try/catch` guarded.
- **localStorage write:** value always from the internal ternary `prev === 'day' ? 'night' : 'day'` — never derived from user input or the read value.
- **Locale routing:** `nextLocale` is always an element of `LOCALES = ['en','id'] as const`; `router.replace` call is structurally identical to the pre-phase implementation.
- **No new attack surface:** no new API routes/server actions/fetch, no auth paths, no schema changes, no `dangerouslySetInnerHTML`/`eval`/`innerHTML`, no secrets.

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-06-01 | T-06-01-01 | CSS color token override. No runtime data, no user input, no network surface. Purely visual WCAG AA accessibility fix. | Jefry Kurniawan | 2026-06-20 |
| AR-06-02 | T-06-02-01 | Hero CTA presentational changes only (sizing CSS + sgds-button outline variant). Same handlers, same href targets, same download logic. No new surface. | Jefry Kurniawan | 2026-06-20 |
| AR-06-03 | T-06-03-01 | Theme/locale toggle markup redesign. Listener wired to a no-payload binary toggle; localStorage reads validated through a closed-enum guard; locale routing driven by a module-level constant tuple. No new network, auth, injection, or schema surface. | Jefry Kurniawan | 2026-06-20 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-20 | 3 | 3 | 0 | gsd-security-auditor (claude-sonnet-4-6) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-20

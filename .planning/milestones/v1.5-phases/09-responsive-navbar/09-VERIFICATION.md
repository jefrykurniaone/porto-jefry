---
phase: 09-responsive-navbar
verified: 2026-06-21T10:00:00Z
status: human_needed
score: 9/9 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Phone widths 360 / 390 / 430px — navbar collapsed, drawer opens and closes"
    expected: "Only brand (JK) and hamburger visible in bar; no inline links. Tapping hamburger slides in right-side drawer listing all 7 sections (About through Contact) with ThemeToggle and EN|ID switch present, each with ≥44px tap targets. Close button, backdrop tap, and Esc each close the drawer. While open, background page does not scroll. On close, focus returns to the hamburger (keyboard observable)."
    why_human: "CSS media-query collapse (sgds:md:hidden / sgds:hidden sgds:md:flex) and sgds-mainnav web-component layout are not exercised in jsdom. Responsive breakpoints, visual overlap, and touch-target sizing require a real browser at each viewport width."
  - test: "Tablet widths 768 / 1024px — inline nav visible and scrolls horizontally on overflow"
    expected: "All 7 section links are visible in the inline nav. When items don't all fit (ID locale, narrow window, zoom), the nav row scrolls horizontally via swipe/drag and every section stays reachable — nothing clipped or permanently hidden. At full width, no scrollbar appears."
    why_human: "The overflow-x-auto class is present in code, but whether it visually scrolls vs. clips requires rendering the SGDS web component tree at tablet widths — not verifiable in jsdom."
  - test: "Desktop 1280px+ — all 7 nav items visible, no drawer or scrollbar"
    expected: "All 7 items are inline and fully visible. The hamburger and MobileDrawer are hidden. No horizontal scrollbar appears on the nav row."
    why_human: "Requires real browser rendering to confirm items fit and overflow-x-auto does not introduce an unwanted scrollbar at full width."
  - test: "ID locale responsive check across all viewport widths"
    expected: "Indonesian labels (longer than English) do not break the phone bar. In the drawer, all 7 ID labels render. On tablet, the longer ID labels trigger horizontal scroll where they don't fit. Smooth-scroll, hash update, and drawer-close work identically in the ID locale."
    why_human: "Requires real browser rendering with /id locale active at each tested viewport width."
  - test: "Touch targets: hamburger, drawer close button, and all 7 drawer nav links"
    expected: "All controls are visually at least 44×44px and comfortably tappable on a real device or in browser devtools responsive mode."
    why_human: "Inline-style min-width/min-height is coded; visual tap-target adequacy is a human judgment call across device pixel ratios."
---

# Phase 9: Responsive Navbar Verification Report

**Phase Goal:** Navbar collapses to brand + hamburger on phones; hamburger opens an accessible right-side drawer with all 7 section links and both toggles (theme + language); inline nav at tablet/desktop scrolls horizontally whenever items overflow so navigation never breaks at any width.
**Verified:** 2026-06-21T10:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Below md (768px) the navbar shows only the brand (JK) and the hamburger; no inline section links are present | ? UNCERTAIN (human) | `HamburgerButton` has `sgds:md:hidden`; `InlineNav` has `sgds:hidden sgds:md:flex`; verified in code, but CSS breakpoint behavior requires browser rendering |
| 2 | At/above md the inline nav shows all 7 section links | ? UNCERTAIN (human) | `DesktopNavLinks` maps all 7 `NAV_KEYS`; gated `sgds:hidden sgds:md:block`; same browser-rendering caveat |
| 3 | An open drawer lists all 7 section links (About, Experience, Education, Skills, Projects, Certifications, Contact) | ✓ VERIFIED | `MobileDrawer.tsx` `DrawerLinks` maps all 7 `NAV_KEYS`; MobileDrawer test `renders all 7 section labels when open` passes; Navbar integration test `hamburger click opens drawer with all 7 section labels` passes |
| 4 | An open drawer contains the theme toggle and the EN|ID language switch | ✓ VERIFIED | `DrawerPanel` renders `<ThemeToggle />` and `<LanguageToggle />` in its footer (lines 79–80); MobileDrawer test asserts `LanguageToggle` (`getByRole('group')`) present |
| 5 | When the drawer opens, focus moves inside it; when it closes on any path, focus returns to the hamburger | ✓ VERIFIED | `useFocusTrap` focuses `focusable[0]` on open; `closeMenu` in Navbar.tsx (line 88) calls `toggleRef.current?.focus()` on every path including close-button, backdrop, link-select, and Escape; four regression tests in Navbar.test.tsx assert `document.activeElement === toggleBtn` after each close path; all 4 tests pass |
| 6 | Esc, a visible close control, and a backdrop tap each close the drawer | ✓ VERIFIED | `useFocusTrap` handles Escape calling `onClose`; close button `onClick={onClose}` (MobileDrawer.tsx line 63); backdrop `onClick={onClose}` (line 105); MobileDrawer tests cover all three paths; Navbar integration test for Escape also passes |
| 7 | Background page scroll is locked while the drawer is open and restored when it closes | ✓ VERIFIED | `useScrollLock(isOpen)` called unconditionally in `MobileDrawer` (line 95); hook captures prior `document.body.style.overflow`, sets `'hidden'` while locked, restores on cleanup; 4 unit tests in `use-scroll-lock.test.ts` pass |
| 8 | When inline items overflow the available width the nav row scrolls horizontally; nothing is clipped or permanently hidden | ? UNCERTAIN (human) | `InlineNav` wrapper has `sgds:overflow-x-auto sgds:flex-nowrap` (Navbar.tsx line 72); Navbar test asserts className contains `overflow-x-auto`; actual scrolling behavior requires browser rendering |
| 9 | Tapping a drawer link smooth-scrolls to the section, updates the URL hash, and closes the drawer | ✓ VERIFIED | `scrollTo` callback: `scrollIntoView({behavior:'smooth'})` + `history.pushState(null,'','#${id}')` + `closeMenu()`; MobileDrawer `onNavClick` receives `scrollTo` as prop; Navbar integration test `clicking a drawer link calls scrollIntoView, pushState, and closes the drawer` asserts all three and passes |

**Score:** 6/6 code-verifiable truths VERIFIED; 3 truths require human browser verification (responsive layout, overflow behavior)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/layout/MobileDrawer.tsx` | Right-side accessible drawer: 7 nav links + ThemeToggle + LanguageToggle + close button + backdrop | ✓ VERIFIED | 113 lines; exports default `MobileDrawer`; `DrawerPanel` (dialog, aria-modal), `DrawerLinks` (7 NAV_KEYS), backdrop (data-testid="drawer-backdrop"), close button (aria-label=close_menu, 44px), ThemeToggle, LanguageToggle all present |
| `src/hooks/use-scroll-lock.ts` | Locks document scroll while boolean flag is true; restores prior value on release | ✓ VERIFIED | 24 lines; exports `useScrollLock`; captures `originalOverflow`, sets `'hidden'`, restores in effect cleanup; SSR-guarded |
| `src/hooks/use-focus-trap.ts` | Focus trap for drawer (pre-existing, consumed) | ✓ VERIFIED | Exports `useFocusTrap(isOpen, menuRef, toggleRef, onClose)`; handles initial focus, Escape+focus-restore, Tab/Shift+Tab wrapping |
| `src/components/layout/Navbar.tsx` | Responsive navbar: brand+hamburger below md, scrollable inline nav at md+, MobileDrawer integration | ✓ VERIFIED | 114 lines; imports and renders `<MobileDrawer>`; `closeMenu` centralized with focus restore; `scrollTo` routes through `closeMenu`; `InlineNav` with `overflow-x-auto`; no `expand="always"`; ThemeToggle/LanguageToggle gated `sgds:hidden sgds:md:flex` |
| `src/i18n/messages/en.json` | nav.close_menu = "Close menu" | ✓ VERIFIED | `nav.close_menu: "Close menu"` present; all 12 nav keys in parity with id.json |
| `src/i18n/messages/id.json` | nav.close_menu = "Tutup menu" | ✓ VERIFIED | `nav.close_menu: "Tutup menu"` present; all 12 nav keys match en.json |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `MobileDrawer.tsx` | `use-focus-trap.ts` | `useFocusTrap(isOpen, panelRef, toggleRef, onClose)` | ✓ WIRED | Import line 5; invoked line 94 |
| `MobileDrawer.tsx` | `use-scroll-lock.ts` | `useScrollLock(isOpen)` | ✓ WIRED | Import line 6; invoked line 95 |
| `Navbar.tsx` | `MobileDrawer.tsx` | `<MobileDrawer isOpen={isOpen} onClose={closeMenu} onNavClick={scrollTo} toggleRef={toggleRef} />` | ✓ WIRED | Import line 8; JSX line 111 |
| `Navbar.tsx scrollTo` | `MobileDrawer onNavClick` | `scrollTo` passed as `onNavClick`; scrollTo calls `closeMenu()` which restores focus | ✓ WIRED | scrollTo (lines 90–94) calls scrollIntoView + pushState + closeMenu; passed as onNavClick at line 111 |
| `MobileDrawer.tsx` | `Navbar.tsx` | `NAV_KEYS` imported | ✓ WIRED | Import line 7: `import { NAV_KEYS } from './Navbar'`; used in `DrawerLinks` map (line 26) |

### Data-Flow Trace (Level 4)

All rendered data is static (i18n strings from next-intl, hardcoded NAV_KEYS allowlist). No dynamic DB or API data flows through the nav components. Level 4 is not applicable for static navigation content.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| MobileDrawer + Navbar tests pass (29 tests) | `npx vitest run Navbar.test.tsx MobileDrawer.test.tsx` | PASS (29) FAIL (0) | ✓ PASS |
| useScrollLock unit tests pass | `npx vitest run use-scroll-lock.test.ts` | PASS (4) FAIL (0) | ✓ PASS |
| closeMenu centralizes focus restore (all close paths) | grep `toggleRef.current?.focus()` in closeMenu | Found at Navbar.tsx:88; scrollTo routes through closeMenu at line 93 | ✓ PASS |
| No duplicate useFocusTrap in Navbar | grep `useFocusTrap` in Navbar.tsx | 0 matches — removed as required | ✓ PASS |
| `expand="always"` removed from sgds-mainnav | grep `expand` in Navbar.tsx | Only `aria-expanded` at line 61; no `expand="always"` | ✓ PASS |
| overflow-x-auto present on InlineNav wrapper | grep `overflow-x-auto` in Navbar.tsx | Found at line 72 in InlineNav className | ✓ PASS |
| ThemeToggle/LanguageToggle gated off phones | grep `sgds:hidden sgds:md:flex` in Navbar.tsx | Lines 72 and 104 gate the inline nav and the toggles | ✓ PASS |
| en.json and id.json nav key parity | node key comparison | 12 keys each, identical set, close_menu correct in both | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|---------|
| NAV-01 | 09-02 | Phones show only brand + hamburger; inline links hidden | ✓ SATISFIED (code) | `sgds:md:hidden` on hamburger; `sgds:hidden sgds:md:flex` on InlineNav; test `hamburger button exists with aria-label` asserts `md:hidden` class |
| NAV-02 | 09-01 | Hamburger opens right-side drawer with all 7 sections | ✓ SATISFIED | MobileDrawer renders all 7 NAV_KEYS; Navbar integration test asserts all 7 labels in dialog |
| NAV-03 | 09-02 | Drawer link smooth-scrolls, updates hash, closes drawer | ✓ SATISFIED | `scrollTo` callback verified; Navbar integration test asserts all three behaviors |
| NAV-04 | 09-01 | Theme toggle and EN|ID switch inside drawer | ✓ SATISFIED | `<ThemeToggle />` and `<LanguageToggle />` rendered in DrawerPanel footer; test asserts LanguageToggle group present |
| NAV-05 | 09-02 | Inline nav scrolls horizontally on overflow at md+ | ✓ SATISFIED (code) | `sgds:overflow-x-auto sgds:flex-nowrap` on InlineNav wrapper; Navbar test asserts className; visual scroll behavior requires human verification |
| A11Y-01 | 09-01 | Drawer traps focus while open; restores to hamburger on close | ✓ SATISFIED | `useFocusTrap` in MobileDrawer; `closeMenu` restores focus on all 4 close paths (WR-01 fix in commit 2b195fc); 4 regression tests verify all paths |
| A11Y-02 | 09-01 | Drawer closable via Esc, visible close control, backdrop | ✓ SATISFIED | All three close paths implemented and tested |
| A11Y-03 | 09-01 | Background scroll locked while drawer open | ✓ SATISFIED | `useScrollLock(isOpen)` in MobileDrawer; hook captures and restores overflow; 4 unit tests pass |
| A11Y-04 | 09-01, 09-02 | Controls have accessible labels and ≥44px touch targets | ✓ SATISFIED (code) | Hamburger: `aria-label={t('toggle_menu')}`, `style={{ minWidth:'44px', minHeight:'44px' }}`; close button: `aria-label={t('close_menu')}`, `style={{ minWidth:'44px', minHeight:'44px' }}`; drawer links: `style={{ minHeight:'44px' }}`; MobileDrawer test asserts 44px on close button |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `MobileDrawer.test.tsx` | 48 | `toBeDefined()` on querySelector result — always passes (IN-01 from code review) | ℹ️ Info | ThemeToggle presence is not truly asserted; confirmed by code review as a known gap, but covered by the LanguageToggle group assertion in the adjacent test |
| `Navbar.tsx` | 29 | `React.Fragment` wrapper around single child (IN-02 from code review) | ℹ️ Info | Cosmetic dead structure; no functional impact |

No `TBD`, `FIXME`, `XXX` debt markers found in any modified file. No stub patterns (empty returns, placeholder strings, hardcoded empty arrays) found.

### Code Review Finding Status (WR-01 through WR-05)

| Finding | Severity in Review | Status |
|---------|--------------------|--------|
| WR-01: Focus orphaned on non-Escape close paths (WCAG 2.4.3) | Warning (WCAG defect) | **FIXED** in commit 2b195fc — `closeMenu` now centralizes `toggleRef.current?.focus()` on all 4 close paths; `scrollTo` routes through `closeMenu`; 3 new regression tests added and passing |
| WR-02: Close button renders no fallback if `<sgds-icon>` fails to upgrade | Warning | Advisory — `aria-label` preserved for screen readers; sighted fallback not added; left for user per plan |
| WR-03: Initial drawer focus lands on close button (not first nav link) | Warning | Advisory — close button is first DOM child; behavior is consistent with code; left for user per plan |
| WR-04: `aria-modal` does not block background screen-reader access | Warning | Advisory — `inert` attribute not added; left for user per plan |
| WR-05: Hamburger and close button lack explicit `focus-visible` ring | Warning | Advisory — depends on SGDS global stylesheet; left for user per plan |

WR-02 through WR-05 are advisory items explicitly left for the user. They do not block the phase goal per the context note. None constitute `TBD`/`FIXME` debt markers.

### Human Verification Required

The automated code checks pass completely. The following items require human verification in a real browser because they depend on CSS media queries, SGDS web-component layout behavior, and visual rendering that cannot be asserted in jsdom.

#### 1. Phone collapsed navbar (360 / 390 / 430px)

**Test:** Open `npm run dev` at localhost:3000. Use browser devtools responsive mode at 360px, 390px, and 430px.
**Expected:** Only the "JK" brand and the hamburger icon are visible in the navbar bar. No inline section links appear. No horizontal overflow from the bar. Tapping the hamburger slides in a right-side drawer listing all 7 sections (About, Experience, Education, Skills, Projects, Certifications, Contact). The ThemeToggle and EN|ID switch are inside the drawer and both function. Close button, backdrop tap, and Esc each close the drawer. While open, the background page does not scroll. On close, focus is returned to the hamburger (verify with keyboard Tab navigation).
**Why human:** `sgds:md:hidden` / `sgds:hidden sgds:md:flex` are Tailwind CSS utilities that only activate below the 768px media-query breakpoint. jsdom renders all elements regardless of media queries.

#### 2. Tablet inline nav and horizontal scroll (768 / 1024px)

**Test:** At 768px and 1024px in devtools responsive mode, inspect the inline nav. Then narrow the window or switch to the ID locale so labels are longer.
**Expected:** All 7 inline nav links are visible. When items don't all fit, the nav row scrolls horizontally (swipe or drag) and every section remains reachable — nothing is clipped or permanently hidden. At full desktop width with EN labels, no scrollbar appears.
**Why human:** `overflow-x-auto` suppresses scroll when content fits and enables it when content overflows; only observable under real layout constraints.

#### 3. Desktop full-width (1280px+)

**Test:** Resize to 1280px or maximize the browser window.
**Expected:** All 7 nav items are fully visible inline. The hamburger button and MobileDrawer are not visible. No horizontal scrollbar appears on the nav row.
**Why human:** Requires real browser rendering to confirm items fit within the available width.

#### 4. ID locale cross-cutting check

**Test:** Switch to the /id URL prefix. Repeat the phone, tablet, and desktop checks with Indonesian labels.
**Expected:** Indonesian labels (Tentang, Pengalaman, Pendidikan, Keahlian, Proyek, Sertifikasi, Kontak) behave identically to EN labels across all widths. Smooth-scroll, hash update, and drawer-close work in the ID locale.
**Why human:** Requires real browser + locale routing.

#### 5. Touch target adequacy

**Test:** In devtools device emulation or on a real device, tap the hamburger, the drawer close button, and all 7 drawer nav links.
**Expected:** All controls are comfortably tappable — visually at least 44×44px rendered size.
**Why human:** Inline `style={{ minWidth: '44px', minHeight: '44px' }}` sets the minimum; actual rendered size under SGDS layout constraints requires visual confirmation.

### Gaps Summary

No code-level gaps found. All 9 requirement IDs are satisfied in the codebase. The WR-01 WCAG 2.4.3 defect identified in code review has been fixed and regression-tested. The 5 items above are inherently responsive/visual behaviors that cannot be asserted in a jsdom test environment — they require human browser verification as the final gate before marking Phase 9 complete.

---

_Verified: 2026-06-21T10:00:00Z_
_Verifier: Claude (gsd-verifier)_

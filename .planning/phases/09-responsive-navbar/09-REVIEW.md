---
phase: 09-responsive-navbar
reviewed: 2026-06-21T00:00:00Z
depth: standard
files_reviewed: 8
files_reviewed_list:
  - src/components/layout/MobileDrawer.tsx
  - src/components/layout/MobileDrawer.test.tsx
  - src/components/layout/Navbar.tsx
  - src/components/layout/Navbar.test.tsx
  - src/hooks/use-scroll-lock.ts
  - src/hooks/use-scroll-lock.test.ts
  - src/i18n/messages/en.json
  - src/i18n/messages/id.json
findings:
  critical: 0
  warning: 5
  info: 4
  total: 9
status: issues_found
---

# Phase 09: Code Review Report

**Reviewed:** 2026-06-21
**Depth:** standard
**Files Reviewed:** 8
**Status:** issues_found

## Summary

Reviewed the responsive navbar implementation: `MobileDrawer`, `Navbar`, the `useScrollLock` hook, their co-located tests, and the EN/ID translation additions. The `useScrollLock` hook is correct (SSR-guarded, captures and restores prior overflow, clean cleanup) and the translation files are balanced (every new `nav` key exists in both `en.json` and `id.json`).

No BLOCKER-tier defects were found — there are no security vulnerabilities, crashes, or data-loss risks in scope. However there are several accessibility and correctness defects that materially weaken the feature for the very thing this phase exists to deliver (mobile navigation, focus management, keyboard support). The most important: **focus is only returned to the toggle button on Escape**, not on any of the other three close paths (close button, backdrop, link selection), which is a WCAG 2.4.3 / 2.1.2 keyboard-trap-recovery defect. There is also a real visual/interaction defect where the close button renders an icon-less control because no fallback icon/label content backs the `<sgds-icon>`, and the drawer's initial-focus behavior lands on the close button rather than first nav item, contradicting the documented hook intent in a way the tests don't catch.

The feature's own test suite is reasonably thorough on happy paths but has gaps that let the focus-return defect through, and one test (the ThemeToggle assertion) is effectively a no-op that always passes.

## Warnings

### WR-01: Focus is not returned to the toggle button on close-button, backdrop, or link close paths

**File:** `src/components/layout/MobileDrawer.tsx:48-84`, `src/components/layout/Navbar.tsx:84-89,103,106`
**Issue:** The drawer can be dismissed four ways: Escape, the close button (`DrawerPanel`, line 61-69), the backdrop (`MobileDrawer`, line 102-107), and selecting a nav link (`scrollTo` → `setIsOpen(false)`). Focus is only restored to the hamburger toggle on the **Escape** path — that restoration lives inside `useFocusTrap`'s keydown handler (`toggleRef.current?.focus()`), not in the close flow itself. For the other three paths, `onClose`/`scrollTo` simply set `isOpen=false`; the drawer (and the element that had focus, e.g. the close button) is unmounted (`if (!isOpen) return null`), leaving `document.activeElement` on `<body>`. A keyboard or screen-reader user who tabs to the close button and activates it loses their place in the page entirely. This violates WCAG 2.4.3 (Focus Order) and the spirit of 2.1.2 (No Keyboard Trap — recovery). The Navbar test at line 127-136 only asserts focus return for Escape, so the gap is invisible to CI.
**Fix:** Restore focus to the toggle on every close. Centralize it in `closeMenu` rather than only in the Escape handler:
```tsx
// Navbar.tsx
const closeMenu = useCallback(() => {
    setIsOpen(false);
    toggleRef.current?.focus();
}, []);
const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    history.pushState(null, '', `#${id}`);
    closeMenu();
}, [closeMenu]);
```
Then remove the redundant `toggleRef.current?.focus()` from `useFocusTrap`'s Escape branch (or keep it — it becomes harmless). Add tests asserting focus return for the close-button and backdrop paths.

### WR-02: Close button renders no visible/textual content if `<sgds-icon>` fails to upgrade

**File:** `src/components/layout/MobileDrawer.tsx:61-69`; compare `src/components/layout/Navbar.tsx:52-65`
**Issue:** The close button's only child is `<sgds-icon name="cross" />`. If the SGDS web component fails to register/upgrade (script blocked by CSP, hydration timing, JS disabled, or component load error), the custom element renders as an empty inline element with no glyph and no text — the button becomes an invisible 44×44 target. The accessible name is preserved via `aria-label`, so screen readers are fine, but sighted keyboard/mouse users see an empty box. The hamburger button (Navbar line 52-65) has the identical pattern, so the failure mode is consistent but not mitigated. Because this is a custom element with no shadow-fallback text, there is no graceful degradation.
**Fix:** Provide fallback text content inside the icon element (custom elements render their light-DOM children until/unless upgraded), e.g. a visually-hidden label or a Unicode glyph fallback:
```tsx
<sgds-icon name="cross" suppressHydrationWarning>
    <span className="sgds:sr-only">{t('close_menu')}</span>
</sgds-icon>
```
At minimum, confirm the SGDS icon script is allowlisted by the CSP nonce so it always upgrades. Track as a known degradation risk if fallback is intentionally omitted.

### WR-03: Initial drawer focus lands on the close button, not the first nav link, contradicting documented intent

**File:** `src/components/layout/MobileDrawer.tsx:48-74` (DOM order); `src/hooks/use-focus-trap.ts:51-54` (consumed behavior)
**Issue:** `useFocusTrap` focuses `focusable[0]` on open, where `focusable` is `querySelectorAll('a, button, [tabindex]...')` in DOM order. In `DrawerPanel`, the **close button** (line 61) precedes the nav links (line 73-74) and footer controls in the DOM, so the first focusable element is the close button. The hook's own doc comment claims it performs "Initial focus on the first focusable element" with the intent of landing the user in the menu content. Focusing the close button as the entry point is a defensible pattern, but it is undocumented here and untested — and combined with WR-01 it means a user who immediately presses Enter (thinking they're on a nav item) closes the drawer and loses focus. The behavior is implicit and fragile to DOM reordering.
**Fix:** Decide and document the intended initial-focus target. If the close button is intended, add an explicit test asserting `document.activeElement` is the close button after open. If the first nav link is intended, move initial focus there (e.g., focus the panel container with `tabindex="-1"`, or explicitly target the first link). Either way, make it explicit so a future DOM reorder doesn't silently change entry focus.

### WR-04: `aria-modal` dialog does not block background focusability or screen-reader access to page content

**File:** `src/components/layout/MobileDrawer.tsx:51-58,100-111`
**Issue:** The panel declares `role="dialog" aria-modal="true"`, asserting to assistive tech that content outside the dialog is inert. But nothing actually makes the rest of the page inert: the backdrop is `aria-hidden="true"` (good, but it only hides the backdrop div itself, not the page behind it), and `useFocusTrap` only intercepts Tab/Shift+Tab to wrap within the menu. A screen-reader user using virtual-cursor/swipe navigation (not Tab) can still read the entire page behind the drawer, contradicting the `aria-modal="true"` promise. This is an ARIA correctness issue (the attribute over-claims). With the focus trap snapshotting `focusable` once at open, dynamically rendered focusables (e.g., theme toggle button state) are also not re-captured, though that is minor here.
**Fix:** Either drop `aria-modal="true"` (and accept it as a non-modal panel), or make the rest of the page inert when open — e.g., set `aria-hidden="true"` / `inert` on the main page wrapper while the drawer is open and remove it on close. The `inert` attribute is the most robust option and also solves background tab-focus.

### WR-05: Hamburger and close buttons lack a focus-visible affordance

**File:** `src/components/layout/Navbar.tsx:52-65`; `src/components/layout/MobileDrawer.tsx:61-69`
**Issue:** Both the hamburger (`HamburgerButton`) and the drawer close button use `sgds:border-0 sgds:bg-transparent` with no `focus-visible` outline/ring class. If SGDS's global stylesheet does not supply a focus ring for bare `<button>` elements (these are not SGDS components, just styled native buttons), keyboard users get no visible focus indicator on the two primary controls of this feature, violating WCAG 2.4.7 (Focus Visible). The 44px touch target requirement (line 59, 66) is met and tested, but visible focus is neither implemented nor tested.
**Fix:** Add an explicit focus-visible style, e.g. `sgds:focus-visible:outline sgds:focus-visible:outline-2 sgds:focus-visible:outline-offset-2` (or the SGDS focus-ring utility) to both buttons. Verify the indicator meets WCAG AA contrast against both transparent-header and scrolled-header backgrounds.

## Info

### IN-01: ThemeToggle test assertion is a guaranteed pass (no-op)

**File:** `src/components/layout/MobileDrawer.test.tsx:45-49`
**Issue:** `expect(container.querySelector('[data-testid="theme-toggle"], button[aria-label], .theme-toggle')).toBeDefined()`. `querySelector` returns either an `Element` or `null` — both are "defined" values, so `.toBeDefined()` is always true even when the element is absent. The test provides no real coverage that ThemeToggle renders inside the drawer.
**Fix:** Assert presence, not definedness: `expect(container.querySelector('...')).not.toBeNull();` or select a concrete attribute that ThemeToggle is known to render.

### IN-02: Redundant `React.Fragment` wrapper around a single child

**File:** `src/components/layout/Navbar.tsx:29-39`
**Issue:** `DesktopNavLinks` maps each key to `<React.Fragment key={key}>` wrapping exactly one `<sgds-mainnav-item>`. The Fragment adds nothing — the `key` can move directly to `sgds-mainnav-item`. Dead structural noise.
**Fix:** Drop the Fragment and put `key={key}` on `<sgds-mainnav-item>`.

### IN-03: Magic `44px` touch-target value duplicated across three controls as inline styles

**File:** `src/components/layout/MobileDrawer.tsx:32,66`; `src/components/layout/Navbar.tsx:59`
**Issue:** The WCAG minimum touch-target size `44px` is hardcoded as inline-style strings in three places (drawer link `minHeight`, close button `minWidth`/`minHeight`, hamburger `minWidth`/`minHeight`). Inline styles also bypass the SGDS/Tailwind utility system used everywhere else, making them inconsistent with project styling conventions and harder to theme/audit. Magic number with no named constant.
**Fix:** Extract a shared constant (e.g. `TOUCH_TARGET_MIN = '44px'`) or, preferably, a Tailwind/SGDS utility class (e.g. `min-w-[44px] min-h-[44px]`) applied consistently. Note the tests at MobileDrawer.test.tsx:121-127 parse the inline `style` attribute, so a refactor to classes would require updating those assertions.

### IN-04: `scrollTo` close logic duplicated — `setIsOpen(false)` instead of reusing `closeMenu`

**File:** `src/components/layout/Navbar.tsx:84-89`
**Issue:** `closeMenu` is `useCallback(() => setIsOpen(false), [])`, yet `scrollTo` calls `setIsOpen(false)` directly rather than invoking `closeMenu`. Minor duplication today, but it is exactly why WR-01 is easy to introduce: any close-side-effect (like focus return) added to `closeMenu` would silently not apply to the link-navigation path.
**Fix:** Have `scrollTo` call `closeMenu()` (add it to the dependency array) so all close behavior funnels through one place. This dovetails with the WR-01 fix.

---

_Reviewed: 2026-06-21_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_

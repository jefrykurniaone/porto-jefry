# Requirements: porto-jefry — v1.5 Responsive Navigation & Layout Fixes

**Defined:** 2026-06-21
**Core Value:** A fast, accessible, bilingual portfolio that accurately represents Jefry's work and makes it easy for recruiters and collaborators to download his CV and reach him.

## v1.5 Requirements

Requirements for this milestone. Each maps to a roadmap phase. Coverage spans **phone, tablet, and desktop** — navigation must never break at any width.

### Navigation (NAV)

- [x] **NAV-01**: On phones (below the `md` 768px breakpoint), the navbar shows only the brand and a hamburger button; the inline desktop nav links are hidden so they no longer overflow or get clipped
- [ ] **NAV-02**: Tapping the hamburger opens a right-side slide-in drawer that lists all 7 sections (About, Experience, Education, Skills, Projects, Certifications, Contact)
- [x] **NAV-03**: Tapping a section in the drawer smooth-scrolls to it, updates the URL hash, and closes the drawer
- [ ] **NAV-04**: The theme toggle and the EN|ID language switch are available inside the drawer
- [x] **NAV-05**: At `md` (768px) and above, when the inline nav's items do not all fit the available width — tablet portrait, a non-maximized laptop window, longer Indonesian labels, or browser zoom — the nav row scrolls horizontally (swipe/drag) so every section stays reachable; no item is clipped or permanently hidden. On a full-width desktop where all items fit, the nav shows fully with no scroll

### Drawer Accessibility (A11Y)

- [ ] **A11Y-01**: The drawer traps keyboard focus while open and restores focus to the hamburger button when closed
- [ ] **A11Y-02**: The drawer can be closed via the Esc key and via a visible close control or backdrop tap
- [ ] **A11Y-03**: Background page scrolling is locked while the drawer is open
- [x] **A11Y-04**: The hamburger, drawer controls, and any horizontal-scroll affordance have accessible labels and ≥44px touch targets

### Hero & Responsive Layout (LAYOUT)

- [ ] **LAYOUT-01**: The hero profile photo and content are fully visible below the fixed navbar at short viewport heights, on both phones and tablets (portrait and landscape) — no top clipping
- [ ] **LAYOUT-02**: There is no horizontal page overflow from 320px up through tablet widths (≤1024px); content fits the viewport at the validation widths 360 / 390 / 430 (phone) and 768 / 1024 (tablet), with desktop (≥1280px) unaffected

## v2 Requirements

Deferred to a future milestone. Tracked but not in this roadmap.

### Performance & Tooling

- **PERF-01**: Core Web Vitals ≥ 90 (mobile)
- **PERF-02**: Progressive / responsive image loading
- **CI-01**: Lighthouse / Core Web Vitals checks in CI
- **CI-02**: Playwright E2E coverage
- **CI-03**: Dependabot dependency updates

### Content & Features

- **FEAT-01**: Blog
- **FEAT-02**: Testimonials
- **FEAT-03**: Experience timeline visualization

## Out of Scope

Explicitly excluded for v1.5. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Desktop visual redesign | Desktop layout works; v1.5 only adds the horizontal-scroll overflow fallback to the inline nav — not a restyle |
| Restyling sections beyond responsive fixes | Bug-fix milestone, not a redesign |
| Changing the 768px phone/drawer boundary | Keep `md` (768px) as the phone→inline switch; NAV-05 adds scroll behavior at ≥`md` without moving the boundary |
| New nav sections or reordering | Navigation set is unchanged; only its responsive presentation changes |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01 | Phase 9 | Complete |
| NAV-02 | Phase 9 | In Progress (MobileDrawer unit-verified; Plan 02 wires hamburger) |
| NAV-03 | Phase 9 | Pending (Plan 02) |
| NAV-04 | Phase 9 | In Progress (toggles in drawer unit-verified; Plan 02 wires hamburger) |
| NAV-05 | Phase 9 | Pending (Plan 02) |
| A11Y-01 | Phase 9 | In Progress (useFocusTrap unit-verified; Plan 02 wires) |
| A11Y-02 | Phase 9 | In Progress (Esc + close + backdrop unit-verified; Plan 02 wires) |
| A11Y-03 | Phase 9 | In Progress (useScrollLock unit-verified; Plan 02 wires) |
| A11Y-04 | Phase 9 | In Progress (44px targets unit-verified; Plan 02 wires hamburger) |
| LAYOUT-01 | Phase 10 | Pending |
| LAYOUT-02 | Phase 10 | Pending |

**Coverage:**

- v1.5 requirements: 11 total
- Mapped to phases: 11 (Phase 9: 9, Phase 10: 2)
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-21*
*Last updated: 2026-06-21 — scope broadened to phone + tablet + desktop; added NAV-05 (scrollable inline-nav fallback); traceability filled (Phase 9: NAV-01..05, A11Y-01..04; Phase 10: LAYOUT-01..02)*

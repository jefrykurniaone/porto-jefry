# Requirements: porto-jefry — v1.5 Mobile Navigation & Layout Fixes

**Defined:** 2026-06-21
**Core Value:** A fast, accessible, bilingual portfolio that accurately represents Jefry's work and makes it easy for recruiters and collaborators to download his CV and reach him.

## v1.5 Requirements

Requirements for this milestone. Each maps to a roadmap phase.

### Mobile Navigation (NAV)

- [ ] **NAV-01**: Below the `md` breakpoint, the navbar shows only the brand and a hamburger button; the inline desktop nav links are hidden so they no longer overflow or get clipped
- [ ] **NAV-02**: Tapping the hamburger opens a right-side slide-in drawer that lists all 7 sections (About, Experience, Education, Skills, Projects, Certifications, Contact)
- [ ] **NAV-03**: Tapping a section in the drawer smooth-scrolls to it, updates the URL hash, and closes the drawer
- [ ] **NAV-04**: The theme toggle and the EN|ID language switch are available inside the drawer

### Drawer Accessibility (A11Y)

- [ ] **A11Y-01**: The drawer traps keyboard focus while open and restores focus to the hamburger button when closed
- [ ] **A11Y-02**: The drawer can be closed via the Esc key and via a visible close control or backdrop tap
- [ ] **A11Y-03**: Background page scrolling is locked while the drawer is open
- [ ] **A11Y-04**: The hamburger and drawer controls have accessible labels and ≥44px touch targets

### Hero & Mobile Layout (LAYOUT)

- [ ] **LAYOUT-01**: On mobile, the hero profile photo and content are fully visible below the fixed navbar at short viewport heights (no top clipping)
- [ ] **LAYOUT-02**: There is no horizontal page overflow on mobile widths (320–480px); content fits the viewport

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
| Desktop nav / layout redesign | Desktop view works; this milestone is mobile-only fixes |
| Restyling sections beyond mobile fixes | Out of scope — bug-fix milestone, not a redesign |
| Changing the `md` breakpoint value | Keep the existing 768px switch point for consistency with current responsive classes |
| New nav sections or reordering | Navigation set is unchanged; only its mobile presentation changes |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01 | TBD | Pending |
| NAV-02 | TBD | Pending |
| NAV-03 | TBD | Pending |
| NAV-04 | TBD | Pending |
| A11Y-01 | TBD | Pending |
| A11Y-02 | TBD | Pending |
| A11Y-03 | TBD | Pending |
| A11Y-04 | TBD | Pending |
| LAYOUT-01 | TBD | Pending |
| LAYOUT-02 | TBD | Pending |

**Coverage:**
- v1.5 requirements: 10 total
- Mapped to phases: 0 (set during roadmap creation)
- Unmapped: 10 ⚠️ (resolved by roadmapper)

---
*Requirements defined: 2026-06-21*
*Last updated: 2026-06-21 after initial definition*

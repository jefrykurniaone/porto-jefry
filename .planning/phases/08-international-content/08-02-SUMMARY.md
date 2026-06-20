---
phase: 08-international-content
plan: "02"
subsystem: i18n / content / data
tags: [content, i18n, education, projects, bilingual]
dependency_graph:
  requires: []
  provides:
    - "Education majors use idiomatic English (CONTENT-03)"
    - "Projects.tsx reads descriptions from i18n with missing-key guard (CONTENT-02 plumbing)"
  affects:
    - src/data/education.ts
    - src/components/sections/Education.tsx
    - src/components/sections/Projects.tsx
    - src/data/projects.ts
tech_stack:
  added: []
  patterns:
    - "next-intl useMessages() for dynamic-key i18n lookup with null-safe guard"
key_files:
  created: []
  modified:
    - src/data/education.ts
    - src/components/sections/Education.tsx
    - src/components/sections/Education.test.tsx
    - src/components/sections/Projects.tsx
    - src/data/projects.ts
    - src/components/sections/Projects.test.tsx
decisions:
  - "Use useMessages() raw access for dynamic project ID keys to avoid next-intl TypeScript strict-key constraint on t.has()"
  - "Degree labels shortened to 'Bachelor's' / 'Diploma' and separator changed from ' — ' to ' in ' to produce natural phrasing"
  - "description field removed from ProjectItem interface (field was never populated; i18n is now the sole source)"
metrics:
  duration: "~15 minutes"
  completed: "2026-06-20T16:51:18Z"
---

# Phase 08 Plan 02: International Content (Mechanical Slice) — Partial Summary

**One-liner:** Education majors corrected to idiomatic English and Projects.tsx plumbed to read descriptions from i18n with a missing-key guard — prose content deferred.

> **PARTIAL EXECUTION:** This summary covers only the mechanical sub-tasks executed in this slice.
> Plan 08-02 as a whole is NOT complete. See "Deferred" section below.

---

## What Was Done

### CONTENT-03 — Education idiomatic English (DONE)

**Commit:** `84805b7` — `feat(08-02): fix education majors to idiomatic English (CONTENT-03)`

- `src/data/education.ts`: Widyatama `major` changed from `'System Information'` to `'Information Systems'`; `degree` label changed from `"Bachelor's Degree"` to `"Bachelor's"`.
- `src/data/education.ts`: Telkom `major` changed from `'Informatic Management'` to `'Informatics Management'`; `degree` label changed from `'Diploma Degree'` to `'Diploma'`.
- `src/components/sections/Education.tsx`: separator between degree and major changed from ` — ` to ` in `, producing "Bachelor's in Information Systems" and "Diploma in Informatics Management" — matching the owner-supplied mapping in D-08-08.
- `src/components/sections/Education.test.tsx`: assertion updated from `/Bachelor.*?System Information/` to `/Bachelor.*?Information Systems/`.

### CONTENT-02 Plumbing — Projects.tsx reads descriptions from i18n (DONE)

**Commit:** `f4cbf71` — `feat(08-02): read project descriptions from i18n with missing-key guard (CONTENT-02)`

- `src/components/sections/Projects.tsx`: introduced `resolveProjectDescription()` helper that accesses the raw messages object via `useMessages()` and walks `messages.projects.items[id].description` with null-safe guards at every level. Returns `undefined` (not a throw) when any segment is absent. `ProjectCard` accepts an optional `description?: string` prop and renders the paragraph only when the value is defined and non-empty.
- `src/data/projects.ts`: removed `description?: string` from `ProjectItem` interface. The field was optional, never populated, and is now superseded by the i18n path.
- `src/components/sections/Projects.test.tsx`: replaced the `renders project descriptions when present` test (which accessed `p.description` on the data object) with `renders no project descriptions (none defined in i18n yet)` — asserting that zero description paragraphs are rendered when no i18n description keys exist, which is the correct current behavior.

---

## Deferred

The following items from plan 08-02 are explicitly NOT done in this slice and require a separate content pass:

| Item | Status | Reason |
|------|--------|--------|
| Task 1: Draft bilingual project descriptions for all 14 projects in en.json + id.json | DEFERRED | Out of scope — requires humanizer/voice decision (D-08-01) and owner review of drafted content |
| `projects.items.<id>.description` keys in en.json and id.json | DEFERRED | No description strings added; i18n files unchanged except parity |

The following items from plan 08-01 were not touched at all:
- CONTENT-01 prose rewrite (hero.*, about.description, experience.items.*.bullets, contact.description, certifications.coding_id.description) — DEFERRED pending humanizer skill decision

**Plan 08-02 as a whole is NOT marked complete.** STATE.md and ROADMAP.md were NOT modified by this slice.

---

## Deviations from Plan

None — plan executed exactly as scoped in the mechanical slice. Task ordering was adjusted (CONTENT-03 first for simpler staging) but no deviations were needed. No prose was modified; en.json and id.json are unchanged.

---

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes introduced. `useMessages()` reads static bundled messages — no new attack surface.

---

## Self-Check

| Item | Result |
|------|--------|
| `src/data/education.ts` major fields updated | FOUND |
| `src/components/sections/Education.tsx` separator updated | FOUND |
| `src/components/sections/Projects.tsx` resolveProjectDescription guard | FOUND |
| `src/data/projects.ts` description field removed | FOUND |
| Commit 84805b7 exists | FOUND |
| Commit f4cbf71 exists | FOUND |
| lint | PASS (0 issues) |
| typecheck | PASS (0 errors) |
| test | PASS (602/602) |
| build | PASS (8 static pages) |

## Self-Check: PASSED

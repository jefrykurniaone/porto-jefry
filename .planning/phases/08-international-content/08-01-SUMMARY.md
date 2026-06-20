---
phase: 08-international-content
plan: "01"
subsystem: i18n / content
tags: [content, i18n, humanizer, prose, bilingual]
dependency_graph:
  requires:
    - "08-02 mechanical slice (Projects.tsx i18n read + education fixes)"
  provides:
    - "Humanized EN/ID prose (CONTENT-01)"
    - "14 bilingual project descriptions (CONTENT-02 content)"
  affects:
    - src/i18n/messages/en.json
    - src/i18n/messages/id.json
    - src/components/sections/About.test.tsx
    - src/components/sections/Contact.test.tsx
    - src/components/sections/Experience.test.tsx
    - src/components/sections/Certifications.test.tsx
    - src/components/sections/Projects.test.tsx
tech_stack:
  added:
    - "blader/humanizer skill (free, prompt-based; replaces paid humanizerai/agent-skills@humanize)"
  patterns:
    - "Voice driven by Wikipedia 'Signs of AI writing' patterns: plain, concrete, first-person; no em/en dashes; no buzzword resume-speak"
key_files:
  created: []
  modified:
    - src/i18n/messages/en.json
    - src/i18n/messages/id.json
    - src/components/sections/About.test.tsx
    - src/components/sections/Contact.test.tsx
    - src/components/sections/Experience.test.tsx
    - src/components/sections/Certifications.test.tsx
    - src/components/sections/Projects.test.tsx
decisions:
  - "Humanizer swap: owner rejected the paid HumanizerAI API (needs HUMANIZERAI_API_KEY, spends credits, sends content to an external service, designed for AI-detector evasion). Installed free prompt-based blader/humanizer and uninstalled the paid skill."
  - "No [your number] placeholders inserted: they would render literally on the live site. Impact stays qualitative; owner can add real figures later (e.g. the nawa-2020 Katalon coverage bullet)."
  - "British spelling kept for consistency with existing copy and the SGDS/Singapore context (organisations, optimise, analyse)."
metrics:
  duration: "~1 session"
  completed: "2026-06-21"
---

# Phase 08 Plan 01: International Content — Prose Humanization + Project Descriptions

**One-liner:** Rewrote all portfolio prose in a natural, first-person, non-buzzword voice (CONTENT-01) and added 14 bilingual project descriptions (CONTENT-02 content), completing Phase 8.

---

## Humanizer skill decision

The phase context (D-08-01) assumed a humanizer skill would be installed via `find-skills`. The owner had installed `humanizerai/agent-skills@humanize`, but that skill is a **paid external API**: it needs `HUMANIZERAI_API_KEY` (not set), spends ~1 credit/word, sends content to humanizerai.com, and is built to bypass AI detectors — risky for truthful, bilingual, JSON-structured portfolio copy.

Per owner instruction, I found a free alternative, installed it, and removed the paid one:
- **Installed:** `blader/humanizer` (free, prompt-based, no API/credits; Gen/Socket/Snyk audits clean). Based on Wikipedia's "Signs of AI writing" guide.
- **Removed:** `humanizerai/agent-skills@humanize` (paid).

The new skill drove the rewrite *voice* (pattern checklist), not an external call.

## What Was Done

### CONTENT-01 — prose rewrite (EN + ID)

Rewritten in a plain, concrete, first-person voice with buzzword resume-speak removed:
- `hero.subtitle` — dropped the em dash and "growing passion" framing; concrete sector + tech.
- `about.description` — replaced "Results-driven… production-grade… high-performance… genuinely drive business value" with specific, first-person prose. **Remote/international availability signal added.**
- `contact.description` — natural, with a remote/abroad availability signal.
- `certifications.coding_id.description` — tightened, dropped "intensive".
- Every `experience.items.*.bullets` entry rewritten to concrete action statements; removed "seamless integration", "exceptional user experiences", duty-only filler. Array lengths and keys unchanged.

Constraints honoured: no fabricated metrics, no `[your number]` placeholders (would render literally), no em/en dashes in the rewritten prose, idiomatic Indonesian mirror (not literal).

### CONTENT-02 — 14 bilingual project descriptions

Added `projects.items.<id>.description` for all 14 projects in `en.json` + `id.json`, one concise sector-aware sentence each, drawn from name/company/tech. `Projects.tsx` already reads these through the `resolveProjectDescription` missing-key guard (from the 08-02 mechanical slice), so no component change was needed. This completes the item deferred in 08-02-SUMMARY.

### Tests

Updated copy-coupled assertions to the new strings: About, Contact, Experience, Certifications (EN + ID). Projects test changed from "renders no descriptions" to "renders a description for every project" (14) plus an exact-text check.

## Self-Check

| Item | Result |
|------|--------|
| Free humanizer installed; paid one removed | DONE |
| Prose rewritten (hero/about/contact/cert/all bullets) EN + ID | DONE |
| Availability signal in about + contact | DONE |
| No fabricated metrics; no `[your number]` rendered | DONE |
| 14 `projects.items.<id>.description` in EN + ID | DONE |
| No em/en dashes in rewritten prose | VERIFIED |
| EN/ID key parity (84/84 leaf keys) | OK |
| lint | PASS |
| typecheck | PASS |
| test | PASS (603/603) |
| build | PASS (8 static pages) |

## Owner verification needed

These are real client projects. The owner should confirm the drafted project descriptions and may add real metrics where useful (kept qualitative for now).

## Self-Check: PASSED

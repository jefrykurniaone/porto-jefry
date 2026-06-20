# Phase 8: International Content Overhaul - Context

**Gathered:** 2026-06-20
**Status:** Ready for planning/execution

<domain>
## Phase Boundary

Rewrite all user-facing prose so the portfolio reads as natural, specific, human writing aimed
at **international employers** — replacing the current buzzword-heavy resume-speak. Also: add
bilingual project descriptions (currently none render), signal remote/global availability, and
fix non-idiomatic education terms. All prose lives in `en.json` + `id.json`; data fixes in
`education.ts`; one component change in `Projects.tsx` to read descriptions from i18n.
</domain>

<decisions>
## Implementation Decisions

### Voice & humanizer
- **D-08-01:** Install a humanizer skill via `find-skills` FIRST, then use it to drive the
  rewrite voice. (No humanizer skill exists in the repo or current environment today.)
- **D-08-02:** Current tone is generic ("Results-driven", "high-performance", "seamless
  integration", "exceptional user experiences"). Target: plain, concrete, first-person — what
  was built, for whom, in which sectors.
- **D-08-03:** **No fabricated metrics.** Impact statements stay qualitative; insert explicit
  `[your number]` placeholders only where a real figure would clearly strengthen the line, for
  the owner to fill or drop.

### Scope of prose rewrite (CONTENT-01)
- **D-08-04:** Rewrite `hero.subtitle` (and tighten `hero.title` if helpful), `about.description`,
  every `experience.items.*.bullets[]`, `contact.description`, and
  `certifications.coding_id.description`.
- **D-08-05:** Add a clear **remote/international availability** signal in `about.description`
  and/or `contact.description` (the whole point of the milestone).

### Project descriptions (CONTENT-02)
- **D-08-06:** Projects currently have an optional `description` on the data object but none are
  populated, and `Projects.tsx` reads `project.description` (English-only). For bilingual
  support, move descriptions into i18n: add `projects.items.<id>.description` for all 14
  projects in both locales, and update `Projects.tsx` to read via
  `t('items.' + project.id + '.description')` with a missing-key guard.
- **D-08-07:** Descriptions are DRAFTED from name + company + sector (banking/insurance/gov/HR) +
  tech, and clearly flagged for owner verification (these are real client projects — the owner
  confirms facts).

### Education (CONTENT-03)
- **D-08-08:** Owner-supplied mapping: D3 **Manajemen Informatika** → "Diploma in Informatics
  Management"; S1 **Sistem Informasi** → "Bachelor's in Information Systems". Fix the `major`
  (and degree label where shown) fields in `src/data/education.ts`.

### Parity
- **D-08-09:** `en.json` and `id.json` must stay key-for-key parallel — `translations.test.ts`
  enforces this. Every EN change has a matching idiomatic Indonesian change.
</decisions>

<canonical_refs>
## Canonical References

- `.planning/ROADMAP.md` — Phase 8 goal + success criteria (CONTENT-01/02/03)
- `.planning/PROJECT.md` — bilingual constraint, 300/40-line limits, coverage thresholds
- `src/i18n/messages/en.json` + `id.json` — all prose; sections: hero, about, experience.items.*.bullets, contact, certifications, projects
- `src/i18n/messages/translations.test.ts` — key-parity guard
- `src/components/sections/Projects.tsx` — renders `project.description` if present (~lines 37-41); has `useTranslations('projects')` + `useLocale()`; iterates `projects` by `project.id`
- `src/data/projects.ts` — 14 projects, each with `id`, `name`, `company`, `period`, `tech[]`, optional `description`
- `src/data/education.ts` — `major` fields to fix (Telkom Diploma, Widyatama Bachelor's)
- `src/components/sections/About.tsx` / `Contact.tsx` — consume `about.description` / `contact.description`
- `find-skills` skill — to locate & install a humanizer skill
</canonical_refs>

<code_context>
## Existing Code Insights

- Project ids already exist and are stable slugs (e.g. `heritagesg-website-maintenance`,
  `rbbr-super-bank`) — ideal i18n keys for `projects.items.<id>.description`.
- `Projects.tsx` already imports `useTranslations('projects')`, so reading
  `t('items.<id>.description')` is a minimal change; next-intl throws on a missing key, so add a
  guard (e.g. check existence or wrap with a safe lookup) for any project without a description.
- The strongest existing bullets are under `nawa-2020` (names real clients Adira Insurance/BTPN,
  large-scale financial data, test-coverage improvements) — a good model for the rewrite voice.
- `about.description` is the single biggest prose block, rendered verbatim in `About.tsx`.
</code_context>

<specifics>
## Specific Ideas

- Keep claims truthful and verifiable; the owner reviews drafted project descriptions.
- The availability signal should feel natural, not a tacked-on "open to relocation" line.
- Mirror tone in Indonesian — idiomatic, not a literal translation of the English.
</specifics>

<deferred>
## Deferred Ideas

- Quantified metrics across all bullets — only where the owner provides real numbers (placeholders left in the meantime).
- A dedicated "Testimonials" or "Availability" section — tracked in v2 (FEAT-02).
</deferred>

---
*Phase: 8 — International Content Overhaul*
*Context gathered: 2026-06-20*

# Phase 7: Information Architecture - Context

**Gathered:** 2026-06-20
**Status:** Ready for planning/execution

<domain>
## Phase Boundary

A single information-architecture change: move the **GitHub link** from the Contact ("Get In Touch")
section to the About section. The owner wants GitHub surfaced alongside the other personal links
in About rather than buried in the contact grid. No content rewrite, no styling overhaul.
</domain>

<decisions>
## Implementation Decisions

- **D-07-01:** The GitHub URL stays defined exactly once in `src/data/contact.ts`
  (`CONTACT_GITHUB_URL`, `CONTACT_GITHUB_DISPLAY`, `CONTACT_GITHUB_HANDLE`). Only the rendering
  location moves.
- **D-07-02:** Remove the GitHub entry (4th object) from `buildContactLinks` in `Contact.tsx`,
  and remove the now-unused `GitHubIcon` + `CONTACT_GITHUB_*` imports there.
- **D-07-03:** The Contact grid drops 4→3 cards. Adjust the column width so 3 cards stay
  balanced (current cards use `sgds-col-lg-3`; widen to `sgds-col-lg-4` for a 3-up row).
- **D-07-04:** Add a GitHub link to `About.tsx`'s `AboutContactLinks` (which already renders
  Email/Phone/LinkedIn). Mirror the existing LinkedIn anchor pattern: import `GitHubIcon` and
  `CONTACT_GITHUB_URL`/`CONTACT_GITHUB_HANDLE`, add a `githubLabel` prop, render an `<a>` with
  the GitHub icon + handle, `target="_blank"`, `rel="noopener noreferrer"`.
- **D-07-05:** i18n label key moves namespaces: remove `contact.github_label`, add
  `about.contact_github` in BOTH `en.json` and `id.json` (key parity enforced by
  `src/i18n/messages/translations.test.ts`).
</decisions>

<canonical_refs>
## Canonical References

- `.planning/ROADMAP.md` — Phase 7 goal + success criteria (IA-01)
- `.planning/PROJECT.md` — EN/ID parity constraint, coverage thresholds
- `src/components/sections/Contact.tsx` — `buildContactLinks(t)` builds Email/Phone/LinkedIn/GitHub; GitHub is the 4th entry (~lines 77-83); grid uses `sgds-col-lg-3`
- `src/components/sections/About.tsx` — `AboutContactLinks` renders Email/Phone/LinkedIn; LinkedIn anchor (~lines 34-42) is the pattern to copy
- `src/data/contact.ts` — single source of truth for all contact constants
- `src/components/icons/GitHubIcon.tsx` — the icon to import into About
- `src/i18n/messages/en.json` + `id.json` — `contact.github_label` (remove) → `about.contact_github` (add)
- `src/components/sections/Contact.test.tsx` + `About.test.tsx` — assertions to update
- `src/i18n/messages/translations.test.ts` — key-parity guard
</canonical_refs>

<code_context>
## Existing Code Insights

- `About.tsx` `AboutContactLinks` already takes `emailLabel`/`phoneLabel`/`linkedinLabel` props and renders three `<a>` links in a `slot="footer"` flex group — adding a 4th GitHub anchor + `githubLabel` prop is a small, symmetric change.
- `Contact.tsx` imports `GitHubIcon` and `CONTACT_GITHUB_URL`/`CONTACT_GITHUB_DISPLAY` only for the GitHub card; removing the card means removing those imports to avoid unused-import lint errors.
- The existing LinkedIn anchor in About uses `CONTACT_LINKEDIN_HANDLE` as the visible text — mirror with `CONTACT_GITHUB_HANDLE` for consistency.
</code_context>

<specifics>
## Specific Ideas

- Keep the About link order natural: Email, Phone, LinkedIn, GitHub.
- Double-check no other file references `contact.github_label` before removing it (grep).
</specifics>

<deferred>
## Deferred Ideas

None — single, well-scoped change.
</deferred>

---
*Phase: 7 — Information Architecture*
*Context gathered: 2026-06-20*

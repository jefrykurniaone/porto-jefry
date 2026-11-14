# Spec — dependency upkeep: land the November Dependabot updates and record the tree

- **Spec issue**: [#135](https://github.com/jefrykurniaone/porto-jefry/issues/135)
- **Execution map**: [#140](https://github.com/jefrykurniaone/porto-jefry/issues/140)
- **Tickets**: [#139](https://github.com/jefrykurniaone/porto-jefry/issues/139) guidance refresh · Dependabot #128, #129, #130 landed by the orchestrator · tracking issue [#136](https://github.com/jefrykurniaone/porto-jefry/issues/136)
- **Run**: `upkeep-2026-11`
- **Version**: v1
- **As of**: 2026-11-14, `main` at `2a5743a`. A point-in-time copy of the spec item; the item is the one written copy, and delivery notes are written there first.

---

## Problem statement

The facts below hold as of 2026-11-14, with `main` at `2a5743a`.

As the site's owner, I want the dependency tree current and the repository's guidance to describe it truthfully. Three things stand in the way.

**Three Dependabot pull requests are green but cannot merge.** Each passes all six checks: the four required ones plus `Vercel` and `Vercel Preview Comments`. Each is marked `BEHIND`, because the "Protect main" ruleset requires a branch to contain the current `main` before it merges.

- **#128** bumps the `github-actions` group: `actions/checkout` 4 → 7, plus `actions/setup-node` and `SonarSource/sonarqube-scan-action`. It touches only the CI workflow.
- **#129** bumps the `next` group: `next` and `eslint-config-next` 16.4.1 → 16.4.6.
  - 16.4.5 carries security fixes.
  - 16.4.6 compresses route-handler responses automatically, which reaches the PDF CV endpoint.
  - The repository's guidance requires checking this group's preview, CV endpoint included, before merging.
- **#130** bumps the `minor-and-patch` group, nine packages:
  - `react` and `react-dom` 19.2.8 → 19.3.1, with their type packages;
  - `next-intl` 4.14.1 → 4.15.0;
  - `eslint-plugin-sonarjs` 4.2.0 → 4.2.2;
  - `postcss` 8.5.26 → 8.5.32;
  - `tailwindcss` and `@tailwindcss/postcss` 4.3.3 → 4.3.5.

Merging any one of them puts the others behind again. Updating a branch with the forge's update button adds the owner's merge commit to it, and Dependabot then stops maintaining that branch.

**One Dependabot alert stays open.** Alert #3 is `minimatch` GHSA-g3hv-75wg-m249: denial of service through globparts amplification, medium severity, development scope, affected range `>=7.0.0 <11.0.1`.

- `minimatch` 10.2.6 arrives through two parents:
  - `@typescript-eslint/typescript-estree` 8.69.0, under `typescript-eslint`, under `eslint-config-next`, which declares `^10.2.2`;
  - `eslint-plugin-sonarjs`, which declares `^10.2.6` in 4.2.2.
- Both upstreams have already moved to `minimatch` 11 on their main branches:
  - `typescript-eslint` merged its minimatch 11.0.1 update as PR #13145 on 2026-11-10, and its canary `8.72.3-alpha.8` declares `^11.0.1`. Its latest stable, 8.72.2 (2026-11-09), still declares `^10.2.2`.
  - SonarJS's repository pins `minimatch` 11.0.5 (PR #8360, 2026-11-11). Its latest plugin release, 4.2.2 (2026-09-28), still declares `^10.2.6`.
- The production audit reads zero. The full-tree audit lists only this chain.

**The guidance will be stale.** After these merges and the run's other two specs, the repository's guidance misstates:

- the `next` floor;
- the `postcss` and `sonarjs` versions, and the reasons given for each override;
- the state of the `minimatch` advisory;
- how fonts are loaded;
- the preview security policy;
- how to land Dependabot's monthly pull requests.

## Solution

The three Dependabot pull requests land one after another. Each is rebased by Dependabot itself and checked, and those that reach runtime are walked on their preview first. The `minimatch` alert is left to close through upstream releases rather than through an override, and a tracking issue owned by the site's owner carries its trigger. The guidance is then rewritten from measurements taken after every merge, and it records the monthly routine so that the next month's pull requests land the same way.

## Goals and non-goals

**Goals**

- #128, #129 and #130 are merged, each green on the current `main` and, where it reaches runtime, walked on its preview.
- The repository's guidance matches the tree after the run, measured rather than copied.
- Alert #3 has an owner, a trigger and written steps.

**Non-goals**

- Closing alert #3 within this run. The owner chose on 2026-11-14 to wait for upstream releases.
- Any override, downgrade or dismissal for `minimatch`.
- Automating Dependabot merges: auto-merge, a merge queue, or relaxing "up to date before merging".
- Removing an override that has stopped working. That is measured here and becomes its own issue.

## User stories

1. As the site's owner, I want each Dependabot pull request brought up to date by Dependabot itself, so that it keeps maintaining the branch.
2. As the site's owner, I want the pull requests merged in a fixed order — workflow, then `next`, then the rest — so that each lands on a `main` that already contains the ones before it.
3. As the site's owner, I want the `next` update walked on its preview, CV endpoint included, before it merges, so that a failure like the 16.2 `sharp` tracing break is caught before production.
4. As the site's owner, I want the React and next-intl update walked on its preview as well, so that a hydration or locale regression is caught before production.
5. As the site's owner, I want alert #3 tracked by one issue with its trigger, so that I know exactly when and how it closes.
6. As a later maintainer, I want the guidance's versions, floors and override reasons measured after the run, so that I can trust every figure in it.
7. As a later maintainer, I want the monthly Dependabot routine written down, so that the next month's pull requests land the same way.
8. As a later maintainer, I want an override that no longer changes the tree to be found and reported, so that it does not linger as an unexamined liability.

## Implementation decisions

- **Landing order: #128, then #129, then #130.** Each is merged with a squash, on the up-to-date tip, with all four required checks green.
  - *Why this order:* #128 touches only the workflow and no lockfile. #129 is the group the guidance singles out. #130 conflicts with #129 in the lockfile, and Dependabot resolves that when it rebases.
- **Branches are updated by commenting `@dependabot rebase`**, never with the forge's update button.
  - *Why:* the button adds the owner's merge commit, after which Dependabot no longer rebases or recreates the pull request.
- **Preview walks:**
  - #129 and #130 each get a walk on their rebased preview before merging. Both pages must render with zero console errors, and the CV endpoint must return a valid PDF in both locales.
  - #128 needs no walk: its own CI run, executed by the updated workflow, is its proof.
  - The walks come after the preview-toolbar spec has merged, so that a clean console is a valid requirement.
- **Alert #3 waits for upstream.**
  - The fix arrives in one of two ways once the latest stable releases of both parents declare `minimatch` `^11`:
    - a Dependabot security-update pull request;
    - an `npm update` that names `typescript-eslint`, `@typescript-eslint/typescript-estree` and `eslint-plugin-sonarjs`.
  - A tracking issue, owned by the site's owner and outside this run, carries that trigger and the steps.
  - *Why not a scoped override:* the owner chose on 2026-11-14 to wait for upstream releases rather than override them. Two facts are recorded so that the choice is not relitigated blind. Both parents call only `minimatch()`, `new Minimatch()` and `.match()`, all of which minimatch 11 keeps. An override would have had to be scoped to the two parents, because a top-level one would also force the version-3 copies under `eslint-plugin-import`, `eslint-plugin-react` and `eslint-plugin-jsx-a11y`.
  - The alert is never dismissed: a dismissed alert gets no security-update pull request.
- **The guidance is rewritten in one ticket, after every merge**, so that it is measured once against the final tree. It is docs-only.
  - Every figure is measured on the ticket's branch at writing time.
  - Each override is measured by comparing the resolved tree with and without it. One that no longer changes the tree is reported, and the orchestrator files a follow-up issue to remove it.
  - The guidance records the outcomes of the run's other two specs: self-hosted fonts and the preview-only policy.

## Testing decisions

The repository has no test suite.

- **S1: CI** on each Dependabot pull request's rebased tip, and on the guidance ticket's pull request.
- **S2: preview walks** for #129 and #130, driven by Playwright MCP for the pages and by Vercel MCP over plain HTTP for the CV endpoint, which yields a PDF rather than a page. The walker checks:
  - each response is `200` with `application/pdf`;
  - each body begins `%PDF` and ends `%%EOF`;
  - the deployment's runtime errors show nothing from the CV route.

  Prior art: map #120, wave 1.
- **Audit readings on `origin/main` after the last merge:**
  - the production audit exits 0;
  - the full-tree audit lists only the `minimatch` GHSA-g3hv-75wg-m249 chain.

## Success criteria

- [ ] #128, #129 and #130 are merged, in that order, each on an up-to-date tip with all four required checks green.
- [ ] #129's and #130's previews passed their walks before merging. The deployment ids and results are posted on the map.
- [ ] After the last merge, the production audit reads zero, and the full-tree audit lists only the `minimatch` chain.
- [ ] The guidance's versions, floors, override reasons, advisory state, font loading, preview policy and Dependabot routine match measurements taken after the merges.
- [ ] A tracking issue for alert #3 exists, carries the trigger and steps, and is assigned to the owner.
- [ ] Every override that no longer changes the tree has a follow-up issue.

## Out of scope

- Closing alert #3 in this run, and any override, downgrade or dismissal for it.
- Dependabot automation, merge queues, and changes to the ruleset.
- Removing or adding overrides; raising or lowering declared ranges by hand.
- `.github/dependabot.yml` changes.
- Any pull request Dependabot opens during the run other than #128, #129 and #130. Each is recorded on the map and left to the owner.

## Further notes

- Decided with the owner on 2026-11-14: wait for upstream on `minimatch` (option (b) of three); land the pull requests as above; one guidance ticket at the end; measure overrides and report rather than remove them.
- `typescript-eslint` has released on Mondays: 8.72.0 on 2026-10-19, 8.72.1 on 2026-10-26, 8.72.2 on 2026-11-09. The next stable release may be the first to accept `minimatch` 11. `eslint-plugin-sonarjs` has no release date.


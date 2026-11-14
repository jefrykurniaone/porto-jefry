# Spec — security baseline: clear the zod advisory, run Node 26, and gate dependencies

- **Spec issue**: [#113](https://github.com/jefrykurniaone/porto-jefry/issues/113)
- **Execution map**: [#120](https://github.com/jefrykurniaone/porto-jefry/issues/120)
- **Tickets**: [#114](https://github.com/jefrykurniaone/porto-jefry/issues/114) `@vercel/functions` floor · [#115](https://github.com/jefrykurniaone/porto-jefry/issues/115) dependency review · [#116](https://github.com/jefrykurniaone/porto-jefry/issues/116) Node 26 · [#117](https://github.com/jefrykurniaone/porto-jefry/issues/117) Dependabot version updates · [#118](https://github.com/jefrykurniaone/porto-jefry/issues/118) required checks · [#119](https://github.com/jefrykurniaone/porto-jefry/issues/119) guidance
- **Run**: `security-baseline`
- **Version**: v1
- **As of**: 2026-11-14, `main` at `615f263`. A point-in-time copy of the spec item; the item is the one written copy, and delivery notes are written there first.

---

## Problem statement

The facts below hold as of 2026-11-14, with `main` at `615f263`.

As the site's owner, I have switched on Dependabot alerts, Dependabot security updates and SonarQube Cloud. I still cannot rely on them to keep the site safe, for the following reasons.

- **A production dependency carries a high-severity advisory.**
  - `zod` 4.1.11 carries GHSA-mrhx-c7xc-m3w5: memory exhaustion while validating oversized constrained collections. The first patched version is 4.6.6.
  - It is pinned exactly by `@vercel/cli-config` 0.2.4. That package is reached through `@vercel/oidc` 3.8.5 from `@vercel/functions` 3.9.5, which the CV download route uses to read the caller's IP address.
  - Dependabot alert #2 has been open since 2026-11-01. Dependabot's security update failed that day with `security_update_not_possible`, because no release of `@vercel/functions` accepted a patched `zod` yet.
  - The production audit in CI fails on any severity. It is red on the current lockfile, so the next pull request of any kind fails it.
- **CI and the deployment run different Node.js majors.**
  - CI tests on Node 20, which reached end of life on 2026-04-30.
  - The package's engine range is the open `>=20.9.0`. Vercel deploys an open range on the latest major it offers. As of 2026-11-14 it offers 26.x (the default), 24.x and 22.x. Production therefore almost certainly runs Node 26, three majors from what CI tests.
  - The deployed major will move again, unannounced, the next time Vercel changes its default.
- **Nothing proposes routine updates.** There is no Dependabot version-update configuration. Packages and Actions age until an advisory forces a move. For example, the workflow still uses `actions/checkout` and `actions/setup-node` v4, while v7 is current.
- **Nothing reviews the dependencies a pull request adds.** The production audit sees only the production scope of the resulting tree. A pull request can bring in a vulnerable development tool without anyone noticing.
- **`main` requires one check only, `SonarQube Cloud`.** A pull request whose build job or production audit is red can still be merged.
- **Development-scoped alerts are dismissed automatically.** GitHub's preset auto-triage rule *Dismiss low impact issues for development-scoped dependencies* is on, which is the default for public repositories. It dismissed the `braces` alert on 2026-10-22. A dismissed alert receives no security-update pull request, yet that pull request is the fix path on the day a patch exists.
- **The repository guidance is stale on the full tree.**
  - It says the full tree carries `braces` (GHSA-vfj7-8cjw-p6xm). That advisory was **withdrawn** on 2026-10-23, although `braces` 3.0.3 is still in the lockfile.
  - It does not mention `minimatch` GHSA-g3hv-75wg-m249: moderate, denial of service, development-only, patched only in 11.0.1. The full tree now carries it through `typescript-eslint` and `eslint-plugin-sonarjs`. The latest release of each still requires `minimatch` ^10, so no upgrade path exists.

## Solution

From the owner's point of view, once this run is delivered:

- The production tree reads clean again.
- CI tests on the same Node major that serves the site, and that major is declared in exactly one place.
- Routine updates arrive as a few grouped pull requests a month. Framework updates arrive on their own, so they can be checked on a preview deployment before they merge. Major updates wait for the owner's decision.
- Every pull request is checked for the dependencies it adds or changes, development tools included.
- A pull request cannot merge unless lint, typecheck, build, the production audit, the dependency review and the SonarQube Cloud gate all pass on an up-to-date branch. The owner keeps an emergency bypass.
- The repository guidance records all of this, including the one development advisory that is knowingly accepted and the condition that ends that acceptance.

## Goals and non-goals

**Goals**

1. The production audit reads zero on the lockfile, and Dependabot alert #2 closes as fixed.
2. CI and the Vercel deployment run Node 26 from a single declaration.
3. Dependabot proposes version updates monthly, grouped, with major updates held for a person.
4. Every pull request runs a dependency review.
5. `main` requires four checks, with "up to date before merging" on.
6. The repository guidance states the whole policy and is accurate about the full tree.

**Non-goals**

- Fixing the `minimatch` advisory. It has no upgrade path, and an override is rejected below.
- Merging or reviewing the pull requests that Dependabot opens once version updates are configured. They are handed to the owner.
- Changing the production audit's scope (`--omit=dev`) or threshold (any severity).
- CodeQL, a scheduled audit, or a licence policy.
- Any change to the SonarQube Cloud configuration.

## User stories

1. As the site owner, I want the production dependency tree free of published advisories, so that no visitor request runs code with a known vulnerability.
2. As the site owner, I want the CV download to keep working after the dependency change, so that recruiters still receive the PDF.
3. As the site owner, I want CI to test on the same Node major that serves the site, so that a green build means the deployed runtime was tested.
4. As the site owner, I want the Node major declared once, so that CI and Vercel cannot drift apart again.
5. As the site owner, I want the deployed Node major to change only when I change it, so that a change of Vercel's default does not silently move my runtime.
6. As the site owner, I want routine minor and patch updates to arrive as one monthly pull request, so that updating is a single review rather than a stream.
7. As the site owner, I want updates to `next`, `eslint-config-next` and `sharp` in a pull request of their own, so that I can check the CV endpoint on its preview first. That pairing has broken production before in a way CI could not see.
8. As the site owner, I want major updates held back from the bot, so that a breaking change is always my decision.
9. As the site owner, I want the GitHub Actions my workflow uses updated monthly, majors included, so that the workflow does not run on deprecated action runtimes.
10. As the site owner, I want security updates to keep arriving for every open alert, so that the fix for an advisory arrives as a pull request rather than a manual hunt.
11. As a reviewer, I want the dependencies a pull request adds or changes checked against the advisory database, development tools included, so that a vulnerable tool cannot enter unreviewed.
12. As the site owner, I want a pull request blocked unless lint, typecheck, build, the production audit, the dependency review and the SonarQube Cloud gate all pass, so that a red check is never merged by accident.
13. As the site owner, I want branches brought up to date before merging, so that the checks that passed are the checks of what lands.
14. As the site owner, I want to keep my bypass of the ruleset, so that a newly published advisory with no fix cannot lock me out of my own repository.
15. As a future maintainer, human or agent, I want the guidance to say which development advisory is knowingly accepted, why, and what ends the acceptance, so that nobody adds a risky override to silence it.
16. As a future maintainer, I want the guidance to name the required checks exactly as GitHub records them, so that renaming a job does not silently detach it from protection.
17. As the site owner, I want development-scoped alerts to stay open rather than be auto-dismissed, so that Dependabot can open the fix pull request on the day a patch exists.
18. As the site owner, I want Dependabot's pull requests to pass the required checks without extra secrets, so that the bot needs no more access than it has today.

## Implementation decisions

**`zod`: raise the direct parent's floor.**

- `@vercel/functions` is declared at `^3.11.3`. Version 3.11.3 was published 2026-11-13. It reaches `@vercel/oidc` 4.0.9, which reaches `@vercel/cli-config` 0.4.0, which declares `zod` ^4.6.6.
- The guidance's remedy order is: a refreshed parent, then a raised declared range, then an override, then replacing or removing the dependency. A refreshed parent already resolves this advisory. The range is raised as well, so the lockfile can never resolve the vulnerable chain again. This follows the precedent of the `next` floor.
- Only `@vercel/functions` is moved, by name. No blanket refresh: `next` stays 16.4.1 and `sharp` stays 0.35.5. No override.
- The development copy of `zod` comes through `eslint-plugin-react-hooks`, which declares `^3.25.0 || ^4.0.0`. It is expected to deduplicate onto the patched version.
- *Rejected:* removing the dependency and reading the client IP header directly. It would delete the whole chain, but the remedy order puts removal last, and a refreshed parent is enough.

**Node 26 everywhere, declared once.**

- The package's engine range becomes the single major `26.x`. This is the form Vercel documents for pinning a major, and pinning stops a change of Vercel's default from moving the runtime.
- Every CI job that installs Node reads the version from that same declaration. `actions/setup-node` reads the package manifest's `engines.node` when pointed at it, so the workflow holds no second literal that could drift.
- Node type definitions move to `^26`. There is no `.nvmrc`.
- Why 26 rather than 24:
  - Production almost certainly already runs 26, so the deployed runtime does not change.
  - 26 has been Active LTS since 2026-10-28 and reaches end of life on 2029-04-30. Node 24 is in maintenance and ends on 2028-04-30.
  - No server-side code calls `fetch`, so the Node 26 change to `fetch` behaviour that Vercel documents does not apply.
- A probe on 2026-11-14 ran lint, typecheck and build on Node 26.13.1 with `@types/node` 26.6.6. All three were green with no source change.

**Dependabot version updates.**

- Two ecosystems, `npm` and `github-actions`, both on a monthly schedule, with commit messages prefixed `chore(deps)`.
- **npm.**
  - The group `next` (`next`, `eslint-config-next`, `sharp`) comes first. The group `minor-and-patch` (everything else) comes second.
  - Both groups apply to version updates only, and to minor and patch updates only.
  - Every major update is ignored for version updates.
  - Order matters: a dependency that matches several groups joins the first one it matches.
- **github-actions.** One group, with majors not ignored. Actions are referenced by major tag, so only a major update moves them.
- **Security updates.** They stay ungrouped and are unaffected by the ignore rule. Per GitHub's documentation, `update-types` filters version updates only, and security updates are always created.
- No package is held back by an architecture decision here, unlike the ADR-gated packages in `inventaris-aset-ppm`.

Trimmed prototype of the npm grouping (the decision, not the file):

```yaml
groups:
  next:                # first: a dependency joins the first group it matches
    applies-to: version-updates
    patterns: [next, eslint-config-next, sharp]
    update-types: [minor, patch]
  minor-and-patch:
    applies-to: version-updates
    patterns: ["*"]
    exclude-patterns: [next, eslint-config-next, sharp]
    update-types: [minor, patch]
ignore:
  - dependency-name: "*"
    update-types: [version-update:semver-major]
```

**Dependency review as a fourth CI job.**

- It goes in the existing CI workflow, not in a new one. The production audit is already a separate job with no `needs`, so the reason `inventaris-aset-ppm` gave its audit a workflow of its own does not apply here: a red audit there used to skip other jobs.
- Settings:
  - `actions/dependency-review-action` v5, referenced by major tag like the other `actions/*`.
  - Pull requests only.
  - `fail-on-severity: high` across the `runtime` and `development` scopes. The action's default is `runtime` alone, which would let a vulnerable dev tool in unreviewed.
  - `comment-summary-in-pr: never`. Any other value needs `pull-requests: write`, so with `never` the job keeps `contents: read`.
  - Display name `Review dependency changes`.
- It judges only what a pull request adds or changes, so the accepted `minimatch` chain does not trip it unless a pull request moves `minimatch`.

**Required checks on `main`.**

- The ruleset "Protect main" requires four checks, listed by job display name and all from GitHub Actions:
  - `Lint, Typecheck, Build`
  - `Production dependency audit`
  - `Review dependency changes`
  - `SonarQube Cloud`
- "Require branches to be up to date before merging" is on. The owner's bypass is unchanged. No other rule in the ruleset changes.
- Renaming any of these jobs silently detaches it from protection, and the guidance says so.
- The dependency review is skipped on pushes to `main`. A skipped job reports as passing, which is acceptable because a push to `main` is already past review.
- On Dependabot's pull requests, the SonarQube Cloud job takes its documented skip path, because Dependabot cannot read Actions secrets, and reports success. This is accepted, as in `inventaris-aset-ppm`. The analysis on the push to `main` still covers what they change. `SONAR_TOKEN` is not added to Dependabot secrets.

**`minimatch` is accepted, and its alert is not dismissed.**

- GHSA-g3hv-75wg-m249 is development-only. It is a denial of service triggered by attacker-controlled glob patterns, and every pattern here comes from the repository's own ESLint and TypeScript configuration.
- No override. Forcing major 11 under parents that require ^10 risks breaking lint.
- **Removal condition:** a release of `typescript-eslint` and of `eslint-plugin-sonarjs` that accepts `minimatch` ≥ 11.0.1. Dependabot proposes it on its own.
- As of 2026-11-14 this repository has no Dependabot alert for it yet. If one appears, it is not dismissed.

**The auto-triage preset is switched off by the owner.** Switching it off is a repository setting in the web interface with no API, so it is a step handed to the owner after the run. The guidance records why it is off.

**The policy lives in the repository guidance.** As before, it is written in the agent and contributor guidance file, not in a new series of architecture decision records.

## Testing decisions

There is no test suite. It was removed in #43. Every seam is a system-level observation of external behaviour:

- **S1: lockfile audit.** `npm audit` read from the lockfile only, in production scope (blocking) and full tree (report).
  - *Catches:* any production advisory, and any change to the accepted development set.
  - *Misses:* anything about runtime behaviour.
- **S2: the completion gate on Node 26.** Install, lint, typecheck and build, locally and in CI.
  - *Catches:* type and build regressions on the new runtime and the new type definitions.
  - *Misses:* failures that only exist in the deployed function bundle, the class of the Next.js 16.2 `sharp` incident.
- **S3: the deployed function.**
  - Through Vercel's MCP server, on the pull request's preview deployment and then on production:
    - `GET /api/generate-cv?locale=en` and `?locale=id` return `200`, `application/pdf`, and a complete document (`%PDF` … `%%EOF`);
    - the runtime log shows no error from that route;
    - the build log shows Node 26.
  - Through Playwright MCP, `/en` and `/id` render with no console error.
  - *Catches:* deployment-only breakage from moving `@vercel/functions` or the Node major.
  - *Misses:* nothing in scope. It needs the Vercel MCP server to be authenticated in the executing session.
- **S4: GitHub configuration, read through `gh api`.**
  - The ruleset's required contexts and strict flag.
  - The "Dependabot Updates" workflow runs after the version-update configuration lands.
  - The required checks a later pull request actually shows.
  - *Catches:* a misconfigured ruleset or Dependabot configuration.
  - *Misses:* auto-triage behaviour, which only shows when the next advisory arrives.

**Prior art:** run `vuln-gate` (spec #101, map #104) drove the same preview CV check through Vercel's MCP server (`list_deployments`, `web_fetch_vercel_url`, `get_runtime_errors`).

## Success criteria

- On `main`, `npm audit --omit=dev --audit-level=low --package-lock-only` exits 0.
- `npm audit --package-lock-only` lists only the `minimatch` GHSA-g3hv-75wg-m249 chain.
- Dependabot alert #2 reads `fixed`.
- The lockfile holds no `zod` below 4.6.6. `next` is 16.4.1 and `sharp` is 0.35.5.
- The package declares `engines.node` `26.x` and `@types/node` `^26`. The workflow holds no Node version literal. Every CI job that sets up Node logs a 26.x version.
- S3 passes on the preview of each runtime-affecting change and on production. The production build log shows Node 26.
- Once the version-update configuration is on `main`, the "Dependabot Updates" workflow runs version-update jobs for `npm` and `github-actions` without a configuration error.
- A pull request shows `Review dependency changes` as a check, and it passes.
- The ruleset lists the four contexts with strict on and the bypass unchanged. The run's last pull request shows all four as required.
- The repository guidance describes:
  - the four CI jobs and the four required checks, by name;
  - Node 26 and its single declaration;
  - the Dependabot configuration and why `next` is grouped alone;
  - the `@vercel/functions` floor;
  - the accepted `minimatch` advisory and its removal condition;
  - the withdrawn `braces` advisory;
  - the auto-triage preset;
  - the SonarQube Cloud skip on Dependabot pull requests.

## Out of scope

- Merging, reviewing or rebasing the pull requests Dependabot opens once version updates are configured. They are recorded on the map and handed to the owner.
- Any override, downgrade or dismissal for `minimatch` or any other advisory.
- Changing the production audit's scope or threshold. CodeQL, a scheduled audit, a licence policy.
- SonarQube Cloud configuration. Adding `SONAR_TOKEN` to Dependabot secrets.
- Bumping Actions versions by hand. Dependabot's `github-actions` pull request does that. Pinning Actions by commit SHA.
- `next` beyond 16.4.1, any change to `sharp`, and any blanket in-range refresh of the tree.
- Any change to application source.
- The owner's local default Node alias.

## Further notes

- **Prior art:** `inventaris-aset-ppm` ADR 0008 and its 2026-11-14 amendment. This spec mirrors it where the two repositories agree, and departs from it in four places:
  - the audit stays in the CI workflow;
  - the audit threshold stays at any severity rather than `high`;
  - no package is gated by an architecture decision;
  - `next`, `eslint-config-next` and `sharp` get a version-update group of their own.
- **Owner steps before the run:** authenticate the Vercel MCP server (`/mcp`) in the session that runs `/orchestrate`. It was added to this project's local Claude Code configuration on 2026-11-14.
- **Owner steps after the run:**
  - switch off the auto-triage preset;
  - watch the repository with *Custom → Security alerts* (email for Dependabot alerts is an account setting and was switched on 2026-11-14);
  - handle Dependabot's first version-update pull requests;
  - optionally, make Node 26 the local default.
- **Local runtime:** Node 26.13.1 was installed through nvm on 2026-11-14. The nvm default stays 24, so the run's sessions select 26 explicitly.


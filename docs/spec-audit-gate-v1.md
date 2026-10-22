# Spec — patch production advisories and gate them in CI

- **Spec issue**: [#101](https://github.com/jefrykurniaone/porto-jefry/issues/101)
- **Execution map**: [#104](https://github.com/jefrykurniaone/porto-jefry/issues/104)
- **Tickets**: [#102](https://github.com/jefrykurniaone/porto-jefry/issues/102) version move · [#103](https://github.com/jefrykurniaone/porto-jefry/issues/103) CI audit job
- **Run**: `vuln-gate`
- **Version**: v1
- **As of**: 2026-10-23, `main` at `a45fd01`. A point-in-time copy of the spec item; the item is the one written copy, and delivery notes are written there first.

---

## Problem statement

As of 2026-10-23, `npm audit` read from `main`'s lockfile (commit `a45fd01`) reports nine vulnerable packages: one critical and eight high, counted by package. Three of them ship to production:

- `next` 16.3.4 carries seven advisories. They include GHSA-vcvr-r3jv-pc5j (critical, remote code execution in `next/og` `ImageResponse`), GHSA-cjq9-62q9-8jv4 (high, server-side request forgery in Image Optimization), four moderates, and GHSA-39w2-rjm5-chcv (low, information disclosure from the development server's MCP endpoint). All seven are closed in 16.3.8.
- `sharp` 0.35.4 carries GHSA-wq5f-xc86-pv6w (high, an upstream librsvg memory bug that can lead to remote code execution on glibc Linux). It is closed in 0.35.5.
- `source-map-js` 1.2.1, reached through PostCSS, carries GHSA-68fv-2mgg-jv7q (high, event-loop denial of service). It is closed in 1.2.2.

The rest sits only in lint tooling:

- `brace-expansion` 1.1.18 and 5.0.9 carry three denial-of-service advisories. Patched versions exist inside the ranges their parents already declare.
- `braces` 3.0.3 carries GHSA-vfj7-8cjw-p6xm (high, stack-exhaustion denial of service). It is reached through the Next.js ESLint config, its ESLint plugin, `fast-glob` and `micromatch`, which is why the audit also lists those four. **No patched version of `braces` has been published.**

As measured on 2026-10-23, none of the production advisories is reachable from attacker input in the current code:

- the site does not use `next/og`;
- it configures no remote image patterns;
- the locale route is rendered per request, built by Turbopack and deployed on Vercel;
- `sharp` only ever reads images the repository itself owns.

The one exception is the low-severity development-server advisory. A malicious website the developer visits while `next dev` is running can read project data from that endpoint.

The audit read zero on 2026-09-01, when the dep-health run closed (PR #62). Every advisory above was published between 2026-09-18 and 2026-10-07, and nothing noticed:

- CI runs lint, typecheck and build only.
- Dependabot alerts are disabled on the repository.
- The dep-health run (map #57) put CI-based advisory monitoring explicitly out of scope. This spec reverses that decision.

From the owner's perspective: the site's dependencies drift into known-vulnerable versions silently, and the first signal is someone running `npm audit` by hand.

## Solution

The production dependencies move to patched versions. From then on, CI fails whenever a production dependency carries an open advisory of any severity. Between pull requests, GitHub alerts the owner and opens a fix pull request when a new advisory lands.

## Goals and non-goals

Goals:

- The production-only audit reads zero on `main`.
- A dedicated `audit` check fails on every pull request to `main` and every push to `main` while any production dependency carries an advisory of any severity.
- Advisories in development-only dependencies are printed in the CI log but never fail the check.
- Dependabot alerts and Dependabot security updates are enabled on the repository.
- The repository guidance describes:
  - the gate;
  - the new dependency floors;
  - what to do when a production advisory has no patch.

Non-goals:

- A full-tree audit of zero. `braces` has no patch, so it stays, and it is documented.
- Catching advisories published while no pull request is open through CI itself. No scheduled run is added; Dependabot owns that case.
- Moving to Next.js 16.4.
- Scanning the project's own source code.

## User stories

1. As the site owner, I want the production dependencies patched against the advisories published since 2026-09-01, so that the deployed site does not run known-vulnerable versions.
2. As the site owner, I want a pull request that introduces or keeps a vulnerable production dependency to fail CI, so that I cannot merge it without knowing.
3. As the site owner, I want the audit to be its own status check, so that a red audit is never confused with a red build.
4. As the site owner, I want the audit check to finish in seconds without installing dependencies, so that it adds no meaningful time to CI.
5. As the site owner, I want development-only advisories printed in the CI log, so that they stay visible without blocking unrelated work.
6. As the site owner, I want GitHub to alert me and open a fix pull request when a new advisory affects the repository between pull requests, so that drift is caught without anyone running `npm audit` by hand.
7. As a maintainer or agent reading the repository guidance, I want the gate's scope, the dependency floors and the procedure for an unpatched production advisory written down, so that I neither weaken the gate nor downgrade below a floor under pressure.
8. As the site owner, I want the CV PDF endpoint still working after the version move, so that this change does not repeat the Next.js 16.2 native-module outage that only showed up in production.

## Implementation decisions

**Versions.**

- `next` and `eslint-config-next` resolve to exactly 16.3.8 in the lockfile, and `sharp` to 0.35.5.
- The declared ranges in the manifest rise to `^16.3.8` and `^0.35.5`. The manifest states the security floor, and the lockfile pins the patch.
- Why 16.3.8: it is the smallest release that closes all seven `next` advisories. Moving to 16.4 is a separate decision with its own risk.

**Transitive patches.**

- `source-map-js` moves to 1.2.2, and `brace-expansion` to 1.1.21 and 5.0.12. Both are refreshed within the ranges their parents already declare.
- No blanket refresh of the whole tree. Under the new caret range it would pull `next` 16.4.x, contradicting the version decision.
- No new override, and the existing overrides (`postcss: "$postcss"` and the three `@emnapi/*` pins) are unchanged.
- Why: this follows the repository's remedy order. First a refreshed parent, then the project's own declared range, and an override only as the last resort.

**`braces` (GHSA-vfj7-8cjw-p6xm) is accepted.**

- It is development-only, unreachable by attacker input (its inputs are the project's own lint globs), and has no patched version as of 2026-10-23.
- It is not suppressed anywhere. The gate's scope excludes it by design.
- The fix that `npm audit` offers, `eslint-config-next` 14.2.35, is a major downgrade and is rejected.

**The gate.**

- A new job named `audit` in the existing CI workflow. It has the same triggers as the existing job (pull requests to `main`, pushes to `main`) and runs in parallel with it. It reads the lockfile only and never installs dependencies.
- Its blocking command:

  ```
  npm audit --omit=dev --audit-level=low --package-lock-only
  ```

- A second, report-only command audits the full tree of the same lockfile. Its failure never fails the job.
- Both commands run whatever the other's outcome. The job's result is the blocking command's result.
- Why production-only: only production dependencies ship to Vercel. A blocking full-tree gate would need an exception mechanism for `braces`. An exception list is a standing liability of the same kind the repository already removed overrides for: it freezes a decision that nothing re-checks.
- Why `low`: the gate fails on any severity. Four of `next`'s advisories were moderate and were closed by the same patch. A `high` threshold would have let them pass unseen.
- Why no schedule: the owner chose pull-request and push triggers only. Dependabot covers drift between pull requests.

**When a production advisory has no patch.**

- The gate is not weakened in advance.
- The owner measures whether the advisory is reachable, then takes the least-binding remedy available, in this order:
  1. a refreshed parent;
  2. a raised declared range;
  3. an override;
  4. replacing or removing the dependency.
- Any exception is a deliberate, recorded decision made at that time. It is never a mechanism built ahead of need.

**Dependabot.**

- Alerts and automated security fixes are enabled through GitHub's REST API by the orchestrator.
- This happens after the version move has merged, so that Dependabot does not open duplicate pull requests for `next` and `sharp`.
- No version-update configuration is added. Only security updates were requested.

**Guidance.** The repository guidance changes in two places:

- **The CI description**: the audit job, its scope and threshold, and the unpatched-advisory procedure.
- **The dependency-overrides section**:
  - the floors `next` ≥ 16.3.8 and `sharp` ≥ 0.35.5;
  - the version citations that the move makes stale;
  - a corrected claim about what the audit reads;
  - the `braces` note, dated.

## Testing decisions

The repository has no test suite. A good test here observes external behaviour only: exit codes, check status on a pull request, HTTP status and content type of the deployed endpoint, and GitHub API responses.

| Seam | What it catches | What it misses |
|---|---|---|
| S1 — the blocking audit command, run both ways: it must exit 0 on the new lockfile and **non-zero on `main`'s lockfile at `a45fd01`** | Any open production advisory, and whether the gate actually bites | Functional breakage from the version move |
| S2 — the standing gate (lint, typecheck, build), plus both spellings of `backdrop-filter` in the built CSS | Compile and build regressions, CSS bundling regressions | A native module failing to load at runtime |
| S3 — the GitHub Actions run on the pull request: an `audit` check appears on its own and passes, and its log carries the full-tree report showing `braces` without failing the job | Workflow syntax, wrong flags, a job that never triggers | Anything about the application |
| S4 — HTTP against the **preview** deployment, through Vercel's MCP because previews are SSO-protected: `/api/generate-cv?locale=en` and `?locale=id` return `200` with `application/pdf` | The sharp / libvips class of failure that only a deployment shows | Production-only differences (same artifact, different domain) |
| S5 — the GitHub API: vulnerability alerts answer `204`, and automated security fixes report enabled | Dependabot actually switched on | Whether Dependabot opens a pull request, which only a future advisory shows |

Prior art: the dep-health run (map #57) checked the CV endpoint against both the preview and the production deployment of its version move.

## Success criteria

- On `main` after the run, the blocking audit command exits 0. Against `main`'s lockfile at `a45fd01` it exits non-zero.
- The full-tree audit on `main` after the run reports only GHSA-vfj7-8cjw-p6xm (`braces`, and the four packages listed through it).
- `next` and `eslint-config-next` resolve to 16.3.8, and `sharp` to 0.35.5, with exactly one copy of `sharp`. The manifest declares `^16.3.8` and `^0.35.5`, and the overrides block is unchanged.
- The pull request carrying the CI change shows a separate `audit` check that passes, and its log contains the full-tree report.
- On the preview deployment of the version-move pull request, `/api/generate-cv?locale=en` and `?locale=id` each return `200` with content type `application/pdf`.
- The repository's vulnerability-alerts endpoint returns `204`, and automated security fixes report `enabled: true`.
- The repository guidance on `main`:
  - describes the audit job, its scope and its threshold;
  - states the floors `next` ≥ 16.3.8 and `sharp` ≥ 0.35.5;
  - records the `braces` exception with its date;
  - states the unpatched-advisory procedure;
  - no longer claims the full audit reads zero.
- Lint, typecheck and build pass on `main`.

## Out of scope

- Moving to Next.js 16.4.
- Code scanning (CodeQL), the dependency-review action, a scheduled workflow, and Dependabot version-update configuration.
- Branch protection or required status checks on `main`.
- Moving CI off Node 20, which is end-of-life (Vercel already runs the site on 24.x).
- Pinning GitHub Actions by commit SHA, and workflow `permissions:` hardening.
- Fixing `braces`, adding any override, or downgrading `eslint-config-next`.
- `sharp` below 0.35.5 under any circumstances.
- The `feat/redesign` branch and map #82. The owner cancelled the redesign on 2026-10-23. Deleting the branch and closing #82 are separate decisions and are not part of this run.

## Further notes

- Every audit in this run is read from the lockfile (`--package-lock-only`), never from the installed tree. The maintainer's local `node_modules` has been observed stale against the lockfile before.
- When `braces` publishes a patch, an in-range refresh should clear it. The report-only step is where that becomes visible.
- Dependabot security pull requests will target `main` and run the new `audit` job like any other pull request.

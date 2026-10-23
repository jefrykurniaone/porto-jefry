# SonarQube Cloud analysis

How static analysis runs on this repository, and the things about it that are not obvious.

Configuration lives in [`sonar-project.properties`](../sonar-project.properties) and in the `sonar`
job of [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

| | |
|---|---|
| Organization | `jefry-kurniawan` |
| Project key | `jefrykurniaone_porto-jefry` |
| Dashboard | <https://sonarcloud.io/dashboard?id=jefrykurniaone_porto-jefry> |
| Action | `SonarSource/sonarqube-scan-action`, pinned to the commit for `v8.3.0` |
| Secret | `SONAR_TOKEN`, in the repository's Actions secrets |
| Quality gate | `Sonar way`, measured on new code; `sonar.qualitygate.wait=true` turns a failed gate into a red job |

## `SONAR_TOKEN` does not go in `.env.local`

**GitHub, repository, Settings, Secrets and variables, Actions, New repository secret**, named
exactly `SONAR_TOKEN`. Nowhere else. Generate the value at SonarQube Cloud under My Account, Security,
or from the project's own Analysis Method page.

`.env.local` is read by the application on a developer machine, and Vercel's environment variables by
the deployment. `SONAR_TOKEN` is read by a GitHub Actions runner, which sees neither. It is never
committed, never prefixed `NEXT_PUBLIC_`, and never pasted into an issue, a pull request or a chat
transcript. If it leaks, revoke it in SonarQube Cloud and generate a new one: it grants analysis
access to every project in the organization.

## Automatic Analysis must stay off

SonarQube Cloud turns Automatic Analysis on for a newly imported project, and it **cannot coexist
with CI-based analysis**: with both on, the `Analyse` step fails with a message about the project
already being analysed automatically, which does not name the setting to change. It is a project
setting in the web interface (Administration, Analysis Method), so nothing in this repository can
express or enforce it.

If `Analyse` starts failing with nothing in the diff to explain it, check that setting first.

## No coverage report

The test suite was removed in #43, so the `sonar` job sends no coverage report and has no `npm ci`
step.

A missing report does not switch the coverage condition off. Sonar cannot tell "not instrumented"
from "not covered", and it still counts every changed JavaScript and TypeScript line as uncovered:
PR #112 failed the gate at 0.0% coverage on new code the first time it touched a script.
`sonar.coverage.exclusions=**/*` therefore takes every file out of coverage scope, because nothing is
instrumented.

If tests come back, narrow that line to what the test runner does not instrument, produce the
coverage report in the `ci` job and hand it to `sonar` as an artifact, as `inventaris-aset-ppm` does,
so that `SONAR_TOKEN` never enters a job that runs third-party install scripts.

## The editor and the server do not report the same things

Neither SonarLint in the editor, the `eslint-plugin-sonarjs` rules in `npm run lint`, nor SonarQube
Cloud is a superset of the others. Every `githubactions:*` rule is server-only, because neither local
tool analyses workflow files; that is why `sonar.sources` is `.` rather than `src`.

**CI is the authority.** An empty diagnostics result from the editor proves nothing either way: it is
the same for a clean file and for a file the editor has never opened.

## The scan is skipped, not failed, without a token

`HAS_SONAR_TOKEN` is derived from the secret in a job-level `env` expression, which may read
`secrets` where a step-level `if` may not. Without the secret the workflow stays green and emits a
warning that the commit was not analysed. A pull request from a fork always takes this path, because
secrets are not exposed to it. A green CI run is therefore **not** proof that analysis happened:
check the `Analyse` step.

## Setting it up again from scratch

1. Create the project on SonarQube Cloud and bind it to the GitHub repository.
2. **Turn Automatic Analysis off.**
3. Generate a token and add it as the `SONAR_TOKEN` Actions secret.
4. Confirm `sonar.organization` and `sonar.projectKey` in `sonar-project.properties` match the new
   project. The project key is visible in the dashboard URL.

# Spec — emnapi overrides: remove the three @emnapi pins

- **Spec issue**: [#150](https://github.com/jefrykurniaone/porto-jefry/issues/150)
- **Execution map**: [#153](https://github.com/jefrykurniaone/porto-jefry/issues/153)
- **Tickets**: [#152](https://github.com/jefrykurniaone/porto-jefry/issues/152) remove the overrides and record the removal · source issues [#145](https://github.com/jefrykurniaone/porto-jefry/issues/145), [#146](https://github.com/jefrykurniaone/porto-jefry/issues/146)
- **Run**: `followups-2026-11`
- **Version**: v1
- **As of**: 2026-11-14, `main` at `04c953f`. A point-in-time copy of the spec item; the item is the one written copy, and delivery notes are written there first.

---

## Problem statement

The facts below hold as of 2026-11-14, with `main` at `04c953f`, measured under Node 26.13.1 and npm 11.20.0 on scratch copies of the manifest and the lockfile.

As the site's owner, I want every override in the package manifest to earn its place, and none to hold a dependency outside the range its consumer declares.

The manifest's overrides pin three packages of the WebAssembly fallback runtime: `@emnapi/core` at `1.11.0`, `@emnapi/runtime` at `1.11.0` and `@emnapi/wasi-threads` at `1.2.2`. They arrived on 2026-06-09 with #26 (commit `54b6ad3`), whose message gives the only recorded reason: "deterministic @emnapi/* lockfile pinning so CI npm ci stays in sync across platforms".

Today they do two kinds of harm and no measured good.

- **#145: the `@emnapi/wasi-threads` pin changes nothing.** Its only dependent outside a bundle, the root `@emnapi/core@1.11.0`, declares exactly `1.2.2`. Removing that pin alone leaves the lockfile byte-identical.
- **#146: the pins force three edges outside their declared ranges, not the one #146 recorded.**
  - `@img/sharp-wasm32@0.35.5` declares `@emnapi/runtime` `^1.11.3`, and resolves `1.11.0`.
  - `@unrs/resolver-binding-wasm32-wasi@1.12.2` declares `@emnapi/core` exactly `1.10.0`, and resolves `1.11.0`.
  - The same package declares `@emnapi/runtime` exactly `1.10.0`, and resolves `1.11.0`.
- **The recorded reason no longer holds.** With all three pins removed and the lockfile refreshed, `npm ci --dry-run` reports the lockfile in sync with `--os` set to linux, win32 and darwin. A control copy that is deliberately out of sync fails the same check on all three, so the check does run.

Every package involved is a `cpu: wasm32` fallback, sharp's, the lint resolver's and Tailwind's, and no environment this project runs in installs one: not CI, not Vercel, not the owner's machine. The risk is latent, and so is the cost of removing the pins. The repository's guidance describes all three pins as in force, and two of them as still doing work.

The options measured, with bundled copies excluded and the `postcss` override unchanged in every row:

| Option | `@emnapi` overrides left | Copies npm resolves | Edges outside their declared range | `npm ci` in sync on linux, win32, darwin |
|---|---|---|---|---|
| Today | 3 | 3 | 3 | yes |
| **Remove all three (chosen)** | **0** | 7 | **0** | yes |
| Raise `core` and `runtime` to `1.11.3`, remove `wasi-threads` | 2 | 3 | 2, both on `@unrs/resolver-binding-wasm32-wasi` | yes |
| Remove `wasi-threads` only | 2 | 3 | 3 | yes |
| Remove `wasi-threads` and `runtime` | 1 | 5 | 1 | yes |

## Solution

The three `@emnapi` entries leave the overrides, and npm resolves each consumer's declared version on its own. The lockfile gains four small copies that only a wasm32 platform would install, and loses every edge forced outside its range. The repository's guidance records the three pins as removed, with the reason they were added and the measurement that retired it, as it already does for the overrides removed before them. `postcss` remains the only override.

## Goals and non-goals

**Goals**

- No `@emnapi` override remains, and every `@emnapi` edge in the lockfile is inside its declared range.
- The lockfile stays in sync for `npm ci` on linux, win32 and darwin.
- The production audit still reads zero, and the deployed CV endpoint still returns a PDF in both locales.
- The repository's guidance describes the result, measured rather than copied.
- #145 and #146 close.

**Non-goals**

- Touching the `postcss` override.
- Collapsing the duplicate `@emnapi` copies by any other means.
- Moving any other locked version. The refresh changes only `@emnapi` entries.
- Anything about #136, the `minimatch` advisory.

## User stories

1. As the site's owner, I want no override that does no work, so that nothing holds a version silently.
2. As the site's owner, I want no override that forces a consumer outside its declared range, so that a fallback runtime never runs against a version it was not built for.
3. As the site's owner, I want `npm ci` to keep working on every platform I might develop on, so that removing the pins does not reopen the problem they were added for.
4. As the site's owner, I want the deployed CV endpoint proved after the change, because sharp's part of the lockfile changes and sharp has broken before in a way only a deployment showed.
5. As an agent reading the guidance, I want the removed pins and their original reason recorded, so that nobody re-adds them to fix a problem that no longer exists.
6. As an agent reading the guidance, I want the record to say that three edges were forced, not one, so that it matches the measurement.

## Implementation decisions

- **Remove, do not re-pin.** The owner chose this on 2026-11-14 over raising `core` and `runtime` to a matched `1.11.3` set, which keeps two overrides and two forced edges, and over removing one or two of the pins. The guidance's remedy order treats an override as a standing liability to be retired once it stops being needed.
- **The lockfile is refreshed, not regenerated**: an install that writes only the lockfile, so every other locked version stays where it is. As measured, the semantic diff touches only `@emnapi` entries, 48 lines: the root copies stay at `1.11.0`, `1.11.0` and `1.2.2`; `@unrs/resolver-binding-wasm32-wasi` gains its own `core` and `runtime` at `1.10.0` and `wasi-threads` at `1.2.1`; `@img/sharp-wasm32` gains its own `runtime` at `1.11.3`.
- **The manifest keeps its four-space indentation.** npm takes the lockfile's indentation from the manifest, so reformatting the manifest reformats every line of the lockfile.
- **The guidance's overrides section records the removal.** The three pins join the list of removed overrides, with the reason they were added (#26), the measurement that retired it, and the correction that three edges were forced. The text introducing the remaining entries then describes `postcss` alone. Each figure is re-measured on the ticket's branch, not copied from this spec.

## Testing decisions

- **S1: CI on the pull request**, the four required checks. `audit` proves the production audit, and `ci` proves `npm ci` and the build on linux.
- **S2: the lockfile measurement**, run on the ticket's branch and repeated by the orchestrator:
  - `npm ci --dry-run` reports in sync with `--os` and `--cpu` set to linux x64, win32 x64 and darwin arm64;
  - no `@emnapi` dependency edge lies outside its declared range, by a semver check of each consumer's declaration against the version it resolves;
  - `npm ls` over the three packages, lockfile only, shows no `overridden` and no `invalid`;
  - the lockfile's semantic diff touches only `@emnapi` entries.

  It catches a regression in the tree. It cannot exercise a wasm32 runtime, which nothing here runs.
- **S3: the CV endpoint**, on the pull request's preview before merge and on production after it, fetched over plain HTTP through Vercel MCP. `/api/generate-cv?locale=en` and `?locale=id` each return `200` with `application/pdf` and a body that begins `%PDF`, and the deployment shows no runtime error from that route. Prior art: run `upkeep-2026-11`, waves 2 and 3.
- The repository has no test suite.

## Success criteria

- The manifest's overrides hold `postcss` alone.
- S2 passes on every point.
- The production audit reads 0, and the full-tree audit is unchanged from `main` at `04c953f`.
- S3 passes on the preview and on production.
- The repository's guidance names no `@emnapi` pin as in force.
- The ticket's pull request closes #145 and #146.

## Out of scope

- The `postcss` override.
- #136 and the `minimatch` advisory.
- Any version change outside the `@emnapi` entries.

## Further notes

- Source issues: #145 and #146, filed by run `upkeep-2026-11` (map #140) from ticket #139's measurement.
- This run's other spec, sonar pin comment, is write-disjoint from this one.


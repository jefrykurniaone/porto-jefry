# Spec — clear the open npm advisories and review the override set

- **Spec issue**: [#51](https://github.com/jefrykurniaone/porto-jefry/issues/51)
- **Execution map**: [#57](https://github.com/jefrykurniaone/porto-jefry/issues/57)
- **Tickets**: [#56](https://github.com/jefrykurniaone/porto-jefry/issues/56) advisories and override review
- **Run**: `dep-health`
- **Version**: v1

---

## Problem Statement

`npm audit` on `main` reports four open high-severity advisories. The repository's own guidance states that its dependency overrides exist "to hold `npm audit` at zero", so that statement is now false, and it has been false for long enough that nobody noticed. Two of the four advisories are against the pinned versions the overrides themselves introduced: the override that was added to escape one advisory now names a version that a later advisory covers.

The four, measured from the lockfile rather than the installed tree:

- `brace-expansion`, pinned by an override at 5.0.8 — denial of service via unbounded intermediate arrays, bypassing the mitigation of the earlier advisory the pin was added for. Every version from 4.0.0 through 5.0.8 is affected.
- `minimatch`, pinned by an override at `^10.2.5` — flagged through its `brace-expansion` dependency.
- `js-yaml` at 4.2.0, reached through ESLint's configuration loader — quadratic CPU consumption resolving an ordered-map tag, with the upstream fix not backported to the affected range. Versions 4.0.0 through 4.3.0 are affected.
- `nanoid` below 3.3.18, reached through PostCSS — a custom generator can loop indefinitely when asked for zero bytes.

None of them is exploitable from the deployed site: all four sit in build and lint tooling rather than in the request path. The cost of leaving them is that `npm audit` stops being a usable signal — once it reports four things nobody intends to fix, the fifth is invisible.

## Solution

Return the audit to zero, and make the repository's guidance about the overrides true again.

Each of the four has a fix available within a range the project can take. `brace-expansion` has a patched 5.0.9. `minimatch` has a 10.2.6 that consumes it. `js-yaml` has patched releases inside the 4.x line, so no major-version move is needed. `nanoid` has a patched 3.3.18 inside the range PostCSS already declares, which means refreshing PostCSS may resolve it without an override at all.

The work is deliberately biased towards *removing* overrides rather than adding them. An override is a standing liability: it pins a version the project does not otherwise control, it hides the transitive graph's own resolution, and — as two of these four demonstrate — it becomes the vulnerable version when the advisory moves. Every override that survives this change has to justify itself in writing.

This spec runs after the CV fix in the same delivery run, because that change refreshes every in-range dependency and regenerates the lockfile. The advisory set is therefore re-measured at the start of this work rather than assumed from the numbers above; some of these may already be gone.

## Goals

- `npm audit`, measured from the lockfile, reports zero advisories at every severity.
- Every override still present in the manifest has a written reason next to it, and no override names a version that an open advisory covers.
- The repository's own guidance describes the override set as it actually is.
- Lint, typecheck and build still pass, and lint in particular still runs the same rule set it ran before.

## Non-goals

- Adding automated advisory monitoring, a scheduled audit job, or a CI step that fails on a new advisory. Worth doing, not part of this.
- Upgrading ESLint to 10, or relaxing the plugin pins that force ESLint 9.
- Any change to application code or runtime behaviour.

## Constraints and trade-offs

- **The ESLint 9 pin is load-bearing and stays.** `eslint-plugin-react@7.37.5` peer-caps at ESLint 9 and calls an API that ESLint 10 removed. Nothing in this work is allowed to move ESLint to 10 as a route to a clean audit.
- **The `minimatch` override is only safe while no enabled lint rule calls `minimatch` as a function.** Three ESLint plugins still require it in the old callable style, but only inside rules the project's configuration does not turn on. Any change that alters which rules are enabled, or which plugin versions are installed, has to keep that true — lint crashing with a "not a function" error is the symptom.
- **`brace-expansion` 5 and `minimatch` 10 are coupled.** `brace-expansion` 5 exports a named function rather than a callable default, which the 3.x `minimatch` that most of the tree would otherwise resolve cannot consume. Whichever way the pins move, the two must stay compatible.
- **Prefer resolution over pinning.** Where refreshing a parent dependency lets the graph resolve a patched version on its own, that is preferred to an override, even when the override is a smaller diff.
- **`js-yaml` stays within 4.x.** A patched 4.x release exists; moving the ESLint toolchain onto a 5.x major to satisfy an advisory would be a far larger change than the advisory warrants.
- **Advisories are re-measured, not assumed.** The numbers in this spec were taken before the CV fix refreshed the dependency tree, and from a machine whose installed tree is stale with respect to its manifest. The lockfile is the authority.

## User Stories

1. As a maintainer, I want `npm audit` to report zero, so that the next advisory that appears is visible rather than lost among four I have decided to live with.
2. As a maintainer, I want the overrides that exist to be ones I still need, so that the manifest is not carrying pins for problems that are gone.
3. As a maintainer, I want every surviving override annotated with why it exists, so that the next person can tell a load-bearing pin from a stale one.
4. As a maintainer, I want no override naming a version that an open advisory covers, so that the fix does not become the vulnerability.
5. As a maintainer, I want the repository's guidance to describe the override set truthfully, so that I do not trust a stale claim about a clean audit.
6. As a maintainer, I want lint to keep running the same rules after the change, so that a clean audit was not bought with a quietly weakened lint gate.
7. As a maintainer, I want lint, typecheck and build to pass, so that the change is shippable on the same terms as any other.
8. As a maintainer, I want the site's behaviour untouched by this change, so that a dependency-hygiene pull request needs no behavioural review.
9. As the next person to add an override, I want the reasoning for the coupled pins recorded, so that removing one of them does not silently break lint.

## Implementation Decisions

- **Re-measure first.** The advisory set is read from the lockfile at the start of the work, after the CV fix has landed. The list in the Problem Statement is a starting point, not the specification of what to fix.
- **For each advisory, prefer the least-binding remedy**, in this order: let a refreshed parent resolve a patched version; widen or raise the project's own declared range; and only then add or raise an override.
- **Overrides are reviewed as a set, not individually.** Each one is either justified in a comment or removed, including the ones that predate this work and are not implicated in any advisory.
- **The coupled pins are moved together.** Whatever `brace-expansion` resolves to, the `minimatch` that consumes it moves with it in the same step, and lint is run afterwards specifically to prove the callable-style consumers were not activated.
- **No lint configuration changes.** The enabled rule set before and after is identical; if a rule becomes enabled as a side effect of a plugin version moving, that is a finding to report, not a change to absorb.
- **Verification is at the same seams the project already uses**: the audit read from the lockfile, and the existing lint, typecheck and build commands.

## Testing Decisions

- **No test suite exists in this repository and none is added.** The gate is lint, typecheck and build, plus the audit measurement.
- **A good check here is a measurement of the resolved dependency graph**, not of source code: the advisory list read from the lockfile, and the resolved versions of the packages named in the overrides.
- **Lint is the behavioural check for this work.** It is the surface that the `minimatch` and `brace-expansion` pins can break, and the failure it produces is loud and specific.
- **The build is included in the gate** because PostCSS sits in the build path, so a PostCSS move has to be shown not to change the built output. The vendor-prefix check the project already documents applies here for the same reason.
- **Prior art**: the existing overrides and the reasoning recorded alongside them are the model for how the surviving ones are annotated.

## Out of Scope

- The CV endpoint, `sharp`, and the Next.js version — the other spec in this run owns those.
- Automated or scheduled advisory checking in CI.
- Moving to ESLint 10, or changing which ESLint plugins are installed.
- Any change to application source, styling, content, or configuration outside the dependency manifest, the lockfile, and the repository guidance that describes them.
- Adopting a different package manager, or changing the install command CI uses.

## Success Criteria

- `npm audit`, measured from the lockfile, reports zero advisories at every severity.
- No override in the manifest names a version covered by an open advisory.
- Every surviving override carries a written reason; overrides that no longer serve one are gone.
- Lint, typecheck and build pass, and lint runs without a "not a function" failure from the minimatch consumers.
- The repository guidance describing the overrides matches the manifest.
- No application source file is modified by this work.

## Further Notes

- Two of the four advisories are against pins the project itself introduced, which is the general hazard of overrides: a pin freezes a version, and advisories move. The annotation requirement in this spec exists so that the next audit failure can be read against the intent of each pin rather than re-derived.
- The `nanoid` advisory is reached only through PostCSS, and the PostCSS release the project can move to already declares a range that admits the patched version. That is the clearest case of a fix that should not need an override.
- vercel/next.js#96064, which tracks the framework bundling a vulnerable `sharp`, is the reason one of the existing overrides was added in the first place; it remains open, so that override is expected to survive this review.

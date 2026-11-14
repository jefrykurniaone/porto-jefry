# Spec — sonar pin comment: name the scan action's release where Dependabot keeps it current

- **Spec issue**: [#149](https://github.com/jefrykurniaone/porto-jefry/issues/149)
- **Execution map**: [#153](https://github.com/jefrykurniaone/porto-jefry/issues/153)
- **Tickets**: [#151](https://github.com/jefrykurniaone/porto-jefry/issues/151) trailing version comment · source issue [#144](https://github.com/jefrykurniaone/porto-jefry/issues/144)
- **Run**: `followups-2026-11`
- **Version**: v1
- **As of**: 2026-11-14, `main` at `04c953f`. A point-in-time copy of the spec item; the item is the one written copy, and delivery notes are written there first.
- **Regenerated**: 2026-11-14 at the run's close, `main` at `48cb329`, from the spec item carrying its delivery notes.

---

## Problem statement

The facts below hold as of 2026-11-14, with `main` at `04c953f`.

As the site's owner, I want the CI workflow and its SonarQube notes to say which release of the SonarQube scan action runs, and to stay right without a manual step after every Dependabot bump.

The workflow pins `SonarSource/sonarqube-scan-action` to a commit, `e805d87`, which is the release tagged `v8.4` and `v8.4.1`. The comment on the line above the pin names `v8.3.0`, the release it pinned before Dependabot #128 moved it. The SonarQube analysis notes repeat `v8.3.0` in their table. Dependabot rewrites the `uses:` line and leaves a comment on any other line alone, so both copies go stale on every bump. As of 2026-11-14 the action has already released `v8.5.0` (`59202af`), so the next monthly `github-actions` pull request will move the pin again. *(Delivery 2026-11-14: the tag check at implementation confirmed that `e805d87` is still `v8.4.1`, and `v8.5.0` (`59202af`) is the newest tag. Dependabot opened no pull request during the run, so the pin was still `e805d87` at the close. The next monthly `github-actions` pull request is handed to the owner.)*

Dependabot does maintain one kind of comment: a trailing comment on the same line as `uses:` whose text ends with the version of the old ref. Its GitHub Actions file updater (`VersionCommenter` in dependabot-core, read on 2026-11-14) replaces that version with the most specific version tag of the new commit. A comment with anything after the version is left untouched.

## Solution

The version moves onto the pinned line, as a trailing comment that Dependabot rewrites with every bump. The comment above the pin keeps its reason, that a tag can move, and loses the version. The SonarQube notes stop naming a version and point at that trailing comment instead, so neither copy can go stale.

## Goals and non-goals

**Goals**

- The workflow names the pin's release in exactly one place, and Dependabot keeps that place current. *(Delivery 2026-11-14: met in the workflow by #151 (PR #155, merge `e71ad8a`). That Dependabot keeps it current is proven only by its next pull request, after the close.)*
- The SonarQube notes never name a version of the action again. *(Delivery 2026-11-14: met. The *Action* row now reads: `SonarSource/sonarqube-scan-action`, pinned to a commit; the trailing comment on that `uses:` line in `ci.yml` names its release.)*
- #144 closes. *(Delivery 2026-11-14: closed by the merge of PR #155.)*

**Non-goals**

- Moving the pin. `e805d87` stays; Dependabot's next monthly pull request moves it to `v8.5.0`. *(Delivery 2026-11-14: held. The pin is still `e805d87` at the close.)*
- Pinning the other actions by commit. They stay on major tags.
- Editing the repository's guidance. Its sentence that the SonarQube scan action is pinned "by commit" stays true. *(Delivery 2026-11-14: held. `CLAUDE.md` was not edited for this spec.)*

## User stories

1. As the site's owner, I want the pinned line to say which release it runs, so that I can read the version without resolving a commit.
2. As the site's owner, I want Dependabot to update that version when it moves the pin, so that no bump leaves a stale version behind.
3. As the site's owner, I want the SonarQube notes to point at the workflow rather than repeat a version, so that they never go stale.
4. As a reviewer of a Dependabot `github-actions` pull request, I want the version change on the same diff line as the commit change, so that I can check one against the other.
5. As an agent reading the workflow, I want the reason for the commit pin kept beside it, so that nobody simplifies it back to a tag.

## Implementation decisions

- **A trailing comment is the format Dependabot recognises**: `# v8.4.1` after the commit on the `uses:` line, ending with the version and nothing after it. Dependabot's matcher requires the comment to *end with* the old version, so trailing text after the version defeats it. *(Delivery 2026-11-14: landed as `uses: SonarSource/sonarqube-scan-action@e805d875275f728fac1885b413934be6d7c63f65 # v8.4.1`.)*
- **`v8.4.1`, not `v8.4`.** Dependabot writes the most specific version tag of the new commit, so starting from the most specific one keeps the first rewrite like for like.
- **The explanatory comment above the pin stays**, without its version: the action is pinned to a commit rather than a tag because a tag can move. *(Delivery 2026-11-14: the line now reads ``# Pinned to a commit rather than a tag: a tag can move. The trailing comment on the `uses:` line names the release; Dependabot rewrites it.``)*
- **The SonarQube notes name no version.** Their action row says the action is pinned to a commit, and that the trailing comment on that line in the workflow names its release.
- The repository's guidance is not edited.

## Testing decisions

- **S1: CI on the pull request**, the four required checks. The `sonar` job runs the edited `uses:` line, so it catches a broken workflow file or an unresolvable pin. It cannot show the rewrite. *(Delivery 2026-11-14: passed on PR #155. Its `sonar` job ran the `Analyse` step on the edited line, not the skip path, and so did the push of `e71ad8a` to `main`.)*
- **The rewrite itself** is proven by the next Dependabot `github-actions` pull request that moves the Sonar pin, due with `v8.5.0`: its diff must change the version in the trailing comment together with the commit. That falls after the run closes, and is the owner's observation. *(Delivery 2026-11-14: still pending at the close, and handed to the owner by map #153.)*
- The repository has no test suite. Prior art for the rewrite is dependabot-core's own `VersionCommenter`.

## Success criteria

- The scan action's `uses:` line still pins `e805d875275f728fac1885b413934be6d7c63f65`, and ends with `# v8.4.1`. *(Delivery 2026-11-14: met.)*
- `v8.3.0` appears nowhere in the workflow or the SonarQube notes, and the notes name no version of the action. *(Delivery 2026-11-14: met. `grep -n 'v8\.3\.0'` over both files finds nothing.)*
- The four required checks pass on the pull request. *(Delivery 2026-11-14: met on PR #155.)*
- The ticket's pull request closes #144. *(Delivery 2026-11-14: met.)*

## Out of scope

- Bumping the scan action to `v8.5.0` by hand.
- Pinning other actions by commit.
- Editing the repository's guidance.

## Further notes

- Source issue: #144, filed by run `upkeep-2026-11` (map #140), with its comment naming the SonarQube notes.
- This run's other spec, emnapi overrides, is write-disjoint from this one.


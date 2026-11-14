# Spec — offline font build: self-host the site fonts so the build never downloads them

- **Spec issue**: [#134](https://github.com/jefrykurniaone/porto-jefry/issues/134)
- **Execution map**: [#140](https://github.com/jefrykurniaone/porto-jefry/issues/140)
- **Tickets**: [#138](https://github.com/jefrykurniaone/porto-jefry/issues/138) self-hosted fonts
- **Run**: `upkeep-2026-11`
- **Version**: v1
- **As of**: 2026-11-14, `main` at `2a5743a`. A point-in-time copy of the spec item; the item is the one written copy, and delivery notes are written there first.

---

## Problem statement

The facts below hold as of 2026-11-14, with `main` at `2a5743a`.

As the site's owner, I need every required CI check to fail only for a real defect. `Lint, Typecheck, Build` is one of the four required checks on `main`, and it fails intermittently while building, with this error:

```
Error: Turbopack build failed with N errors:
[next]/internal/font/google/space_grotesk_55e96d1d.module.css:7:8
Error: Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
```

It was reported as #124. On 2026-11-14 it failed in two of six runs:

- PR #122, run 43585411519, on Space Grotesk;
- PR #121, run 43585946549, on JetBrains Mono, with a docs-only diff.

Both passed when re-run with no change. A failure blocks merging until someone re-runs the job.

The site loads both of its typefaces through the Google Fonts loader, which downloads them from Google **while the site builds**. The build therefore depends on the network, and a probe on 2026-11-14 shows it:

- `main`'s build with the network cut, through a dead HTTPS proxy and separately through `unshare -rn`, fails in about 4 seconds;
- the error is `Failed to fetch Space Grotesk from Google Fonts` (and the same for JetBrains Mono);
- Next's own message advises self-hosting the font.

**The CI signature differs from the offline one.** "Can't resolve …/font/google/font" is not "Failed to fetch". It is therefore not proven that every CI failure was a network failure. Both failures, however, arise inside the Google Fonts loader's build step, and this spec removes that step entirely.

## Solution

The two typefaces are committed to the repository and loaded through Next's local font loader. The build no longer contacts Google. Visitors see the same fonts, served from the site's own origin as they are today, because the Google loader already self-hosts the files it downloads.

## Goals and non-goals

**Goals**

- A build with no network access succeeds.
- Each page renders in the same two typefaces, at the same weights, exposed through the same two CSS variables.
- No new dependency: nothing changes in the manifest or the lockfile.
- The fonts' licence travels with the committed files.

**Non-goals**

- Changing typefaces, weights, styles or subsets.
- Changing the PDF CV's fonts. Those are separate static files used by the CV renderer.
- Retrying the build step in CI.

## User stories

1. As the site's owner, I want the build to succeed without network access, so that a transient network failure in a CI runner never blocks a merge.
2. As the site's owner, I want CI's `Lint, Typecheck, Build` to fail only for a real defect, so that a red check means something.
3. As a visitor, I want the site to look exactly as it does today, so that the change is invisible to me.
4. As a visitor, I want the fonts served from the site itself, so that no third party sees my visit. This is unchanged from today.
5. As a later maintainer, I want the font files and their licence side by side, with their source written down, so that I can update or replace them without guessing.
6. As a later maintainer, I want the PDF CV's fonts left alone, so that this change cannot break the CV endpoint.

## Implementation decisions

- **The local font loader replaces the Google loader** in the one place the site loads fonts. The two CSS variables, `--font-sans` and `--font-mono`, keep their names, so no stylesheet changes.
- **Each family is one variable-weight WOFF2 file, Latin subset**, taken from the Google Fonts API: the same source and subset the build downloads today.
  - Space Grotesk covers weights 400–700.
  - JetBrains Mono covers weights 400–600, normal style only.
  - *Why variable:* one file per family covers every weight used. This matches what the Google loader requests today, and adds no file per weight.
- **The files live beside the app source, not in the public directory.**
  - *Why:* the public font directory is traced whole into the CV function's bundle. Placing the web fonts there would add them to the CV function, and would serve the raw files a second time at a public path.
  - The CV's existing static fonts stay where they are, untouched.
- **Each family's SIL Open Font License text sits beside its file**, following the precedent of the CV's vendored Space Grotesk.
- **Rendering stays as it is.** The executor matches today's built output on four points:
  - font display;
  - preloading;
  - weight range;
  - fallback-metric adjustment. Each family's fallback face, as `main` emits it today, is reproduced where the local loader can express it. Where it cannot, adjustment is turned off and the reason is recorded in the commit message.
- **No dependency is added.** Packaged font distributions were considered and declined on 2026-11-14, because they would add two dependencies and a lockfile change.

## Testing decisions

The repository has no test suite. Three seams apply:

- **S4: offline build.** The build is run with the network cut, through a dead HTTPS proxy or `unshare -rn`, from a clean build cache. It fails on `main` today, as measured on 2026-11-14, and must succeed after this change. This is the seam that proves the fix. It misses visual parity.
- **S1: CI on the pull request.** It misses whether the flake recurs, which only time shows.
- **S2: preview walk**, driven by Playwright MCP through a share URL. On `/en` and `/id` the walker:
  - finds `document.fonts` reporting both families `loaded`;
  - finds the computed `font-family` of the hero heading resolving to the sans family, and of a monospace label to the mono family;
  - sees every font request go to the preview's own origin, with no request to a Google host;
  - reads zero console errors. This needs the preview-toolbar spec merged first.

  Catches visual and loading regressions. Misses nothing this change can affect.

## Success criteria

- [ ] The build succeeds with the network cut, from a clean cache.
- [ ] No module in the app imports the Google font loader.
- [ ] On this change's preview, both families report `loaded`, every font request is same-origin, and the console is clean.
- [ ] Neither the manifest nor the lockfile changes.
- [ ] #124 is closed by this change's pull request.

## Out of scope

- The PDF CV's fonts and their tracing configuration.
- Any change of typeface, weight, style or subset.
- CI retries or caching.
- Turbopack configuration.

## Further notes

- Decided with the owner on 2026-11-14 (option (a) of the four offered: self-host, packaged fonts, CI retry, won't fix).
- If the CI flake recurs after this change, its cause was not the font step after all. That would be a new issue, not a reopening of this spec.


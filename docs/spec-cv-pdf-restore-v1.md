# Spec — restore production CV PDF download (Next.js 16.3.4)

- **Spec issue**: [#50](https://github.com/jefrykurniaone/porto-jefry/issues/50)
- **Execution map**: [#57](https://github.com/jefrykurniaone/porto-jefry/issues/57)
- **Tickets**: [#52](https://github.com/jefrykurniaone/porto-jefry/issues/52) upgrade · [#53](https://github.com/jefrykurniaone/porto-jefry/issues/53) preview verification · [#54](https://github.com/jefrykurniaone/porto-jefry/issues/54) documentation · [#55](https://github.com/jefrykurniaone/porto-jefry/issues/55) production verification
- **Run**: `dep-health`
- **Version**: v1

---

## Problem Statement

Downloading the CV from the live site fails. Every request to the CV endpoint returns a 500, in both languages, for every visitor. Vercel's runtime error table records 18 occurrences on the production deployment between 13:24 and 22:39 UTC on 2026-08-31, all on `/api/generate-cv`, and they are the only errors the project has. Nothing in the page tells the visitor what went wrong — the download simply does not arrive.

The failure is invisible before it reaches production. Local development works, `npm run build` succeeds, and CI (lint, typecheck, build) is green, because the missing piece is a native shared library that only the deployed serverless bundle is missing.

## Solution

Take the upstream fix. Next.js 16.2's Turbopack production build traces the `sharp` native addon into the function bundle but not the sibling package that carries the `libvips` shared object it dynamically links against, so the module fails to load the first time the route is invoked. Next.js fixed this in 16.3.0 ("Sharp@0.35 tracing fixed", vercel/next.js#94845); the sharp maintainer closed the upstream report on 2026-08-26 with "I'll close as this has been fixed downstream in the latest versions of Next.js 15 and 16."

The repository is locked to Next 16.2.12. The 16.2 line ends there — there is no backport — so the fix arrives by upgrading to the current stable release, 16.3.4, with `eslint-config-next` moved in lockstep and the rest of the dependency tree refreshed to its latest in-range versions at the same time.

Because the failure mode is invisible to every check that runs before deployment, the fix is not considered done until the CV has actually been downloaded from a Vercel preview deployment in both languages, and the production error table has been re-read after the merge and shows no new occurrences.

## Goals

- A visitor on the live site can download the CV PDF in English and in Indonesian.
- The downloaded PDF contains the profile photo, not the photo-less fallback layout.
- The production runtime error table shows no new `sharp` module-load errors after the fix ships.
- The project runs a Next.js release that contains the tracing fix, rather than carrying a local workaround for it.

## Non-goals

- Removing `sharp` from the request path (for example by committing a pre-converted JPEG). Considered and rejected for this run: the upstream bug is fixed, and the conversion step is wanted.
- Making the endpoint degrade to a photo-less PDF when the photo pipeline fails. A CV without the photo is not shippable; a hard failure is the correct, loud behaviour.
- Clearing the npm advisories that already exist on `main`. That is a separate spec in this run.

## Constraints and trade-offs

- **`sharp` must not be downgraded.** Downgrading to 0.34.4 also makes the error disappear and is the workaround most widely circulated, but every `sharp` below 0.35.0 inherits four high-severity libvips advisories (GHSA-f88m-g3jw-g9cj: CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591). Trading a broken endpoint for four high-severity vulnerabilities is not a trade this project makes.
- **No permanent tracing workaround is added.** Forcing the libvips package into the function bundle through the build's file-tracing configuration is a known working workaround, and it was rejected: it pins a path into a package layout that the project does not own, it is silently redundant the moment the framework fix lands, and it leaves the underlying framework bug in place. The upgrade is the fix.
- **The Next.js upgrade is a minor version bump and carries its own risk.** The repository moved to Next 16 only recently, and several behaviours are load-bearing and framework-owned: the CSP nonce minted per request in the proxy, the forced dynamic rendering of the locale route that the nonce depends on, next-intl's locale routing and redirect, and the vendor-prefix ordering that survives the CSS pass. Each is re-checked explicitly rather than assumed.
- **The dependency refresh rides along in the same change.** Moving every in-range dependency at once keeps a single lockfile change to review and a single regression pass to run, at the cost of a wider diff than a lone `next` bump.
- **`npm audit` cannot be gated at zero.** Four high-severity advisories are already open on `main` before this work starts. The gate for this spec is therefore "no advisory that was not already present", with the existing four handled by the other spec in this run.

## User Stories

1. As a visitor to the portfolio, I want the Download CV button to deliver a PDF, so that I can read the CV offline.
2. As a visitor reading the site in English, I want the English CV, so that the document matches the language I am browsing in.
3. As a visitor reading the site in Indonesian, I want the Indonesian CV, so that the document matches the language I am browsing in.
4. As a visitor, I want the downloaded CV to carry the profile photo, so that it looks like the finished document rather than a fallback.
5. As a recruiter opening the CV, I want the file to be named for the language I downloaded, so that an English and an Indonesian copy do not overwrite each other in my downloads folder.
6. As the site owner, I want the CV endpoint to stop returning 500s in production, so that the portfolio's single call to action works.
7. As the site owner, I want the fix proven on a preview deployment before it reaches the live site, so that a second broken deploy is not the way I find out it did not work.
8. As the site owner, I want the production error table re-read after the merge, so that "it works" is a measurement rather than an assumption.
9. As the site owner, I want the project on a supported Next.js release that contains the fix, so that the repository does not carry a workaround for someone else's bug.
10. As the site owner, I want `sharp` kept at a version without the libvips advisories, so that fixing the download does not reintroduce known vulnerabilities.
11. As a maintainer, I want lint, typecheck and build to pass after the upgrade, so that the existing CI gate still means what it meant before.
12. As a maintainer, I want the per-request CSP nonce still present on the rendered HTML after the upgrade, so that the site's script policy is not silently broken.
13. As a maintainer, I want the locale route still rendered dynamically after the upgrade, so that a frozen nonce does not start rejecting the framework's own scripts.
14. As a maintainer, I want locale routing and the language toggle still working after the upgrade, so that both languages remain reachable.
15. As a maintainer, I want both spellings of the backdrop-filter declaration still present in the built CSS after the upgrade, so that the navigation blur does not die in Chromium again.
16. As a maintainer, I want the theme cookie still honoured on the first render after the upgrade, so that a returning visitor's light theme does not flash dark.
17. As the next person to hit this class of bug, I want the cause and the fix written down in the repository, so that the next occurrence is a lookup rather than a re-investigation.
18. As the next person to touch dependencies, I want the "never downgrade sharp below 0.35" constraint recorded next to the other dependency footguns, so that the fastest-looking workaround is not taken by accident.

## Implementation Decisions

- **The framework version is the fix.** `next` and `eslint-config-next` both move to 16.3.4. `eslint-config-next@16.3.4` still declares a peer range of `eslint >= 9.0.0`, so the project's deliberate pin to ESLint 9 (forced by `eslint-plugin-react@7.37.5`, which calls an API ESLint 10 removed) is unaffected and stays.
- **All remaining dependencies move to their latest in-range versions in the same change**, with the lockfile regenerated. No dependency's declared semver range is widened to make that happen.
- **`next@16.3.4` declares `sharp: ^0.35.4` as an optional dependency.** The project's existing override that hoists `sharp` to the root copy stays in place; the root declaration must resolve at or above 0.35.4 so that the framework's own optional dependency is satisfied by the same copy and no second `sharp` is installed.
- **No file-tracing configuration is added for the libvips package.** The existing tracing configuration, which pins the fonts and the profile photo into the function bundle, is unrelated and stays exactly as it is.
- **The route's module-level static import of `sharp` stays.** It is why the failure is a 500 rather than a photo-less PDF, and that behaviour is wanted.
- **Node.js stays on 20.** `next@16.3.4` declares `node >= 20.9.0`, matching the project's own engines declaration and CI's Node 20.
- **The 16.3 release deprecates several TypeScript compiler options** (`baseUrl`, `moduleResolution: "node"`, `downlevelIteration`). The project's TypeScript configuration uses none of them, so no configuration change is expected; if the build says otherwise, the build is right.
- **The codemod shipped with 16.3 covers cache-components adoption**, which this project does not use. It is not run.
- **Verification happens at the HTTP seam.** The endpoint is exercised as a visitor exercises it — an HTTP GET per locale against a real deployment — rather than by importing internals. This is the highest available seam and the only one that can observe the failure at all, since the bug lives in the deployed bundle rather than in the source.

## Testing Decisions

- **This repository has no test suite.** The runner and tests were removed earlier in its history, and the standing gate is lint, typecheck and build. Nothing in this spec reintroduces a test runner.
- **A good check here observes external behaviour at the deployment boundary**: the status code, content type and body of an HTTP request to the CV endpoint, and the presence of the photo in the returned document. Nothing asserts on how the photo is converted.
- **The pre-merge gate runs on the branch**: lint, typecheck, and a production build, plus a static inspection of the built CSS for both spellings of the vendor-prefixed backdrop-filter declaration, and an advisory comparison against the pre-upgrade baseline.
- **The pre-merge behavioural check runs against the Vercel preview deployment** the pull request produces: the CV endpoint fetched once per locale, expecting a PDF rather than a 500, with the photo present in the rendered document and the filename carrying the locale. The same deployment is used to confirm the CSP nonce is present on the HTML response, that the locale routes and the language toggle work, and that the theme cookie is honoured on first render.
- **The post-merge check reads the production runtime error table** over a window that begins at the production deployment, and expects no new occurrence of the module-load error. A live download of the CV in both locales from the production domain accompanies it.
- **Prior art**: the vendor-prefix check mirrors the procedure already documented in the repository's own guidance after the navigation blur was lost to the CSS pass — inspect the build output, never the source.

## Out of Scope

- The four npm advisories already open on `main` before this work starts. They belong to the other spec in this run.
- Any change to the CV's content, layout, typography or the data-and-messages join behind it.
- Removing or replacing `sharp`, and any change to how the profile photo is produced or converted.
- Graceful degradation of the endpoint when the photo cannot be produced.
- The rate limiter, its in-memory store, and the accepted risk recorded against it.
- The unrelated build-time image script, which runs locally and is unaffected.
- Adding a build-time assertion that native dependencies reached the function bundle. Considered; the framework fix plus the preview check covers this occurrence, and a bundle-shape assertion is a guard against a class the framework now owns.
- Any Tailwind adoption, styling change, or content edit that the dependency refresh might make tempting.

## Success Criteria

- The CV downloads from the production domain in both English and Indonesian, as a PDF, with the profile photo present.
- The production runtime error table shows zero occurrences of the `sharp` module-load error in a window beginning at the production deployment of the fix.
- `next` and `eslint-config-next` both resolve to 16.3.4 in the lockfile; `sharp` resolves at or above 0.35.4; no second copy of `sharp` is installed.
- Lint, typecheck and build pass on the branch.
- The set of npm advisories on the branch is a subset of the set already present on `main` before the change.
- Both the prefixed and unprefixed backdrop-filter declarations are present in the built CSS.
- The cause, the fix, and the "never downgrade sharp below 0.35" constraint are written into the repository's own guidance.

## Further Notes

- Upstream references: the sharp report at lovell/sharp#4567, closed 2026-08-26 as fixed downstream; the Next.js fix "Sharp@0.35 tracing fixed" (#94845), released in 16.3.0; and vercel/next.js#96064, still open, which tracks Next 16.2 bundling a vulnerable `sharp` and is the reason the override exists.
- The failure signature to recognise next time: a successful build and a runtime `ERR_DLOPEN_FAILED` naming a versioned `.so` file, raised from the framework's external-module loader. It means a native package's sibling shared library did not reach the deployed bundle, not that the dependency is missing from the lockfile — in this case the lockfile carried the correct linux packages all along.
- The local `node_modules` on the maintainer's machine is currently stale with respect to the manifest, so any advisory baseline must be measured from the lockfile rather than from the installed tree.

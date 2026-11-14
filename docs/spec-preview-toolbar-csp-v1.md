# Spec — preview toolbar CSP: let the Vercel toolbar load on previews without loosening production

- **Spec issue**: [#133](https://github.com/jefrykurniaone/porto-jefry/issues/133)
- **Execution map**: [#140](https://github.com/jefrykurniaone/porto-jefry/issues/140)
- **Tickets**: [#137](https://github.com/jefrykurniaone/porto-jefry/issues/137) preview-only CSP allowance
- **Run**: `upkeep-2026-11`
- **Version**: v1
- **As of**: 2026-11-14, `main` at `2a5743a`. A point-in-time copy of the spec item; the item is the one written copy, and delivery notes are written there first.

---

## Problem statement

The facts below hold as of 2026-11-14, with `main` at `2a5743a`.

As the site's owner, I review every change on its Vercel preview deployment before it merges. On every preview page the browser console logs one error:

```
Framing 'https://vercel.live/' violates the following Content Security Policy directive: "default-src 'self'". The request has been blocked. Note that 'frame-src' was not explicitly set, so 'default-src' is used as a fallback.
```

Vercel injects its toolbar into preview deployments as an iframe from `vercel.live`. The site's production Content Security Policy sets `default-src 'self'` and no `frame-src`, and previews are served with that same policy, so the browser blocks the iframe. This was reported as #126.

This causes two problems:

- **Every preview check of the form "no console error" fails**, whatever the change under test. Run `security-baseline` (map #120) had to accept this error by name on its walk of PR #125's preview.
- **The toolbar does not work on previews**, and neither do its comments.

Production is not affected, because Vercel does not inject the toolbar there.

## Solution

Preview deployments are served a policy that adds exactly the sources Vercel documents for its toolbar. Production keeps the policy it has today, byte for byte. A preview page then loads the toolbar and logs no console error, and the production site is exactly as strict as before.

## Goals and non-goals

**Goals**

- The toolbar loads on preview deployments, and preview pages log no console error.
- The production policy is unchanged, character for character, apart from the per-request nonce.
- The allowance is fail-closed. Only the exact preview environment value turns it on; an absent, unknown or production value never does.

**Non-goals**

- Showing the toolbar in production or in local development.
- Any other change to the production or development policy.
- Adding the `@vercel/toolbar` package or mounting the toolbar ourselves.

## User stories

1. As the site's owner, I want preview pages to log no console error, so that a clean console is a meaningful signal in every preview check.
2. As the site's owner, I want the Vercel toolbar to load on previews, so that I can use its comments and tools while reviewing.
3. As a visitor to the production site, I want the same strict policy as before, so that the toolbar allowance never widens what can run on the page I am reading.
4. As a later maintainer, I want the allowance to turn on only for the exact preview value, so that a missing or misspelt environment value fails closed rather than open.
5. As an orchestrator verifying this change, I want to compare the production policy before and after the merge, so that "production unchanged" is measured rather than assumed.
6. As a reviewer, I want the allowed sources to match Vercel's documentation exactly, so that I can audit them against one public list.

## Implementation decisions

- **The switch is the platform's environment value.** The allowance is on only when the deployment environment value Vercel sets is exactly `preview`. Every other value, including an absent one, produces today's policy.
  - *Why:* this value is set by the platform for every preview deployment, and nobody sets it by hand. A comparison against one exact value fails closed.
  - The executor states whether the value is read at build time or at request time in the proxy, with evidence. Either is acceptable on Vercel, because a preview's build and its runtime see the same value.
- **The added sources are Vercel's documented set for the toolbar**, as of 2026-11-14 (vercel.com/docs/vercel-toolbar/managing-toolbar), and nothing else:

  ```
  script-src  + https://vercel.live
  style-src   + https://vercel.live
  connect-src + https://vercel.live wss://ws-us3.pusher.com
  img-src     + https://vercel.live https://vercel.com
  font-src    + https://vercel.live https://assets.vercel.com
  frame-src     'self' https://vercel.live        (new directive on previews only)
  ```

  - *Why the full set rather than only `frame-src`:* once the iframe is allowed, the toolbar requests its other resources. A partial allowance would trade the one error for the next one.
  - *Why the added `script-src` source is harmless:* the production policy uses `'strict-dynamic'`, under which browsers that support it ignore host sources. The nonce stays the only thing that authorizes a script. The source is listed because Vercel documents it, and it affects only browsers without `'strict-dynamic'`.
  - `frame-src` lists `'self'` explicitly, because a declared `frame-src` stops the fallback to `default-src 'self'`.
- **Previews are behind Vercel Authentication.** As of 2026-11-14 the project's protection is `all_except_custom_domains`, so only signed-in team members, or holders of a share link, ever receive the relaxed policy. This bounds the exposure. It is not what makes the change safe; the fail-closed switch is.
- **The development policy is untouched.** Local development has no injected toolbar.
- **High-consequence, design settled.** The change sits on a security boundary, so it meets the *adversarial* clause. Every decision above is made here, so the executor implements it rather than designing it. A second verification in a fresh context reviews it before merge.

## Testing decisions

The repository has no test suite. A good test here observes the policy a browser receives, never the implementation. Four seams apply:

- **S1: CI on the pull request** (`Lint, Typecheck, Build`, `Production dependency audit`, `SonarQube Cloud`, `Review dependency changes`). Catches compile, lint, audit and quality-gate failures. Misses runtime behaviour.
- **S2: preview walk**, driven by Playwright MCP through a share URL from Vercel MCP. The walker:
  - opens `/en` and `/id` on the pull request's preview;
  - reads zero console errors;
  - finds the toolbar's `vercel.live` iframe in the page;
  - reads the preview's policy header and finds every source listed above.

  Catches the toolbar fix and any new console error. Misses production.
- **S3: production policy comparison**, by plain HTTP. The production policy header of `/` and `/en` is captured before the run's first merge and again after this change merges, each with the nonce replaced by a placeholder. The two must be identical. Catches any widening of production.
- **Executor-side proof, before the pull request.** The policy builder's output for a production build with no environment value, and with the value `production`, is compared to `main`'s output for the same nonce, and must be identical.

Prior art: run `security-baseline` (map #120) walked previews the same way through `get_access_to_vercel_url`.

## Success criteria

- [ ] On this change's preview, `/en` and `/id` log zero console errors, and the `vercel.live` iframe is present.
- [ ] The preview's policy header contains every added source above, and no other new source.
- [ ] Production's policy header after the merge equals the baseline captured before the run, with the nonce normalised.
- [ ] The second verification records a verdict, with evidence, on the fail-closed switch and on production identity.
- [ ] #126 is closed by this change's pull request.

## Out of scope

- The toolbar in production or in local development.
- Any other change to the production or development policy, including `frame-ancestors`.
- Disabling the toolbar through project settings or environment variables. That option was considered and declined on 2026-11-14.
- Vercel project protection settings.

## Further notes

- Decided with the owner on 2026-11-14 (option 1 of #126's triage options).
- The run's other preview walks, for fonts and for the Dependabot pull requests, depend on this change: they can require a clean console only once it has merged. It therefore lands first in wave 1.


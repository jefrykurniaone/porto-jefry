# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: overseas remote recruiters and hiring managers** — people at companies outside Indonesia, screening candidates for a full-time remote role or a relocation hire. They arrive from a LinkedIn profile, a job application, or a CV link, usually mid-screen with several candidates open, and often on a phone. Their job on this site is to decide in under a minute whether this candidate is credible enough to advance, then to capture the evidence (CV, contact detail) they need to act on that decision.

Secondary, without a separate design target:

- **Freelance/project enquiries** — the site accepts them, but they are not what it is optimised for.
- **Indonesian-language readers** — the ID locale exists at full parity; it is a language requirement, not a second audience strategy.

## Product Purpose

A bilingual (EN/ID) personal portfolio for Jefry Kurniawan that converts a cold recruiter screen into contact. It presents a verified professional record — six roles since Feb 2020, fifteen delivered projects, formal education, one certification — plus a CV that can be downloaded as a PDF on demand.

Success is a recruiter reaching out, or downloading the CV and advancing the candidate. Failure is a recruiter who cannot tell within a minute what this developer does, at what level, and whether the work is real.

## Positioning

**Backend depth plus modern frontend range, in one person.** A .NET/SQL Server core built over 5+ years on production systems — with React, Next.js, and TypeScript actually shipped, not merely listed. The claim is coverage from API through UI by a single developer.

Supporting facts a comparable candidate cannot copy: the production work is in regulated, high-stakes domains — operational risk management for banks and insurers (ORMS Adira Insurance, ORMS BTPN, RBBR/OPRISK Super Bank), HR systems, and live Singapore public-sector websites (psc.gov.sg, a-star.edu.sg, dsta.gov.sg, yellowribbon.gov.sg, heritage.sg) on Sitefinity and Sitecore. The site itself is the frontend evidence: it appears in the project list, is publicly sourced, and renders its own PDF CV.

## Operating Context

- Entry is almost always from outside: a LinkedIn or CV link, not organic search. The visitor arrives already mid-task.
- Sessions are short, comparative, and interruption-prone; the visitor is screening a stack of candidates, not reading a site.
- Mobile is a first-class case, not a fallback.
- The download-CV action is the handoff into the recruiter's own workflow (an ATS, an email to a hiring manager). It matters as much as the on-page content.
- The candidate is based in Indonesia and works with distributed teams across time zones; time-zone and location questions are part of every screen and must be answerable from the page.
- Content originates from a real CV. Site and PDF are two renderers over one record.

## Capabilities and Constraints

Confirmed capabilities:

- Bilingual EN/ID at full string parity, locale-routed (`/en`, `/id`).
- Sections in fixed order: Hero, About, Experience, Skills, Projects, Education (with certifications folded in), Contact.
- On-demand PDF CV at `/api/generate-cv?locale=en|id`, rendered from the same content via `@react-pdf/renderer`.
- Light/dark theme, persisted, rendered server-side from a cookie.
- Skills distinguish **production-backed** from **working knowledge**; this distinction is a truth claim and must not be flattened.

Constraints future work must preserve:

- **EN/ID parity.** Every user-facing string exists in both `en.json` and `id.json`. No English-only surface.
- **PDF CV stays in sync.** Content changes land in both the web section and its `src/components/cv/` counterpart, or the PDF silently drifts from the site.
- **Fast and accessible.** WCAG AA contrast, keyboard navigation, strict CSP with a per-request nonce, and acceptable performance on a mid-range Android over an Indonesian mobile network.
- Technical: Next.js 16 App Router on Vercel, `maxDuration: 10` on the CV function, in-memory CV cache and rate limit that reset on cold start.

Undecided / not established:

- No custom domain — the canonical URL is `https://porto-jefry.vercel.app`.
- No blog, case-study pages, or per-project detail routes exist; whether the site should grow them is open.
- Whether freelance work deserves its own surface is undecided.

## Brand Commitments

- Name: **Jefry Kurniawan**; the site is referred to in code as Porto-Jefry.
- Voice in the existing copy is plain, first-person, and specific — "I care about code that the next person can read and change without having to guess what it does." No superlatives, no growth-hacked hype.
- Contact identity is consistent across channels: `jefrykurniaone` on both LinkedIn and GitHub; phone is always shown in international form (`+62 821-2622-9978`) because the audience cannot dial the local `08xx` format.
- Availability is stated openly: open to full-time remote and relocation, freelance welcome.

No logo, wordmark, or fixed palette has been declared binding.

## Evidence on Hand

Real and verifiable:

- Six employment records with dates, roles, and locations (`src/data/experience.ts`), Feb 2020 – present.
- Fifteen projects (`src/data/projects.ts`), five with live public URLs — heritage.sg, yellowribbon.gov.sg, psc.gov.sg, a-star.edu.sg, dsta.gov.sg.
- This site's own public source: `github.com/jefrykurniaone/porto-jefry`.
- Formal education with GPAs (Widyatama 3.63/4.00, Telkom 3.26/4.00) and one certification (Coding.ID .NET Programmer Class, Nov 2019 – Jan 2020).
- Profile photo: `public/cv-photo.webp`.

Does not exist — future work must not invent it:

- No client testimonials, quotes, or references.
- No performance metrics, uptime figures, user counts, or business-outcome numbers.
- No client logo permissions. Government client names appear as text; no crest or logo asset is licensed.
- No screenshots or case studies of the delivered client systems; most are internal and cannot be shown.
- No awards, press, or public speaking.

## Product Principles

1. **The first minute decides.** Role, level, and proof of realness must land before any scrolling. Everything else is depth for the visitor who already said yes.
2. **Evidence over adjectives.** Named clients, live URLs, dates, and public source do the persuading. Nothing is claimed that the CV or a link cannot back.
3. **One record, two renderers.** Web and PDF are views of the same content. A change that touches one and not the other is a bug.
4. **Both languages are the product.** ID is not a translation afterthought; a surface that ships English-only is unfinished.
5. **Range is the story, depth is the credential.** Backend seniority is the foundation; the frontend work is the differentiator. Neither may be presented at the cost of the other.

## Accessibility & Inclusion

- WCAG AA contrast (4.5:1) in both themes; full keyboard navigation, including the mobile drawer.
- Semantic HTML, real `alt` text, skip-to-content link.
- Must hold up on a mid-range Android phone on a mobile network — recruiters screen on phones, and the Indonesian network baseline is the floor.

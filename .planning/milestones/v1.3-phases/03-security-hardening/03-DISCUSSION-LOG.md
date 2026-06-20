# Phase 3: Security Hardening - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-10
**Phase:** 3-security-hardening
**Areas discussed:** SEC-03 rate-limit durability, SEC-01 IP source, SEC-02 CSP cleanup scope, SEC-02 script authorization

> Re-discussion: existing CONTEXT.md (2026-06-06) was stale (predated Phase 5 SGDS migration
> + 03-01/03-02 CSP hotfixes). User chose **Update it** + **Continue, replan after** (the merged
> 03-01 hotfix stays; remaining work gets a fresh plan).

---

## SEC-03 — Rate-Limit Durability

| Option | Description | Selected |
|--------|-------------|----------|
| Implement Vercel KV | Native Vercel (Upstash-backed) via @upstash/ratelimit; true global limit; needs env vars | |
| Implement Upstash Redis direct | @upstash/ratelimit against own Upstash; portable; needs env vars | |
| Keep in-memory, close SEC-03 | Accept per-instance limit; document trade-off; zero deps/env vars; unblocks phase | ✓ |

**User's choice:** Keep in-memory, close SEC-03 (accepted risk).
**Notes:** PDF is module-cached per locale, so the expensive render path is guarded acceptably by
the per-instance limit. Closing this resolves the prior Upstash/Vercel KV env-var blocker.

---

## SEC-01 — Client IP Source

| Option | Description | Selected |
|--------|-------------|----------|
| @vercel/functions ipAddress() | Official, future-proof — NextRequest.ip removed in Next 15 | ✓ |
| req.ip ?? fallback | Simplest, no deps, but deprecated and gone in Next 15 | |

**User's choice:** `@vercel/functions` `ipAddress()`.
**Notes:** Keeps `'127.0.0.1'` dev fallback; rate-limit logic unchanged.

---

## SEC-02 — CSP Cleanup Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Full post-SGDS CSP re-audit | Drop Google Fonts domains + re-verify script hash + confirm unsafe-inline + check SGDS CSS for gstatic | ✓ |
| Minimal — drop Google Fonts domains only | Faster, but leaves possibly-stale script hash unverified | |

**User's choice:** Full post-SGDS CSP re-audit.
**Notes:** Hotfixes left a hardcoded script hash that likely no longer matches the SGDS-rewritten
theme-init script.

---

## SEC-02 — Theme-Init Script Authorization

| Option | Description | Selected |
|--------|-------------|----------|
| Recompute the hash | SHA-256 of current script, hardcoded; consistent with locked 03-02 hash pattern; verify programmatically | ✓ |
| Externalize to /theme-init.js | No inline; no hash/nonce; but extra request + FOUC risk | |
| Fix nonce propagation | Investigate x-nonce null on Vercel; uncertain outcome | |

**User's choice:** Recompute the hash, verify programmatically against production HTML.
**Notes:** Hash is load-bearing because x-nonce is null at runtime on Vercel (03-02).

---

## Claude's Discretion

- SEC-01 test updates (mock `ipAddress`, assert IP path), coverage ≥ 80%.
- `buildCsp` test assertion updates for removed font domains / old hash.
- Hash recomputation mechanism (Node `crypto`).

## Deferred Ideas

- Distributed rate limiting (SEC-03) — closed as accepted-risk; reopen as a new phase only on
  evidence of sustained abuse.
- Root-cause of `x-nonce` null on Vercel — unresolved; static-hash workaround sufficient.

# Developer Behavioral Profile

> Generated: 2026-05-25 | Source: Questionnaire | Version: 1.0

---

## Report Card

| Dimension | Score | Label |
|---|---|---|
| Communication Depth | ████████████████████ 5/5 | Detailed — full context and rationale |
| Autonomy Comfort | ████████████████░░░░ 4/5 | High — act, flag risky decisions |
| Planning Rigor | ████████████████░░░░ 4/5 | Structured — PLAN.md with phases |
| Code Strictness | ████████████████████ 5/5 | Maximum — all 6 gates enforced |
| Testing Discipline | ████████████░░░░░░░░ 3/5 | Pragmatic — post-impl coverage |
| Debugging Rigor | ████████████████████ 5/5 | Systematic — reproduce→isolate→fix→verify |
| Documentation Density | ████░░░░░░░░░░░░░░░░ 1/5 | Minimal — self-documenting code |
| Risk Caution | ████████████████████ 5/5 | Thorough — ADRs for major decisions |

**Overall Profile Type: The Meticulous Architect**

High standards, systematic by nature, researches before committing, wants detailed explanations to understand decisions, but trusts clean code over inline docs.

---

## Dimension Details

### 1. Communication Style
- **Preference:** Detailed — full context and rationale
- **Agent behavior:** Always explain the *why* behind decisions, not just the *what*. Include trade-offs when proposing solutions. For complex changes, provide context before diving into code.

### 2. Autonomy & Agency
- **Preference:** High autonomy — act, but flag risky decisions
- **Agent behavior:** Execute tasks without asking for confirmation on standard operations. Pause and surface reasoning before: destructive operations (deletes, resets), schema changes, public API breaks, dependency additions with known CVEs.

### 3. Planning Style
- **Preference:** Structured — PLAN.md with phases and tasks
- **Agent behavior:** Always create a PLAN.md before executing multi-step work. Break work into phases with clear deliverables. Use `manage_todo_list` for all multi-step tasks. No cowboy coding.

### 4. Code Quality Standards
- **Non-negotiables:** Zero lint/type errors, SonarQube clean, 80%+ test coverage, max 40-line functions, named constants, strict naming conventions
- **Agent behavior:** Never ship code with lint or type errors. Run validation before marking tasks done. Flag any SonarQube smell immediately. Enforce `camelCase` / `PascalCase` / `SCREAMING_SNAKE_CASE` strictly. No magic numbers.

### 5. Testing Approach
- **Preference:** Test after — cover what matters post-implementation
- **Agent behavior:** Write tests after implementation, not TDD. Focus coverage on utility functions, business logic, and edge cases. Target 80% coverage. Co-locate test files with source files. Test behavior, not internals.

### 6. Primary Tech Stack
- **Languages:** TypeScript, JavaScript, C#, Go
- **Frameworks:** React, Next.js, Node.js/Express
- **Agent behavior:** Default to TypeScript over JavaScript. Prefer Next.js App Router patterns. Use idiomatic patterns for each language. Apply language-specific conventions without prompting.

### 7. Debugging Style
- **Preference:** Systematic — reproduce → isolate → fix → verify
- **Agent behavior:** When debugging, follow scientific method. Reproduce the bug with a minimal case first. Isolate the root cause (not just the symptom). Fix the root cause. Verify fix doesn't regress anything.

### 8. Commit & PR Style
- **Preference:** Feature branches with squash merge
- **Agent behavior:** All work goes on `feat/` / `fix/` / `chore/` branches. Commits use Conventional Commits format. PR squash-merges produce a single clean commit on main. Never push directly to `main`/`master`.

### 9. Documentation
- **Preference:** Minimal — self-documenting code only
- **Agent behavior:** Do NOT generate JSDoc/docstrings unless explicitly requested. Name things clearly so code is self-explanatory. Only add inline comments for non-obvious logic (e.g., regex, algorithm steps, workarounds). README and architecture docs are acceptable; excessive inline comments are not.

### 10. Risk Tolerance & Decision Making
- **Preference:** Research thoroughly — ADRs for major decisions
- **Agent behavior:** For architectural decisions or tech-stack choices, generate an ADR. Do not guess or pick arbitrarily. Surface trade-offs. Research before committing. Use `.planning/` as the canonical location for decision records.

---

## Key Agent Directives (Summary)

```
ALWAYS:
  - Explain the reasoning behind non-trivial decisions
  - Enforce zero lint/type errors before marking work done
  - Use PLAN.md + manage_todo_list for multi-step work
  - Follow strict naming: camelCase / PascalCase / SCREAMING_SNAKE_CASE
  - Branch → PR → squash merge workflow
  - Write tests post-implementation, target 80% coverage

NEVER:
  - Push directly to main/master
  - Add docstrings or inline comments unless asked
  - Use magic numbers — always use named constants
  - Write functions > 40 lines
  - Ship code with lint/type/SonarQube errors
  - Make architectural decisions without an ADR
```

---

## Tech Stack Fingerprint

| Domain | Tools |
|---|---|
| Frontend | React, Next.js (App Router), Tailwind CSS |
| Language | TypeScript (primary), JavaScript, C#, Go |
| Backend | Node.js / Express, Go |
| Styling | Tailwind CSS |
| i18n | next-intl (EN + ID required) |
| Quality | ESLint, TypeScript strict, SonarQube |
| Testing | Jest / Vitest (post-impl, 80%+) |
| Git | Conventional Commits, feature branches, squash merge |

---

## Profile Highlights

- **Biggest strength signal:** Code quality — selected ALL 6 strictness gates. Zero tolerance for slop.
- **Workflow signal:** Structured planner with high autonomy comfort — trusts the agent to execute, but wants the plan documented first.
- **Communication signal:** Wants explanations, not just code. The "why" matters as much as the "what".
- **Risk signal:** Conservative decision-maker despite high code execution autonomy. Researches thoroughly before committing to major changes.
- **Docs signal:** Strong preference for clean code over commented code. Avoid generating JSDoc noise.

---

*Refresh this profile with `gsd-profile-user --refresh`*

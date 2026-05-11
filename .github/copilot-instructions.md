## Coding Standards

### Code Quality
- Follow SonarQube coding standards (clean code, no code smells)
- Target: 0 warnings, 0 vulnerabilities, 0 deprecated components
- Fix all lint/type errors before considering a task done
- Lint checks enforced via pre-commit hook (e.g., Husky + lint-staged)
- Maximum function length: 40 lines; maximum file length: 300 lines
- Avoid deep nesting (max 3 levels) — prefer early return pattern
- No magic numbers; use named constants

### Naming Convention
- Variables & functions: camelCase
- Classes & React components: PascalCase
- Constants: SCREAMING_SNAKE_CASE
- Component files: PascalCase → `UserCard.tsx`
- Utility/hook files: kebab-case → `use-auth.ts`, `format-date.ts`
- Boolean variables: prefix with `is`, `has`, `should`

### Error Handling
- Never use empty catch blocks
- Always log errors with context (location, input, message)
- User-facing errors must be localized and human-readable
- Never expose stack traces or internal errors to end users

### Internationalization (i18n)
- New apps must support minimum 2 languages: Indonesian (ID) and English (EN)
- Default language is English unless explicitly requested otherwise
- Single-language projects default to English
- All user-facing strings must go through the i18n system — no hardcoded text

### Accessibility (a11y)
- All interactive elements must be keyboard-navigable
- Images must have descriptive alt text
- Minimum color contrast: 4.5:1 (WCAG AA)
- Use semantic HTML elements

### Security
- Follow OWASP Top 10 practices
- Validate all inputs at every entry point (API, forms, URL params)
- Prefer modern, non-deprecated APIs and components
- Avoid libraries with no updates for 2+ years without justification
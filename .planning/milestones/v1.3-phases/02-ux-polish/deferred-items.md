# Deferred Items - Phase 02 UX Polish

## Out-of-Scope Issues Found During Plan 02-04

### Pre-existing Hero.tsx errors (found during verification)

**Lint error:**
- File: src/components/sections/Hero.tsx:19:12
- Error: 'errorMessage' is assigned a value but never used
- Type: @typescript-eslint/no-unused-vars

**Type error:**
- File: src/components/sections/Hero.tsx:116:18
- Error: Property 't' is missing in type '{ locale: string; ctaWork: string; ctaCv: string; ctaContact: string; ctaDownloading: string; }' but required in type 'Readonly<HeroCtaButtonsProps>'
- Type: TS2741

**Disposition:** Out of scope for Plan 02-04 (ThemeToggle CLS verification). These errors exist in Hero.tsx, not in ThemeToggle components. Should be addressed in a separate plan.

**Found during:** Plan 02-04, Task 3 (verification checks)

**Status:** Deferred to future plan

## Out-of-Scope Issues Found During Plan 02-02

### TypeScript Errors in Future Task Files (Discovered during 02-02)

**Scope:** Out of scope for task 02-02 (custom 404 page)
**Context:** Type errors exist in files related to task 02-03 (custom error page)

**Files with errors:**
- `src/app/[locale]/error.test.tsx` - Test for error page (task 02-03)
  - Error TS7009: 'new' expression target lacks construct signature
  - Error TS2345: Argument type mismatch in Error constructor
- `src/i18n/messages/translations.test.ts` - Translation tests expecting 'error' namespace
  - Error TS2339: Property 'error' does not exist (namespace not yet added)

**Disposition:** These will be resolved during task 02-03 execution. Not fixing now per deviation rule (pre-existing errors in unrelated files are out of scope).

**Found during:** Plan 02-02, Task 3 (verification checks)

**Status:** Deferred to task 02-03

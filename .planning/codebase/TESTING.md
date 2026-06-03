# Testing
_Last mapped: 2026-06-02_

## Framework

**Test runner:** Vitest `^4.1.7`
- Config: `vitest.config.ts` (project root)
- Environment: `jsdom` (browser DOM simulation)
- Globals: `true` — `describe`, `it`, `expect`, `vi` available without imports (but explicitly imported in all test files)

**Assertion library:** `@testing-library/jest-dom` `^6.9.1`
- Loaded globally via `src/test/setup.ts`:
  ```ts
  import '@testing-library/jest-dom';
  ```

**Rendering:** `@testing-library/react` `^16.3.2`
- `render`, `screen`, `act` from `@testing-library/react`

**User interaction:** `@testing-library/user-event` `^14.6.1`
- Always use `userEvent.setup()` then `await user.click(...)` — never `fireEvent`

**TypeScript path resolution in tests:** `vite-tsconfig-paths` plugin wires `@/` alias into Vitest.

**next-intl inlining:** `next-intl` is inlined in Vitest's server deps to prevent ESM transform issues:
```ts
// vitest.config.ts
server: { deps: { inline: ['next-intl'] } }
```

---

## Structure

**Co-location:** Test files live next to the source file they test. No separate `__tests__` directory.

**Naming convention:**
- React component tests: `ComponentName.test.tsx` (same directory as `ComponentName.tsx`)
- Utility/data tests: `module-name.test.ts` (same directory as `module-name.ts`)

**Directory layout:**
```
src/
  components/
    sections/
      Hero.tsx
      Hero.test.tsx          ← co-located
      Experience.tsx
      Experience.test.tsx
      About.tsx
      About.test.tsx
      Skills.tsx
      Skills.test.tsx
      Projects.tsx
      Projects.test.tsx
      Certifications.tsx
      Certifications.test.tsx
      Contact.tsx
      Contact.test.tsx
      Education.tsx
      Education.test.tsx
    layout/
      Navbar.tsx
      Navbar.test.tsx
      Footer.tsx
      Footer.test.tsx
      ThemeToggle.tsx
      ThemeToggle.test.tsx
      LanguageToggle.tsx
      LanguageToggle.test.tsx
      BackToTop.tsx
      BackToTop.test.tsx
    cv/                      ← NO tests (excluded from coverage)
  data/
    experience.ts
    experience.test.ts       ← co-located
    projects.ts
    projects.test.ts
    skills.ts
    skills.test.ts
    certifications.ts
    certifications.test.ts
    education.ts
    education.test.ts
    contact.ts
    contact.test.ts
  utils/
    constants.ts
    constants.test.ts
    translate-period.ts
    translate-period.test.ts
  test/
    setup.ts                 ← global setup (jest-dom import only)
```

**Test suite structure:** Every test file uses `describe` + `it` blocks. Named describes match the component/function being tested:
```ts
describe('Hero', () => {
    it('renders without crashing', () => { ... });
    it('renders heading with name', () => { ... });
});
```

**Render helpers:** Extract a `renderX()` factory function at the top of each test file to avoid repeating the provider wrapper:
```ts
function renderHero() {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <Hero />
        </NextIntlClientProvider>,
    );
}
```

---

## Mocking

### next/image
Mock in every component test that renders `<Image>` — replace with a plain `<img>`:
```ts
vi.mock('next/image', () => ({
    default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { alt: string }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} {...props} />
    ),
}));
```
Used in: `src/components/sections/Hero.test.tsx`

### next-themes
Mock `useTheme` when the component under test uses `ThemeToggle` or `next-themes` directly:
```ts
vi.mock('next-themes', () => ({
    useTheme: () => ({ resolvedTheme: 'light', setTheme: vi.fn() }),
}));
```
Used in: `src/components/layout/Navbar.test.tsx`, `src/components/layout/ThemeToggle.test.tsx`

### @/i18n/routing
Mock `useRouter` and `usePathname` for components that use locale-aware navigation:
```ts
vi.mock('@/i18n/routing', () => ({
    useRouter: () => ({ replace: vi.fn() }),
    usePathname: () => '/',
}));
```
Used in: `src/components/layout/Navbar.test.tsx`, `src/components/layout/LanguageToggle.test.tsx`

### Global browser APIs (vi.stubGlobal)
Stub globals for async browser APIs; always clean up in `afterEach`:
```ts
beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({ ok: true, blob: () => Promise.resolve(new Blob()) });
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});
```
Used in: `src/components/sections/Hero.test.tsx`

### scrollY / scrollTo stubs
For scroll-dependent components, stub `scrollY` and `scrollTo` on `globalThis`:
```ts
beforeEach(() => {
    vi.stubGlobal('scrollY', 0);
    scrollToMock = vi.fn();
    vi.stubGlobal('scrollTo', scrollToMock);
});
afterEach(() => {
    vi.unstubAllGlobals();
});
```
Used in: `src/components/layout/BackToTop.test.tsx`

### DOM element stubs
Append/remove DOM elements in `beforeEach`/`afterEach` to simulate the page environment:
```ts
beforeEach(() => {
    aboutEl = document.createElement('div');
    aboutEl.id = 'about';
    Object.defineProperty(aboutEl, 'offsetTop', { configurable: true, value: 500 });
    document.body.appendChild(aboutEl);
});
afterEach(() => { aboutEl.remove(); });
```
Used in: `src/components/layout/BackToTop.test.tsx`

### NextIntlClientProvider (NOT mocked)
Do **not** mock `next-intl`. Wrap all component renders in the real provider with `en` messages:
```ts
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';

render(
    <NextIntlClientProvider locale="en" messages={messages}>
        <MyComponent />
    </NextIntlClientProvider>,
);
```

---

## Coverage

**Provider:** `@vitest/coverage-v8` `^4.1.7`

**Reporters:** `text` (terminal), `html` (browsable), `lcov` (CI integration)
- HTML report output: `coverage/` directory (committed to repo root)

**Thresholds** (enforced — test run fails if not met):
| Metric     | Threshold |
|------------|-----------|
| Lines      | 80%       |
| Functions  | 80%       |
| Statements | 80%       |
| Branches   | 65%       |

**Included paths:**
- `src/**/*.{ts,tsx}`

**Excluded from coverage:**
| Path | Reason |
|------|--------|
| `src/components/cv/**` | PDF-only, @react-pdf/renderer — not testable in jsdom |
| `src/app/api/**` | Next.js API route — integration-level |
| `src/app/**` | Next.js App Router layouts/pages |
| `src/middleware.ts` | Next.js middleware — edge runtime |
| `src/i18n/request.ts` | next-intl server-side config |
| `src/i18n/routing.ts` | next-intl routing config |
| `src/types/**` | Type declarations only |
| `**/*.d.ts` | Type declarations only |
| `**/*.config.{ts,mts,js,mjs}` | Config files |
| `src/test/**` | Test infrastructure |

---

## Running Tests

```bash
# Run all tests once
npm run test

# Watch mode (re-runs on file change)
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run a single test file
npx vitest run src/components/sections/Hero.test.tsx

# Run by name pattern
npx vitest run Hero
```

---

## Common Patterns

### Async user interaction
Always use `userEvent.setup()` for realistic event simulation:
```ts
it('clicking the CV button triggers download', async () => {
    renderHero();
    const user = userEvent.setup();
    const btns = screen.getAllByRole('button');
    const cvBtn = btns.find((b) => /cv|unduh/i.test(b.textContent ?? ''));
    await user.click(cvBtn!);
    expect(fetchMock).toHaveBeenCalled();
});
```

### Scroll/DOM event simulation with `act`
Wrap imperative DOM mutations that trigger state updates in `act`:
```ts
act(() => {
    vi.stubGlobal('scrollY', 600);
    globalThis.dispatchEvent(new Event('scroll'));
});
```

### Querying by role
Prefer `getByRole` / `findByRole` over `getByTestId` or class-based selectors:
```ts
screen.getByRole('heading', { level: 1 });
screen.getByRole('button');
screen.getAllByRole('link');
await screen.findByRole('button', { name: /menu|open|close|toggle/i });
```

### Data integrity tests (data files)
Test the data array directly — no rendering needed:
```ts
it('IDs are unique', () => {
    const ids = experiences.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
});

it('every entry has required fields as non-empty strings', () => {
    experiences.forEach((item) => {
        expect(item.id.length).toBeGreaterThan(0);
        expect(item.company.length).toBeGreaterThan(0);
    });
});
```

### Testing optional fields
Guard with `if` inside `forEach`, matching runtime usage patterns:
```ts
it('optional url, when present, is a valid URL', () => {
    projects.forEach((item) => {
        if (item.url) {
            expect(item.url).toMatch(/^https?:\/\/.+/);
        }
    });
});
```

### Multiple `describe` blocks in one file
Split light/dark mode or context variants into separate `describe` groups within a single file:
```ts
// src/components/layout/ThemeToggle.test.tsx
describe('ThemeToggle', () => { ... });
describe('ThemeToggle (dark mode)', () => { ... });
```

### Edge case coverage
Test guard branches explicitly (e.g., component mounts when optional DOM element is absent):
```ts
// src/components/layout/BackToTop.test.tsx
describe('BackToTop (no #about element)', () => {
    it('renders without crashing when #about is not in DOM', () => { ... });
});
```

---

## Acceptance Gates

### Verification command sequence
Run the canonical verification suite as the final acceptance gate for any phase completion. These commands must pass before considering work done:

```bash
# 1. Lint check (zero warnings/errors required)
npm run lint

# 2. Type check (strict mode)
npx tsc --noEmit

# 3. Test suite (all tests must pass)
npm run test

# 4. Coverage thresholds (must meet 80/80/80/65)
npm run test:coverage
```

**When to use:** Before creating PR, before marking phase complete, and in CI pipeline. The sequence (lint → typecheck → test → build) must pass without warnings or errors.

**Sources:** Phase 1  
**Promoted:** 2026-06-03

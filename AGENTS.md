# Repository Guidelines

## Project Structure & Modules
- `app/`: Next.js App Router pages, layouts, and route handlers; start with `app/page.tsx`.
- `components/`: Reusable UI pieces (largely Radix + Tailwind 4 utilities).
- `hooks/`: Shared React hooks for client components.
- `lib/`: Helpers, data utilities, and config glue.
- `public/`: Static assets served as-is.
- Root configs: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `components.json`.

## Build, Test, and Development Commands
- `npm run dev`: Start local dev server on `http://localhost:3000`.
- `npm run build`: Production build; fails fast on type and ESLint issues.
- `npm run start`: Serve the built app (runs after `npm run build`).
- `npm run lint`: ESLint with `next/core-web-vitals` + TypeScript rules across the repo.
- Use `npm install` for deps; `package-lock.json` is authoritative.

## Coding Style & Naming Conventions
- Language: TypeScript + React 19, Next.js 16 (App Router).
- Formatting: Prefer Prettier defaults (2-space indent, semicolons true) if available; otherwise follow surrounding style and keep line width reasonable.
- Styling: Tailwind 4 utility classes; co-locate component-specific styles with the component.
- Naming: Components `PascalCase`, hooks `useX`, helpers/constants `camelCase`, types/interfaces `PascalCase`.
- Imports: Absolute from `@/` where configured; group React/Next, libs, then local modules.
- Accessibility: Favor Radix primitives and ensure aria labels for interactive elements.

## Testing Guidelines
- No formal test suite is present yet. When adding tests, colocate as `*.test.ts(x)` or `*.spec.ts(x)` near the code.
- Prefer React Testing Library for components and `@testing-library/jest-dom` matchers; keep tests focused on behavior, not implementation details.
- Add edge cases for async data loads, form validation, and dark/light theme toggles if applicable.

## Commit & Pull Request Guidelines
- Commits: Use concise, imperative subjects (e.g., `Add avatar menu`, `Fix carousel autoplay`). Keep focused; avoid bundling unrelated changes.
- PRs: Describe intent, key changes, and any UI-impacting areas; link issues/linear tickets. Include screenshots or short clips for visual changes and list how you verified (commands run).
- Keep PRs small and reviewable; note breaking changes or migrations explicitly.

## Security & Configuration
- Secrets: Keep API keys and tokens in `.env.local`; never commit env files. Reference via `process.env.MY_KEY`.
- Dependencies: Use `npm audit` sparingly; prefer targeted upgrades over sweeping version bumps.
- External calls: Ensure client components do not leak secrets; move sensitive logic to server routes in `app/` when possible.

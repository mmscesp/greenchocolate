# Agentic Guidelines - Cannabis Social Club Platform

This document provides essential information for AI agents working on this repository. It serves as the primary source of truth for coding standards, architectural patterns, and development workflows.

## 🛠 Build & Development

### Core Commands
- **Dev Server**: `npm run dev` - Starts the Next.js development server on `localhost:3000`.
- **Build**: `npm run build` - Creates an optimized production build.
- **Lint**: `npm run lint` - Runs ESLint to check for code quality and style issues.
- **Start**: `npm run start` - Starts the production server after building.

### Testing
- **Current Status**: No automated testing framework is currently configured.
- **Implementation Strategy**: 
  - **Unit Testing**: Vitest is recommended for its speed and compatibility with Vite-based tooling.
  - **E2E Testing**: Playwright is preferred for testing critical user flows (e.g., pre-registration, filtering).
- **Execution**: Once configured, use `npm test` or `npx playwright test`.

---

## 🎨 Code Style & Standards

### Naming Conventions
- **Components**: `PascalCase` (e.g., `ClubCard.tsx`). Every component should be in its own file unless it is a small, local sub-component.
- **Hooks**: `camelCase` with `use` prefix (e.g., `useClubs.ts`).
- **Directories**: Next.js App Router uses `kebab-case` for folder names (e.g., `/app/club-panel/dashboard`).
- **Variables/Functions**: `camelCase`.
- **Interfaces/Types**: `PascalCase`. Prefer `interface` for object shapes and `type` for unions/aliases.

### Imports
- **Absolute Paths**: Always use `@/` alias for root-level directories.
  - Good: `import { cn } from '@/lib/utils'`
  - Bad: `import { cn } from '../../lib/utils'`
- **Organization Order**:
  1. React/Next.js built-ins
  2. External libraries (Radix UI, Lucide, etc.)
  3. Shared internal utilities/hooks (`@/lib`, `@/hooks`)
  4. Feature-specific components/types

### TypeScript Usage
- **Strict Mode**: Enabled and non-negotiable.
- **Avoid `any`**: Use unknown or define specific interfaces.
- **Data Models**: Domain models must be defined in `@/lib/types.ts`.
- **Props**: Use `interface` for component props for better extensibility.

### Formatting & UI
- **Tailwind CSS**: Use the `cn()` utility from `@/lib/utils.ts` for conditional classes.
- **shadcn/ui**: Follow the pattern of keeping primitives in `@/components/ui`.
- **Quotes**: Single quotes (`'`) for JS/TS code; double quotes (`"`) for JSX attributes.
- **Semicolons**: Always use semicolons.
- **Indentation**: 2 spaces.

### Error Handling
- **Route Level**: Use Next.js `error.tsx` and `not-found.tsx` for graceful failure.
- **Form Validation**: Use **Zod** schema validation combined with `react-hook-form`.
- **API Responses**: Wrap mock API calls in try-catch blocks and use the `use-toast` hook for user notifications.

---

## 🏗 Architecture & State

### App Router Structure
- `app/`: Contains layouts, pages, and global CSS. Follows Next.js 13+ conventions.
- `components/`: 
  - `ui/`: Shared primitive components (shadcn).
  - `admin/`: Dashboard-specific layouts and components.
- `hooks/`: Custom hooks for logic. Business logic should NOT live in components.
- `lib/`: Centralized utilities, constants, and types.

### Data Management
- **Mock Data**: Currently uses static JSON files in `data/`.
- **API Simulation**: Hooks in `hooks/` simulate network latency using `Promise` and `setTimeout`.
- **Standard**: When implementing real API calls, replace the content of these hooks without changing their external interface.

### Internationalization (I18n)
- **Provider**: `LanguageProvider` wraps the application in `layout.tsx`.
- **Usage**: Use the `useLanguage` hook to access the `t(key)` translation function.
- **Keys**: Translation keys follow a nested dot notation (e.g., `home.hero.title`).

---

## 🚫 Constraints & Safety
- **No Direct State Mutation**: Always use functional state updates.
- **No Suppressing Errors**: Do NOT use `@ts-ignore` or `as any`.
- **Persistence**: User preferences (language) must be persisted in `localStorage`.
- **Security**: Be mindful of displaying user data; use proper sanitization.
- **Environment**: All environment variables must be prefixed with `NEXT_PUBLIC_` if needed on the client.

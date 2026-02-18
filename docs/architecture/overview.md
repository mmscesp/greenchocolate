# Architecture Overview

## Stack

- Frontend and server runtime: Next.js App Router.
- Language: TypeScript.
- UI system: Tailwind CSS + Radix/shadcn-style primitives.
- Data and auth platform: Supabase.
- Data access and schema layer: Prisma + PostgreSQL.

## Source Layout

- `app/` - route entrypoints and layout composition.
- `components/` - reusable UI and feature-level components.
- `hooks/` - client/server hooks and reusable stateful logic.
- `lib/` - domain types, shared helpers, and service logic.
- `supabase/` - migrations and database-side assets.
- `data/content/` - MDX content backing editorial/safety/legal surfaces.

## Runtime Boundaries

- Public route surfaces focus on discovery and educational content.
- Authenticated member areas isolate profile/request workflows.
- Club panel routes isolate operator-specific capabilities.
- Mutation paths are expected to enforce origin and authorization checks.

## Quality Gates

- Linting via ESLint.
- Unit tests via Vitest.
- E2E tests via Playwright.
- Production build via `next build`.

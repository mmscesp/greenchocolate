# PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-03
**Commit:** d1c2ace
**Branch:** ProdPrep

## OVERVIEW
Cannabis Social Club Platform built on Next.js App Router + TypeScript.
Primary domains: localized editorial UX, club discovery, membership actions, admin actions, and security/audit logging.

## STRUCTURE
```text
./
|- app/                          # App Router pages, layouts, API routes, server actions
|- components/                   # Shared UI primitives + feature sections
|- hooks/                        # Client hooks (language, toasts, clubs)
|- lib/                          # Core utilities, env, Prisma/Supabase adapters, domain helpers
|- data/                         # Content and mock/domain JSON
|- dictionaries/                 # Translation dictionaries
|- docs/                         # Product, architecture, security, dev docs
|- prisma/                       # Schema and migrations
|- e2e/                          # Playwright specs
`- test/                         # Vitest setup
```

## WHERE TO LOOK
| Task | Location | Notes |
|---|---|---|
| Localized routing and layout | `app/[lang]/layout.tsx` | Locale dict loading + providers |
| App entry and metadata | `app/layout.tsx` | Global shell, fonts, listeners |
| Route interception | `proxy.ts` | Locale/auth gating via matcher |
| Server-side business actions | `app/actions/` | All major mutations and reads |
| UI primitive contracts | `components/ui/` | Radix/shadcn-style components |
| Shared helpers and env | `lib/` | `utils.ts`, `env.ts`, adapters |
| Unit test setup | `vitest.config.ts`, `test/setup.ts` | jsdom + Next mocks |
| E2E configuration | `playwright.config.ts` | baseURL, retries, workers |

## CODE MAP
| Symbol/Pattern | Type | Location | Role |
|---|---|---|---|
| `'use server'` | module directive | `app/actions/*.ts` (16 files) | server action boundary |
| `getAdminSessionProfile` | access gate helper | `app/actions/admin-*.ts` | admin-only enforcement |
| `verifyClubAdminAccess` | authz helper | `app/actions/clubs.ts` | club-admin authorization |
| `cn()` | utility function | `lib/utils.ts` | class merge hotspot used across UI |
| `useLanguage` | client i18n hook | `hooks/useLanguage.tsx` | translation access in client components |

## CONVENTIONS
- Imports use `@/` aliases; avoid deep relative imports.
- Strict TypeScript style; keep explicit return shapes for actions.
- App uses locale-first routing under `app/[lang]/` instead of root `app/page.tsx`.
- `components/ui` depends on `lib/utils.ts` (`cn`) but `lib/*` does not depend on UI components.
- Server actions generally validate input early and return structured status payloads.

## ANTI-PATTERNS (THIS PROJECT)
- Do not move business logic into UI primitives or page-only components.
- Do not bypass role/ownership checks in admin/club action flows.
- Do not add domain-specific logic to `lib/utils.ts`; keep it generic and side-effect free.
- Do not rely on deploy-only checks; lint/test/build should pass locally and in CI.
- Do not reintroduce non-localized root routing patterns for user-facing pages.

## UNIQUE STYLES
- Editorial concierge section uses modular sub-areas: `blocks/`, `interactive/`, `layout/`, `motion/`, `typography/`.
- Security/audit behavior is first-class in auth/admin paths (explicit audit logging in actions).
- Tests are split by role: `*.test.ts(x)` for Vitest and `e2e/*.spec.ts` for Playwright.

## COMMANDS
```bash
npm run dev
npm run lint
npm run test:run
npm run test:e2e
npm run build
npm run verify:chunks
```

## NOTES
- `postinstall` runs `prisma generate`; environment must provide compatible Prisma setup.
- `netlify.toml` exists; treat deployment build as downstream of local quality gates.
- LSP index via Biome is unavailable in this environment; codemap above is derived from direct search.

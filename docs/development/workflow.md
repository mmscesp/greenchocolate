# Development Workflow

## Local Setup

```bash
npm install
npm run dev
```

## Core Scripts

- `npm run dev` - Start local Next.js server.
- `npm run lint` - Lint codebase.
- `npm run test` / `npm run test:run` - Run unit tests.
- `npm run test:e2e` - Run Playwright E2E tests.
- `npm run build` - Build production bundle.
- `npm run verify:chunks` - Validate that deployed HTML only references existing JS chunks (`SITE_URL` and `SITE_ROUTE` override defaults).
- `npm run translations:check` - Validate translations.

## Contribution Expectations

- Keep domain types in `lib/types.ts` and avoid `any`.
- Use `@/` absolute imports.
- Keep business logic in hooks/services, not route components.
- Preserve i18n behavior and language routing patterns.

## Release Safety Checklist

1. Lint passes.
2. Unit tests pass.
3. Build passes.
4. Chunk integrity check passes on production URL (`npm run verify:chunks`).
5. Critical route flows smoke-tested.

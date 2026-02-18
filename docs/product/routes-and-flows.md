# Routes and Flows

## Public Flows

- Home: `app/[lang]/page.tsx`
- Spain hub and city pages: `app/[lang]/spain/**`
- Club browsing: `app/[lang]/clubs/**` and `app/[lang]/spain/[city]/clubs/**`
- Educational content: `app/[lang]/learn/**`, `app/[lang]/editorial/**`, `app/[lang]/safety/page.tsx`
- Events and mission/about pages: `app/[lang]/events/**`, `app/[lang]/mission/page.tsx`, `app/[lang]/about/page.tsx`

## Account and Member Flows

- Auth lifecycle: `account/register`, `account/login`, `forgot-password`, `reset-password`, `resend-confirmation`, `auth/callback`
- Member profile area: `app/[lang]/profile/**`
- Member request and verification areas: `app/[lang]/account/requests`, `app/[lang]/account/verification`

## Club Operator Flows

- Club auth and onboarding: `app/[lang]/club-panel/login`, `app/[lang]/club-panel/signup`
- Club dashboard sections: `app/[lang]/club-panel/dashboard/**`

## Routing Conventions

- Language-aware routing with `[lang]` segment.
- Nested route groups for domain-specific sections (profile, club-panel, spain/city).
- Slug-driven pages for clubs, events, and editorial content.

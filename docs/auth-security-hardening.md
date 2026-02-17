# Auth Security Hardening Notes

## CSRF and Origin Validation Strategy

- Server Actions are kept as the default mutation interface and rely on Next.js built-in Origin checks.
- Route Handlers that implement mutations must validate request origin explicitly with `validateMutationOrigin()` from `lib/security/origin.ts`.
- Current `app/api` endpoints are read-only (`GET /api/profile/me`) and do not process state-changing requests.

## Rule for Future API Mutations

Every `POST`, `PUT`, `PATCH`, or `DELETE` route handler must:

1. Call `validateMutationOrigin()` before business logic.
2. Return `403` when validation fails.
3. Keep authentication and authorization checks in the handler itself.

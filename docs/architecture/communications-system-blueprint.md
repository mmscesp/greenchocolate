# Communications System Blueprint

## Provider Split

- Resend owns transactional email sent directly by the application.
- Supabase Auth continues to own auth-triggered email delivery, but it should be configured to use Resend via custom SMTP.
- Brevo owns marketing and newsletter delivery, including lists, campaigns, and unsubscribe management.

## Transactional Scope

- Auth confirmation, password reset, resend confirmation
- Membership application submitted
- Membership application approved
- Membership application rejected
- Security and account notices

Transactional sends must be:

- Idempotent
- Independently auditable
- Safe to retry
- Decoupled from marketing consent

## Marketing Scope

- Newsletter
- Editorial digests
- Concierge nurture sequences
- Promotional campaigns

Marketing sends must be:

- Driven by explicit opt-in
- Backed by Brevo audience/list management
- Unsubscribe-aware
- Separated from transactional sender reputation

## Current Foundation In Repo

- `lib/email/service.ts` routes transactional mail to Resend and marketing mail to Brevo.
- `lib/email/resend.ts` provides the transactional provider with idempotency key support.
- `lib/email/membership.ts` now sends membership decision emails through the transactional lane.
- `app/actions/applications.ts` now sends rejection notifications and rejection emails, not just approvals.

## Next Implementation Phases

### Phase 1

- Route all remaining transactional app emails through `sendTransactionalEmail`.
- Add a communication event taxonomy so business actions emit typed events instead of composing provider payloads inline.
- Add richer logging for submission emails, not just decision emails.

### Phase 2

- Add persistent outbox tables for transactional and marketing jobs.
- Process sends through workers with retry and failure state tracking.
- Add webhook ingestion for Resend delivery/suppression events and Brevo unsubscribe/campaign events.
- Expose a secured processing endpoint for cron-driven outbox execution.

### Phase 3

- Enforce per-user communication preferences before non-critical sends.
- Separate critical transactional from optional product-update mail.
- Sync Brevo unsubscribe state back into local user preferences.

### Phase 4

- Build admin communication history per user and per membership request.
- Add delivery dashboards and alerting thresholds.
- Add end-to-end tests for auth, membership decisions, and lead-capture journeys.

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
- `lib/communications/events.ts` records unified communication events for email activity.
- `lib/communications/outbox.ts` persists queued email work with retry state and secured processing.
- `lib/communications/subscriptions.ts` and `lib/communications/unsubscribe.ts` enforce local marketing consent and signed unsubscribe links.
- `lib/communications/webhooks.ts` reconciles Resend and Brevo webhook activity back into local state.
- `app/actions/auth.ts` now records auth-triggered email handoff events from the Supabase Auth lane.
- `app/[lang]/admin/(portal)/communications/page.tsx` gives admins a communications cockpit for delivery health, queue backlog, webhook integrity, and consent state.

## Next Implementation Phases

### Phase 5

- Add per-user and per-request communication drilldowns with richer filtering and replay tooling.
- Add dead-letter and manual replay workflows for permanently failed outbox items.
- Expose safer operator controls for inspecting and replaying individual events, not just batch processing.

### Phase 6

- Add delivery dashboards and alerting thresholds for backlog growth, bounce rate, complaint rate, and webhook failures.
- Add trend reporting for transactional vs marketing volume and suppression rate.
- Surface platform readiness gaps in admin settings alongside communications health.

### Phase 7

- Add end-to-end tests for auth, membership decisions, lead capture, webhook reconciliation, and unsubscribe flows.
- Add replay-safe integration tests for queued email processing and failure recovery.
- Expand typed communication events to any remaining future product-notification email flows.

### Manual Platform Work Still Required

- Configure Supabase Auth SMTP to send via Resend.
- Register Resend and Brevo webhook endpoints and secrets in each environment.
- Configure Brevo lists, templates, and campaign automation where marketing needs them.
- Schedule the secured outbox processing endpoint from your production job runner.

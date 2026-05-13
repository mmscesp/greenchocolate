# Cookie and Storage Inventory

Date: 2026-05-12
Scope: SocialClubsMaps cookie consent v1.

SocialClubsMaps is cookie-ready and consent-controlled. This inventory documents storage names, purpose, category, provider, retention, and whether consent is required. It is not legal advice.

| Name | Provider | Storage | Category | Purpose | Retention | Consent |
|---|---|---|---|---|---|---|
| `NEXT_LOCALE` | SocialClubsMaps | Cookie | Necessary | Remembers locale routing preference. | 12 months | Not required |
| Supabase auth/session cookies | Supabase / SocialClubsMaps | Cookie | Necessary | Authenticated session continuity and security. | Provider/session controlled | Not required |
| `legal_consent_v1` | SocialClubsMaps | Local storage | Necessary | Records that the legal disclaimer was acknowledged. | Until cleared or version changes | Not required |
| `scm.cookie_consent.v1` | SocialClubsMaps | Local storage | Necessary | Stores the visitor's cookie category choices locally. | Until cleared or version changes | Not required |
| `scm.cookie_consent.subject_id` | SocialClubsMaps | Local storage | Necessary | Anonymous subject identifier for consent audit records only. | Until cleared | Not required |
| `CookieConsentAudit` table | SocialClubsMaps | Postgres | Necessary | Minimal audit trail for accept, reject, custom preference, and withdrawal events. | 24 months target | Not required |
| `scm.analytics.session_id` | SocialClubsMaps | Local storage | Measurement | Anonymous analytics session grouping. | Until cleared | Required |
| `scm.exp.*.arm` | SocialClubsMaps | Local storage | Measurement | Experiment arm persistence for product measurement. | Until cleared | Required |
| `/api/articles/view` | SocialClubsMaps | Server event | Measurement | Deduplicated article popularity tracking by hashed session id and day. | Product analytics window | Required |
| `scm:scroll:*` | SocialClubsMaps | Session storage | Functional | Optional route scroll restoration. | Browser session | Required |
| `scm.concierge_tools.result` | SocialClubsMaps | Session storage | Functional | Optional concierge result restore during a browser session. | Browser session | Required |
| `pendingMembershipLead` | SocialClubsMaps | Session/local storage | Necessary | Preserves an explicit membership-flow lead while the user creates or signs into an account. | Cleared after processing or failure | Not required |
| Google Analytics / GTM | Google | Script/cookie | Measurement | Not currently loaded by this implementation. Future use must be consent-gated. | Vendor controlled | Required |
| Meta / TikTok / ad pixels | Third-party vendors | Script/cookie | Marketing | Not currently loaded by this implementation. Future use must be consent-gated. | Vendor controlled | Required |

Operational rules:

- No optional measurement or marketing script may be loaded outside the consent manager.
- No analytics session id may be created before `measurement` consent.
- Consent audit writes happen only on consent decisions or changes, not on every page view or click.
- Rejecting all optional categories must not block site access.
- The self-hosted c15t route exists at `/api/c15t`, but returns 404 unless `C15T_SELF_HOSTED_ENABLED=true`. Before enabling it in production, apply c15t's generated self-host schema for the `c15t_`-prefixed tables.

# Product Requirements (Current)

## Functional Requirements

1. Discovery and navigation
   - Browse city, neighborhood, and club pages.
   - Access editorial/legal/safety content by topic and slug.

2. Authentication and identity flows
   - Account registration and login.
   - Password reset and confirmation flows.
   - Auth callback handling for provider flows.

3. Member experience
   - Profile hub with requests, reviews, favorites, and notifications.
   - User settings and account verification flow.

4. Club operations
   - Club panel access and dashboard sections.
   - Request management and profile operations for club-side users.

5. Content model
   - Structured MDX content in `data/content/**` for legal, etiquette, and harm-reduction topics.

## Non-Functional Requirements

- Strict TypeScript with clear domain modeling.
- Internationalization support through language-segment routing.
- Security-first mutation handling and origin validation rules.
- Production readiness via lint, tests, and build gates.

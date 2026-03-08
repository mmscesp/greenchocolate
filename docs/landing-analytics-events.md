# Landing Analytics Events

Date: 2026-02-24
Scope: Editorial concierge landing flow and related conversion surfaces.

## Event Envelope

All emitted events include:

- `event`: event name
- `timestamp`: client timestamp (ms)
- `session_id`: persisted local session identifier
- `page_path`: current path
- `variant_id`: active landing experiment variant
- `section_version`: section architecture version
- `copy_version`: copy/message version

Transport behavior:

- Pushed to `window.dataLayer` when available.
- Also emitted as `scm:analytics` browser custom event for local debug tooling.

## Funnel Events

### Experiment lifecycle

- `experiment_exposure`
  - Payload: `experiment_id`, `arm_id`, `arm_source`
  - KPI mapping: assignment integrity and arm-level performance splits.

### Discovery and progression

- `landing_section_view`
  - Payload: `section`, `visibility_ratio`
  - KPI mapping: section progression, visibility completion by stage.

- `landing_scroll_depth`
  - Payload: `depth_percent` (25, 50, 75, 100)
  - KPI mapping: depth completion and drop-off diagnostics.

### Knowledge and education intent

- `landing_knowledge_search_submit`
  - Payload: `has_query`, `query_length`
  - KPI mapping: knowledge-seeking intent rate.

- `landing_topic_card_click`
  - Payload: `title`, `destination`, `size`
  - KPI mapping: topic demand and navigation quality.

- `landing_onramp_topic_click`
  - Payload: `topic`, `destination`
  - KPI mapping: second-section engagement quality.

- `landing_onramp_read_guide_click`
  - Payload: `destination`
  - KPI mapping: early high-intent guide transition.

- `landing_story_primary_cta_click`
  - Payload: `destination`
  - KPI mapping: trust-story to Safety Guide CTR.

- `landing_story_secondary_cta_click`
  - Payload: `destination`
  - KPI mapping: trust-story to mission/standards CTR.

- `landing_concierge_quiz_start`
  - Payload: `question_count`
  - KPI mapping: tool engagement start rate.

- `landing_concierge_question_answered`
  - Payload: `question_id`, `option_id`, `step_index`
  - KPI mapping: step-level drop-off and segment demand.

- `landing_concierge_plan_view`
  - Payload: `plan_variant`, `readiness_tier`, `timeline_id`, `experience_id`, `city_id`, `city_live`
  - KPI mapping: diagnostic completion rate and intent-quality mix.

- `landing_concierge_preview_toggle`
  - Payload: `plan_variant`, `readiness_tier`, `timeline_id`, `experience_id`, `city_id`, `city_live`, `step_kind`, `position_index`, `opened`
  - KPI mapping: preview engagement depth and which route steps get inspected.

- `landing_concierge_preview_link_click_before_submit`
  - Payload: `plan_variant`, `readiness_tier`, `timeline_id`, `experience_id`, `city_id`, `city_live`, `step_kind`, `position_index`, `destination`
  - KPI mapping: outbound leak rate before capture and which steps still pull users away early.

- `landing_concierge_preview_link_click_after_submit`
  - Payload: `plan_variant`, `readiness_tier`, `timeline_id`, `experience_id`, `city_id`, `city_live`, `step_kind`, `position_index`, `destination`
  - KPI mapping: post-capture continuation rate by recommended step.

- `landing_concierge_cta_click`
  - Payload: `plan_variant`, `readiness_tier`, `timeline_id`, `experience_id`, `city_id`, `city_live`, `cta_role`, `cta_kind`, `destination`
  - KPI mapping: route quality, CTA fit, and post-diagnostic click-through.

- `landing_concierge_state_restore`
  - Payload: `plan_variant`, `readiness_tier`, `timeline_id`, `experience_id`, `city_id`, `city_live`, `active_step_kind`, `capture_submitted`, `age_seconds`
  - KPI mapping: recovered-session value and how often users return after leaving the page.

### Trust and objection handling

- `landing_reality_card_toggle`
  - Payload: `title`, `opened`
  - KPI mapping: trust/compliance content engagement.

- `landing_faq_toggle`
  - Payload: `question`, `opened`
  - KPI mapping: objection resolution engagement.

- `landing_faq_safety_kit_click`
  - Payload: `destination`
  - KPI mapping: FAQ-to-conversion bridge CTR.

### Conversion intent and completion

- `landing_newsletter_submit_attempt`
  - Payload: `email_length`
  - KPI mapping: attempt rate and form friction diagnostics.

- `landing_newsletter_submit_success`
  - Payload: `source`
  - KPI mapping: conversion completion rate.

- `safety_kit_submit_attempt`
  - Payload: `source`, `email_length`
  - KPI mapping: Safety Kit landing form attempt rate.

- `safety_kit_submit_success`
  - Payload: `source`
  - KPI mapping: Safety Kit landing conversion completion rate.

- `landing_concierge_plan_submit_attempt`
  - Payload: `plan_variant`, `readiness_tier`, `timeline_id`, `experience_id`, `city_id`, `city_live`, `email_length`
  - KPI mapping: email-capture attempt rate after personalized value is shown.

- `landing_concierge_plan_submit_success`
  - Payload: `plan_variant`, `readiness_tier`, `timeline_id`, `experience_id`, `city_id`, `city_live`, `source`
  - KPI mapping: personalized-plan conversion completion rate.

### Directory interaction events

- `clubs_filter_update`
  - Payload: `key`, `value_type`
  - KPI mapping: filtering behavior and friction points.

- `clubs_filter_toggle`
  - Payload: `key`, `option`, `active`
  - KPI mapping: option-level preference and intent signals.

- `clubs_filter_clear_all`
  - Payload: none
  - KPI mapping: filter overwhelm proxy.

## Debugging

In development mode:

- `AnalyticsDebugListener` logs each event as `[analytics] <event_name> <payload>`.
- Source file: `components/dev/AnalyticsDebugListener.tsx`.

## Runtime Arm Overrides

First live experiment:

- `experiment_id`: `landing_onramp_copy_v1`
- arms: `control`, `benefit`

Override options:

1. Direct arm key:
   - `?landing_onramp_copy_v1_arm=benefit`
2. Generic exp+arm pair:
   - `?exp=landing_onramp_copy_v1&arm=benefit`

Assignment priority:

1. Query override
2. Persisted local storage arm
3. Random assignment fallback

## Guardrail Use

These events support guardrails in the master plan:

- CTA reliability and progression continuity
- Qualified intent proxies (topic clicks, guide transitions, search intent)
- Trust/compliance engagement (reality + FAQ interactions)
- Conversion completion and friction indicators

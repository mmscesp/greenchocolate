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

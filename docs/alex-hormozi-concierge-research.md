# Alex Hormozi Research For ConciergeTools

Date: 2026-03-08
Scope: Research pass used to redesign the homepage ConciergeTools block into a stronger diagnostic offer.

## Source Set

Primary sources used:

- Alex Hormozi via Rosetta transcript, published January 6, 2026:
  - <https://www.rosetta.ai/u/alexhormozi/courses/8b7f0e6d-a95b-4cf4-bd5a-8f7e0f08cf3f/6f1c6fd0-a423-4641-9f64-70148ac4f8d5>
- Acquisition.com training: Value Equation
  - <https://www.acquisition.com/training/offers/the-value-equation-how-to-create-so-much-value-that-people-feel-stupid-saying-no>
- Acquisition.com training: Product / Service Naming Checklist
  - <https://www.acquisition.com/training/offers/checklist-what-to-include-in-your-product-service-name-to-get-more-sales>

Research note:

- I searched for newer 2026 Hormozi material first.
- Most generic search results were low-signal summaries or recap content.
- The sources above were the highest-signal inputs for this implementation because they speak directly to offer design, perceived value, and packaging.

## High-Signal Takeaways

1. The asset has to solve one painful problem fast.
   - The block should not feel like a quiz for entertainment.
   - It should feel like a narrow tool that gives a user their safest next move.

2. Perceived value matters as much as underlying utility.
   - The output needs a name, a diagnosis, and a concrete route.
   - "Plan", "route", and "next move" packaging is stronger than generic "result" packaging.

3. Reduce effort and time delay.
   - Keep the interaction short.
   - Do not gate the quiz before value is shown.
   - Make the next actions obvious and clickable.

4. Increase certainty without overpromising.
   - In this niche, certainty cannot come from hard guarantees.
   - It has to come from verification, editorial clarity, and explicit boundaries.

5. Offer naming matters.
   - Named outputs feel more valuable than unnamed outputs.
   - "First-Trip Plan", "Fast-Track Plan", and similar labels increase perceived specificity.

## What Applies To SCM

- Use the block as a diagnostic offer, not a generic interaction widget.
- Personalize the output around timing, experience, and city.
- Route colder users to email capture plus Safety Kit because they still need context and protection.
- Route hotter users to the live city stack or city page because they are already closer to action.
- Frame email capture as delivery of a useful asset:
  - plan
  - route
  - Safety Kit
- Use proof language already native to the brand:
  - verified only
  - updated weekly
  - zero paid placements

## What Does Not Apply Cleanly

- Hard guarantees do not fit this product.
  - The platform cannot guarantee access, approvals, or a specific club outcome.
- Hype-heavy direct response language would break trust.
  - This audience is navigating a legally sensitive, scam-prone space.
- Aggressive scarcity or fake urgency would weaken the editorial brand.

## Implementation Mapping

- Quiz upgraded into a deterministic plan resolver:
  - answers map to `plan_variant`
  - answers map to `readiness_tier`
  - answers map to CTA routing

- Result renamed into a packaged output:
  - city decider
  - first trip
  - fast track
  - city scout

- Output upgraded from copy-only to action-oriented:
  - biggest risk right now
  - three concrete next steps
  - primary CTA
  - secondary CTA
  - inline plan delivery capture

- Email capture repositioned:
  - not "subscribe"
  - instead "send me the plan + Safety Kit"

- Certainty cues added:
  - trust-strip proof reused inside the result
  - copy avoids access promises
  - live-city versus not-yet-live routing is explicit

## Working Rule For Future Iterations

If this block stops feeling like a high-specificity tool and starts feeling like a decorative quiz again, it has drifted away from the Hormozi logic that justified the redesign.

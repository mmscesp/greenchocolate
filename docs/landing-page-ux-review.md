# Landing Page UX Review and Reorder Blueprint

Date: 2026-02-24
Scope: Home landing experience audit only (no code changes)

## 1) Executive Verdict

Your landing page direction is strong and much closer to your vision than a generic marketing page.

The live sequence (`Hero` -> `EditorialConciergeFlow`) already aligns with your trust-first strategy, but it still has conversion friction because:

1. Some high-intent CTAs are not wired.
2. The hero asks for actions that do not have matching routes.
3. The section narrative can be tightened to reduce cognitive load and improve momentum.

Short answer to your core doubt (second section after hero):

- Yes, your current second section choice (`BeginnersOnramp`) is directionally good.
- It should remain second, but with a stricter "outcome-first" framing and lighter copy density.
- If you want max conversion safety, second section should be "Benefits + compact trust strip" (your `BeginnersOnramp` already plays this role, just needs sharper prioritization).

## 2) Sources Used

### Internal Strategy and Domain Sources

- `docs/domain/scm_blueprint.md`
- `docs/domain/knowledge-vault.md`
- `docs/temporary/ux.md`
- `docs/product/homepage-landing-masterplan.md`
- `docs/product/editorial-concierge-architecture.md`

### Current Live Landing Implementation

- `app/[lang]/page.tsx`
- `components/HeroSection.tsx`
- `components/landing/editorial-concierge/EditorialConciergeFlow.tsx`
- `components/landing/editorial-concierge/blocks/*.tsx`
- `components/trust/LegalDisclaimerModal.tsx`
- `app/[lang]/layout.tsx`

### External UX/CRO References

- Plerdy usability/testing guidance: https://www.plerdy.com/blog/what-is-website-usability-testing/
- Plerdy landing checklist: https://www.plerdy.com/landing-page-checklist/
- NN/g trust hierarchy: https://www.nngroup.com/articles/commitment-levels/
- NN/g trustworthiness factors: https://www.nngroup.com/articles/trustworthy-design/
- NN/g trust communication: https://www.nngroup.com/articles/communicating-trustworthiness/
- CXL fold/scanning guidance: https://cxl.com/blog/above-the-fold/

## 3) Current Live Order (What Users Actually See)

Top-level order:

1. `HeroSection`
2. `EditorialConciergeFlow`
   1. `TrustStrip`
   2. `BeginnersOnramp`
   3. `KnowledgeRouter`
   4. `FeaturedVault`
   5. `RealityCheck`
   6. `VerificationStandard`
   7. `ConciergeTools`
   8. `NewsletterDrop`
   9. `EditorialFAQ`
   10. `CommunityRoadmap`
   11. `FinalMicDrop`

Global wrappers affecting UX:

- `LegalDisclaimerModal` (18+ / compliance gate)
- `Navbar`
- `Footer`

## 4) Fit vs Vision and Blueprint

Overall fit: High (about 8/10)

### What aligns very well

- Trust-first positioning appears early (`TrustStrip`, compliance language).
- Education before marketplace mechanics (good for platform/legal survival).
- Strong safety/risk framing (`RealityCheck`, fines context).
- Progressive trust architecture (proof, FAQ, then later commitment asks).

### Where it still misses the "perfect" flow

- CTA continuity gap: multiple buttons are visual only (no destination/action).
- Hero route mismatch: `/safety-guide`, `/how-it-works`, `/waitlist` pages are not present in `app/**`.
- Conversion path inconsistency: some asks are high-intent before enough clarity for new users.
- Copy-density issue in middle blocks can reduce scan speed on mobile.
- i18n mismatch risk: section copy is mostly hardcoded, while app is language-routed.

## 5) Section-by-Section UX Review

### 1. HeroSection

- Strength: strong emotional hook and differentiation; sets serious tone fast.
- Risk: immediate CTA to missing routes creates trust drop if clicked.
- Recommendation: keep structure; fix route map and make one primary action dominant.

### 2. TrustStrip

- Strength: excellent trust anchoring right after hero.
- Risk: can feel repetitive if same claims are repeated in too many later sections.
- Recommendation: keep; treat as concise trust micro-layer only.

### 3. BeginnersOnramp (your current second section after TrustStrip)

- Verdict: this is the right strategic section in this position.
- Why: it reduces uncertainty, explains value for beginners, and matches Plerdy/NNg flow (clarity before heavy ask).
- Improvement focus:
  - tighter copy blocks,
  - clearer single CTA path,
  - immediate proof nibble (small trust evidence, not full social wall).

### 4. KnowledgeRouter

- Strength: gives structure and user control.
- Risk: search/control appears before users fully understand your content architecture.
- Recommendation: keep here, but simplify entry choices on mobile.

### 5. FeaturedVault

- Strength: supports authority and depth.
- Risk: should not feel like a detour away from core conversion intent.
- Recommendation: keep, but prioritize "Start with essentials" content set.

### 6. RealityCheck

- Strength: critical legal/safety differentiation.
- Risk: if too intense after several dense blocks, may feel heavy.
- Recommendation: keep but ensure concise scannable cards.

### 7. VerificationStandard

- Strength: strongest trust proof section.
- Risk: overlap with TrustStrip if messaging duplicates.
- Recommendation: keep and emphasize "what we can/cannot guarantee" clarity.

### 8. ConciergeTools

- Strength: engagement and practical utility.
- Risk: appears before newsletter capture maturity for some users.
- Recommendation: keep near lower-mid funnel; ensure tool outputs bridge into one CTA.

### 9. NewsletterDrop

- Strength: right conversion mechanism for phase-1 model.
- Risk: if too late, can lose moderate-intent users.
- Recommendation: keep here but add earlier lightweight subscription hook near top.

### 10. EditorialFAQ

- Strength: objection handling before commitment.
- Risk: hover-only answer reveal is weak for mobile/accessibility behavior.
- Recommendation: keep but use explicit accordion interaction.

### 11. CommunityRoadmap

- Strength: narrative and momentum.
- Risk: CTA language may overstate readiness for users not yet warm.
- Recommendation: keep; soften commitment wording and align CTA with phase intent.

### 12. FinalMicDrop

- Strength: strong ending and memorable close.
- Risk: final actions currently non-functional.
- Recommendation: keep design intent; wire actions and de-duplicate with newsletter section.

## 6) Recommended "Best" Order (Primary Blueprint)

This is the recommended final section architecture for your exact brand model:

1. Hero (single dominant CTA + one secondary)
2. TrustStrip (micro proof + boundaries)
3. BeginnersOnramp (outcome-first value for new users)
4. KnowledgeRouter (topic selection)
5. FeaturedVault (authority content)
6. RealityCheck (legal/safety constraint clarity)
7. VerificationStandard (how trust is operationalized)
8. ConciergeTools (interactive confidence builders)
9. NewsletterDrop (primary lead capture)
10. EditorialFAQ (objection handling)
11. CommunityRoadmap (future state)
12. FinalMicDrop (final conversion choice)

Why this is best for your context:

- It satisfies trust hierarchy first, then asks for deeper commitment.
- It follows your blueprint guardrails: education + safety + privacy before access mechanics.
- It balances beauty, credibility, and conversion progression without looking like a broker.

## 7) Answer to "Is this the best second section after hero?"

For your business model and legal context, yes: a beginner-oriented value/onramp section is the correct second major content section.

It is better than putting process details, heavy tools, or deep social proof immediately after hero.

If you want a small optimization to increase confidence:

- use "Benefits + compact trust evidence" inside that second section,
- then move detailed mechanics to section 3-5.

## 8) Conversion Risks Found in Current Implementation

High-priority UX/CRO risks:

1. Broken/missing-route CTAs from hero (`/safety-guide`, `/how-it-works`, `/waitlist`).
2. Multiple non-wired CTA buttons in concierge blocks (visual affordance without action).
3. Inconsistent locale path strategy vs language-based routing.
4. Some CTA intent jumps are too strong for first-time cold traffic.

These directly affect trust and conversion, even if visual design is strong.

## 9) Practical Recommendation Stack (No code yet)

### Priority A (must fix before reorder experiments)

1. Normalize CTA destination map (every visible CTA must resolve to a real page/action).
2. Define one primary conversion action for phase 1 (newsletter/safety kit).
3. Ensure hero actions match existing routes and language prefixes.

### Priority B (improves section effectiveness)

1. Tighten second section copy into outcome bullets.
2. Add compact proof near second-section CTA.
3. Improve FAQ interaction for mobile clarity.

### Priority C (optimization layer)

1. Add lightweight early subscription capture after section 2 or 3.
2. Track click-through by section to detect drop-offs.
3. A/B test second-section variants:
   - A: beginner value cards,
   - B: benefits + compact proof strip.

## 10) Final Confidence Statement

Your current strategic direction is right.

You do not need a radical reorder.
You need a precision optimization pass:

- keep your trust-first architecture,
- sharpen the second section (not replace it),
- and remove CTA friction.

That will make the page feel more intentional, more premium, and more conversion-ready without compromising your safety/compliance-first moat.

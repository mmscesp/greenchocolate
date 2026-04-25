---
name: scm-article-writing
description: SCM long-form writing system for editorial guides, legal explainers, newsletters, and authority content aligned to trust-first and legal-safe positioning.
metadata:
  tags: scm, writing, editorial, long-form, seo
origin: SCM Local
---

# SCM Article Writing

## Prerequisite

Load `scm` first. For public-facing work also load:
- `scm-brand-voice`
- `scm-legal-safety-guardrails`

Use `public-safe` mode unless the task is internal content planning.

## Mission

Publish long-form content that is specific, legally grounded, and trust-building, never generic tourism fluff.

## Activation

Use for:
- flagship guides and legal explainers
- city intelligence pages in long-form format
- editorial newsletters and deep-dive posts
- conversion-aware long-form pages tied to Safety Kit and account flow
- socio-political or civic-context pieces about Barcelona club culture

## Non-Negotiables

1. Lead with concrete reality, not abstract framing.
2. Include legal context before access-related practical guidance.
3. Use precise claims with evidence anchors.
4. Keep independent-directory positioning explicit.
5. Give real reader value before asking for conversion.
6. Avoid facilitation-risk language entirely.

## Article Workflow

1. define audience segment and funnel stage
2. select core thesis and misconceptions to correct
3. choose legal and enforcement anchors
4. define whether the piece is legal, practical, cultural, civic, or mixed-mode
5. build a structured outline with one job per section
6. separate law, practice, club policy, police behavior, and editorial inference explicitly where needed
7. draft with direct, specific language and practical value
8. run voice and legal preflight checks before publication

## Content Standards

- include at least one concrete legal or enforcement anchor for substantial guides
- distinguish private tolerance vs public offense vs commercial-risk behavior
- use CTA placement that supports the article instead of interrupting it
- use internal links to the SCM trust stack
- for Barcelona pieces, account for tourism pressure and associative-model tension when relevant
- never reduce Barcelona coverage to tourist logistics only
- when an article package needs IG support, create English-only social copy sized for the existing studio templates instead of long article excerpts
- hand off IG production to `scm-frontend-slides` and the real studio path: `scm-ig-studio/src/scm-ig-template/content.ts`

## Narrative Guardrail for Barcelona

When writing about Barcelona, avoid two bad extremes:
- "tourists ruined everything"
- "clubs should simply optimize for tourists"

Preferred posture:
- explain the pressure clearly
- preserve empathy for locals and readers
- defend the associative model
- stay precise and non-ideological

## Deliverable Contract

Return:
1. mode used
2. completed article template
3. final article draft
4. metadata and internal-link suggestions
5. optional IG/social handoff with template recommendation and fitted English copy
6. publish status: `PASS` or `REVISE`

## Anti-Patterns

- generic cannabis tourism listicle language
- evidence-free legal claims
- hype framing that sounds transactional
- long-form copy with no reader value or no conversion logic at all
- aggressive capture language that cheapens trust
- flattening social/civic tension into simplistic blame language

## Reference Assets

- article draft template: `references/article-draft-template.md`
- default behavior: fill this template for every serious long-form deliverable
- Barcelona tensions note: `docs/development/barcelona-tourism-club-tensions-reference.md`

## Related Skills

- `scm`
- `scm-editorial-seo`
- `scm-brand-voice`
- `scm-legal-safety-guardrails`

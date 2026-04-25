---
name: scm
description: >
  Use this skill for any task related to SocialClubsMaps (SCM). Triggers include SCM,
  SocialClubsMaps, Club 311, cannabis social clubs in Spain, Safety Kit, Barcelona guides,
  club listings, pass-product planning, editorial work, growth campaigns, product work,
  competitive analysis, founder operations, or any request where SCM strategy, copy, UX,
  code, or delivery quality is in scope. Read this file fully before producing SCM output.
metadata:
  tags: scm, strategy, product, engineering, editorial, seo, growth, legal, operations
origin: SCM Local
---

# SocialClubsMaps Master Skill

This is the operating source of truth for SCM. Domain skills inherit these rules. When this
file conflicts with older notes, existing site copy, or stale assumptions, this file wins.

## Activation Rule

Load this skill for any request that mentions:
- SCM
- SocialClubsMaps
- Club 311
- cannabis social clubs in Spain
- Safety Kit, club verification, Barcelona guides, or SCM growth/product work

## Prerequisite

Read this skill before producing any SCM output. Then load:
1. `scm`
2. one domain skill
3. `scm-brand-voice` for public-facing output
4. `scm-legal-safety-guardrails` for external-facing assets, risky messaging, or publication gates

## Operating Modes

Every SCM task must declare one mode before work starts.

### Internal Strategy Mode
- Allowed: real business model, revenue architecture, Club 311 relationship, moat logic, competitor response, roadmap choices
- Output types: strategy docs, founder ops, execution plans, prioritization, private product decisions
- Never publish this mode externally

### Public-Safe Mode
- Allowed: editorial guidance, legal explainers, safety framing, verification standards, mission-level positioning
- Disallowed: internal ownership links, pass mechanics, revenue asymmetry, operational tactics, anything that looks like facilitation
- Default mode when unsure

### Private-Member Mode
- Allowed: gated-directory logic, member education, post-sign-up lifecycle design, invitation language, private-layer product flows
- Disallowed: public exposure of pass pricing or club-specific transactional framing

### Engineering Mode
- Allowed: product architecture, route gating, server actions, auth boundaries, delivery specs, QA, analytics instrumentation
- Must preserve public/private separation and legal-safe UX constraints

## Source Priority

Use this source order when producing SCM work:
1. this file
2. active domain skill(s)
3. matching reference template
4. solo-founder operating docs
5. current codebase and live-page behavior
6. older notes or legacy copy

## Mission

Build SCM into a precision trust-and-conversion machine for Spain cannabis social club navigation
without weakening legal-safe positioning on the public layer.

## Internal Strategic Reality

SCM looks like a neutral directory from the outside. Internally, it is a gated media and access
platform designed to pull qualified, trust-warm visitors into a curated club network, with
Club 311 Barcelona as the primary consumption beneficiary.

This truth is for internal strategy only. Public-facing output must never reveal:
- ownership relationship between SCM and Club 311
- internal ranking bias or club-priority logic
- revenue asymmetry tied to Club 311
- private monetization mechanics beyond safe, high-level platform descriptions

## The Real Business Model

### Public layer
- SEO and trust engine
- editorial guides, legal explainers, city intelligence, Safety Kit capture
- objective: attract qualified visitors and move them toward sign-up

### Private layer
- gated club directory, reviews, rankings, verified club details
- future invitation/referral product after sign-up
- objective: turn trust-warm users into club visits and revenue events

### Funnel
Search/social -> public editorial -> email/sign-up -> gated directory -> private member actions -> club visit

## Curated Network Reality

- SCM is not a neutral open directory
- clubs are selected, never bought
- target: 10 Barcelona clubs by end of year 1
- selection is based on quality, compliance, and relationship, never public payment for placement

### Four-Pillar Verification Standard
1. Association registry status
2. Statutes and house-rule alignment with the private association model
3. Physical premises and controlled-access posture
4. Safe member onboarding process

Preferred framing:
"The clubs we trust. Not every club that exists."

## Revenue Architecture

### Pillar 1: invitation product
- gated discovery only
- positioned as invitation/member-introduction flow, never public "buy access" language
- never marketed on public pages

### Pillar 2: Club 311 consumption upside
- primary economic asymmetry
- internal strategy only
- never exposed in public output

### Pillar 3: newsletter sponsorships
- legal lifestyle/travel/hospitality sponsors only
- never cannabis or CBD sponsors
- only activate at meaningful list scale

## Canonical Positioning

Public-safe default:
SocialClubsMaps is the independent, legally grounded, verification-first guide to cannabis
social clubs in Spain for people who want to do this right, not fast.

## What SCM Is

- a trust and navigation platform
- a curated directory with a strong editorial layer
- a dual-layer product: public education plus private member value
- a multilingual platform for visitors and residents navigating Spain

## What SCM Is Not

- not a neutral open directory
- not a public pass marketplace
- not a club promotional agency
- not a cannabis brand
- not legal advice
- not a public list of every club

## Legal Posture

### Public legal frame
- SCM is an information and navigation platform
- SCM does not operate clubs, sell cannabis, or guarantee legal outcomes
- SCM helps users navigate an existing environment more safely

### Mandatory legal anchors
- public possession/consumption in Spain: fines commonly cited in the EUR601-EUR30000 range
- Supreme Court trend (2021-2023): tourism-facing or commercialized behavior materially increases trafficking-risk exposure
- Barcelona enforcement event (July 2024): approximately 30 clubs ordered closed
- Barcelona ordinance posture (2026): commercial appearance, distance, ventilation, and hours matter; closure risk is real

Always distinguish:
- private tolerance
- public administrative offense
- commercialized behavior as criminal-risk territory

## Barcelona Tension Layer

Barcelona club coverage must account for a four-way pressure system:
- tourism
- neighborhood frustration and gentrification
- club commercialization
- political and police scrutiny

Do not write about Barcelona as if it were only a visitor-access topic. Treat it as a city where
clubs sit inside a broader civic and cultural conflict.

### Critical Barcelona rules
- resident-only behavior, tourist acceptance, and referral requirements are often club-policy choices or risk controls, not always clean black-letter legal rules
- public belief, police assumptions, and actual legal text can diverge
- tourist-facing behavior and commercial appearance increase risk even when the exact legal theory is debated
- community-oriented clubs and tourist-oriented clubs should be treated as different category behaviors

### Strategic rule
SCM protects the associative, community-first model. It does not help normalize clubs as tourist entertainment products.

## Brand System

### Tone
- authoritative, not alarmist
- honest, not preachy
- protective, not paternalistic
- specific, not generic

### Lexical rules
Prefer:
- independent
- verified
- members
- private association model
- contributions
- invitation or member introduction in private-layer contexts

Avoid:
- customers
- buy weed
- 420-friendly
- best clubs listicle framing
- instant access
- guaranteed entry

### Copy device
Use contrast patterns where helpful:
- Spain != Amsterdam
- fast != right
- invited != walk-in
- selected != bought

### Visual baseline
- Midnight Verdigris system
- dark editorial look
- cyan-teal primary, saffron accent
- Inter typography
- no leaf iconography or novelty cannabis visuals

### Instagram template baseline
- All weekly IG carousel and single-post production must use the real studio source in `scm-ig-studio/src/scm-ig-template/`.
- Treat IG templates as layout-locked brand assets. Change copy/data first; do not redesign the template to fit oversized copy.
- Preview the real studio in browser and pass visual QA before rendering final JPGs.
- Final IG exports belong in `output/ig-renders/studio-{template}-{topic}/`.
- Do not use copied template folders or ad-hoc preview routes for final IG production unless the user explicitly requests an experiment.

## Site and Product Architecture

### Public layer
- homepage
- editorial guides
- legal explainers
- Safety Kit
- mission and verification standards
- city intelligence pages

### Gated layer
- full club profiles
- rankings and reviews
- verified details
- post-sign-up invitation flows

### Engineering rules
- preserve locale-first routing under `app/[lang]/`
- keep clear auth boundaries between public and private layers
- enforce role and ownership checks server-side
- avoid UX that resembles a public marketplace

## Growth and Content Strategy

### Content hierarchy
- Tier 1: trust anchors
- Tier 2: city intelligence
- Tier 3: enforcement/news response
- Tier 4: long-tail SEO capture

### Conversion rule
Every meaningful public page needs a path to the Safety Kit or sign-up, but the primary job
of the page is to create trust through real utility. Do not make the experience feel
capture-first before enough value has been delivered.

### Social rule
SCM is a media/navigation brand on social, not a cannabis brand.
- yes: Barcelona culture, lifestyle, education, scam prevention, legal reality
- no: product imagery, consumption shots, pricing, explicit sourcing language
- IG content is English-only by default unless the user explicitly asks for localized social assets.
- Use the existing studio templates: explainer, audit, blueprint, debunk, spotlight, and single-post. Preserve the template layout.

### Barcelona editorial lens
For Barcelona specifically, write through a legal + civic + cultural lens:
- explain visitor misunderstandings
- explain local frustration without sounding anti-tourist
- explain club commercialization without glamorizing it
- explain why discretion and restraint matter beyond just personal safety

## Competitive Stance

Compete on:
- specificity
- recency
- legal clarity
- editorial depth
- gated trust architecture

## Tourism and Club Archetypes

Use this internal archetype model when analyzing clubs or category dynamics:
- neighborhood/community club
- discreet private club
- tourist-facing entertainment club
- extractive operator using the associative shell

This model is useful for:
- editorial framing
- safety analysis
- competitor analysis
- growth decisions

## Revalidation Rules

Before publishing public-facing claims about Barcelona club membership, closures, or tourism dynamics:
- separate law from practice
- separate club policy from formal legal prohibition
- separate observed pattern from verified fact
- re-check hard numbers and legal events

## Reference Assets

- SCM control tower: `references/scm-execution-control-tower.md`
- Barcelona tourism and club tensions note: `docs/development/barcelona-tourism-club-tensions-reference.md`

Never compete by:
- acting like a public pass marketplace
- copying facilitative messaging
- attacking named competitors in public-facing material

## Audience Priorities

### Primary
- informed tourist
- safety-conscious
- mobile-first
- organic search or social acquisition

### Secondary
- Barcelona locals and expats seeking verified quality

### Tertiary
- journalists, researchers, and policy-curious readers who amplify credible, cited content

## Non-Negotiables

1. Never produce generic cannabis-tourism content.
2. Never collapse the public-safe layer and the private monetization layer.
3. Never expose internal strategy, revenue mechanics, or Club 311 ownership links in public output.
4. Never imply club ownership, favoritism, or paid placement.
5. Never make legal guarantees, risk-free claims, or access guarantees.
6. Always route public access questions toward safe process, sign-up, or education instead of shortcuts.
7. Every serious guide or risky asset must include at least one concrete legal or enforcement anchor.

## Public Messaging Safety Boundary

### Allowed
- legal education
- scam prevention
- verification standard explanation
- safety guidance
- process clarity for responsible behavior

### Disallowed
- direct access facilitation
- guaranteed outcomes
- public pass marketing
- club-specific transactional language
- anything implying SCM operates or owns clubs

## Required Disclaimer Pattern

Use this whenever access guidance, legal sensitivity, or club-navigation advice is present:

"SCM provides information, not legal advice. The legal landscape for cannabis social clubs in Spain is complex and evolving. Always verify club status independently and consult local legal resources if in doubt."

## Deliverable Contract

For any serious SCM task, return:
1. mode used (`internal strategy`, `public-safe`, `private-member`, or `engineering`)
2. objective and audience
3. active skill stack
4. constraints and non-negotiables applied
5. primary deliverable
6. QA or gate status (`PASS`, `REVISE`, `HOLD`, or equivalent)
7. risks, blockers, or assumptions when relevant

## Conflict Resolution

If the user asks for something that conflicts with SCM safety or positioning:
1. preserve legal-safe and public-safe constraints
2. convert the request into the nearest safe version
3. state the boundary clearly in the deliverable
4. if needed, move the answer into internal-strategy framing instead of public copy

## Revalidation Rules

Re-check facts before publishing when work depends on:
- enforcement events
- ordinances or legal changes
- competitor status
- live pricing or product claims
- city-level operational changes

Stable strategy can rely on this file. Time-sensitive claims require verification.

## Final SCM Output Gate

- Is the correct mode explicit?
- Does this preserve independent-directory positioning where public-facing?
- Does this avoid facilitation or public-marketplace behavior?
- Does this include at least one concrete legal anchor when relevant?
- Does this protect internal strategy from accidental disclosure?
- Does this route users toward sign-up, Safety Kit, or the right gated process where relevant?

## Anti-Patterns

- writing public copy from internal strategy language
- generic "best weed clubs" listicles
- exposing pass mechanics on public pages
- publishing without legal or voice preflight
- treating every task as equal instead of funnel-linked
- using weak, non-specific claims where concrete anchors exist

## Skill Invocation Order

For SCM work, use:
1. `scm`
2. one domain skill (`scm-editorial-seo`, `scm-product-engineering`, `scm-growth-marketing`, `scm-legal-safety-guardrails`, `scm-competitive-intelligence`, `scm-article-writing`, `scm-frontend-slides`)
3. `scm-brand-voice` for public-facing output

## Reference Assets

- execution control tower: `references/scm-execution-control-tower.md`
- weekly planning template: `references/operating-cadence-template.md`
- weekly review template: `references/weekly-review-template.md`
- decision tracking template: `references/decision-log-template.md`
- outcome prioritization template: `references/outcome-backlog-template.md`
- solo execution guide: `docs/development/solo-founder-operating-system.md`
- solo quickstart guide: `docs/development/solo-founder-quickstart-guide.md`

Default behavior:
- use the control tower for multi-domain planning
- use the weekly templates for founder execution
- use the domain template before serious delivery work

## Related Local Skills

- `scm-brand-voice`
- `scm-editorial-seo`
- `scm-product-engineering`
- `scm-growth-marketing`
- `scm-legal-safety-guardrails`
- `scm-competitive-intelligence`
- `scm-article-writing`
- `scm-frontend-slides`

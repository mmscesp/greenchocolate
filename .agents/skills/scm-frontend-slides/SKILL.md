---
name: scm-frontend-slides
description: SCM slide and presentation design workflow for investor decks, strategic updates, and narrative briefings with premium visual quality and strict messaging safety.
metadata:
  tags: scm, slides, presentation, frontend, storytelling
origin: SCM Local
---

# SCM Frontend Slides

## Prerequisite

Load `scm` first.

For public or external decks also load:
- `scm-brand-voice`
- `scm-legal-safety-guardrails`

Use `internal strategy` mode for founder or investor decks unless the deck is clearly external and public-safe.

## Mission

Create presentation assets that are visually premium, message-disciplined, and legally safe for SCM.

## Activation

Use for:
- investor or partner narrative decks
- internal strategy decks and roadmap briefings
- conference or talk presentation drafts tied to SCM narrative
- HTML slide builds requiring strong motion and viewport safety
- Instagram carousel and social post production using the SCM IG studio templates

## Non-Negotiables

1. Every slide fits the viewport with no internal scrolling.
2. Narrative and visual hierarchy are clear.
3. Messaging preserves independent-directory positioning where public-facing.
4. No facilitation-risk language in externally shared decks.
5. Distinctive visual direction, never generic templates.
6. For IG assets, templates are layout-locked. Change content data only unless a template has a proven data-wiring bug.
7. Never render final IG assets before previewing the real template visually in browser.

## Deck Workflow

1. define audience, objective, and desired decision
2. build the story arc: problem -> model -> proof -> ask
3. convert into slide architecture with one idea per slide
4. apply SCM visual and voice constraints
5. validate readability, pacing, and legal-safe phrasing

## SCM Deck Content Rules

- do not expose internal-only operational mechanics in public decks
- use verified, defensible numbers and mark assumptions clearly
- keep legal framing factual and non-alarmist
- include disclaimer language in appendix or footer when needed

## SCM IG Template Production Rules

Use this workflow for every weekly IG carousel, audit, blueprint, debunk, spotlight, or single-post asset.

### Source of Truth

- Real production studio: `scm-ig-studio/src/scm-ig-template/`
- Real content file: `scm-ig-studio/src/scm-ig-template/content.ts`
- Real preview app: `scm-ig-studio/src/App.tsx`
- Final render output: `output/ig-renders/studio-{template}-{topic}/`

Do not use these for final production unless explicitly asked:
- `scm-ig-templates/scm-ig-template-newlymade/`
- ad-hoc Next.js preview routes
- screenshots of copied or reconstructed layouts

### Available Formats

- `CarouselTemplate`: 6-slide explainer, best for one structured educational narrative.
- `WarningTemplate`: red-flags or safety audit. The current visual layout is designed around 2 primary warning cards plus cover and CTA.
- `AnatomyTemplate`: blueprint/system map. The current visual layout is designed around 2 structural pillars plus cover/stat and CTA.
- `ComparisonTemplate`: 3-slide myth-vs-reality or rumor-vs-reality debunk.
- `SpotlightTemplate`: 5-slide criteria or selected-standard story with 3 spotlight entries.
- `StatementPost`: single 4:5 statement asset for one sharp claim.

### Layout-Locked Rule

- Preserve template structure, spacing, classes, typography, colors, and visual hierarchy.
- Rewrite copy to fit the design; do not stretch the design to fit copy.
- Prefer short, high-signal lines over paragraph blocks.
- If a line wraps badly, shorten the copy.
- If a component hardcodes old demo copy that should come from `content.ts`, make the smallest data-wiring patch possible and keep all layout classes intact.

### Copy Fit Targets

- Cover titles: 1 to 4 words where possible.
- Eyebrows and labels: 1 to 4 words.
- Body bullets: 3 to 8 words each for hero slides; 6 to 14 words for detail cards.
- Warning/audit descriptions: one sentence, usually under 18 words.
- Blueprint pillar descriptions: one sentence, usually under 18 words.
- Spotlight descriptions: one sentence, usually under 20 words.
- CTA lines: 2 to 6 words.

### Required Production Workflow

1. Load `scm`, `scm-brand-voice`, `scm-legal-safety-guardrails`, and this skill.
2. Choose the correct template by format, not by convenience.
3. Draft English-only IG copy in the exact data shape expected by `content.ts`.
4. Update only `scm-ig-studio/src/scm-ig-template/content.ts` unless a minimal data-wiring bug fix is required.
5. Run the studio locally from `scm-ig-studio`.
6. Inspect every affected section visually in browser before export.
7. Fix copy length until the browser preview is readable and aligned.
8. Render final JPGs only after visual inspection passes.
9. Save final exports under `output/ig-renders/studio-{template}-{topic}/`.
10. Run `npm run build` in `scm-ig-studio`.

### Visual QA Gate

Final export is blocked unless:
- all text is readable at phone scale
- no text overlaps borders, logos, labels, or CTA strips
- no slide requires scrolling inside the artboard
- colors match the SCM dark editorial system
- the selected template still visually resembles the original master design
- there is no cannabis cliché imagery, sourcing cue, or public-access facilitation language
- output files are actual final JPGs, not browser viewport screenshots

### Render Manifest Rule

Each output folder must include:
- `slide-01.jpg`, `slide-02.jpg`, etc.
- `manifest.json`

The manifest should record:
- source URL or studio route
- template section id
- slide count
- render timestamp
- output dimensions

## Deliverable Contract

Return:
1. mode used
2. completed slides spec
3. slide-by-slide outline
4. visual direction notes and interaction plan
5. for IG work, template used, output folder, visual QA result, and render count
6. legal and voice readiness status

## Anti-Patterns

- overcrowded slides and tiny text
- generic gradient-template aesthetics
- public deck language that implies transaction facilitation
- decks with no clear decision ask

## Reference Assets

- slides spec template: `references/slides-spec-template.md`
- default behavior: fill this template before creating or revising serious decks

## Related Skills

- `scm`
- `scm-brand-voice`
- `scm-legal-safety-guardrails`
- `scm-growth-marketing`

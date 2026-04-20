# SCM IG Template System

This directory is the top-level organization layer for SCM Instagram content templates.

## Template Families

- `explainer`: contextual deep dive carousel
- `audit`: red flags checklist carousel
- `blueprint`: data-heavy stats carousel
- `debunk`: myth-vs-fact carousel
- `spotlight`: location visual listicle carousel
- `single-post`: 4:5 quote or statement post

## Current State

- The live production-ready explainer remains implemented in `C:\Users\ousss\Projects\SCM\scm-ig-template`.
- The newly dropped multi-template suite is currently ingested from `C:\Users\ousss\Projects\SCM\scm-ig-templates\New folder`.
- The registry for all active and planned templates lives in `C:\Users\ousss\Projects\SCM\scm-ig-templates\registry.tsx`.
- New templates should be dropped into their own folder inside `C:\Users\ousss\Projects\SCM\scm-ig-templates\`.

## Preview Paths

- Explainer: `http://localhost:3000/en/scm-ig-preview`
- Audit: `http://localhost:3000/en/scm-ig-preview/audit`
- Blueprint: `http://localhost:3000/en/scm-ig-preview/blueprint`
- Debunk: `http://localhost:3000/en/scm-ig-preview/debunk`
- Spotlight: `http://localhost:3000/en/scm-ig-preview/spotlight`
- Single Post: `http://localhost:3000/en/scm-ig-preview/single-post`

## Render Flow

- Reusable JPG render script: `npm run carousel:jpg -- <preview-url> <output-folder>`
- Output folder root: `C:\Users\ousss\Projects\SCM\output\ig-renders`

## Folder Convention For New Templates

Each template folder should eventually contain:

- `README.md`
- `Template.tsx`
- `content.ts`
- `Exportable*.tsx` if the export logic differs
- `theme.css` only if the shared SCM tokens need scoped additions

## Operating Rule

The current visual source of truth is now the combined SCM IG template system:

- explainer comes from the original `scm-ig-template`
- the other five formats are currently sourced from `New folder`
- all live previews are controlled through the registry

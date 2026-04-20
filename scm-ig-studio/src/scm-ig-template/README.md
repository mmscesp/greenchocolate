# SCM Agency Post & Carousel Library

This folder contains the complete, reusable React template suite for generating agency-grade Instagram posts and carousels for **SocialClubsMaps.com**. It is strictly tied to the SCM Brand Sheet and outputs at perfect `1080x1080` (Square) and `1080x1350` (Portrait) resolutions.

## The 6 Templates Included

1. **The Explainer (`CarouselTemplate.tsx`)**: 6-slide deep dive carousel. Highly editorial, meant for context building and long-form listicles.
2. **The Audit (`WarningTemplate.tsx`)**: 4-slide "Red Flags" checklist checklist using warning styling (Saffron #E7A63B) and visceral borders.
3. **The Blueprint (`AnatomyTemplate.tsx`)**: 4-slide data-drop using brutalist stats, blueprint graph UI, and architectural markers (Olive #A8A555).
4. **The Debunk (`ComparisonTemplate.tsx`)**: 3-slide "Myth vs Reality" comparison using a massive horizontal split screen layout.
5. **The Spotlight (`SpotlightTemplate.tsx`)**: 5-slide visual sequence showcasing specific area deep-dives, highlighting numbers, and vibe checks.
6. **Single Post (`StatementPost.tsx`)**: 1-slide vertical (4:5 format) typographic statement highlighting impactful quotes or single data points.

## How to Reuse This Template Suite

1. **Content Management (`content.ts`)**: 
   * Open `content.ts` to edit the text for any of the 6 formats. 
   * The file safely holds all the JSON data (`COMPARISON_CONTENT`, `ANATOMY_CONTENT`, etc). The layouts adapt perfectly as long as you keep string lengths generally similar to the examples.

2. **The Components**:
   * `<[Name]Template.tsx>`: The master layout for that specific format. Modify these directly to alter grid structures, borders, or layout aesthetics.
   * `ExportableCarousel.tsx`: The logic wrapper utilizing `html2canvas` and `jsPDF`. **Automatically detects 1:1 or 4:5 ratio.**
   * `SlideContainer.tsx`: Handles DOM scaling to show the template perfectly on your screen while exporting natively at true 1080 width via PDF.
   * `index.ts`: The unified barrel file. Simply import exactly what you need: `import { WarningTemplate } from './scm-ig-template'`

3. **Themes & Styles (`theme.css`)**:
   * Drop the `theme.css` variables into your root CSS framework or Tailwind config. It holds the fundamental SCM brand hex codes (`#0B1320`, `#00C9B1`, `#E7A63B`, etc).

## Installation in Future React Projects
If you are moving this folder to a new standard Vite+React project:
1. Ensure your project has Tailwind CSS installed.
2. Ensure you install the UI dependencies: `npm install lucide-react html2canvas jspdf`
3. Copy `theme.css` variables over to your target CSS file.
4. Add the Google Fonts for *JetBrains Mono*, *Playfair Display*, and *Plus Jakarta Sans* to your project head or CSS.
5. **CRITICAL**: Ensure `/BarcelonaGaudiHouse.jpg` and `/SCM_Logo_SVG.svg` are located in your target project's `public/` directory, otherwise the backgrounds and brand marks will break.

## Copying and Pasting
Literally just drag the entire `scm-ig-template` folder into your `/src` or `/components` folder in any React/Vite/Next.js app. It is entirely self-contained.

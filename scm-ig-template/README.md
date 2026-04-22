# SCM Agency Carousel Template

This folder contains the complete, reusable React template for generating agency-grade Instagram Carousels for SocialClubsMaps.com. It is strictly tied to the SCM Brand Sheet and output at a perfect `1080x1080` resolution.

## How to Reuse This Template

1. **Content Management (`content.ts`)**: 
   * Open `content.ts` to edit the text for your next carousel topic. 
   * The file strictly defines the `title`, `body`, `list` elements, and `footnote` strings. The layouts will adapt perfectly as long as you keep string lengths generally similar to the examples.

2. **The Components**:
   * `CarouselTemplate.tsx`: The master layout. Modify this file directly if you want to alter grid structures, split lines, or layout aesthetics.
   * `ExportableCarousel.tsx`: The logic wrapper utilizing `html2canvas` and `jsPDF`.
   * `SlideContainer.tsx`: Handles scaling logic to show the template perfectly on your screen while exporting it at precise `1080x1080` native resolution.

3. **Themes & Styles (`theme.css`)**:
   * Drop the `theme.css` variables into your root CSS framework or Tailwind config. It holds the fundamental SCM brand hex codes (`#0B1320`, `#00C9B1`, `#E7A63B`, etc).

## Installation in Future React Projects
If you are moving this folder to a new standard Vite+React project:
1. Ensure your project has Tailwind CSS installed.
2. Ensure you have installed packages: `npm install lucide-react html2canvas jspdf`
3. Copy `theme.css` variables over to your `index.css`.
4. Import `CarouselTemplate` directly onto your page to render and export.
5. **CRITICAL**: Ensure `/BarcelonaGaudiHouse.jpg` and `/SCM_Logo_SVG.svg` are located in your target project's `public/` directory, otherwise the backgrounds and brand marks will 404.

## AI Studio Export
To keep a permanent copy of this code to your local machine right now:
Click **Settings (gear icon)** -> **Export** -> **Download ZIP**. Unzip it, and you will find this `src/scm-ig-template` folder ready to be deployed forever.

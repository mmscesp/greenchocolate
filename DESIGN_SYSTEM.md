# Design System & UI Architecture
## Cannabis Social Club Platform

**Version:** 2.0 (Production-Ready)  
**Status:** Refined & Hardened  
**Focus:** Accessibility, Performance, Consistency

---

## 1. Design Philosophy

### "Elevated Underground"
A sophisticated aesthetic balancing cannabis culture's underground roots with enterprise-grade trust and professionalism.

**Core Keywords:** Professional, Clean, Dark Mode Native, Accessible, Privacy-First

**Inspiration References:**
- Resident Advisor (RA.co) - Discovery & filtering patterns
- Soho House - Premium member experience
- Linear.app - Performance & dark UI excellence
- Gov.uk - Accessibility-first design patterns

---

## 2. Accessibility-First (WCAG 2.1 AA)

### 2.1 Compliance Standards
- **Target:** WCAG 2.1 Level AA (minimum), AAA where achievable
- **Audit Frequency:** Quarterly automated scans + annual manual audit
- **Tools:** axe-core, Lighthouse CI, manual screen reader testing (NVDA/VoiceOver)

### 2.2 Color Contrast Requirements
| Element | Foreground | Background | Ratio | Min Ratio |
|---------|-----------|------------|-------|-----------|
| Primary Text | Slate-50 (#F8FAFC) | Slate-950 (#020617) | 15.8:1 | 4.5:1 ✓ |
| Secondary Text | Slate-300 (#CBD5E1) | Slate-950 (#020617) | 10.5:1 | 4.5:1 ✓ |
| Muted Text | Slate-400 (#94A3B8) | Slate-900 (#0F172A) | 5.8:1 | 4.5:1 ✓ |
| Accent Text | Emerald-400 (#34D399) | Slate-950 (#020617) | 8.9:1 | 4.5:1 ✓ |

**⚠️ Avoid:** `Slate-400` on `Slate-900` (4.2:1 - fails WCAG AA for small text)

### 2.3 Motion & Animation Safety
```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Rule:** All animations must be disableable via `prefers-reduced-motion`.

### 2.4 Keyboard Navigation
- All interactive elements must have visible `:focus` states
- Tab order must follow visual order (logical flow)
- Skip links for main content ("Skip to clubs list")
- Modal focus trapping with `Esc` to close

### 2.5 Screen Reader Support
- All images: descriptive `alt` text (not "image of...")
- Form inputs: associated `<label>` elements
- Icons: `aria-hidden="true"` with text alternatives
- Live regions for dynamic content updates

---

## 3. Color Palette

### 3.1 Semantic Tokens
```
Primary Action:     Emerald-500  (#10B981) - CTAs, success states
Background Base:    Slate-950    (#020617) - Page background
Surface Elevated:   Slate-900    (#0F172A) - Cards, modals
Surface Floating:   Slate-800/50 (#1E293B with 50% opacity) - Glassmorphism
Accent Vibe:        Violet-500   (#8B5CF6) - Tags, premium badges
Warning:            Amber-500    (#F59E0B) - Alerts, pending states
Error:              Rose-500     (#F43F5E) - Errors, rejections
Info:               Sky-500      (#0EA5E9) - Informational
```

### 3.2 Dark Mode Philosophy
**Dark Mode is the ONLY mode.** No light mode support required.

Rationale:
- Cannabis social clubs operate evening hours
- Reduces eye strain for extended browsing
- Aligns with "underground" aesthetic
- Conserves mobile battery life

### 3.3 Glassmorphism Specification
```css
.glass {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**Usage:** Navigation bars, floating search, modals only. Avoid on scrollable content.

---

## 4. Typography System

### 4.1 Font Stack
- **Primary:** Inter (Google Fonts) - Headings, UI text
- **Monospace:** JetBrains Mono - Data points, coordinates, technical info
- **Fallback:** system-ui, -apple-system, sans-serif

### 4.2 Type Scale (Tailwind Classes)

| Token | Size | Line Height | Letter Spacing | Weight | Usage |
|-------|------|-------------|----------------|--------|-------|
| `text-xs` | 12px | 16px | 0.05em | 400 | Captions, timestamps |
| `text-sm` | 14px | 20px | 0 | 400 | Body secondary |
| `text-base` | 16px | 24px | 0 | 400 | Body primary |
| `text-lg` | 18px | 28px | -0.01em | 500 | Lead paragraphs |
| `text-xl` | 20px | 28px | -0.02em | 600 | Card titles |
| `text-2xl` | 24px | 32px | -0.02em | 600 | Section headers |
| `text-3xl` | 30px | 36px | -0.02em | 700 | Page titles |
| `text-4xl` | 36px | 40px | -0.03em | 700 | Hero text (mobile) |
| `text-5xl` | 48px | 48px | -0.03em | 800 | Hero text (desktop) |

### 4.3 Font Loading Strategy
```tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevent FOIT
  variable: '--font-inter',
});
```

---

## 5. Spacing System

### 5.1 4px Base Grid
All spacing follows multiples of 4px for visual rhythm.

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight padding, icon gaps |
| `space-2` | 8px | Inline elements, tight groups |
| `space-3` | 12px | Default component padding |
| `space-4` | 16px | Card padding, section gaps |
| `space-6` | 24px | Major section separations |
| `space-8` | 32px | Page section padding |
| `space-12` | 48px | Large section breaks |
| `space-16` | 64px | Hero section padding |

### 5.2 Layout Grid
- **Max Width:** 1280px (`max-w-7xl`)
- **Columns:** 12-column grid
- **Gutter:** 24px (desktop), 16px (mobile)
- **Side Padding:** 16px (mobile), 24px (tablet), 32px (desktop)

---

## 6. Responsive Breakpoints

### 6.1 Mobile-First Approach
```css
/* Base: Mobile (0-639px) */
/* sm: 640px+ */
/* md: 768px+ */
/* lg: 1024px+ */
/* xl: 1280px+ */
/* 2xl: 1536px+ */
```

### 6.2 Component Behavior Matrix

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| **Club Card** | Stacked (image top) | Horizontal | Horizontal with map preview |
| **Navigation** | Hamburger menu | Hamburger menu | Full horizontal |
| **Filter Panel** | Bottom sheet | Sidebar (collapsible) | Sidebar (fixed) |
| **Map View** | Full screen overlay | 50% split | 60/40 split |
| **Hero Search** | Stacked inputs | Inline with button | Centered floating |
| **Club Grid** | 1 column | 2 columns | 3 columns |

### 6.3 Touch Target Requirements
- Minimum: 44x44px (Apple), 48x48px (Material)
- Spacing between touch targets: minimum 8px
- All buttons must meet WCAG 2.5.5 (Target Size)

---

## 7. Animation Standards

### 7.1 Timing & Easing
```
Instant:     0ms      - State changes, hovers
Fast:        150ms    - Micro-interactions (buttons, toggles)
Normal:      300ms    - Component transitions (modals, dropdowns)
Slow:        500ms    - Page transitions, hero animations
```

**Easing Functions:**
- `ease-out` - UI feedback (buttons, cards)
- `ease-in-out` - Symmetrical transitions (modals, panels)
- `cubic-bezier(0.4, 0, 0.2, 1)` - Standard material motion

### 7.2 Performance Rules
- Use `transform` and `opacity` only (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly, remove after animation
- Maximum animation duration: 500ms (except hero video)

### 7.3 Hero Video Specification
**Problem:** 4K video causes performance issues

**Solution:**
```tsx
<video
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  poster="/hero-poster.webp"
  className="object-cover w-full h-full"
>
  <source src="/hero-1080p.webm" type="video/webm" />
  <source src="/hero-1080p.mp4" type="video/mp4" />
</video>
```

**Requirements:**
- Resolution: 1080p max (not 4K)
- Formats: WebM (VP9) + MP4 (H.264)
- Size: <5MB total
- Fallback: Static poster image for mobile data saver
- Disable on `prefers-reduced-motion`

---

## 8. Core Components

### 8.1 Component States
Every interactive component must define these states:

| State | Visual Treatment |
|-------|-----------------|
| **Default** | Standard styling |
| **Hover** | Subtle lift or color shift (+ cursor pointer) |
| **Active/Pressed** | Scale down slightly (0.98) |
| **Focus** | 2px ring in Emerald-400 (keyboard only) |
| **Disabled** | 50% opacity, no-pointer-events |
| **Loading** | Spinner or skeleton, disabled interactions |
| **Error** | Rose-500 border/text with error message |

### 8.2 Loading States (Skeletons)
```tsx
// Club Card Skeleton
<div className="animate-pulse">
  <div className="h-48 bg-slate-800 rounded-t-lg" />
  <div className="p-4 space-y-3">
    <div className="h-4 bg-slate-800 rounded w-3/4" />
    <div className="h-3 bg-slate-800 rounded w-1/2" />
  </div>
</div>
```

**Animation:** `animate-pulse` (2s cycle, opacity 1→0.5→1)

### 8.3 Empty States
- Clear icon/visual indicating empty state
- Helpful message: "No clubs found in this area"
- Action CTA when applicable: "Adjust filters" or "Browse all clubs"
- Never show blank/white screens

### 8.4 Error States
- Inline error messages (not just toast)
- Red border on invalid form fields
- Recovery path always provided
- Generic message: "Something went wrong. Please try again."

---

## 9. Iconography

### 9.1 Icon Library
- **Primary:** Lucide React (consistent, lightweight)
- **Size Scale:** 16px (compact), 20px (default), 24px (large)
- **Stroke Width:** 1.5px (default), 2px (emphasis)

### 9.2 Usage Guidelines
- Always paired with text label (except universally understood icons: search, menu, close)
- Use `aria-hidden="true"` when decorative
- Provide `aria-label` when standalone functional

---

## 10. Form Design

### 10.1 Input Specifications
- Height: 44px (touch-friendly)
- Padding: 12px horizontal
- Border: 1px Slate-700, rounded-lg
- Focus: Emerald-500 border + subtle ring
- Error: Rose-500 border

### 10.2 Validation Patterns
- Inline validation on blur (not just submit)
- Clear error messages below field
- Success indicators for valid fields (optional)
- Never clear user input on error

### 10.3 Endorsement Wizard (Stepper)
**Layout:**
- Step indicator at top (progress bar + labels)
- Content area: Single column, max-width 600px
- Navigation: "Back" (ghost) + "Continue" (primary)
- Mobile: Full-screen steps with swipe transitions disabled

---

## 11. Directory Structure

```
components/
├── ui/                      # shadcn primitives
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── features/
│   ├── clubs/
│   │   ├── ClubCard.tsx
│   │   ├── ClubGrid.tsx
│   │   ├── ClubFilters.tsx
│   │   ├── ClubMap.tsx      # Lazy loaded
│   │   └── ClubSkeleton.tsx
│   ├── membership/
│   │   ├── RequestWizard.tsx
│   │   ├── StepIndicator.tsx
│   │   └── StatusBadge.tsx
│   └── reviews/
│       ├── ReviewCard.tsx
│       └── StarRating.tsx
├── layout/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── MobileNav.tsx
└── shared/
    ├── LanguageSelector.tsx
    ├── LoadingSpinner.tsx
    └── ErrorBoundary.tsx
```

---

## 12. Performance Budgets

| Metric | Target | Max |
|--------|--------|-----|
| **LCP** (Largest Contentful Paint) | <2.5s | 4.0s |
| **FCP** (First Contentful Paint) | <1.8s | 3.0s |
| **TBT** (Total Blocking Time) | <200ms | 600ms |
| **CLS** (Cumulative Layout Shift) | <0.1 | 0.25 |
| **Bundle Size** (Initial) | <200KB | 500KB |
| **Image Size** (Club card) | <100KB | 200KB |

**Enforcement:** Lighthouse CI in build pipeline

---

## 13. Z-Index Scale

| Layer | Z-Index | Usage |
|-------|---------|-------|
| Background | 0 | Page content |
| Elevated | 10 | Cards, buttons |
| Floating | 20 | Dropdowns, tooltips |
| Sticky | 30 | Sticky headers |
| Overlay | 40 | Backdrops, modals |
| Modal | 50 | Dialog content |
| Toast | 60 | Notifications |
| Tooltip | 70 | Highest priority |

---

*Document Version: 2.0*  
*Last Updated: 2026-02-01*  
*Review Cycle: Quarterly*

# SCM Design System & Guidelines
## SocialClubsMaps Platform Design Standards

**Version:** 1.0  
**Last Updated:** February 2026  
**Purpose:** Ensure consistent, premium design quality across all platform sections and pages

---

## 1. Design Philosophy

### Core Principles

1. **Progressive Disclosure**
   - Information reveals itself through user interaction
   - Use hover states, click-to-expand, and staged animations
   - Never overwhelm - guide users through discovery

2. **Visual Hierarchy**
   - Clear distinction between primary and secondary content
   - Size, weight, and color create reading order
   - White space is your friend - let elements breathe

3. **Micro-interactions**
   - Every action must have satisfying feedback
   - Button presses, card hovers, state changes - all animated
   - Animations should be purposeful, not decorative

4. **Color Psychology**
   - Green = Trust, Safety, Success (primary brand)
   - Red = Danger, Warning, Fines (legal risks)
   - Blue = Information, Eligibility (neutral/helpful)
   - Amber = Caution, Attention (medium risk)
   - Purple = Privacy, Exclusivity (member features)

5. **Glassmorphism & Depth**
   - Layer elements with backdrop-blur and transparency
   - Use shadows to create elevation (z-depth)
   - Combine with gradient overlays for premium feel

6. **Motion Design**
   - Smooth, purposeful animations guide the eye
   - Spring physics for natural, bouncy motion
   - Staggered reveals create rhythm and flow

---

## 2. Color System

### Primary Brand Colors

**Green Scale (Trust & Success):**
- green-50: Backgrounds, light fills
- green-100: Badge backgrounds
- green-400: Highlights, accents
- green-500: Primary brand color
- green-600: Hover states, emphasis
- emerald-500-600: Gradients

**Zinc Scale (Neutrality & Sophistication):**
- zinc-50: Light section backgrounds
- zinc-100: Card backgrounds, borders
- zinc-200: Subtle borders
- zinc-400: Secondary text, hints
- zinc-500: Body text
- zinc-600: Emphasized text
- zinc-700-900: Headlines
- zinc-950: Dark sections

### Semantic Color Mapping

| Purpose | Color | Usage |
|---------|-------|-------|
| Success/Safe | green-500 to emerald-600 | CTAs, trust badges, completion states |
| Warning/Risk | amber-500 to orange-600 | Medium risk, caution, first offenses |
| Danger/Fines | red-500 to rose-600 | High risk, fines, penalties, errors |
| Information | blue-500 to indigo-600 | Eligibility, facts, neutral info |
| Privacy | purple-500 to violet-600 | Private features, exclusive access |
| Neutral | zinc-400 to zinc-600 | Body text, secondary content |

### Gradient Patterns

**Hero/Header Gradients:**
- from-zinc-900 to-zinc-800 - Dark headers
- from-green-900 via-emerald-800 to-green-950 - Brand hero
- from-blue-600 to-indigo-600 - Interactive tools

**Card/Element Gradients:**
- from-green-500/20 to-emerald-500/5 - Trust elements
- from-yellow-400 via-orange-500 to-red-600 - Fine calculator progress
- from-red-500 to-rose-600 - Amount/penalty displays

**Background Effects:**
- Radial gradients at 10-30% opacity for depth
- bg-gradient-to-b from-zinc-50 to-white - Section transitions

---

## 3. Typography System

### Font Hierarchy

| Element | Size | Weight | Treatment |
|---------|------|--------|-----------|
| Hero Headlines | 4xl-7xl | 900 (Black) | Gradient text fill |
| Section Titles | 3xl-5xl | 700-900 | Bold, often gradient |
| Card Titles | xl-2xl | 700 | Clear, readable |
| Stats/Numbers | 4xl-6xl | 900 | Gradient, attention-grabbing |
| Body Text | sm-base | 400-500 | Comfortable reading |
| Badges/Labels | xs | 700-800 | Uppercase, tracking-widest |
| Captions | xs | 400-500 | Muted color (zinc-400) |

### Text Treatments

**Gradient Text (Premium Headlines):**
```
text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500
```

**Uppercase Labels:**
```
uppercase tracking-widest font-bold text-xs
```

**Line Clamping (Cards):**
```
line-clamp-2 (titles)
line-clamp-2-3 (descriptions)
```

**Font Stack:**
- Use system font stack (already in Tailwind)
- Maintain consistency - do not mix font families

---

## 4. Animation Guidelines

### Timing Standards

| Animation Type | Duration | Easing |
|----------------|----------|--------|
| Hover transitions | 300-500ms | ease-out |
| Entrance animations | 500-600ms | spring physics |
| Stagger delays | 100-150ms | linear |
| Continuous loops | 2000-3000ms | ease-in-out |

### Entrance Patterns

**Staggered Reveal:**
- initial: opacity 0, y 50
- whileInView: opacity 1, y 0
- transition delay: index * 0.15
- duration: 0.5

**Scale In:**
- initial: scale 0.8, opacity 0
- animate: scale 1, opacity 1
- transition type: spring, stiffness 200

### Interaction Patterns

**Hover Lift:**
- whileHover: y -10, scale 1.02
- transition duration: 0.3

**Active Press:**
- whileTap: scale 0.98

**Icon Wiggle:**
- whileHover: rotate [0, -10, 10, 0]
- transition duration: 0.5

**Slide Transitions:**
- Next: x 50 to 0, exit x -50
- Previous: x -50 to 0, exit x 50

### Continuous Animations

**Pulse (Badges/Indicators):**
- animate: scale [1, 1.05, 1]
- transition repeat: Infinity, duration 2

**Float (Particles):**
- animate: y [0, -20, 0], opacity [0.2, 0.8, 0.2]
- transition duration: 2, repeat Infinity

**Rotate (Decorations):**
- animate: rotate 360
- transition duration: 20, repeat Infinity, ease linear

---

## 5. Component Patterns

### Cards

**Standard Card:**
- Border radius: rounded-2xl or rounded-3xl
- Background: bg-white or bg-white/5 (dark mode)
- Border: border border-zinc-100 or border-white/10
- Shadow: shadow-sm default, shadow-2xl on hover
- Padding: p-6 to p-8
- Overflow: overflow-hidden (for images)

**Hover States:**
- Lift: transform translateY(-10px)
- Shadow: increase to shadow-2xl
- Border: change to brand color (green-400)
- Scale: slight scale-up (1.02-1.05)
- Duration: 300-500ms transition

### Buttons

**Primary Button:**
- Background: bg-zinc-900 or gradient
- Text: text-white
- Padding: py-4 to py-6 (generous)
- Border radius: rounded-xl or rounded-full
- Font: font-bold
- Icon: Arrow that slides right on hover
- Hover: Slight scale (1.02), brightness increase

**Secondary/Outline:**
- Border: border-2
- Background: transparent to hover fill
- Transition: smooth background color

**Icon Animation Pattern:**
- group-hover:translate-x-1 transition-transform

### Badges

**Category Badges:**
- Shape: rounded-full
- Size: px-3 py-1.5
- Font: text-xs font-bold uppercase tracking-wider
- Colors: Category-specific (see Color System)

**Status Badges:**
- Pulsing dot for active states
- Gradient backgrounds for premium feel
- Clear text hierarchy

### Icons

**Container Pattern:**
- Size: w-12 to w-20 (depending on importance)
- Background: Gradient or colored bg with opacity
- Border radius: rounded-xl or rounded-2xl
- Shadow: subtle colored shadow
- Animation: wiggle or scale on interaction

**Icon Treatments:**
- Use Lucide icons consistently
- Size: h-5 to h-10 depending on context
- Color: Match semantic color system

---

## 6. Section Templates

### Hero Section

Structure:
1. Full-width background (gradient or image)
2. Centered content container
3. Badge at top
4. Large headline with gradient text
5. Subtitle/description
6. Primary CTA button
7. Optional: Secondary CTA
8. Scroll indicator (animated)

Visual Effects:
- Background gradient or subtle pattern
- Text shadow for readability
- Fade-in animations with stagger

### Feature Cards Section

Structure:
1. Section header (centered)
   - Icon badge
   - Headline
   - Subtitle description
2. Grid of 3-4 feature cards
3. Each card:
   - Gradient icon container
   - Stat badge (top right)
   - Title
   - Description
   - Bottom accent line

Visual Effects:
- Staggered entrance animations
- Hover lift + glow effect
- Gradient background on hover
- Color-coded by feature type

### Interactive Tool Section

Structure:
1. Section header
2. Two-column layout (calculator | quiz)
3. Each tool:
   - Header with icon
   - Interactive elements (sliders/buttons)
   - Dynamic content display
   - Result/CTA area

Visual Effects:
- Card with rounded corners
- Animated transitions between states
- Progress indicators
- Success/error states with color coding

### Content Grid Section (Articles/Guides)

Structure:
1. Section header with CTA button
2. 4-column grid (responsive: 2 on tablet, 1 on mobile)
3. Each card:
   - Hero image with overlay
   - Category badge (top left)
   - Read time badge (top right)
   - Title
   - Excerpt
   - Author info (avatar + name)
   - Date
   - Read more link

Visual Effects:
- Image zoom on hover
- Card lift with shadow
- Green border reveal
- Staggered scroll-triggered entrance

### Trust/Verification Section

Structure:
1. Dark background (zinc-950)
2. Section header with gradient text
3. Three feature cards
4. Large verification showcase:
   - Left: Checklist with icons
   - Right: Animated visual (shield, stats)
5. Background effects (blur orbs, patterns)

Visual Effects:
- Floating particles
- Rotating rings/decorative elements
- Pulse animations on trust indicators
- Hover reveals (trust score overlay)

---

## 7. Layout Principles

### Spacing Scale

Section padding: py-24 (96px)
Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
Card gaps: gap-6 to gap-8
Internal card spacing: space-y-6 or p-6-8

### Grid Patterns

3-column features: grid md:grid-cols-3 gap-8
2-column tools: grid lg:grid-cols-2 gap-8
4-column articles: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6

### Responsive Breakpoints

Mobile first approach:
- Default: < 640px (single column)
- sm: 640px+
- md: 768px+ (2 columns)
- lg: 1024px+ (full layouts)
- xl: 1280px+ (enhanced spacing)

---

## 8. Background Effects Library

### Gradient Orbs

Position: absolute
Size: w-72 h-72 to w-96 h-96
Blur: blur-3xl
Opacity: 10-30%
Colors: Match section theme (green, blue, red)
Positioning: top/bottom left/right

### Dot Patterns

background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)
background-size: 32px 32px or 40px 40px
opacity: 5-20%

### Glassmorphism

backdrop-blur-sm to backdrop-blur-xl
bg-white/5 to bg-white/10
border-white/10

---

## 9. Agent Instructions (For Consistency)

### When Designing New Sections:

1. Analyze Existing Sections First
   - Check this document for patterns
   - Match the animation timing
   - Use established color mappings

2. Apply Progressive Enhancement
   - Start with content hierarchy
   - Add visual effects (shadows, gradients)
   - Implement animations last

3. Follow the Color Psychology
   - Green = Trust/safety
   - Red = Danger/fines
   - Blue = Information
   - Never mix meanings

4. Animation Checklist
   - [ ] Entrance animation on scroll
   - [ ] Hover state defined
   - [ ] Active/click state defined
   - [ ] Staggered delays for lists
   - [ ] Continuous animations for emphasis

5. Typography Checklist
   - [ ] Hierarchy established (size/weight)
   - [ ] Line height comfortable
   - [ ] Contrast sufficient (WCAG)
   - [ ] Gradient text for headlines only

6. Mobile Considerations
   - [ ] Touch targets minimum 44px
   - [ ] Readable without zoom
   - [ ] Simplified interactions
   - [ ] Performance optimized

### Quality Standards:

- Premium Feel: Every element should feel intentional
- Consistency: Same patterns across all sections
- Accessibility: Color not the only indicator
- Performance: Animations should be 60fps
- Responsiveness: Beautiful at all screen sizes

---

## 10. Common Mistakes to Avoid

### Design Anti-Patterns:

1. Inconsistent Colors
   - Do not use random colors outside the system
   - Stick to semantic color meanings

2. Animation Overload
   - Not everything needs to animate
   - Purposeful motion only

3. Breaking the Grid
   - Maintain alignment
   - Consistent spacing

4. Poor Contrast
   - Always check text on backgrounds
   - Use zinc scale properly

5. Missing Hover States
   - Every interactive element needs feedback
   - Mobile needs active states too

6. Inconsistent Border Radius
   - Stick to 2xl or 3xl for cards
   - Full rounded for badges/buttons

---

## Quick Reference Cheat Sheet

### Color by Purpose:
- Success: green-500 to emerald-600
- Warning: amber-500 to orange-600
- Danger: red-500 to rose-600
- Info: blue-500 to indigo-600
- Privacy: purple-500 to violet-600

### Animation Timing:
- Hover: 300-500ms
- Entrance: 500-600ms
- Stagger: 100-150ms

### Border Radius:
- Cards: rounded-2xl or rounded-3xl
- Buttons: rounded-xl or rounded-full
- Badges: rounded-full

### Shadows:
- Default: shadow-sm or shadow-lg
- Hover: shadow-2xl
- Special: shadow-[color]/20

---

## Version History

**v1.0** - February 2026
- Initial design system documentation
- Captured patterns from homepage redesign
- Established color, typography, and animation standards

---

*This document should be updated whenever new patterns are established or existing ones are refined.*

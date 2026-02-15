# SocialClubsMaps Design System

**Version:** 3.0 - Premium Dark Theme  
**Status:** Production-Ready  
**Theme:** "Elevated Trust" - Based on WhyUsSection Premium Aesthetic

---

## 🎨 Design Philosophy

### "Elevated Underground 2.0"
An evolution from the original underground aesthetic to a **premium, sophisticated dark theme** that builds trust through transparency and modern design patterns.

**Core Keywords:** Premium, Transparent, Trustworthy, Modern, Accessible

**Visual Hierarchy:**
1. **Deep backgrounds** (`bg-zinc-900`) create sophistication
2. **Glass morphism** suggests openness and transparency
3. **Gradient accents** add energy without clutter
4. **Semantic colors** organize information intuitively
5. **Micro-interactions** reward engagement

---

## 📊 Color Palette

### Foundation Colors (Always Use These)

| Token | Value | Hex | Usage |
|-------|-------|-----|-------|
| `bg-primary` | `bg-zinc-900` | `#18181b` | Main section backgrounds |
| `bg-secondary` | `bg-zinc-950` | `#09090b` | Deeper contrast, loading screens |
| `bg-elevated` | `bg-white/5` + `backdrop-blur` | rgba(255,255,255,0.05) | Glass cards |
| `text-primary` | `text-white` | `#ffffff` | Headlines, important text |
| `text-secondary` | `text-zinc-300` | `#d4d4d8` | Body text, descriptions |
| `text-muted` | `text-zinc-400` | `#a1a1aa` | Subtle text, captions |
| `text-subtle` | `text-zinc-500` | `#71717a` | Disabled, metadata |
| `border-subtle` | `border-white/10` | rgba(255,255,255,0.1) | Card borders |
| `border-medium` | `border-white/20` | rgba(255,255,255,0.2) | Interactive borders |

### Semantic Accent Colors

Each major feature area gets a consistent color family:

#### 🟢 Green/Emerald (Trust, Safety, Legal, Verified)
```css
Primary:      #22c55e  (text-green-500)
Light:        #34d399  (text-green-400)
Dark:         #16a34a  (text-green-600)
Background:   bg-green-500/10
Border:       border-green-500/30
Text:         text-green-400
Glow:         shadow-green-500/20
Gradient:     from-green-400 via-emerald-400 to-green-500
```

#### 🔵 Blue/Indigo (Technology, Confidence, UI Systems)
```css
Primary:      #3b82f6  (text-blue-500)
Light:        #60a5fa  (text-blue-400)
Dark:         #2563eb  (text-blue-600)
Background:   bg-blue-500/10
Border:       border-blue-500/30
Text:         text-blue-400
Glow:         shadow-blue-500/20
Gradient:     from-blue-400 via-indigo-400 to-blue-500
```

#### 🟣 Purple/Violet (Privacy, Access, Premium Features)
```css
Primary:      #8b5cf6  (text-purple-500)
Light:        #a78bfa  (text-purple-400)
Dark:         #7c3aed  (text-purple-600)
Background:   bg-purple-500/10
Border:       border-purple-500/30
Text:         text-purple-400
Glow:         shadow-purple-500/20
Gradient:     from-purple-400 via-violet-400 to-purple-500
```

#### 🔴 Red/Rose (Warnings, Fines, Alerts, Danger)
```css
Primary:      #ef4444  (text-red-500)
Light:        #f87171  (text-red-400)
Dark:         #dc2626  (text-red-600)
Background:   bg-red-500/10
Border:       border-red-500/30
Text:         text-red-400
Glow:         shadow-red-500/20
Gradient:     from-red-500 to-rose-600
```

#### 🟡 Amber/Orange (CTAs, Highlights, Gold, Priority)
```css
Primary:      #f59e0b  (text-amber-500)
Light:        #fbbf24  (text-amber-400)
Background:   bg-amber-500/10
Text:         text-amber-400
Gradient:     from-amber-400 to-orange-500
```

### Gradient Patterns

**Text Gradients (Use for 1-2 key words in headlines):**
```tsx
// Green gradient (Trust/Safety)
className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-500"

// Blue gradient (Technology)
className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500"

// Purple gradient (Premium)
className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-purple-500"

// Red gradient (Warnings)
className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500"

// Multi-color (Special features)
className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-500"
```

**Background Glows:**
```tsx
// Large ambient glow (position in corners)
className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"

// Hover glow effect
className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"

// Card background gradient on hover
className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
```

---

## 🔤 Typography Hierarchy

### Font Stack
- **Primary:** Inter (Google Fonts) - All text
- **Weights Used:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold), 900 (black)

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **Hero** | `text-4xl md:text-6xl` | `font-black` | `leading-tight` | Page headlines |
| **H1** | `text-3xl md:text-5xl` | `font-black` | `leading-tight` | Section titles |
| **H2** | `text-2xl md:text-4xl` | `font-bold` | `leading-tight` | Sub-sections |
| **H3** | `text-xl md:text-2xl` | `font-bold` | `leading-snug` | Card titles |
| **H4** | `text-lg` | `font-bold` | `leading-snug` | Feature titles |
| **Body Large** | `text-lg` | `font-normal` | `leading-relaxed` | Intro paragraphs |
| **Body** | `text-base` | `font-normal` | `leading-relaxed` | Standard text |
| **Small** | `text-sm` | `font-medium` | `leading-normal` | Labels, metadata |
| **Caption** | `text-xs` | `font-bold` | `leading-normal` | Badges, tracking |

### Text Patterns

**Hero Headline with Gradient:**
```tsx
<h1 className="text-4xl md:text-6xl font-black leading-tight">
  The Verified{' '}
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-500">
    Navigation Layer
  </span>
</h1>
```

**Section Headline:**
```tsx
<h2 className="text-3xl md:text-5xl font-black text-white mb-4">
  Section Title
</h2>
```

**Card Title with Hover Gradient:**
```tsx
<h3 className="text-2xl font-bold text-white mb-4 text-center 
  group-hover:text-transparent group-hover:bg-clip-text 
  group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80 
  transition-all">
  Card Title
</h3>
```

**Body Text with Hover State:**
```tsx
<p className="text-zinc-400 leading-relaxed text-center 
  group-hover:text-zinc-300 transition-colors">
  Description text goes here...
</p>
```

---

## 🃏 Card Components

### Glass Morphism Card (Primary Pattern)

This is the signature card style for the premium theme:

```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ delay: index * 0.15, duration: 0.6 }}
  whileHover={{ y: -10 }}
  className="group relative"
>
  <div className="relative p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 h-full overflow-hidden">
    {/* Hover gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
    
    {/* Hover glow effect */}
    <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />
    
    {/* Content Container */}
    <div className="relative z-10">
      {/* Icon Container - Large, centered */}
      <motion.div 
        className="relative w-20 h-20 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 mx-auto"
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Icon background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-20 rounded-2xl" />
        <Icon className="h-10 w-10 text-white/80" />
      </motion.div>
      
      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        Feature Title
      </h3>
      
      {/* Description */}
      <p className="text-zinc-400 leading-relaxed text-center group-hover:text-zinc-300 transition-colors">
        Feature description goes here...
      </p>
      
      {/* Optional: Stat Badge (top-right corner) */}
      <div className="absolute top-4 right-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-white/80 border border-green-500/30">
          100%
        </span>
      </div>
    </div>
    
    {/* Bottom accent line (animates on hover) */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full group-hover:w-1/2 transition-all duration-500" />
  </div>
</motion.div>
```

**Card Anatomy:**
1. **Container:** `rounded-3xl`, `border-white/10`, `bg-white/5`, `backdrop-blur-sm`
2. **Padding:** `p-8` (generous breathing room)
3. **Icon:** Centered, `w-20 h-20`, gradient background, `rounded-2xl`
4. **Title:** Centered, `text-2xl font-bold`, gradient on hover
5. **Description:** Centered, `text-zinc-400`, lightens on hover
6. **Hover Effects:** Lift (`y: -10`), gradient reveal, glow, bottom line animation

### Feature List Item

For vertical lists of features/benefits:

```tsx
<motion.div
  initial={{ opacity: 0, x: -30 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.3 }}
  whileHover={{ x: 10 }}
  className="flex gap-4 group cursor-pointer"
>
  {/* Icon container */}
  <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
    <Icon className="h-6 w-6 text-green-400" />
  </div>
  
  {/* Content */}
  <div>
    <h4 className="font-bold text-white text-lg mb-1 group-hover:text-green-400 transition-colors">
      Feature Title
    </h4>
    <p className="text-zinc-500 group-hover:text-zinc-400 transition-colors">
      Feature description...
    </p>
  </div>
</motion.div>
```

### Compact Card (Stats, Metrics)

```tsx
<div className="bg-zinc-900/75 backdrop-blur-xl border border-white/25 p-6 md:p-10 rounded-2xl md:rounded-3xl text-center shadow-[0_20px_80px_rgba(0,0,0,0.8)] hover:border-green-500/50 transition-all duration-300">
  <div className="flex justify-center mb-4">
    <Icon className="w-7 h-7 md:w-9 md:h-9 text-green-400" />
  </div>
  <div className="text-4xl md:text-6xl font-black text-white mb-2">
    100%
  </div>
  <div className="text-xs md:text-sm font-bold text-green-400 uppercase tracking-widest">
    Metric Label
  </div>
</div>
```

---

## ✨ Animation System

### Entrance Animations (Scroll-Triggered)

```tsx
// Fade up (most common - use for cards, sections)
initial={{ opacity: 0, y: 50 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-100px" }}
transition={{ delay: index * 0.15, duration: 0.6 }}

// Scale in (for hero elements, important visuals)
initial={{ opacity: 0, scale: 0.8 }}
whileInView={{ opacity: 1, scale: 1 }}
transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}

// Slide from left (for lists, sequential items)
initial={{ opacity: 0, x: -30 }}
whileInView={{ opacity: 1, x: 0 }}
transition={{ delay: 0.2 }}

// Slide from right
initial={{ opacity: 0, x: 30 }}
whileInView={{ opacity: 1, x: 0 }}
transition={{ delay: 0.2 }}
```

### Hover Interactions

```tsx
// Card lift (standard)
whileHover={{ y: -10 }}

// Scale up (icons, buttons)
whileHover={{ scale: 1.1 }}

// Icon rotation (playful interaction)
whileHover={{ rotate: [0, -10, 10, 0] }}
transition={{ duration: 0.5 }}

// X-axis shift (list items)
whileHover={{ x: 10 }}

// Combined effects
whileHover={{ y: -10, scale: 1.02 }}
```

### Timing Guidelines

| Animation Type | Duration | Easing | Use Case |
|----------------|----------|--------|----------|
| **Micro-interactions** | 150-200ms | `ease-out` | Buttons, toggles |
| **Hover transitions** | 300-500ms | `ease` or spring | Cards, icons |
| **Entrance animations** | 600ms | `ease-out` or spring | Sections, cards |
| **Stagger delay** | 100-150ms | - | Between items |
| **Loop animations** | 2000-3000ms | `ease-in-out` | Pulses, floats |

### CSS Transitions (Non-Framer)

```tsx
// Standard transition
className="transition-all duration-500"

// Color transitions only
className="transition-colors duration-300"

// Transform transitions
className="transition-transform duration-300"

// Group hover patterns
className="opacity-0 group-hover:opacity-10 transition-opacity duration-500"

// Multiple properties
className="transition-all duration-500 group-hover:bg-green-500/20 group-hover:text-green-400"
```

### Continuous Animations

```tsx
// Pulse effect (for live indicators, badges)
animate={{ 
  scale: [1, 1.1, 1],
  opacity: [0.3, 0.5, 0.3]
}}
transition={{ duration: 3, repeat: Infinity }}

// Gentle float
animate={{ y: [0, -10, 0] }}
transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}

// Rotation (for decorative elements)
animate={{ rotate: 360 }}
transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
```

---

## 🧩 Component Library

### Eyebrow Badge (Section Labels)

```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-zinc-400 mb-6 border border-white/10">
  <Icon className="h-4 w-4" />
  <span className="text-sm font-bold">Section Label</span>
</div>
```

**Variations:**

**Gradient Badge:**
```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full text-green-400 border border-green-500/30">
  <Award className="h-4 w-4" />
  <span className="text-sm font-bold">Premium</span>
</div>
```

**With Accent Color:**
```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full text-blue-400 border border-blue-500/30">
  <Icon className="h-4 w-4" />
  <span className="text-sm font-bold">Technology</span>
</div>
```

### Buttons

**Primary CTA:**
```tsx
<Button className="bg-green-600 text-white hover:bg-green-500 px-8 py-4 rounded-2xl font-bold transition-colors">
  Action Text
</Button>
```

**Secondary Outline:**
```tsx
<Button 
  variant="outline" 
  className="rounded-2xl px-8 py-4 font-bold border-2 border-white/20 text-white hover:bg-white/5 hover:border-white/40 transition-all"
>
  Secondary Action
</Button>
```

**With Icon & Animation:**
```tsx
<Button className="group rounded-full px-8 py-6 text-base font-bold bg-white text-zinc-900 hover:bg-zinc-100 transition-all">
  Browse All
  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
</Button>
```

**Gradient Button:**
```tsx
<button className="group relative bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl py-4 font-bold text-lg shadow-lg shadow-green-500/25 overflow-hidden">
  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
  <span className="relative flex items-center justify-center gap-2">
    <Icon className="h-5 w-5" />
    Action Text
  </span>
</button>
```

### Icons

**Standard Icon Container:**
```tsx
<div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
  <Icon className="h-6 w-6 text-green-400" />
</div>
```

**Large Icon Container (for cards):**
```tsx
<div className="relative w-20 h-20 rounded-2xl bg-green-500/10 flex items-center justify-center">
  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-20 rounded-2xl" />
  <Icon className="h-10 w-10 text-white/80" />
</div>
```

**Icon with Hover Animation:**
```tsx
<motion.div 
  className="relative w-20 h-20 rounded-2xl bg-green-500/10 flex items-center justify-center"
  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
  transition={{ duration: 0.5 }}
>
  <Icon className="h-10 w-10 text-white/80" />
</motion.div>
```

---

## 📐 Layout Patterns

### Section Structure Template

Every section should follow this structure:

```tsx
<section className="py-24 bg-zinc-900 relative overflow-hidden">
  {/* Background Effects */}
  <div className="absolute inset-0 pointer-events-none">
    {/* Ambient glows */}
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
    
    {/* Dot pattern overlay */}
    <div className="absolute inset-0 opacity-20" style={{ 
      backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)', 
      backgroundSize: '32px 32px' 
    }} />
  </div>

  {/* Content Container */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    {/* Section Header */}
    <motion.div 
      className="text-center mb-20"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Eyebrow Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-zinc-400 mb-6 border border-white/10">
        <Icon className="h-4 w-4" />
        <span className="text-sm font-bold">Section Label</span>
      </div>
      
      {/* Headline with Gradient */}
      <h2 className="text-4xl md:text-6xl font-black mb-6">
        Section{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-500">
          Title
        </span>
      </h2>
      
      {/* Description */}
      <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
        Section description goes here...
      </p>
    </motion.div>

    {/* Content Grid */}
    <div className="grid md:grid-cols-3 gap-8">
      {/* Cards or Content */}
    </div>
  </div>
</section>
```

### Grid Patterns

**3-Column Feature Grid:**
```tsx
<div className="grid md:grid-cols-3 gap-8">
  {items.map((item, index) => (
    <FeatureCard key={item.id} item={item} index={index} />
  ))}
</div>
```

**2-Column Split (Text + Visual):**
```tsx
<div className="grid lg:grid-cols-2 gap-12 items-center">
  {/* Left: Text content */}
  <div>
    {/* Content */}
  </div>
  
  {/* Right: Visual/Interactive element */}
  <div className="relative">
    {/* Visual content */}
  </div>
</div>
```

**Responsive Single → Multi Column:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
  {/* Items */}
</div>
```

---

## 🎯 Background Effects

### Ambient Glows

Place these in section backgrounds for depth:

```tsx
{/* Top-left glow */}
<div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

{/* Bottom-right glow */}
<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

{/* Center accent glow */}
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
```

### Dot Pattern Overlay

Adds subtle texture:

```tsx
<div 
  className="absolute inset-0 opacity-20 pointer-events-none" 
  style={{ 
    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)', 
    backgroundSize: '32px 32px' 
  }} 
/>
```

### Gradient Overlays

For hero images or section transitions:

```tsx
{/* Top fade (for text readability) */}
<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent" />

{/* Bottom fade */}
<div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

{/* Full vignette */}
<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />

{/* Side fades (for horizontal content) */}
<div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-transparent to-zinc-900" />
```

---

## ✅ Do's and ❌ Don'ts

### ✅ DO

- **Use generous spacing:** `py-24` for sections, `p-8` for cards, `gap-8` between items
- **Apply consistent border radius:** `rounded-3xl` for cards, `rounded-2xl` for buttons
- **Add backdrop blur** to glass cards: `backdrop-blur-sm`
- **Use semantic colors** consistently for feature areas (green = trust, blue = tech, etc.)
- **Animate on scroll** with `viewport={{ once: true }}` to prevent re-animation
- **Hover states** on all interactive elements - cards should lift, icons should animate
- **Gradient text** for 1-2 key words in headlines only
- **High contrast** - white text on dark backgrounds
- **Stagger animations** - delay between items: `delay: index * 0.15`
- **Pointer events** - background effects need `pointer-events-none`
- **Z-index layering** - content `z-10`, effects behind

### ❌ DON'T

- **Don't use pure black** (`bg-black`) - always use `bg-zinc-900` or `bg-zinc-950`
- **Don't mix light sections** without a clear alternating pattern
- **Don't use solid color backgrounds** without opacity/gradient layers
- **Don't skip hover states** - every card should react to interaction
- **Don't use harsh shadows** - use glows and blurs instead
- **Don't overcrowd** - whitespace is premium and necessary
- **Don't use more than 3 accent colors** in one section
- **Don't animate width/height** - use `transform` and `opacity` only
- **Don't forget reduced motion** - respect `prefers-reduced-motion`
- **Don't use inconsistent spacing** - stick to the 4px grid

---

## 🚀 Quick Start Templates

### New Section Template

```tsx
<section className="py-24 bg-zinc-900 relative overflow-hidden">
  {/* Background Effects */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[COLOR]-500/10 rounded-full blur-3xl" />
  </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    {/* Header */}
    <motion.div 
      className="text-center mb-20"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-zinc-400 mb-6 border border-white/10">
        <Icon className="h-4 w-4" />
        <span className="text-sm font-bold">Eyebrow</span>
      </div>
      
      <h2 className="text-4xl md:text-6xl font-black mb-6">
        Section{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[COLOR]-400 to-[COLOR]-500">
          Title
        </span>
      </h2>
      
      <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
        Description text...
      </p>
    </motion.div>

    {/* Content */}
    {/* ... */}
  </div>
</section>
```

### New Card Component Template

```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: index * 0.15, duration: 0.6 }}
  whileHover={{ y: -10 }}
  className="group relative"
>
  <div className="relative p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 h-full overflow-hidden">
    {/* Hover effects */}
    <div className="absolute inset-0 bg-gradient-to-br from-[COLOR]-500 to-[COLOR]-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
    <div className="absolute -inset-1 bg-gradient-to-r from-[COLOR]-500 to-[COLOR]-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />
    
    {/* Content */}
    <div className="relative z-10">
      {/* Icon */}
      <div className="relative w-20 h-20 rounded-2xl bg-[COLOR]-500/10 flex items-center justify-center mb-6 mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-[COLOR]-500 to-[COLOR]-600 opacity-20 rounded-2xl" />
        <Icon className="h-10 w-10 text-white/80" />
      </div>
      
      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        Title
      </h3>
      
      {/* Description */}
      <p className="text-zinc-400 leading-relaxed text-center">
        Description
      </p>
    </div>
    
    {/* Bottom accent */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-[COLOR]-500 to-[COLOR]-600 rounded-full group-hover:w-1/2 transition-all duration-500" />
  </div>
</motion.div>
```

---

## 📁 File References

- **Primary Implementation:** `components/marketing/WhyUsSection.tsx`
- **Interactive Tools:** `components/marketing/FineCalculator.tsx`, `components/marketing/EligibilityQuiz.tsx`
- **Color Configuration:** `app/globals.css` (CSS variables)
- **Accordion Pattern:** `components/ui/faq-accordion.tsx`
- **Hero Section:** `components/HeroSection.tsx`

---

## 🔄 Migration Guide

When updating existing sections to this design system:

1. **Background:** Change `bg-white` → `bg-zinc-900`
2. **Text colors:** Change `text-gray-900` → `text-white`
3. **Secondary text:** Change `text-gray-600` → `text-zinc-400`
4. **Cards:** Wrap in glass morphism pattern (`bg-white/5`, `backdrop-blur-sm`, `border-white/10`)
5. **Add hover effects:** `whileHover={{ y: -10 }}` and gradient reveals
6. **Background effects:** Add ambient glows and dot pattern
7. **Gradients:** Add gradient text to headlines
8. **Animations:** Wrap with Framer Motion entrance animations

---

## 🎨 Color Decision Tree

```
What is the content about?
├── Trust, Safety, Legal, Verification
│   └── Use GREEN (#22c55e)
├── Technology, UI, Confidence, Systems
│   └── Use BLUE (#3b82f6)
├── Privacy, Access, Premium Features
│   └── Use PURPLE (#8b5cf6)
├── Warnings, Fines, Alerts, Danger
│   └── Use RED (#ef4444)
├── CTAs, Highlights, Important
│   └── Use AMBER (#f59e0b)
└── General content
    └── Use ZINC grays
```

---

*Document Version: 3.0 - Premium Dark Theme*  
*Last Updated: February 15, 2026*  
*Based on: WhyUsSection Design Implementation*  
*Review Cycle: Per-feature implementation*

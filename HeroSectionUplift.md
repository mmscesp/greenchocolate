# META PROMPT FOR OPENCODE: Barcelona Hero Scroll — Single Image Implementation

---

## 🎯 PROJECT MISSION

You are implementing a **cinematic scroll-based hero experience** for **SocialClubsMaps.es** — a cannabis social club verification platform operating in Spain's legally grey market. 

**Design Identity**: "Underground Authority" (Resident Advisor meets financial compliance platform)

**Core Principle**: Every pixel communicates trust, sophistication, and legal awareness.

---

## 📸 IMAGE ASSET — SINGLE SOURCE OF TRUTH

### **ONLY IMAGE USED**: `Scene1.jpg`

**Why this image**:
- ✅ Higher resolution (suitable for 153% zoom without quality loss)
- ✅ Perfect composition zones:
  - **Top 40%**: Clear blue sky (optimal text overlay zone)
  - **Middle 40%**: Sagrada Familia + Barcelona cityscape
  - **Bottom 20%**: Green foliage/trees (transition zone)
- ✅ Centered Sagrada Familia (perfect focal point for zoom)
- ✅ Cool blue sky + warm city tones (color psychology balance)

**Technical Specs**:
- **Resolution**: High-res (appears to be 3000+ pixels wide)
- **Format**: Convert to `.webp` for performance
- **Optimized Size**: Target ~400-600KB after compression
- **Color Grade**: Use as-is (already has good sky/city/greenery separation)

**File Path**: `/public/images/barcelona-hero.webp` (rename Scene1.jpg to this)

---

## 🎬 THE COMPLETE CINEMATIC SCROLL EXPERIENCE

### **THE CONCEPT**: "Descending Into Barcelona"

The user experiences a metaphorical descent:
- **START**: Zoomed in (153%), floating above the city, focused on Sagrada Familia
- **SCROLL**: Camera pulls back and descends
- **END**: Full city view revealed, transitioning to ground-level content

**Total Scroll Height**: `300vh` (3× viewport height)  
**Animation Engine**: GSAP 3 + ScrollTrigger (free version via npm)

---

## 🎞️ SCENE-BY-SCENE BREAKDOWN

### **SCENE 1: Initial State (Scroll Position 0% — Page Load)**

#### Image State:
```
ZOOM LEVEL: 153% (scale: 1.53)
VERTICAL POSITION: object-[center_40%]
FOCAL POINT: Sagrada Familia spires perfectly centered
VISIBLE COMPOSITION:
  ├─ Top 50%: Blue sky (text readability zone)
  ├─ Center: Sagrada Familia prominently displayed
  └─ Bottom edges: Hints of cityscape
```

#### Visual Overlay Stack (z-index layers):
```
z-0   : Image (scale: 1.53, static)
z-10  : Dark gradient overlay (text readability)
z-20  : Edge vignette (subtle darkening on borders)
z-30  : Text content layer
z-40  : Scroll indicator
```

#### Text Content (Staggered Fade-In Animations):

**Animation Sequence** (each element appears after previous):

```
+0.5s  →  TAGLINE appears
          "Different city. Different rules.
           Different consequences."
          
          Typography:
          • "Different city. Different rules." → #F5F0EB (white)
          • "Different consequences." → #D9534F (coral red)
          • Size: text-xl md:text-2xl lg:text-3xl
          • Tracking: tracking-[0.1em]
          • Font-weight: 400 (regular) for first line, 700 (bold) for second
          • Line-height: leading-relaxed
          • Animation: fade-in-up (0 → 100% opacity, translateY(30px → 0))

+1.3s  →  HEADLINE appears
          "BARCELONA ≠ AMSTERDAM"
          
          Layout:
          • Horizontal flex layout
          • "BARCELONA" (left) | "≠" (center) | "AMSTERDAM" (right)
          • Gap: gap-4 md:gap-8
          • Alignment: items-center justify-center
          
          Typography:
          • City names: text-4xl md:text-6xl lg:text-7xl xl:text-8xl
          • City names: font-black (900 weight)
          • City names: tracking-[0.15em]
          • City names: uppercase
          • City names: #F5F0EB (white)
          
          • ≠ symbol: text-5xl md:text-7xl lg:text-8xl xl:text-9xl
          • ≠ symbol: #E8A838 (amber gold)
          • ≠ symbol: text-shadow: 0 0 40px rgba(232,168,56,0.4)
          • ≠ symbol: Subtle pulse animation (optional)
          
          Animation: fade-in-up + scale (0.95 → 1.0)

+2.0s  →  BODY TEXT appears
          "Spain's cannabis social clubs aren't coffeeshops.
           No walk-ins. No menus. No second chances if you 
           don't know the rules.
           
           We're the verification layer that keeps you safe."
           
          Typography:
          • First paragraph: text-base md:text-lg lg:text-xl
          • First paragraph: text-gray-300 (#D1D5DB)
          • First paragraph: leading-relaxed
          
          • Second paragraph: text-lg md:text-xl lg:text-2xl
          • Second paragraph: #F5F0EB (white)
          • Second paragraph: font-semibold (600 weight)
          
          • Max-width: max-w-2xl lg:max-w-3xl
          • Text-align: center
          
          Animation: fade-in-up (slower, 1s duration)

+2.5s  →  SCROLL INDICATOR appears
          Icon + Text
          
          Visual:
          • ChevronDown icon (Lucide React)
          • Icon size: w-8 h-8 md:w-10 md:h-10
          • Icon color: #E8A838 (amber)
          • Icon animation: animate-bounce (infinite)
          
          • Text: "Scroll to explore"
          • Text size: text-sm md:text-base
          • Text color: text-gray-400
          • Text transform: uppercase
          • Text tracking: tracking-wider
          
          Layout: flex flex-col items-center gap-2
          Animation: fade-in (simple opacity)
```

#### CSS for Initial Animations:

```css
/* Add to globals.css */

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-scale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-scale {
  animation: fade-in-scale 1s ease-out forwards;
  opacity: 0;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-1300 {
  animation-delay: 1.3s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-2500 {
  animation-delay: 2.5s;
}

/* Edge vignette effect */
.image-vignette {
  background: radial-gradient(
    ellipse 120% 100% at 50% 50%,
    transparent 0%,
    transparent 65%,
    rgba(10, 10, 15, 0.25) 80%,
    rgba(10, 10, 15, 0.7) 100%
  );
}
```

---

### **SCENE 2: The Scroll Journey (0vh → 300vh)**

#### Timeline Overview:
```
SCROLL DISTANCE    | IMAGE STATE              | TEXT STATE           | WHAT USER SEES
───────────────────┼──────────────────────────┼─────────────────────┼────────────────────────
0vh - 10vh         | scale: 1.53              | opacity: 1           | Static "statement" screen
                   | yPercent: 0              | y: 0                 | All text visible
───────────────────┼──────────────────────────┼─────────────────────┼────────────────────────
10vh - 100vh       | scale: 1.53 → 1.3        | opacity: 1 → 0       | Text fading out
(PHASE 1)          | yPercent: 0              | y: 0 → -100px        | Image starting zoom-out
                   |                          | scale: 1 → 0.9       | Slight text shrink
───────────────────┼──────────────────────────┼─────────────────────┼────────────────────────
100vh - 200vh      | scale: 1.3 → 1.0         | opacity: 0           | Full zoom-out
(PHASE 2)          | yPercent: 0 → -15        | (invisible)          | Sagrada becoming smaller
                   |                          |                      | City grid revealed
                   |                          |                      | Sky area shrinking
───────────────────┼──────────────────────────┼─────────────────────┼────────────────────────
200vh - 300vh      | scale: 1.0               | opacity: 0           | Vertical pan starts
(PHASE 3)          | yPercent: -15 → -25      | (invisible)          | Bottom greenery visible
                   |                          |                      | Transition gradient active
                   |                          |                      | Stats section enters
```

#### Detailed GSAP Animation Code:

```javascript
// components/HeroSection.tsx
// Inside useEffect after gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════
// PHASE 1: IMAGE ZOOM-OUT (153% → 100%)
// ═══════════════════════════════════════════════════════
gsap.to(".hero-image-container", {
  scale: 1,                    // From initial 1.53 → 1.0
  ease: "power2.inOut",        // Smooth acceleration/deceleration
  scrollTrigger: {
    trigger: ".hero-scroll-wrapper",
    start: "top top",          // When section top hits viewport top
    end: "66% top",            // At 66% of scroll (200vh mark)
    scrub: 1,                  // 1 second smoothing lag
    // markers: true,          // DEBUG: Uncomment to see trigger points
  }
});

// ═══════════════════════════════════════════════════════
// PHASE 2: IMAGE VERTICAL PAN (Reveals bottom greenery)
// ═══════════════════════════════════════════════════════
gsap.to(".hero-image-container", {
  yPercent: -25,               // Pan upward (negative = reveals bottom)
  ease: "power2.inOut",
  scrollTrigger: {
    trigger: ".hero-scroll-wrapper",
    start: "33% top",          // Start pan at 33% (100vh mark)
    end: "100% top",           // End at 100% (300vh mark)
    scrub: 1,
  }
});

// ═══════════════════════════════════════════════════════
// PHASE 3: TEXT CONTENT EXIT
// ═══════════════════════════════════════════════════════
gsap.to(".hero-text-content", {
  opacity: 0,
  y: -100,
  scale: 0.9,
  ease: "power2.in",           // Faster exit (ease-in)
  scrollTrigger: {
    trigger: ".hero-scroll-wrapper",
    start: "10% top",          // Start fading at 10% scroll (30vh)
    end: "35% top",            // Fully gone by 35% (105vh)
    scrub: true,               // Tight scrubbing (no lag)
  }
});

// ═══════════════════════════════════════════════════════
// PHASE 4: GREENERY GRADIENT INTENSIFY
// ═══════════════════════════════════════════════════════
gsap.to(".greenery-transition-gradient", {
  opacity: 1,                  // From 0 → 1
  ease: "power2.inOut",
  scrollTrigger: {
    trigger: ".hero-scroll-wrapper",
    start: "60% top",          // Start at 60% (180vh)
    end: "100% top",           // Full at 100% (300vh)
    scrub: 1,
  }
});

// ═══════════════════════════════════════════════════════
// PHASE 5: STATS SECTION ENTRANCE
// ═══════════════════════════════════════════════════════
gsap.from(".stat-card", {
  opacity: 0,
  y: 60,
  scale: 0.95,
  stagger: 0.12,               // Each card +0.12s delay
  ease: "back.out(1.4)",       // Bounce effect
  scrollTrigger: {
    trigger: ".stats-section",
    start: "top 85%",          // When stats section is 85% down viewport
    end: "top 50%",            // Finish when it's 50% down
    scrub: 1,
  }
});
```

---

### **SCENE 3: Stats Section (Black Background)**

#### Visual Transition Mechanics:

```
IMAGE BOTTOM (greenery zone at yPercent: -25)
              ↓
    [Gradient overlay increasing opacity]
              ↓
    linear-gradient(
      transparent 50%,
      rgba(10,10,15,0.6) 70%,
      rgba(10,10,15,1) 100%
    )
              ↓
SOLID BLACK SECTION (#0A0A0F)
              ↓
    [Stats cards fade in, staggered]
              ↓
STATS GRID FULLY VISIBLE
```

#### Stats Data:

```typescript
const stats = [
  {
    value: '4',
    label: 'Expert Guides',
    description: '100% Verified Content',
    icon: BookOpen,
    iconColor: '#E8A838', // Amber
  },
  {
    value: '2.5K+',
    label: 'Safety Kits',
    description: 'Downloaded by Travelers',
    icon: Shield,
    iconColor: '#E8A838', // Amber
  },
  {
    value: '€0',
    label: 'Fines',
    description: 'For Protected Members',
    icon: AlertCircle,
    iconColor: '#E8A838', // Amber
  },
  {
    value: 'Mar',
    label: '2026',
    description: 'Barcelona Club Launch',
    icon: Calendar,
    iconColor: '#E8A838', // Amber
  },
];
```

---

## 🏗️ COMPLETE TECHNICAL IMPLEMENTATION

### **File Structure**:

```
components/
├── HeroSection.tsx              ← Main hero (300vh scroll wrapper)
├── StatsSection.tsx             ← Stats grid (NEW component)
└── ui/
    └── button.tsx               ← shadcn button (existing)

public/
└── images/
    └── barcelona-hero.webp      ← Single image source (Scene1.jpg converted)

app/
└── [lang]/
    └── page.tsx                 ← Assembles HeroSection + StatsSection

styles/
└── globals.css                  ← Animation keyframes
```

---

### **1. HeroSection.tsx (COMPLETE IMPLEMENTATION)**

```typescript
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      // Wait for image load before starting animations
      if (imageLoaded) {
        initScrollAnimations();
      }
    }
  }, [imageLoaded]);

  const initScrollAnimations = () => {
    // Image zoom-out: 153% → 100%
    gsap.to(".hero-image-container", {
      scale: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".hero-scroll-wrapper",
        start: "top top",
        end: "66% top",
        scrub: 1,
        // markers: true, // DEBUG: Uncomment to visualize
      }
    });

    // Image vertical pan: reveals bottom greenery
    gsap.to(".hero-image-container", {
      yPercent: -25,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".hero-scroll-wrapper",
        start: "33% top",
        end: "100% top",
        scrub: 1,
      }
    });

    // Text fade-out
    gsap.to(".hero-text-content", {
      opacity: 0,
      y: -100,
      scale: 0.9,
      ease: "power2.in",
      scrollTrigger: {
        trigger: ".hero-scroll-wrapper",
        start: "10% top",
        end: "35% top",
        scrub: true,
      }
    });

    // Greenery transition gradient
    gsap.to(".greenery-transition-gradient", {
      opacity: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".hero-scroll-wrapper",
        start: "60% top",
        end: "100% top",
        scrub: 1,
      }
    });
  };

  return (
    <section 
      className="hero-scroll-wrapper relative w-full overflow-hidden"
      style={{ height: '300vh' }}
      role="region"
      aria-label="Hero Introduction"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        
        {/* ═══════════════════════════════════════════ */}
        {/* IMAGE LAYER (z-0)                           */}
        {/* ═══════════════════════════════════════════ */}
        <div className="absolute inset-0 bg-black">
          <div 
            className="hero-image-container absolute inset-0 w-full h-full"
            style={{ 
              transform: 'scale(1.53)',
              transformOrigin: 'center center',
            }}
          >
            <Image
              src="/images/barcelona-hero.webp"
              alt="Aerial view of Barcelona with Sagrada Familia"
              fill
              priority
              quality={90}
              sizes="100vw"
              className={`
                object-cover 
                object-[center_40%] 
                transition-opacity 
                duration-1000
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
              onLoadingComplete={() => setImageLoaded(true)}
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* DARK GRADIENT OVERLAY (z-10)                */}
        {/* ═══════════════════════════════════════════ */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,10,15,0.7) 0%, rgba(10,10,15,0.4) 40%, rgba(10,10,15,0.75) 100%)'
          }}
        />

        {/* ═══════════════════════════════════════════ */}
        {/* EDGE VIGNETTE (z-20)                        */}
        {/* ═══════════════════════════════════════════ */}
        <div className="image-vignette absolute inset-0 pointer-events-none z-20" />

        {/* ═══════════════════════════════════════════ */}
        {/* GREENERY TRANSITION GRADIENT (z-25)         */}
        {/* ═══════════════════════════════════════════ */}
        <div 
          className="greenery-transition-gradient absolute inset-0 pointer-events-none z-25 opacity-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(10,10,15,0.6) 70%, rgba(10,10,15,1) 100%)'
          }}
        />

        {/* ═══════════════════════════════════════════ */}
        {/* TEXT CONTENT LAYER (z-30)                   */}
        {/* ═══════════════════════════════════════════ */}
        <div className="hero-text-content relative z-30 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto w-full text-center">
            
            {/* TAGLINE */}
            <div className="mb-6 md:mb-8 animate-fade-in-up animation-delay-500">
              <p className="text-xl md:text-2xl lg:text-3xl text-[#F5F0EB] tracking-[0.1em] leading-relaxed">
                Different city. Different rules.
              </p>
              <p 
                className="text-xl md:text-2xl lg:text-3xl font-bold tracking-[0.1em] leading-relaxed mt-1"
                style={{ color: '#D9534F' }}
              >
                Different consequences.
              </p>
            </div>

            {/* MAIN HEADLINE */}
            <div className="mb-8 md:mb-12 animate-fade-in-scale animation-delay-1300">
              <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 flex-wrap">
                <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-[0.15em] uppercase text-[#F5F0EB]">
                  BARCELONA
                </h1>
                <span 
                  className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black"
                  style={{ 
                    color: '#E8A838',
                    textShadow: '0 0 40px rgba(232, 168, 56, 0.4)'
                  }}
                >
                  ≠
                </span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-[0.15em] uppercase text-[#F5F0EB]">
                  AMSTERDAM
                </h1>
              </div>
            </div>

            {/* BODY TEXT */}
            <div className="mb-8 md:mb-12 max-w-2xl lg:max-w-3xl mx-auto animate-fade-in-up animation-delay-2000">
              <p className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed mb-4">
                Spain's cannabis social clubs aren't coffeeshops.<br className="hidden sm:block" />
                No walk-ins. No menus. No second chances if you don't know the rules.
              </p>
              <p className="text-lg md:text-xl lg:text-2xl text-[#F5F0EB] font-semibold">
                We're the verification layer that keeps you safe.
              </p>
            </div>

            {/* SCROLL INDICATOR */}
            <div className="animate-fade-in-up animation-delay-2500">
              <div className="flex flex-col items-center gap-2">
                <ChevronDown 
                  className="w-8 h-8 md:w-10 md:h-10 animate-bounce" 
                  style={{ color: '#E8A838' }}
                  strokeWidth={2.5}
                />
                <span className="text-sm md:text-base text-gray-400 uppercase tracking-wider font-medium">
                  Scroll to explore
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
```

---

### **2. StatsSection.tsx (NEW COMPONENT)**

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { BookOpen, Shield, AlertCircle, Calendar } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const statsData = [
  {
    value: '4',
    label: 'Expert Guides',
    description: '100% Verified Content',
    icon: BookOpen,
  },
  {
    value: '2.5K+',
    label: 'Safety Kits',
    description: 'Downloaded by Travelers',
    icon: Shield,
  },
  {
    value: '€0',
    label: 'Fines',
    description: 'For Protected Members',
    icon: AlertCircle,
  },
  {
    value: 'Mar',
    label: '2026',
    description: 'Barcelona Club Launch',
    icon: Calendar,
  },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && sectionRef.current) {
      gsap.registerPlugin(ScrollTrigger);

      // Staggered card entrance
      gsap.from(".stat-card", {
        opacity: 0,
        y: 60,
        scale: 0.95,
        stagger: 0.12,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "top 50%",
          scrub: 1,
        }
      });
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="stats-section bg-[#0A0A0F] py-16 md:py-20 lg:py-24 border-t border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <div 
                key={index} 
                className="stat-card text-center group cursor-default"
              >
                {/* Icon Container */}
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#E8A838]/10 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-[#E8A838]/20 group-hover:scale-110">
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-[#E8A838]" strokeWidth={2} />
                </div>

                {/* Value */}
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-sm md:text-base font-bold text-[#4A7C6F] mb-1 tracking-wide">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-xs md:text-sm text-zinc-500 uppercase tracking-wider font-medium px-2">
                  {stat.description}
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
```

---

### **3. globals.css (Animation Keyframes)**

```css
/* ═══════════════════════════════════════════════════════ */
/* HERO SCROLL ANIMATIONS                                  */
/* ═══════════════════════════════════════════════════════ */

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-scale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-scale {
  animation: fade-in-scale 1s ease-out forwards;
  opacity: 0;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-1300 {
  animation-delay: 1.3s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-2500 {
  animation-delay: 2.5s;
}

/* Edge vignette for image bleeding effect */
.image-vignette {
  background: radial-gradient(
    ellipse 120% 100% at 50% 50%,
    transparent 0%,
    transparent 65%,
    rgba(10, 10, 15, 0.25) 80%,
    rgba(10, 10, 15, 0.7) 100%
  );
}

/* Custom z-index for greenery gradient */
.z-25 {
  z-index: 25;
}
```

---

### **4. package.json Dependencies**

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "gsap": "^3.12.5",
    "lucide-react": "latest",
    "tailwindcss": "^3.4.0"
  }
}
```

**Installation Command**:
```bash
npm install gsap lucide-react
```

---

### **5. Page Assembly (app/[lang]/page.tsx)**

```typescript
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F]">
      <HeroSection />
      <StatsSection />
      {/* Other sections below... */}
    </main>
  );
}
```

---

## 📦 IMAGE PREPARATION STEPS

### **Convert Scene1.jpg to Optimized WebP**:

```bash
# Using ImageMagick (if installed)
convert Scene1.jpg -quality 85 -define webp:method=6 barcelona-hero.webp

# Or using online tool: https://squoosh.app
# - Upload Scene1.jpg
# - Select WebP format
# - Quality: 85
# - Download as barcelona-hero.webp
```

### **File Location**:
```
public/
└── images/
    └── barcelona-hero.webp    ← Place converted image here
```

### **Image Size Target**: 400-600KB max

---

## ❓ CLARIFYING QUESTIONS FOR OPENCODE

Before beginning implementation, please confirm:

### **1. Image Zoom Verification**
- At `scale(1.53)`, does the Sagrada Familia appear **prominently centered** in your viewport?
- If not, should we adjust to:
  - `scale(1.6)` (more zoomed)
  - `scale(1.45)` (less zoomed)
- **How to test**: Open Scene1.jpg in browser, zoom to 153%, check composition

### **2. Scroll Speed Preference**
- `300vh` = 3× viewport scroll = ~3-4 seconds of scrolling
- Does this feel:
  - ⚡ Too fast? → Increase to `350vh` or `400vh`
  - 🐌 Too slow? → Decrease to `250vh`
  - ✅ Just right? → Keep `300vh`

### **3. Text Appearance Timing**
- Current: Text appears **after** image loads
- Alternative: Text appears **immediately**, image fades in behind
- **Preference**: Which feels better for first impression?

### **4. Mobile Zoom Reduction**
- On mobile (< 768px), should we:
  - ✅ Reduce initial zoom to `scale(1.3)` (shows more context)
  - ❌ Keep `scale(1.53)` (maintains desktop parity)
- **Recommendation**: Reduce to 1.3 for mobile

### **5. Stats Card Interaction**
- Current: Hover scales icon container + color change
- Should we add:
  - Click interaction (opens modal/tooltip)?
  - Different hover effect (glow, lift, etc.)?
  - **Recommendation**: Keep current (subtle, professional)

### **6. GSAP Debug Markers**
- Should we **enable markers** initially for testing?
  - ✅ Yes, enable `markers: true` in ScrollTrigger
  - ❌ No, disable for cleaner view
- **Recommendation**: Enable for first test, then disable

### **7. Browser Compatibility**
- Target browsers:
  - Chrome/Edge (Blink): ✅ Full support
  - Safari (WebKit): ✅ Full support (may need `-webkit-` prefixes)
  - Firefox (Gecko): ✅ Full support
- Should we add fallbacks for IE11?
  - **Recommendation**: No IE11 support (deprecated)

### **8. Performance Optimization**
- Should we implement:
  - ✅ Lazy-load stats section (only load when scrolled near)?
  - ✅ Disable scroll animations on low-power devices?
  - ✅ Use `will-change: transform` on animated elements?
- **Recommendation**: Yes to all

---

## ✅ IMPLEMENTATION CHECKLIST

Confirm you will implement:

- [ ] **Single image**: `barcelona-hero.webp` (Scene1.jpg converted)
- [ ] **Initial zoom**: `scale(1.53)` on desktop
- [ ] **Scroll height**: `300vh` total
- [ ] **Text sequence**: Tagline (+0.5s) → Headline (+1.3s) → Body (+2.0s) → Scroll (+2.5s)
- [ ] **GSAP animations**: Zoom (1.53→1.0), Pan (0→-25%), Text fade, Greenery gradient
- [ ] **Stats grid**: 4 columns desktop, 2 columns mobile
- [ ] **Stats animation**: Staggered entrance (+0.12s per card, bounce easing)
- [ ] **Color palette**: Amber #E8A838, Red #D9534F, Sage #4A7C6F, Black #0A0A0F
- [ ] **Icons**: Lucide React (BookOpen, Shield, AlertCircle, Calendar)
- [ ] **No "What Tourists Get Wrong"**: Excluded from this phase
- [ ] **GSAP Free**: Via npm, no premium plugins

---

## 🚨 CRITICAL REQUIREMENTS

### **Brand Compliance**:
- ❌ NO cannabis leaf imagery anywhere
- ❌ NO green-dominant color schemes
- ❌ NO "stoner" aesthetic elements
- ✅ Sophisticated, European, trustworthy visual language

### **Performance Targets**:
- 🎯 Lighthouse Performance Score: 90+
- 🎯 First Contentful Paint: < 1.5s
- 🎯 Largest Contentful Paint: < 2.5s
- 🎯 Cumulative Layout Shift: < 0.1
- 🎯 60fps scroll animations (no jank)

### **Accessibility**:
- ✅ WCAG AA contrast ratios (4.5:1 minimum)
- ✅ Semantic HTML (`<section>`, `<h1>`, proper ARIA labels)
- ✅ Keyboard navigation support
- ✅ Screen reader announcements for dynamic content

### **Cross-Browser**:
- ✅ Chrome 100+
- ✅ Safari 15+
- ✅ Firefox 100+
- ✅ Edge 100+
- ❌ IE11 (not supported)

---

## 💬 RESPONSE REQUIRED

Please respond with:

1. ✅ **Confirmation** you understand the single-image concept
2. 📋 **Answers** to the 8 clarifying questions
3. ⚠️ **Any concerns** about technical feasibility
4. ⏱️ **Timeline estimate** for implementation
5. 📦 **First deliverable** (component code, test page, etc.)

---

**Once you confirm, we'll proceed with implementation and fine-tuning. Let's build something iconic. 🚀**
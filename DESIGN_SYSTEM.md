# Design System & UI Architecture

## 1. Design Philosophy
**"Elevated Underground"**
The aesthetic should balance the "underground" nature of cannabis culture with a high-end, trustworthy, and modern "SaaS" feel.
*   **Keywords:** Professional, Clean, Dark Mode Native, Glassmorphism, Trusted.
*   **Inspiration:** Resident Advisor (RA.co), Soho House, Linear.app.

## 2. Color Palette
*   **Primary:** `Emerald-500` (#10B981) - Used for "Verified", "Open", "Success".
*   **Background:** `Slate-950` (#020617) - Deep, rich dark mode base.
*   **Surface:** `Slate-900` with `White/5` opacity overlay - For cards and panels.
*   **Accent:** `Violet-500` - For "Vibe" tags and premium features.
*   **Text:** `Slate-50` (Primary), `Slate-400` (Secondary).

## 3. Typography
*   **Headings:** `Inter` (Tight tracking, bold weights).
*   **Body:** `Inter` or `Geist Sans` (High readability).
*   **Accents:** `JetBrains Mono` (For data points, coordinates, tags).

## 4. Core Components (The "God Level" Set)

### 4.1 Hero Section (The "Hook")
*   **Type:** Interactive Map + Video Hybrid.
*   **Behavior:**
    *   Background: Muted, slow-motion 4K footage of Barcelona streets/smoke textures (abstract).
    *   Foreground: Floating "Search Bar" with glassmorphism.
    *   Interaction: As user types "Gracia", the background map zooms to that neighborhood.

### 4.2 Club Card (The "Unit")
*   **Layout:** Horizontal (Desktop) / Stacked (Mobile).
*   **Features:**
    *   **Cover Image:** High-res with gradient overlay.
    *   **badges:** "Verified" (Green Tick), "Members Only" (Lock Icon).
    *   **Vibe Tags:** Pill-shaped, colored tags (e.g., "Work Friendly", "Pool").
    *   **Distance:** "0.5km away" (Calculated dynamically).

### 4.3 The "Endorsement" Wizard (Membership Flow)
*   **Type:** Multi-step Stepper.
*   **Steps:**
    1.  **Identity:** Basic Info (Encrypted).
    2.  **Context:** "Why do you want to join?" (Textarea).
    3.  **Habits:** "How experienced are you?" (Slider).
    4.  **Review:** Summary card.
*   **UI:** Smooth Framer Motion transitions between steps. No page reloads.

### 4.4 Dashboard (Admin)
*   **Navigation:** Collapsible Sidebar with icons.
*   **Widgets:**
    *   **Stats:** "Total Requests", "Profile Views" (Line Charts).
    *   **Inbox:** Trello-style board for "Pending", "Approved", "Rejected" requests.

## 5. UI Library Stack
*   **Base:** [Shadcn/ui](https://ui.shadcn.com/) (Radix Primitives).
*   **Styling:** Tailwind CSS.
*   **Animations:** Framer Motion (Page transitions, micro-interactions).
*   **Icons:** Lucide React.
*   **Maps:** Mapbox GL JS (Custom dark style).

## 6. Directory Structure (Components)
```
components/
├── ui/                 # Shadcn primitives (Button, Input, etc.)
├── features/
│   ├── hero/          # HeroMap, SearchBar
│   ├── clubs/         # ClubCard, ClubGrid, FilterPanel
│   ├── membership/    # RequestWizard, StatusBadge
│   └── reviews/       # ReviewList, StarRating, CommentForm
├── layout/            # Navbar, Footer, Sidebar
└── shared/            # ThemeToggle, LanguageSelector
```

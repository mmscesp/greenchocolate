# Design Spec: Liquid Glass Navbar

## 1. Visual System

The "Liquid Glass" aesthetic relies on a combination of high-blur backdrops, subtle transparency, and delicate borders to create a premium, floating feel.

### CSS Variables (Theme Extension)

Add these to `app/globals.css`:

```css
:root {
  /* Liquid Glass System */
  --glass-bg: rgba(20, 20, 20, 0.6); /* Dark, semi-transparent base */
  --glass-border: rgba(255, 255, 255, 0.08); /* Subtle white border */
  --glass-highlight: rgba(255, 255, 255, 0.05); /* Top highlight for depth */
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.36); /* Deep shadow */
  --glass-blur: 16px; /* Heavy blur */
}

.dark {
  --glass-bg: rgba(10, 10, 10, 0.7);
  --glass-border: rgba(255, 255, 255, 0.06);
}
```

### Utility Classes (Tailwind)

Define a `.glass-liquid` utility class in `app/globals.css` or as a Tailwind plugin:

```css
@layer utilities {
  .glass-liquid {
    @apply backdrop-blur-xl bg-black/60 border border-white/10 shadow-2xl;
    /* Advanced depth effects */
    box-shadow: 
      0 4px 24px -1px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.05); /* Top inner highlight */
  }
  
  .glass-liquid-hover {
    @apply hover:bg-black/70 hover:border-white/15 transition-all duration-300;
  }
}
```

## 2. Component Architecture

The Navbar will transition from a full-width header to a floating "island" pill.

### Component Tree

```
Navbar (Container)
├── NavbarPill (The floating glass element)
│   ├── Logo (Left)
│   ├── MainNavigation (Center - Desktop)
│   └── Actions (Right)
│       ├── LanguageSelector
│       ├── UserProfileDropdown
│       └── MobileMenuTrigger (Mobile Only)
└── MobileMenuOverlay (Full screen, distinct from pill)
```

### State Management

- **`isScrolled`**: Boolean.
  - `false`: Navbar is at top (Hero state). Full width (or wide container), transparent background, no border.
  - `true`: Navbar is scrolled. Shrinks to `max-w-5xl`, adds `.glass-liquid` class, becomes `rounded-full`, floats `top-6`.

## 3. Child Component Strategy

Child components (`MainNavigation`, `UserProfileDropdown`, `LanguageSelector`) currently have hardcoded opaque backgrounds (`bg-background`, `bg-white`). This breaks the glass effect.

### Refactoring Plan

1.  **`MainNavigation`**:
    -   **Current**: Uses `NavigationMenu` with default styles.
    -   **Change**: Override `NavigationMenuContent` to use `.glass-liquid` instead of `bg-popover`.
    -   **Action**: Pass a `className` prop or wrap the content in a custom styled container.

2.  **`UserProfileDropdown` & `LanguageSelector`**:
    -   **Current**: `bg-background` / `bg-white` on absolute dropdowns.
    -   **Change**:
        -   Remove hardcoded background colors.
        -   Apply `.glass-liquid` to the dropdown container.
        -   Ensure text colors contrast correctly (force light text if glass is dark).
    -   **Positioning**: Ensure dropdowns are `z-50` and don't get clipped by the `rounded-full` Navbar (use React Portal or `position: fixed` strategy if needed, though `absolute` usually works if overflow is visible).

## 4. Animation & Interaction

### Scroll Behavior (The "Shrink" Effect)

Use Framer Motion or CSS Transitions for smooth state changes.

-   **Initial State (Top)**:
    -   Width: `100%` (or `max-w-7xl` container)
    -   Border-radius: `0`
    -   Top: `0`
    -   Background: `transparent`
    -   Border: `transparent`

-   **Scrolled State**:
    -   Width: `fit-content` (min `600px` on desktop)
    -   Border-radius: `9999px` (Pill)
    -   Top: `1.5rem` (24px)
    -   Background: `.glass-liquid`
    -   Border: `.glass-liquid` border

### Transitions

-   `transition-all duration-500 ease-in-out`
-   Animate `width`, `transform`, `background-color`, `border-radius`.

## 5. Responsiveness (Mobile Strategy)

The "Floating Pill" works best on Desktop. On Mobile, screen real estate is premium.

### Mobile Layout

1.  **Top Bar (Floating)**:
    -   Keep the "Floating Pill" concept but make it span almost full width (`w-[95%]`).
    -   Contents: `Logo` (Left) + `MenuButton` (Right).
    -   Hide `MainNavigation`, `LanguageSelector`, `UserProfileDropdown`.

2.  **Menu Overlay**:
    -   When `MenuButton` is clicked, expand a full-screen overlay.
    -   **Style**: `.glass-liquid` background (very high blur).
    -   **Animation**: Slide down from top or fade in.
    -   **Content**:
        -   Vertical list of `MainNavigation` links.
        -   `UserProfileDropdown` (expanded inline).
        -   `LanguageSelector` (expanded inline).

## 6. Migration Steps

1.  **Step 1: CSS Foundation**: Add CSS variables and `.glass-liquid` utility to `app/globals.css`.
2.  **Step 2: Component Refactor**:
    -   Update `UserProfileDropdown` to accept `className` and remove hardcoded backgrounds.
    -   Update `LanguageSelector` similarly.
    -   Update `MainNavigation` to use glass styles for its dropdowns.
3.  **Step 3: Create New Navbar**:
    -   Create `components/layout/LiquidNavbar.tsx` (temporary name).
    -   Implement the scroll logic and conditional styling.
4.  **Step 4: Swap**:
    -   Replace `Navbar` in `app/layout.tsx` with `LiquidNavbar`.
    -   Rename `LiquidNavbar` to `Navbar`.
5.  **Step 5: Polish**:
    -   Tune blur amounts and opacity.
    -   Verify mobile menu interaction.

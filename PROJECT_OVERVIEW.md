# Project Overview: Cannabis Social Club Platform (Spain)

## 🌟 Introduction
This platform is a comprehensive directory and community hub for Cannabis Social Clubs (CSCs) in Spain. It aims to provide a safe, transparent, and educational environment for users to discover clubs that match their preferences while promoting responsible consumption and legal compliance.

## 🚀 Tech Stack
- **Framework**: [Next.js 13](https://nextjs.org/) (App Router) for optimized routing and server-side capabilities.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for robust type safety across the application.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) combined with [shadcn/ui](https://ui.shadcn.com/) for a consistent and modern design language.
- **State & Context**: React Context for global state (Internationalization, User Preferences).
- **Internationalization**: A custom built-in I18n system supporting:
  - Spanish (ES), English (EN), French (FR), German (DE), Italian (IT), Polish (PL), Russian (RU), and Portuguese (PT).
- **Icons**: [Lucide React](https://lucide.dev/) for a clean, consistent iconography.

## 📂 Key Directories & Routes
- `app/clubs/[slug]`: Dynamic routes for individual club profiles.
- `app/blog/[slug]`: Dynamic routes for educational articles and news.
- `app/club-panel/`: Dedicated dashboard for club administrators to manage requests and view analytics.
- `app/profile/`: User-centric settings, favorites, and review management.
- `hooks/`: Custom logic for data filtering and mock API interactions (`useClubs`, `useArticles`).
- `data/`: Contains the JSON-based mock database for Clubs, Articles, and Membership Requests.

## 🔑 Core Functionality
1. **Intelligent Discovery**: Users can filter clubs by neighborhood (e.g., Raval, Born), amenities (WiFi, Pool, TV), and atmosphere/vibe.
2. **Pre-Registration Flow**: A structured multi-step process for users to apply for membership in specific clubs.
3. **Admin Insights**: Club owners get a bird's-eye view of membership trends, visitor ratings, and pending applications.
4. **Educational Content**: A rich blog section focusing on the legal landscape, culture, and health aspects of cannabis in Spain.

## 🛠 Strategic Goals
- **Verification**: Ensuring all listed clubs are legitimate and verified through a rigorous internal process.
- **Accessibility**: Providing a seamless experience for tourists and locals alike through extensive multi-language support.
- **Community**: Building a feedback loop through user reviews and ratings to maintain high standards across the platform.

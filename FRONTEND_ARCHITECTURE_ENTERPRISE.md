# 🏛️ ENTERPRISE FRONTEND ARCHITECTURE
## Cannabis Social Club Platform - The RA of Weed

**Version:** 2.0 - Production Ready  
**Philosophy:** Authority Through Trust, Community Through Utility  
**Strategy:** Effectiveness > Beauty, Conversion > Decoration  

---

## EXECUTIVE VISION

### The RA.co of Cannabis Social Clubs

Like Resident Advisor became **the definitive authority** for electronic music culture, this platform will become the **canonical guide** for cannabis social clubs in Spain.

**Core Value Proposition:**
- **For Users:** "Find your tribe. Join safely. Know before you go."
- **For Clubs:** "Verified presence. Quality members. Community connection."
- **For Culture:** "Elevating standards. Promoting responsibility. Building community."

### Strategic Pillars

| Pillar | Implementation | Success Metric |
|--------|---------------|----------------|
| **🏛️ AUTHORITY** | Editorial curation, verification badges, expert content | Domain authority score, organic traffic |
| **🔒 TRUST** | Privacy-by-design, encryption indicators, transparent policies | User retention, NPS score |
| **👥 COMMUNITY** | Member profiles, reviews, events, guide program | DAU/MAU ratio, UGC volume |
| **📚 EDUCATION** | Legal guides, never strain info we are not a marketplace at all no sale of drugs ! , responsible use content | Time on site, return visits |
| **⚡ CONVERSION** | Frictionless flows, micro-commitments, social proof | Application completion rate |

---

## 1. INFORMATION ARCHITECTURE

### Site Structure (Silo-Based Hierarchy)

```
socialclubmaps.com/
│
├── 📍 DISCOVERY (SEO Landing Pages)
│   ├── /madrid/cannabis-social-clubs
│   ├── /madrid/malasaña/clubs
│   ├── /clubs-with-wifi
│   ├── /chill-vibe-clubs
│   └── /best-clubs-2026
│
├── 🏛️ DIRECTORY (Core Experience)
│   ├── /clubs (Discovery Hub)
│   ├── /clubs/[slug] (Club Detail)
│   ├── /map (Interactive Discovery)
│   └── /compare (Side-by-side)
│
├── 📚 CONTENT (Authority Building)
│   ├── /guide (The Guide - like RA Guide)
│   ├── /guide/legal (Cannabis Law in Spain)
│   ├── /guide/joining (How to Join a Club)
│   ├── /strains (Strain Database)
│   ├── /neighborhoods (Area Guides)
│   └── /blog (Editorial Content)
│
├── 👤 USER (Conversion Funnel)
│   ├── /signup (Onboarding)
│   ├── /dashboard (Member Hub)
│   ├── /profile/[username] (Public Profile)
│   ├── /my-requests (Applications)
│   ├── /favorites (Saved Clubs)
│   └── /passport (Visited Stamps)
│
├── 🔒 MEMBERS (Exclusive)
│   ├── /members (Member Directory)
│   ├── /events (Club Events)
│   ├── /market (Member Deals)
│   └── /groups (Interest Groups)
│
└── 🛡️ ADMIN
    ├── /admin/clubs (Club Management)
    ├── /admin/requests (Applications)
    ├── /admin/content (Editorial)
    ├── /admin/moderation (Reviews)
    └── /admin/analytics (Stats)
```

### URL Strategy (SEO-Optimized)

```typescript
// URL Patterns for Maximum SEO
const urlPatterns = {
  // City landing pages
  city: '/[city]/cannabis-social-clubs',
  
  // Neighborhood pages
  neighborhood: '/[city]/[neighborhood]/clubs',
  
  // Attribute pages
  amenity: '/clubs-with-[amenity]',
  vibe: '/[vibe]-vibe-clubs',
  
  // Club detail
  club: '/clubs/[slug]',
  
  // Guide content
  guide: '/guide/[category]/[slug]',
  
  // User profiles
  profile: '/profile/[username]',
  
  // Events
  event: '/events/[club-slug]/[event-slug]',
};
```

### Navigation Structure

```typescript
// Primary Navigation
const mainNav = [
  {
    label: 'Directory',
    href: '/clubs',
    children: [
      { label: 'All Clubs', href: '/clubs' },
      { label: 'Map View', href: '/map' },
      { label: 'By Neighborhood', href: '/neighborhoods' },
    ]
  },
  {
    label: 'The Guide',
    href: '/guide',
    children: [
      { label: 'How to Join', href: '/guide/joining' },
      { label: 'Legal Info', href: '/guide/legal' },
      { label: 'Strain Guide', href: '/strains' },
      { label: 'Neighborhoods', href: '/neighborhoods' },
    ]
  },
  {
    label: 'Community',
    href: '/community',
    children: [
      { label: 'Events', href: '/events' },
      { label: 'Members', href: '/members' },
      { label: 'Reviews', href: '/reviews' },
    ]
  },
];

// User Navigation (Authenticated)
const userNav = [
  { label: 'My Dashboard', href: '/dashboard' },
  { label: 'My Requests', href: '/my-requests', badge: 'pending' },
  { label: 'Favorites', href: '/favorites' },
  { label: 'My Passport', href: '/passport' },
  { label: 'Settings', href: '/settings' },
];
```

---

## 2. PAGE ARCHITECTURE

### Landing Pages (SEO Acquisition)

#### City Landing Page (`/[city]/cannabis-social-clubs`)
**Purpose:** Capture "[city] cannabis clubs" search traffic

```typescript
interface CityLandingProps {
  city: string;
  clubs: Club[];
  neighborhoods: Neighborhood[];
  guideArticles: Article[];
  stats: {
    totalClubs: number;
    verifiedClubs: number;
    activeMembers: number;
  };
}

// Page Sections
const cityLandingSections = [
  'Hero with search',
  'Quick stats bar',
  'Neighborhood grid',
  'Featured clubs carousel',
  'Guide articles',
  'How it works',
  'FAQ accordion',
  'CTA: Join community',
];
```

#### Neighborhood Page (`/[city]/[neighborhood]/clubs`)
**Purpose:** Long-tail SEO + local discovery

```typescript
interface NeighborhoodPageProps {
  neighborhood: string;
  city: string;
  description: string;
  clubs: Club[];
  nearbyNeighborhoods: string[];
  vibe: string;
  avgPrice: string;
  bestFor: string[];
}

// Content Template
const neighborhoodContent = {
  title: '[Neighborhood] Cannabis Social Clubs',
  meta: 'Discover verified cannabis clubs in [Neighborhood], [City]. Filter by vibe, amenities, and price. Read reviews and apply for membership.',
  sections: [
    'Neighborhood intro',
    'Club listings with filters',
    'Area guide snippet',
    'Map embed',
    'Related neighborhoods',
  ],
};
```

### Core Pages

#### Discovery Hub (`/clubs`)
**Purpose:** Primary entry point for club discovery

```typescript
// Layout Structure
const discoveryHubLayout = {
  // Sticky header
  header: {
    search: 'Search by name, area, or vibe',
    viewToggle: 'Grid | List | Map',
    sortOptions: ['Recommended', 'Nearest', 'Newest', 'Rating'],
  },
  
  // Sidebar (collapsible on mobile)
  filters: {
    neighborhood: 'Multi-select dropdown',
    amenities: 'Tag cloud',
    vibes: 'Visual mood selector',
    priceRange: 'Slider',
    rating: 'Star selector',
    verifiedOnly: 'Toggle',
    openNow: 'Toggle',
  },
  
  // Main content
  results: {
    grid: 'Club cards',
    map: 'Interactive pins',
    empty: 'No results helper',
  },
  
  // Floating action
  mobileCTA: 'Apply filters',
};
```

#### Club Detail Page (`/clubs/[slug]`)
**Purpose:** Conversion-focused club profile

```typescript
interface ClubDetailArchitecture {
  // SEO Header
  metadata: {
    title: '[Club Name] | [Neighborhood] Cannabis Social Club';
    description: '[Short description] - [Amenities] - Apply for membership';
    ogImage: 'Club hero image';
  };
  
  // Hero Section
  hero: {
    imageGallery: 'Carousel with 5-10 photos';
    verificationBadge: 'Platform verified';
    quickActions: 'Save | Share | Report';
    breadcrumbs: 'Home > Madrid > Malasaña > [Club]';
  };
  
  // Trust Bar
  trustBar: {
    rating: '4.8/5 from 127 reviews';
    members: '89 active members';
    established: 'Founded 2019';
    inspected: 'Last verified: Jan 2026';
  };
  
  // Main Info
  mainInfo: {
    name: 'Club Name';
    description: 'Full description (500+ words)';
    vibeTags: ['Chill', 'Social', 'Creative'];
    amenities: ['WiFi', 'Chill Out', 'Games'];
    priceRange: '$$';
    capacity: '85 members';
  };
  
  // Location (Progressive Disclosure)
  location: {
    approximate: '200m radius circle on map';
    exactAddress: '[REVEALED AFTER APPROVAL]';
    neighborhood: 'Malasaña';
    nearby: '5 min from Tribunal metro';
    transport: 'Metro, bus, parking info';
  };
  
  // Hours & Contact
  hours: {
    schedule: 'Weekly schedule';
    openNow: 'Live status';
    exceptions: 'Holiday hours';
  };
  
  // Social Proof
  reviews: {
    rating: '4.8/5';
    count: '127 reviews';
    highlights: 'Top 3 praised aspects';
    recent: 'Last 5 reviews';
  };
  
  // Conversion Section
  cta: {
    availability: '12 spots available';
    waitTime: 'Applications reviewed within 48h';
    button: 'Apply for Membership';
    alternative: 'Save for later';
  };
  
  // Community
  community: {
    members: 'Preview of member profiles';
    events: 'Upcoming events';
    photos: 'Member-submitted photos';
  };
  
  // Related
  related: {
    similar: 'Similar clubs nearby';
    nearby: 'Other clubs in Malasaña';
  };
}
```

#### The Guide Section (`/guide`)
**Purpose:** Build authority and capture educational search traffic

```typescript
const guideStructure = {
  // Main hub
  hub: {
    hero: 'The Definitive Guide to Cannabis Social Clubs in Spain';
    categories: [
      {
        title: 'Getting Started',
        articles: [
          'What is a Cannabis Social Club?',
          'How to Join (Step-by-Step)',
          'Membership Requirements',
          'First Visit Guide',
        ],
      },
      {
        title: 'Legal & Safety',
        articles: [
          'Cannabis Laws in Spain (2026)',
          'Your Rights as a Member',
          'Responsible Consumption',
          'Traveling with Cannabis',
        ],
      },
      {
        title: 'Culture & Lifestyle',
        articles: [
          'Club Etiquette',
          'Strain Guide',
          'Consumption Methods',
          'Events & Activities',
        ],
      },
      {
        title: 'Neighborhoods',
        articles: [
          'Malasaña: The Creative Hub',
          'Chueca: Inclusive & Social',
          'Chamberí: Premium Experience',
          'Lavapiés: Multicultural Vibes',
        ],
      },
    ],
  },
  
  // Article template
  article: {
    header: {
      title: 'H1 optimized for search',
      author: 'Expert byline',
      date: 'Published/Updated date',
      readTime: '5 min read',
    },
    content: {
      toc: 'Table of contents (sticky)';
      body: '2000+ words with subheadings';
      media: 'Images, infographics';
      cta: 'Related clubs or apply CTA';
    },
    sidebar: {
      related: 'Related articles';
      clubs: 'Featured clubs';
      download: 'PDF guide download';
    },
  },
};
```

### User Funnel Pages

#### Signup/Onboarding (`/signup`)
**Purpose:** Maximize activation with progressive profiling

```typescript
const onboardingFlow = {
  step1: {
    title: 'Create Your Account';
    fields: ['Email', 'Password'];
    time: '30 seconds';
    valueProp: 'Join 10,000+ members';
  },
  step2: {
    title: 'Verify Your Age';
    fields: ['Date of Birth'];
    explanation: 'You must be 18+ to join';
    privacy: 'ID never stored, only verified';
  },
  step3: {
    title: 'Your Preferences';
    fields: [
      'Preferred neighborhoods (multi-select)',
      'Vibe preferences (tag selection)',
      'Experience level',
    ];
    benefit: 'We\'ll recommend the perfect clubs';
  },
  step4: {
    title: 'Complete Profile';
    fields: ['Full Name', 'Phone', 'Bio (optional)'];
    encryption: '🔒 Your data is encrypted';
    cta: 'Find Your Club';
  },
};
```

#### User Dashboard (`/dashboard`)
**Purpose:** Central hub for member activity

```typescript
const dashboardLayout = {
  // Welcome section
  header: {
    greeting: 'Welcome back, [Name]';
    tier: 'Connoisseur Member';
    stats: '3 clubs | 12 visits | 5 reviews';
  },
  
  // Main grid
  sections: {
    activity: {
      title: 'Recent Activity';
      items: [
        'Application approved at Green Harmony',
        'New review on your profile',
        'Event reminder: Social Hour tomorrow',
      ];
    },
    
    clubs: {
      title: 'Your Clubs';
      view: 'Card grid with quick actions';
      actions: ['View details', 'Book visit', 'Check menu'];
    },
    
    passport: {
      title: 'Your Passport';
      view: 'Visual stamp collection';
      progress: '7/10 clubs visited';
    },
    
    recommendations: {
      title: 'Recommended for You';
      algorithm: 'Based on your preferences';
      cta: 'Browse all';
    },
    
    requests: {
      title: 'Pending Applications';
      status: '2 pending, 1 approved';
    },
    
    events: {
      title: 'Upcoming Events';
      items: 'Events at your clubs';
    },
  },
};
```

---

## 3. TRUST & SAFETY UX ARCHITECTURE

### Privacy-First Design System

```typescript
// Privacy Indicators Component Library
const privacyComponents = {
  // Encryption Badge
  EncryptionBadge: {
    states: {
      active: {
        icon: 'Lock',
        color: 'green',
        text: 'End-to-end encrypted',
        tooltip: 'Your data is encrypted with AES-256',
      },
      inactive: {
        icon: 'Unlock',
        color: 'gray',
        text: 'Standard connection',
      },
    },
    placement: 'Form headers, profile sections',
  },
  
  // Verification Shield
  VerificationShield: {
    levels: {
      platform: {
        icon: 'Shield',
        color: 'blue',
        text: 'Platform Verified',
        detail: 'Identity, address, and legal status verified',
      },
      member: {
        icon: 'BadgeCheck',
        color: 'green',
        text: 'Verified Member',
        detail: 'ID verified, 18+ confirmed',
      },
      club: {
        icon: 'Building2',
        color: 'purple',
        text: 'Verified Club',
        detail: 'Legal CSC registration confirmed',
      },
    },
  },
  
  // Data Transparency Card
  DataTransparency: {
    sections: [
      {
        icon: 'Eye',
        label: 'What we collect',
        data: 'Name, contact, preferences',
        purpose: 'To connect you with clubs',
      },
      {
        icon: 'Lock',
        label: 'How we protect it',
        data: 'AES-256 encryption',
        purpose: 'Industry-leading security',
      },
      {
        icon: 'Clock',
        label: 'How long we keep it',
        data: '2 years after last activity',
        purpose: 'Legal compliance + your control',
      },
    ],
  },
  
  // Consent Toggle
  ConsentToggle: {
    design: 'Granular, not all-or-nothing',
    categories: [
      { id: 'essential', label: 'Essential', required: true, description: 'Account functionality' },
      { id: 'analytics', label: 'Analytics', required: false, description: 'Help us improve' },
      { id: 'marketing', label: 'Marketing', required: false, description: 'New clubs & events' },
    ],
    withdrawal: 'One-click in settings',
  },
};
```

### Progressive Disclosure Patterns

```typescript
// Location Disclosure (Privacy-First)
const locationDisclosure = {
  // Stage 1: Public (Anonymous users)
  public: {
    display: 'Approximate area circle (200m radius)',
    detail: 'Neighborhood only (e.g., "Malasaña")',
    zoom: 14, // Less precise
    tooltip: 'Exact address revealed after membership approval',
  },
  
  // Stage 2: Registered (Logged in, no membership)
  registered: {
    display: 'Same as public',
    detail: 'Can see walking distance from their location',
    cta: 'Apply to see exact address',
  },
  
  // Stage 3: Member (Approved membership)
  member: {
    display: 'Exact pin location',
    detail: 'Full address, entry instructions',
    zoom: 18, // Precise
    extras: ['Door code', 'Contact person', 'Special instructions'],
  },
};

// Profile Disclosure
const profileDisclosure = {
  public: {
    visible: ['Username', 'Avatar', 'Tier', 'Stats (visits, reviews)'],
    hidden: ['Real name', 'Contact info', 'Exact location'],
  },
  
  clubMembers: {
    visible: ['First name', 'Bio', 'Interests', 'Member since'],
    hidden: ['Phone', 'Email'],
  },
  
  self: {
    visible: ['Everything'],
    controls: ['Edit all fields', 'Download data', 'Delete account'],
  },
};
```

### Security Indicators Throughout UI

```typescript
// Trust Signals Integration
const trustSignalPlacements = {
  // Header
  header: {
    ssl: 'HTTPS lock icon in address bar',
    privacyLink: 'Privacy-first badge in nav',
  },
  
  // Forms
  forms: {
    encryption: '🔒 AES-256 encrypted badge below submit',
    dataRetention: 'Link to data policy near sensitive fields',
    consent: 'Granular toggles, not buried in T&Cs',
  },
  
  // Club cards
  clubCards: {
    verification: 'Shield badge (top right)',
    inspection: 'Last verified date (bottom)',
    reviews: 'Review count + rating',
    members: 'Active member count',
  },
  
  // Profile
  profile: {
    verification: 'Large badge on cover image',
    encryption: 'Subtle lock icon near sensitive data',
    tier: 'Public tier badge (gamification + trust)',
  },
  
  // Checkout/Application
  application: {
    security: 'Security summary sidebar',
    encryption: 'Field-level lock icons',
    guarantee: '"Your application is private" banner',
  },
};
```

---

## 4. CONVERSION OPTIMIZATION ARCHITECTURE

### Discovery to Application Funnel

```typescript
// Conversion Funnel Metrics
const conversionFunnel = {
  // Stage 1: Discovery
  discovery: {
    entry: 'SEO landing pages, social, direct',
    metric: 'Unique visitors',
    optimization: [
      'Fast load times (<2s)',
      'Mobile-first design',
      'Clear value proposition',
    ],
  },
  
  // Stage 2: Browse
  browse: {
    action: 'View club listings',
    metric: 'Listings viewed / session',
    optimization: [
      'Infinite scroll (not pagination)',
      'Rich filtering',
      'Visual club cards',
      'Quick preview modals',
    ],
  },
  
  // Stage 3: Interest
  interest: {
    action: 'Click into club detail',
    metric: 'Detail page views',
    optimization: [
      'High-quality photos',
      'Social proof (reviews)',
      'Clear amenities',
      'Approximate location',
    ],
  },
  
  // Stage 4: Intent
  intent: {
    action: 'Click "Apply" or "Save"',
    metric: 'CTA clicks',
    optimization: [
      'Sticky CTA button',
      'Urgency indicators ("8 spots left")',
      'Trust badges',
      'Social proof ("3 applied today")',
    ],
  },
  
  // Stage 5: Application
  application: {
    action: 'Complete application form',
    metric: 'Form completion rate',
    optimization: [
      'Multi-step form (4 steps max)',
      'Progress indicator',
      'Auto-save drafts',
      'Field validation (inline)',
    ],
  },
  
  // Stage 6: Submission
  submission: {
    action: 'Submit application',
    metric: 'Applications submitted',
    optimization: [
      'Clear expectations ("48h review")',
      'Confirmation modal',
      'Next steps explanation',
      'Email confirmation',
    ],
  },
};
```

### Micro-Conversion Strategy

```typescript
// Micro-Conversions (Small commitments leading to big ones)
const microConversions = [
  {
    name: 'Save Club',
    friction: 'Very low',
    action: 'Click heart icon on card',
    commitment: 'None (anonymous possible)',
    leadTo: 'Account creation prompt',
    value: 'Creates "stake" in platform',
  },
  {
    name: 'Vibe Check Quiz',
    friction: 'Low',
    action: '2-question preference quiz',
    commitment: '30 seconds',
    leadTo: 'Personalized recommendations',
    value: 'Investment of time increases conversion',
  },
  {
    name: 'Check Eligibility',
    friction: 'Low',
    action: 'Verify age + location',
    commitment: 'Basic info',
    leadTo: 'Full application',
    value: 'Qualifies lead, builds momentum',
  },
  {
    name: 'Follow Club',
    friction: 'Low',
    action: 'Subscribe to updates',
    commitment: 'Requires account',
    leadTo: 'Re-engagement via notifications',
    value: 'Retention mechanism',
  },
  {
    name: 'Complete Profile',
    friction: 'Medium',
    action: 'Fill preferences + bio',
    commitment: '5 minutes',
    leadTo: 'Better recommendations, community',
    value: 'Increases platform stickiness',
  },
  {
    name: 'Submit Review',
    friction: 'Medium',
    action: 'Write club review',
    commitment: 'Requires membership',
    leadTo: 'Community contribution',
    value: 'UGC generation, retention',
  },
];
```

### Scarcity & Urgency (Ethical)

```typescript
// Real Scarcity Indicators (Not fake urgency)
const scarcityElements = {
  // Capacity-based
  capacity: {
    display: 'Progress bar',
    text: '82/100 members',
    subtext: '18 spots remaining',
    update: 'Real-time (on page refresh)',
  },
  
  // Wait time
  waitTime: {
    display: 'Badge',
    text: 'High demand club',
    subtext: 'Applications typically reviewed within 48h',
    transparency: 'Never fake countdown timers',
  },
  
  // Application window
  applicationWindow: {
    display: 'Alert',
    text: 'Monthly intake',
    subtext: 'Applications open until 15th of each month',
    transparency: 'Clear, predictable schedule',
  },
  
  // Member limit
  memberLimit: {
    display: 'Info tooltip',
    text: 'Why is membership limited?',
    explanation: 'Spanish law limits CSCs to private, non-profit associations',
    education: 'Builds trust through transparency',
  },
};
```

### Mobile-First Form Optimization

```typescript
// Multi-Step Application Form
const applicationForm = {
  structure: {
    steps: 4,
    indicator: 'Progress bar at top',
    navigation: 'Next/Back buttons',
    mobile: 'Full-screen steps on mobile',
  },
  
  step1: {
    title: 'Basic Info',
    fields: [
      { name: 'fullName', type: 'text', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'phone', type: 'tel', required: true, mask: true },
    ],
    time: '1 minute',
    encryption: 'All data encrypted 🔒',
  },
  
  step2: {
    title: 'About You',
    fields: [
      { name: 'experience', type: 'select', options: ['Beginner', 'Intermediate', 'Expert'] },
      { name: 'interests', type: 'multi-select', options: 'Dynamic from club vibes' },
      { name: 'reason', type: 'textarea', placeholder: 'Why do you want to join?' },
    ],
    time: '2 minutes',
  },
  
  step3: {
    title: 'Verification',
    fields: [
      { name: 'age', type: 'date', required: true },
      { name: 'idUpload', type: 'file', accept: 'image/*', maxSize: '5MB' },
    ],
    privacy: 'ID verified then deleted',
    time: '1 minute',
  },
  
  step4: {
    title: 'Review & Submit',
    fields: [
      { name: 'terms', type: 'checkbox', required: true },
      { name: 'privacy', type: 'checkbox', required: true },
    ],
    summary: 'Show all entered data',
    editable: 'Allow edit of any section',
  },
};
```

---

## 5. COMMUNITY ENGAGEMENT ARCHITECTURE

### Tribe Building Features

```typescript
// Community Identity System
const communityIdentity = {
  // User Tiers (Gamification)
  tiers: {
    novice: {
      name: 'Novice',
      icon: '🌱',
      requirements: 'New account',
      perks: ['Browse clubs', 'Save favorites'],
    },
    member: {
      name: 'Member',
      icon: '🌿',
      requirements: 'Member of 1+ club',
      perks: ['Write reviews', 'RSVP to events', 'Public profile'],
    },
    connoisseur: {
      name: 'Connoisseur',
      icon: '🍃',
      requirements: '5+ club memberships, 10+ reviews',
      perks: ['Early access', 'Exclusive events', 'Verified badge'],
    },
    guide: {
      name: 'Guide',
      icon: '🌳',
      requirements: 'Application + 50+ helpful reviews',
      perks: ['Contribute articles', 'Curate picks', 'Ambassador status'],
    },
  },
  
  // Passport System
  passport: {
    concept: 'Digital passport with stamps for each club visited',
    stamps: {
      design: 'Unique artwork per club',
      collection: 'Displayed on profile',
      achievement: 'Rare stamps for special events',
    },
    progress: {
      stats: 'X of Y clubs visited',
      regions: 'District completion badges',
      unlocks: 'New tiers based on stamps',
    },
  },
  
  // Interest Groups
  groups: {
    types: [
      'Neighborhood Groups (Malasaña Crew)',
      'Activity Groups (Board Game Night)',
      'Experience Groups (First-Timers)',
      'Strain Groups (CBD Enthusiasts)',
    ],
    features: [
      'Group-only events',
      'Discussion boards',
      'Member directory',
      'Group challenges',
    ],
  },
};
```

### UGC (User Generated Content) System

```typescript
// Review System Architecture
const reviewSystem = {
  // Review Form
  form: {
    rating: '5-star system with half-stars',
    categories: [
      { id: 'atmosphere', label: 'Atmosphere', weight: 1 },
      { id: 'vibe', label: 'Vibe/Culture', weight: 1 },
      { id: 'product', label: 'Product Quality', weight: 1 },
      { id: 'staff', label: 'Staff/Service', weight: 1 },
      { id: 'facilities', label: 'Facilities', weight: 0.8 },
    ],
    content: {
      minLength: 100,
      maxLength: 2000,
      prompts: [
        'What did you like most?',
        'What could be improved?',
        'Who would you recommend this to?',
      ],
    },
    media: {
      photos: 'Up to 5 images',
      moderation: 'AI + human review',
    },
    verification: 'Only members can review (verified visit)',
  },
  
  // Review Display
  display: {
    sort: ['Most Helpful', 'Newest', 'Highest Rated', 'Critical'],
    highlights: 'Top positive and negative points',
    response: 'Club owner can reply',
    useful: 'Was this review helpful? (Yes/No)',
  },
  
  // Incentives
  incentives: {
    karma: 'Points for helpful reviews',
    recognition: 'Top reviewer badges',
    rewards: 'Exclusive access for quality contributors',
  },
};

// Photo Sharing
const photoSharing = {
  upload: {
    source: ['Upload', 'Instagram import'],
    moderation: 'Required before public',
    tagging: 'Auto-suggest club based on location',
  },
  gallery: {
    clubPage: 'Member photos tab',
    userProfile: 'Personal photo gallery',
    feed: 'Recent photos from community',
  },
  rights: {
    license: 'User grants platform display rights',
    removal: 'Easy DMCA/report process',
  },
};
```

### Expert/Guide Program

```typescript
// Guide Program (Like RA Guide)
const guideProgram = {
  // Application
  application: {
    requirements: [
      'Member for 6+ months',
      '10+ high-quality reviews',
      'Complete profile',
      'No violations',
    ],
    process: 'Application + sample content',
    benefits: [
      'Contribute to The Guide',
      'Curate "Picks" lists',
      'Early access to features',
      'Exclusive Guide events',
      'Revenue share on content',
    ],
  },
  
  // Guide Contributions
  contributions: {
    articles: {
      type: 'Long-form editorial',
      topics: ['Strain reviews', 'Club culture', 'Legal updates'],
      compensation: 'Per article + performance bonus',
    },
    picks: {
      type: 'Curated lists',
      examples: [
        'Hidden Gems in Malasaña',
        'Best Clubs for Remote Work',
        'Top CBD Strains of 2026',
      ],
      visibility: 'Featured on homepage',
    },
    moderation: {
      type: 'Community moderation',
      role: 'Review UGC, resolve disputes',
      reward: 'Karma + privileges',
    },
  },
  
  // Guide Profiles
  profiles: {
    badge: 'Official Guide badge on profile',
    showcase: 'All contributions listed',
    stats: 'Article views, helpful votes',
    following: 'Users can follow guides',
  },
};
```

### Notification Strategy

```typescript
// Smart Notification System
const notificationStrategy = {
  // Types
  types: {
    transactional: {
      examples: [
        'Application approved/rejected',
        'Membership expiring',
        'Password changed',
      ],
      channel: 'Email + Push',
      frequency: 'Immediate',
    },
    
    engagement: {
      examples: [
        'New review on your profile',
        'Someone saved your club',
        'Club you follow posted event',
        'New club in your neighborhood',
      ],
      channel: 'Push (opt-in) + Email digest',
      frequency: 'Max 3/day',
    },
    
    marketing: {
      examples: [
        'Weekly picks newsletter',
        'New guide article',
        'Special events this weekend',
      ],
      channel: 'Email',
      frequency: 'Weekly max',
      optIn: true,
    },
    
    reEngagement: {
      examples: [
        'We miss you! New clubs added',
        'Complete your application',
        'Your favorite club has new spots',
      ],
      channel: 'Email',
      frequency: 'Only after 7+ days inactive',
    },
  },
  
  // Preferences
  preferences: {
    granular: 'Toggle each notification type',
    channels: 'Choose email, push, or both',
    quietHours: 'No notifications 10pm-8am',
    digest: 'Daily summary option',
  },
};
```

---

## 6. SEO & CONTENT STRATEGY

### Programmatic SEO Structure

```typescript
// SEO Page Templates
const seoTemplates = {
  // City Pages
  city: {
    url: '/[city]/cannabis-social-clubs',
    title: '[City] Cannabis Social Clubs: Verified Directory 2026',
    meta: 'Discover [Count] verified cannabis social clubs in [City]. Filter by neighborhood, vibe & amenities. Read reviews and apply for membership.',
    schema: 'LocalBusiness (aggregate) + FAQPage',
    content: [
      'Introduction to CSCs in city',
      'Neighborhood breakdown',
      'Featured clubs grid',
      'How to join guide',
      'Legal information',
      'FAQ section',
    ],
  },
  
  // Neighborhood Pages
  neighborhood: {
    url: '/[city]/[neighborhood]/clubs',
    title: 'Best Cannabis Clubs in [Neighborhood], [City] | 2026 Guide',
    meta: 'Explore [Count] cannabis social clubs in [Neighborhood]. [Vibe description]. See photos, amenities, and member reviews.',
    schema: 'LocalBusiness (aggregate) + Article',
    content: [
      'Neighborhood vibe description',
      'Why visit this area',
      'Club listings',
      'Nearby attractions',
      'Getting there (transport)',
      'Related neighborhoods',
    ],
  },
  
  // Amenity Pages
  amenity: {
    url: '/clubs-with-[amenity]',
    title: 'Cannabis Clubs with [Amenity] in [City] | Directory',
    meta: 'Find cannabis social clubs with [Amenity]. Perfect for [Use case]. [Count] verified clubs.',
    schema: 'ItemList',
    content: [
      'Why [Amenity] matters',
      'Top clubs with feature',
      'Comparison table',
      'Member tips',
    ],
  },
  
  // Vibe Pages
  vibe: {
    url: '/[vibe]-vibe-clubs',
    title: '[Vibe] Cannabis Social Clubs in [City] | Find Your Scene',
    meta: 'Looking for a [Vibe] vibe? Discover [Count] clubs matching your style. Photos, reviews & applications.',
    schema: 'ItemList + Article',
    content: [
      'What is [Vibe] vibe',
      'Who it\'s for',
      'Featured clubs',
      'Member testimonials',
      'Similar vibes',
    ],
  },
};
```

### Schema.org Implementation

```typescript
// Structured Data Templates
const schemaTemplates = {
  // Club Detail Page
  club: {
    '@context': 'https://schema.org',
    '@type': 'CannabisSocialClub', // Custom type (extends LocalBusiness)
    name: 'Club Name',
    description: 'Club description',
    image: ['image1.jpg', 'image2.jpg'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '[REDACTED - Show neighborhood only]',
      addressLocality: 'Madrid',
      addressRegion: 'Community of Madrid',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      // Approximate coordinates for public
      latitude: 40.4245,
      longitude: -3.7038,
    },
    url: 'https://site.com/clubs/[slug]',
    telephone: '+34...',
    priceRange: '$$',
    openingHoursSpecification: [...],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
    amenityFeature: [...],
    // Custom fields
    capacity: '85',
    membershipRequired: true,
    foundedYear: 2019,
  },
  
  // Guide Article
  article: {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Article Title',
    description: 'Article excerpt',
    image: 'hero-image.jpg',
    author: {
      '@type': 'Organization',
      name: 'SocialClubsMaps Guide',
    },
    publisher: {...},
    datePublished: '2026-01-15',
    dateModified: '2026-01-20',
    articleSection: 'Legal',
    keywords: 'cannabis, spain, legal',
  },
  
  // FAQ Page
  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is cannabis legal in Spain?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '...',
        },
      },
    ],
  },
};
```

### Content Calendar (First 90 Days)

```typescript
const contentCalendar = {
  // Week 1-2: Foundation
  foundation: [
    'What is a Cannabis Social Club?',
    'How to Join a CSC in Spain (Step-by-Step)',
    'Cannabis Laws in Spain: 2026 Guide',
    'CSC Membership Requirements',
  ],
  
  // Week 3-4: Neighborhoods
  neighborhoods: [
    'Malasaña: The Creative Heart of Madrid\'s Cannabis Scene',
    'Chueca: Madrid\'s Most Inclusive Cannabis Clubs',
    'Chamberí: Premium Cannabis Experiences',
    'Lavapiés: Multicultural Cannabis Culture',
  ],
  
  // Week 5-6: Lifestyle
  lifestyle: [
    'Club Etiquette: First Timer\'s Guide',
    'Understanding Cannabis Strains',
    'CBD vs THC: What\'s the Difference?',
    'Responsible Consumption Guidelines',
  ],
  
  // Week 7-8: Deep Dives
  deepDives: [
    'The History of Cannabis Clubs in Spain',
    'Interview with a Club Founder',
    'Month in Review: New Clubs Opened',
    'Member Stories: Finding Community',
  ],
  
  // Ongoing
  recurring: {
    monthly: [
      'New Club Openings',
      'Member Spotlight',
      'Guide Picks: Best of Month',
    ],
    weekly: [
      'Weekend Events Roundup',
      'Fresh Drops (New Strains)',
    ],
  },
};
```

---

## 7. TECHNICAL IMPLEMENTATION

### Component Architecture

```typescript
// Component Hierarchy
const componentArchitecture = {
  // UI Primitives (shadcn/ui)
  primitives: [
    'Button',
    'Card',
    'Input',
    'Dialog',
    'Dropdown',
    'Badge',
    'Avatar',
    'Tabs',
    'Accordion',
  ],
  
  // Feature Components
  features: {
    clubs: [
      'ClubCard',
      'ClubGrid',
      'ClubFilters',
      'ClubMap',
      'ClubDetail',
      'ClubGallery',
      'ClubHours',
      'ClubAmenities',
    ],
    
    reviews: [
      'ReviewCard',
      'ReviewForm',
      'ReviewList',
      'RatingBreakdown',
      'ReviewHighlight',
    ],
    
    membership: [
      'ApplicationForm',
      'ApplicationStepper',
      'StatusBadge',
      'RequestCard',
    ],
    
    user: [
      'ProfileCard',
      'ProfileEdit',
      'PassportStamps',
      'TierBadge',
      'StatsWidget',
    ],
    
    trust: [
      'EncryptionBadge',
      'VerificationShield',
      'PrivacyIndicator',
      'ConsentToggle',
    ],
    
    community: [
      'EventCard',
      'GroupList',
      'PhotoGrid',
      'MemberList',
    ],
    
    content: [
      'ArticleCard',
      'ArticleContent',
      'GuideNavigation',
      'TableOfContents',
    ],
  },
  
  // Layout Components
  layout: [
    'Navbar',
    'Footer',
    'Sidebar',
    'MobileNav',
    'PageHeader',
    'Breadcrumbs',
    'SearchBar',
  ],
};
```

### State Management Strategy

```typescript
// State Architecture
const stateManagement = {
  // Server State (TanStack Query)
  server: {
    clubs: {
      query: 'useClubs(filters)',
      cacheTime: '5 minutes',
      staleTime: '1 minute',
    },
    club: {
      query: 'useClub(slug)',
      cacheTime: '10 minutes',
    },
    user: {
      query: 'useProfile()',
      cacheTime: 'Infinity',
      backgroundRefetch: true,
    },
  },
  
  // Client State (Zustand)
  client: {
    ui: {
      theme: 'dark | light | system',
      sidebarOpen: 'boolean',
      activeModal: 'string | null',
    },
    
    filters: {
      clubFilters: 'FilterState',
      savedFilters: 'FilterState[]',
    },
    
    preferences: {
      language: 'en | es | fr | ...',
      notifications: 'NotificationSettings',
      privacy: 'PrivacySettings',
    },
  },
  
  // URL State (for shareable filters)
  url: {
    clubsPage: {
      neighborhood: 'string',
      vibes: 'string[]',
      amenities: 'string[]',
      priceRange: 'string',
      sort: 'string',
    },
  },
};
```

### Performance Optimization

```typescript
// Performance Strategy
const performance = {
  // Images
  images: {
    format: 'WebP with JPEG fallback',
    sizes: 'Multiple srcset sizes',
    lazy: 'Intersection Observer loading',
    blur: 'Blur placeholder while loading',
  },
  
  // Code Splitting
  splitting: {
    routes: 'Automatic with Next.js',
    heavy: 'Dynamic imports for maps, charts',
    vendors: 'Separate chunk for libraries',
  },
  
  // Caching
  caching: {
    ssr: 'ISR with revalidate',
    static: '1 year for assets',
    api: 'CDN cache for public data',
  },
  
  // Bundle Size
  bundle: {
    target: '< 200KB initial JS',
    analysis: 'Bundle analyzer in CI',
    treeshaking: 'Dead code elimination',
  },
};
```

---

## 8. MOBILE UX ARCHITECTURE

### Mobile-First Design

```typescript
// Mobile UX Principles
const mobileUX = {
  // Navigation
  navigation: {
    pattern: 'Bottom tab bar (app-like)',
    items: ['Discover', 'Map', 'Saved', 'Community', 'Profile'],
    gestures: 'Swipe between tabs',
  },
  
  // Discovery
  discovery: {
    view: 'Card stack (Tinder-style)',
    alternative: 'Vertical list',
    filters: 'Bottom sheet',
    search: 'Floating search bar',
  },
  
  // Club Detail
  clubDetail: {
    hero: 'Full-width image carousel',
    scroll: 'Parallax header',
    cta: 'Sticky bottom bar',
    swipe: 'Swipe left for next club',
  },
  
  // Forms
  forms: {
    layout: 'Full-screen steps',
    input: 'Large touch targets (48px min)',
    keyboard: 'Auto-scroll to focused field',
    validation: 'Inline, real-time',
  },
  
  // Maps
  maps: {
    default: 'List view first',
    toggle: 'Map button expands full-screen',
    clustering: 'Club clusters at zoom out',
    cards: 'Bottom sheet with swipeable cards',
  },
};
```

### Responsive Breakpoints

```typescript
const breakpoints = {
  // Mobile First
  sm: '640px',   // Large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Small laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px', // Large screens
  
  // Layout Behavior
  layout: {
    mobile: 'Single column, bottom nav',
    tablet: '2-column grid, side nav',
    desktop: '3-column grid, full nav',
  },
};
```

---

## 9. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1)

```markdown
- [ ] Set up Next.js 14 with App Router
- [ ] Configure Tailwind + shadcn/ui
- [ ] Implement i18n system
- [ ] Set up TanStack Query
- [ ] Create base layout components
- [ ] Implement authentication UI
- [ ] Build club card component
- [ ] Create filter system
```

### Phase 2: Discovery (Week 2)

```markdown
- [ ] Build club directory page
- [ ] Implement club detail page
- [ ] Create filter sidebar
- [ ] Build map view (Mapbox)
- [ ] Implement search functionality
- [ ] Create SEO landing pages
- [ ] Build neighborhood pages
- [ ] Set up image optimization
```

### Phase 3: Conversion (Week 3)

```markdown
- [ ] Build signup flow
- [ ] Create onboarding wizard
- [ ] Implement application form (stepper)
- [ ] Build user dashboard
- [ ] Create profile pages
- [ ] Implement "Save club" feature
- [ ] Build notification system
- [ ] Create email templates
```

### Phase 4: Community (Week 4)

```markdown
- [ ] Build review system
- [ ] Create user profiles
- [ ] Implement tier/badge system
- [ ] Build passport/stamps feature
- [ ] Create event listings
- [ ] Build photo gallery
- [ ] Implement following system
- [ ] Create groups feature
```

### Phase 5: Content (Week 5)

```markdown
- [ ] Build Guide section
- [ ] Create article templates
- [ ] Implement CMS for content
- [ ] Build strain database
- [ ] Create legal guides
- [ ] Set up blog
- [ ] Implement newsletter
- [ ] Create PDF downloads
```

### Phase 6: Admin (Week 6)

```markdown
- [ ] Build admin dashboard
- [ ] Create club management interface
- [ ] Implement request management
- [ ] Build content moderation
- [ ] Create analytics views
- [ ] Implement user management
- [ ] Build notification admin
- [ ] Create system settings
```

### Phase 7: Polish (Week 7)

```markdown
- [ ] Performance optimization
- [ ] SEO audit & fixes
- [ ] Accessibility audit (WCAG 2.1)
- [ ] Mobile testing
- [ ] Cross-browser testing
- [ ] Security audit
- [ ] Load testing
- [ ] Documentation
```

---

## 10. SUCCESS METRICS

### KPIs by Pillar

```typescript
const successMetrics = {
  // Authority
  authority: {
    domainAuthority: 'Target: 40+',
    organicTraffic: 'Target: 10K/month',
    backlinkCount: 'Target: 500+ quality links',
    brandedSearches: 'Target: 1K/month',
  },
  
  // Trust
  trust: {
    npsScore: 'Target: 50+',
    verificationRate: 'Target: 90% of clubs',
    privacyComplaints: 'Target: < 0.1%',
    dataRequests: 'Track volume',
  },
  
  // Community
  community: {
    dauMauRatio: 'Target: 30%',
    ugcVolume: 'Target: 100 reviews/month',
    retentionRate: 'Target: 60% at 30 days',
    guideApplicants: 'Target: 10/month',
  },
  
  // Conversion
  conversion: {
    visitorToSignup: 'Target: 5%',
    signupToApply: 'Target: 30%',
    applicationComplete: 'Target: 60%',
    approvalRate: 'Target: 70%',
  },
  
  // Performance
  performance: {
    lcp: 'Target: < 2.5s',
    fid: 'Target: < 100ms',
    cls: 'Target: < 0.1',
    ttfb: 'Target: < 600ms',
  },
};
```

---

## SUMMARY

This architecture transforms your platform from a **simple directory** into an **authoritative community hub** - the definitive guide for cannabis social clubs in Spain.

### Key Differentiators

1. **Authority Positioning**: Like RA.co for electronic music, you become the canonical resource
2. **Privacy-First Design**: Encryption indicators, progressive disclosure, and transparency build trust
3. **Community Infrastructure**: Tiers, passport, groups, and guides create sticky engagement
4. **Conversion Optimization**: Multi-step forms, micro-conversions, and social proof maximize applications
5. **SEO Domination**: Programmatic pages capture long-tail search traffic

### Next Steps

1. **Start with Foundation**: Set up Next.js 14 + shadcn/ui
2. **Build Core Discovery**: Club directory with filters and search
3. **Implement Conversion Flow**: Signup → Onboarding → Application
4. **Add Community Layer**: Reviews, profiles, tier system
5. **Launch Content**: The Guide section for authority building

This isn't just a frontend - it's a **platform architecture** designed to dominate the market through trust, community, and effectiveness.

---

*Document Version: 2.0*  
*Architecture Level: Enterprise Grade*  
*Success Probability: High (with proper execution)*

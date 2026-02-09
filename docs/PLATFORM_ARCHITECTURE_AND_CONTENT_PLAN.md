# MASTER PLATFORM ARCHITECTURE & CONTENT PLAN
**Project:** Cannabis Social Club Platform (The "Resident Advisor" of CSCs)
**Version:** 1.0
**Source Truth:** Based on `scm_blueprint.md`, `knowledge-vault.md`, and `Content Backlog`

---

## 1. STRATEGIC CORE & POSITIONING

**The North Star**: "We help visitors navigate Spain’s cannabis social club culture safely and respectfully—through verified information, verified identity, and clubs that opt-in."

**The Wedge**: Trust in a grey market. We do not sell weed. We do not offer "instant access." We offer **safety, etiquette, and verified navigation**.

**The Vibe**: 
- **Not**: "Stoner," "Bro," "Plug," "Fast," "Cheap."
- **Is**: "Local Friend," "Resident Advisor," "Curator," "Compliance-First," "Premium," "Safe."

---

## 2. SITE ARCHITECTURE (SITEMAP)

Structure designed for SEO dominance and compliance safety.

```text
/ (Root)
├── /en/ (English Global/Tourist)
│   ├── / (Homepage - The Trust Gateway)
│   ├── /about/ (Methodology & Verification Standards)
│   ├── /safety/ (Harm Reduction & Legal Reality)
│   │
│   ├── /spain/ (Country Hub)
│   │   ├── /barcelona/ (City Hub - Indexable)
│   │   │   ├── /neighborhoods/ (Area Guides)
│   │   │   │   ├── /eixample/
│   │   │   │   ├── /gracia/
│   │   │   │   └── ...
│   │   │   ├── /clubs/ (Directory Listing - Limited Info Public)
│   │   │   │   └── /[club-slug]/ (Public Teaser -> Gated Full Profile)
│   │   │   └── /guides/ (City Specific Editorial)
│   │       │   └── /how-social-clubs-work/
│   │
│   ├── /events/ (Europe-wide Culture Wedge)
│   │   ├── /spannabis-bilbao-2026/
│   │   └── ...
│   │
│   ├── /editorial/ (The Knowledge Vault - SEO Pillars)
│   │   ├── /legal/ (Is it legal? Fines? Rules?)
│   │   ├── /etiquette/ (Do's and Don'ts)
│   │   └── /culture/ (Interviews, History)
│   │
│   └── /account/ (User Area)
│       ├── /login/
│       ├── /register/ (Age Gate + TOS)
│       ├── /verification/ (Identity Check)
│       └── /requests/ (Membership Interest Status)
│
└── /es/ (Spanish Mirror for Local Authority)
```

---

## 3. PAGE-BY-PAGE UX & CONTENT STRATEGY

### A. HOMEPAGE (The Trust Interface)
**Goal**: Establish immediate authority. Filter out "drug seekers," attract "culture seekers."

*   **Hero Section**:
    *   **Headline**: "Navigate Spain’s Cannabis Social Club Culture Safely."
    *   **Subhead**: "The verified guide to membership, etiquette, and responsible use in Barcelona and beyond."
    *   **Primary CTA**: "Get the Visitor Safety Kit" (Email Capture).
    *   **Secondary CTA**: "Explore Barcelona Clubs" (Search).
*   **Trust Bar**: "Data Privacy First" • "Verified Listings Only" • "Harm Reduction Focused".
*   **Feature Block: The Reality Check**:
    *   3 Cards: "Private Associations (Not Shops)" | "Residency & ID Rules" | "Public Consumption Fines (€601+)".
*   **Curated City Selector**: "Where are you visiting?" -> Barcelona, Madrid, Valencia tiles.
*   **Editorial Feed**: "Latest from the Vault" (e.g., "5 Mistakes Tourists Make").
*   **Footer**: Strict disclaimers. 18/21+ only. No sales.

### B. CITY HUB (e.g., `/en/spain/barcelona/`)
**Goal**: SEO landing page. Orient the user geographically and culturally.

*   **Header**: "Barcelona Cannabis Social Clubs: The Complete Guide (2026)."
*   **The "Safety First" Sticky Alert**: "Public consumption in Barcelona carries fines starting at €601. Read our legal guide."
*   **Neighborhood Navigator**:
    *   "Eixample (Upscale/Quiet)" | "Gòtic (Tourist Hub/Busy)" | "Gràcia (Bohemian/Local)".
*   **Club Filter Engine**:
    *   *Filters*: "Workspace," "Wheelchair Accessible," "Extract Focused," "Lounge Vibe."
    *   *Note*: No price filters. No "strain" filters.
*   **SEO Text Block**: "How the Barcelona system works" (300 words, keyword rich).

### C. CLUB PROFILE (The "Gated" Asset)
**Goal**: Convert interest into a vetted lead. Protect club privacy.

*   **Public View (Unregistered)**:
    *   Club Name (or Pseudonym if sensitive).
    *   Vibe Tags: "Chill," "Work-Friendly," "Artist Community."
    *   Neighborhood: "Eixample Left" (Approximate).
    *   *Blur Effect*: Address, Hours, specific intake details blurred.
    *   **CTA**: "Sign in to view membership requirements."
*   **Private View (Verified User)**:
    *   **"Verification Badge"**: Shows this club has opted-in to our standards.
    *   **Intake Status**: "Accepting New Members" / "Waitlist."
    *   **House Rules**: "No photos," "21+ only," "Referral required."
    *   **Action**: "Request Introduction" or "Book Appointment."
    *   **Warning**: "Do not contact this club via Instagram DM. Use this official channel."

### D. EDITORIAL / KNOWLEDGE VAULT
**Goal**: Organic traffic (SEO) and Education.

*   **Template**: "The Answer Box" (Top of page summary for Google Snippets).
*   **Structure**: 
    1.  The Myth (What tourists think).
    2.  The Reality (The legal/cultural truth).
    3.  The Checklist (Actionable safety steps).
*   **Interrupter CTA**: Mid-article box: "Don't get fined. Download our free Spain Safety & Etiquette Kit."

---

## 4. CONVERSION & COPYWRITING GUIDELINES

### The "Velvet Rope" Tone
*   **DO SAY**: "Membership donation," "Dispensing," "Association," "Private consumption," "Request access."
*   **DON'T SAY**: "Buy weed," "Price," "Shop," "Cafe," "Get high," "Plug."

### The "Hormozi" Offers
1.  **Lead Magnet (Top of Funnel)**: "Spain CSC Etiquette & Safety Kit (2026)."
    *   *Value*: Avoid fines, avoid scams, know what to bring.
    *   *Cost*: Email address.
2.  **Verified Visitor Pass (Mid Funnel)**:
    *   *Value*: One identity verification, access to apply to multiple verified clubs.
    *   *Cost*: Account creation + Agreement to Code of Conduct.

### Trust Signals (The Moat)
*   **Visuals**: High-end photography of interiors (no people/faces, no product close-ups). Architectural style.
*   **Data**: "Last verified: 2 days ago."
*   **Authorship**: Articles written by "Local Compliance Experts" or named editors, not "Admin."

---

## 5. TECHNICAL IMPLEMENTATION PRIORITIES

1.  **Identity & Age Gate**: Must be robust. `NextAuth` + Custom specialized form.
2.  **The "Gate" Component**: Middleware to handle Public vs. Private content visibility based on auth state.
3.  **Schema.org**: Extensive JSON-LD for `Organization` (Clubs), `Article` (Guides), and `Place` (Neighborhoods).
4.  **Performance**: Static Generation (SSG) for all public pages (City/Neighborhood/Editorial) for max SEO speed.

---

## 6. EXECUTION CHECKLIST (Immediate)

### Phase 1: Foundation (Days 1-5)
- [ ] Set up Next.js App Router structure matching Sitemap.
- [ ] Implement `VerifiedLayout` vs `PublicLayout`.
- [ ] Build the "Knowledge Vault" MDX pipeline for editorial content.

### Phase 2: The Content Engine (Days 6-15)
- [ ] Write "The 5 Pillars" content based on `Content Backlog`.
- [ ] Create the "Safety Kit" PDF/Email asset.
- [ ] Build the City/Neighborhood programmatic page templates.

### Phase 3: The Club Directory (Days 16-30)
- [ ] Build the Club Data Model (Supabase).
- [ ] Implement the "Obfuscation Layer" (Public vs Private fields).
- [ ] Create the "Request Membership" flow.

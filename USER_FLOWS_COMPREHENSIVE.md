# 🔄 COMPREHENSIVE USER FLOWS
## Cannabis Social Club Platform - Journey Mapping

**Document Version:** 1.0  
**Purpose:** Map every user journey from first touch to power user  
**Approach:** Multi-persona, multi-channel, conversion-optimized  

---

## EXECUTIVE SUMMARY

This document maps **15+ distinct user flows** covering:
- **Acquisition flows** (SEO, social, referral)
- **Activation flows** (signup, onboarding, first application)
- **Core experience flows** (discovery, application, membership)
- **Community flows** (reviews, social, engagement)
- **Retention flows** (re-engagement, upgrades, advocacy)
- **Admin flows** (club management, moderation)

Each flow includes:
- Entry points & triggers
- Step-by-step journey
- Decision trees
- Emotions & friction points
- Success metrics
- Failure recovery

---

## 1. ACQUISITION FLOWS

### Flow 1.1: Organic Search Discovery (Primary)

**Persona:** Tourist or local seeking clubs in Madrid  
**Intent:** "Find cannabis clubs near me"  
**Channel:** Google Search  

```
ENTRY POINTS
├── Search Query: "cannabis clubs madrid"
├── Search Query: "marijuana social clubs malasaña"
├── Search Query: "where to smoke weed barcelona"
└── Search Query: "cannabis social club membership"

JOURNEY MAP
Step 1: SERP Result
├── Title: "Madrid Cannabis Social Clubs: Verified Directory 2026"
├── Meta: "Discover 50+ verified cannabis clubs..."
├── URL: /madrid/cannabis-social-clubs
└── Rich Snippets: Star ratings, club count

Step 2: Landing Page Load (< 2s)
├── Hero: "Find Your Perfect Cannabis Club in Madrid"
├── Trust Bar: "50+ Verified Clubs | 10K+ Members | 4.8★ Average"
├── Quick Stats: Map showing club distribution
└── CTA: "Explore Clubs" (primary) / "How It Works" (secondary)

Step 3: Browse Decision
├── OPTION A: Click "Explore Clubs" → Discovery Hub
├── OPTION B: Scroll to Neighborhoods → Neighborhood Page
├── OPTION C: Click "How It Works" → Educational Content
└── OPTION D: Exit (bounce)

Step 4: Discovery Hub
├── Filter Application (neighborhood, vibe, amenities)
├── Club Card Browsing
├── Map Toggle View
└── Save Club (micro-conversion, no account needed)

Step 5: Club Interest
├── Click Club Card → Club Detail Page
├── View Photos (gallery)
├── Read Reviews
└── Check Availability

Step 6: Conversion Point
├── See: "8 spots remaining"
├── See: "Applications reviewed in 48h"
├── CTA: "Apply for Membership"
└── Alternative: "Save for Later"

Step 7: Account Gate
├── IF logged in → Application Form
├── IF not logged in → Signup/Login Modal
└── Exit option: Continue browsing

CONVERSION PATH
Organic Search → Landing Page → Discovery → Club Detail → Signup → Application

METRICS
├── Traffic: 60% of total acquisition
├── Bounce Rate: < 40%
├── Avg Session: 4+ pages
├── Conversion: 5% visitor → signup
└── Time to Apply: < 5 minutes
```

### Flow 1.2: Direct Club Search (High Intent)

**Persona:** User knows specific club name  
**Intent:** "Green Harmony Madrid info"  
**Channel:** Branded search  

```
ENTRY POINT
└── Search: "green harmony madrid cannabis club"

JOURNEY
Step 1: Club Detail Page (direct ranking)
Step 2: View all club info
Step 3: Immediate CTA: "Apply Now"
Step 4: Account check
Step 5: Application

ACCELERATED FLOW
Branded Search → Club Detail → Application (2-3 steps)

METRICS
├── Conversion Rate: 15% (3x higher than organic)
├── Time to Apply: < 2 minutes
└── Intent Score: Very High
```

### Flow 1.3: Social Media Discovery

**Persona:** Instagram/TikTok user  
**Intent:** Discover trending/popular clubs  
**Channel:** Social content  

```
ENTRY POINTS
├── Instagram post: Club interior photo
├── TikTok video: Club tour
├── Facebook group mention
└── Influencer recommendation

JOURNEY
Step 1: Content Engagement
├── View photo/video
├── Read caption
└── Click bio link or swipe-up

Step 2: Mobile Landing
├── Mobile-optimized landing
├── Visual club preview
└── Quick signup (social auth)

Step 3: Social Proof
├── "Join 500+ members this week"
├── Recent activity feed
└── User-generated content

Step 4: Conversion
├── Simplified signup (3 fields)
├── Instagram connect option
└── Follow club (lower friction)

METRICS
├── Traffic: 20% of acquisition
├── Mobile Rate: 90%
├── Signup Method: 70% social auth
└── Conversion: 3% (lower but volume high)
```

### Flow 1.4: Referral Flow

**Persona:** Friend of existing member  
**Intent:** Join same club as friend  
**Channel:** Personal invitation  

```
ENTRY POINT
└── Referral link: /invite/[code] or QR code

JOURNEY
Step 1: Personalized Landing
├── "[Friend Name] invited you to join Green Harmony"
├── Friend's profile photo
├── Club preview
└── Trust: "[Friend] has been a member since 2024"

Step 2: Social Proof
├── "Join [Friend] and 89 other members"
├── Testimonial from friend (optional)
└── Club photos

Step 3: Simplified Onboarding
├── Pre-filled: Referral code
├── Quick signup
└── Priority application processing

Step 4: Dual Notification
├── New user gets approved
├── Referrer gets notification: "Your friend joined!"
└── Referral reward triggered

METRICS
├── Conversion: 25% (highest)
├── Trust Score: Maximum
├── Application Approval: Faster (referred)
└── Retention: 80%+ at 30 days
```

---

## 2. ACTIVATION FLOWS

### Flow 2.1: Signup & Onboarding (Progressive Profiling)

**Goal:** Maximize completion rate while gathering data  
**Approach:** 4-step progressive, low friction  

```
ENTRY POINTS
├── From club detail page
├── From "Join Community" CTA
├── From saved clubs reminder
└── From content gate (e.g., read 3 articles)

JOURNEY - STEP 1: Account Creation (30 seconds)
Screen: "Join the Community"
Fields:
├── Email (validated inline)
├── Password (strength indicator)
└── OR: Google/Apple social auth

Trust Signals:
├── "🔒 Your data is encrypted"
├── "We never share your information"
└── "18+ only. Age verification required."

Actions:
├── Primary: "Create Account"
├── Secondary: "Already have an account? Log in"
└── Tertiary: "Why we need this?" (tooltip)

Success → Step 2
Failure → Show error inline, don't clear fields

JOURNEY - STEP 2: Age Verification (20 seconds)
Screen: "Verify Your Age"
Fields:
├── Date of Birth (date picker)
└── Checkbox: "I confirm I am 18+"

Education:
├── "Spanish law requires members to be 18+"
├── "Your ID will be verified but not stored"
└── Privacy explanation link

Actions:
├── Primary: "Continue"
└── Back: "Previous step"

Validation:
├── Auto-calculate age
├── Block if < 18
└── Flag if < 21 (some clubs 21+)

JOURNEY - STEP 3: Preferences (45 seconds)
Screen: "Personalize Your Experience"
Questions:
├── "What neighborhoods interest you?"
│   └── Multi-select: [Malasaña] [Chueca] [Centro]...
├── "What vibes do you prefer?"
│   └── Visual cards: [Chill] [Social] [Creative]...
└── "What's your experience level?"
    └── Select: [Beginner] [Intermediate] [Expert]

Value Prop:
├── "We'll recommend perfect clubs for you"
├── "Get notified when spots open"
└── "Connect with similar members"

Actions:
├── Primary: "Continue"
├── Skip: "I'll do this later"
└── Back: "Previous step"

JOURNEY - STEP 4: Profile Basics (30 seconds)
Screen: "Complete Your Profile"
Fields:
├── Full Name (text)
├── Phone (with country code)
└── Bio (optional, textarea)

Privacy:
├── "Only clubs you apply to see your info"
├── "Encrypted with AES-256"
└── Lock icon on each field

Actions:
├── Primary: "Find My Club" (leads to discovery)
├── Secondary: "Go to Dashboard"
└── Skip: "Complete later"

COMPLETION
├── Confetti animation
├── Welcome email triggered
├── Onboarding tour offered
└── Personalization applied immediately

METRICS
├── Step 1 → Step 2: 90%
├── Step 2 → Step 3: 85%
├── Step 3 → Step 4: 70%
├── Step 4 → Complete: 80%
├── OVERALL: 43% completion (excellent for 4-step)
├── Time to Complete: 2-3 minutes avg
└── Drop-off Point: Step 3 (preferences)

OPTIMIZATION NOTES
├── Allow "Skip" on all non-critical steps
├── Save progress (return to same step)
├── Mobile: Full-screen per step
└── A/B test: Step 3 vs Step 4 order
```

### Flow 2.2: First Application (The "Aha" Moment)

**Goal:** Get user to submit first membership request  
**Critical:** This is the core conversion  

```
ENTRY POINTS
├── Immediately after signup
├── From club detail page
├── From saved clubs list
└── From "Recommended for You"

JOURNEY
Step 1: Intent Confirmation
Screen: Club Detail Page
├── User has browsed and clicked "Apply"
├── Modal: "Apply to [Club Name]"
├── Show: Application requirements
└── Estimated approval time: "48 hours"

Step 2: Eligibility Check (micro-step)
Screen: Quick Questions
├── "Are you 21+?" (if club requires)
├── "Do you live in Madrid?" (if local-only)
└── "Have you been a member before?"

Result:
├── PASS → Continue to application
├── FAIL → Show alternative clubs
└── UNCERTAIN → Continue with note

Step 3: Application Form (Multi-Step)
Sub-Step 3.1: Basic Info (pre-filled from profile)
├── Confirm name, email, phone
└── Edit if needed

Sub-Step 3.2: Motivation
├── "Why do you want to join?"
├── "What are you looking for?"
└── "How did you hear about us?"

Sub-Step 3.3: Identity Verification
├── Upload ID photo
├── OR: Connect verified social
└── Note: "Securely verified, then deleted"

Sub-Step 3.4: Terms & Submit
├── Club-specific rules acceptance
├── Platform terms
├── Privacy policy
└── Submit button

Step 4: Confirmation
Screen: "Application Submitted!"
├── Success animation
├── Application ID: #APP-12345
├── Expected response time: "48 hours"
├── Email confirmation sent
└── Next steps explanation

Step 5: Status Tracking
Dashboard Widget:
├── "Application Pending"
├── Club: [Name]
├── Submitted: [Date]
├── Status: "Under Review"
└── Cancel option (if regretted)

EMAIL SEQUENCE
Hour 0: Confirmation
├── "We received your application"
├── Application details
└── What to expect

Hour 24: Reminder (if not reviewed)
├── "Still reviewing..."
├── High volume notice
└── Contact info for questions

Hour 48: Decision
├── APPROVED: "Welcome! Next steps..."
├── REJECTED: "Not this time, alternatives..."
└── PENDING: "Extended review..."

METRICS
├── Start Application: 100%
├── Complete Step 3.1: 95%
├── Complete Step 3.2: 85%
├── Complete Step 3.3: 75% (drop-off here)
├── Complete Step 3.4: 70%
├── Submit: 60%
├── Approval Rate: 70%
└── Time to Complete: 4-5 minutes
```

### Flow 2.3: First Visit (Post-Approval)

**Goal:** Ensure user visits club after approval  
**Critical:** First visit determines retention  

```
ENTRY POINT
├── Application approved notification
└── Email: "You're in! Here's what's next"

JOURNEY
Step 1: Approval Notification
Email + Push:
├── "🎉 Approved for [Club Name]!"
├── Exact address revealed
├── Entry instructions
├── Contact person
└── QR code for first visit

Step 2: First Visit Prep
Screen: "Your First Visit"
├── What to bring (ID, QR code)
├── How to find it (map, photos)
├── Club rules reminder
├── What to expect
└── "Add to Calendar" button

Step 3: Check-in
Physical:
├── Show QR code at door
├── ID verification
├── Welcome package given
└── Member card issued

Digital:
├── QR scan triggers "First Visit" stamp
├── Push: "Welcome to [Club]!"
└── Survey: "Rate your first visit" (optional)

Step 4: Post-Visit Engagement
Hour 0: Immediate
├── "How was it?" micro-survey
├── Photo upload prompt
└── Review request

Day 1:
├── Tips: "What to try next time"
├── Events: "Upcoming at [Club]"
└── Feature highlight

Day 7:
├── Passport update: "You have 1 stamp!"
├── Invite friends prompt
└── Other club suggestions

METRICS
├── First Visit Rate: 85% (of approved)
├── No-Show Rate: 15%
├── Post-Visit Review Rate: 40%
├── Second Visit Rate: 60%
└── 30-Day Retention: 70%
```

---

## 3. CORE EXPERIENCE FLOWS

### Flow 3.1: Club Discovery & Comparison

**Goal:** Help users find the right club efficiently  
**Users:** Browsing mode, not yet committed  

```
ENTRY POINTS
├── Home page "Explore" CTA
├── Navigation menu
├── Direct URL: /clubs
└── SEO landing pages

JOURNEY
Step 1: Discovery Hub
Layout:
├── Header: Sticky search + view toggle
├── Sidebar: Filters (collapsible on mobile)
├── Main: Club grid or list
└── Map: Toggle overlay

Filter Options:
├── Neighborhood: Multi-select dropdown
├── Vibes: Visual tag cloud
├── Amenities: Checkboxes
├── Price: $ to $$$ slider
├── Rating: Star selector
├── Open Now: Toggle
└── Verified Only: Toggle

Step 2: Club Preview
Card Design:
├── Hero image (carousel on hover)
├── Name + Verification badge
├── Rating + Review count
├── Neighborhood + Distance
├── Vibe tags (3 max)
├── Quick amenities icons
├── Price range
├── "8 spots left" indicator
└── Actions: [Save] [View] [Apply]

Interactions:
├── Hover: Image carousel starts
├── Click: Card expands (quick view modal)
├── Long press: Quick actions (mobile)
└── Double click: Full detail page

Step 3: Comparison Mode
Trigger: Select 2-3 clubs, click "Compare"
Screen: Side-by-side comparison
Columns:
├── Photos
├── Amenities checklist
├── Vibe match %
├── Rating breakdown
├── Price comparison
├── Capacity/spots left
├── Distance from user
└── Quick apply buttons

Step 4: Deep Dive
Club Detail Page Sections:
├── Hero: Gallery + Quick actions
├── Trust Bar: Stats + Verified badge
├── About: Description + Story
├── Location: Map + Transit info
├── Amenities: Full list with icons
├── Hours: Weekly schedule + Open now
├── Reviews: Highlights + Full list
├── Community: Member preview
├── Events: Upcoming at club
└── CTA: Apply / Save / Share

Step 5: Decision
Actions:
├── Apply Now → Application flow
├── Save for Later → Dashboard widget
├── Share → Social/links
├── Compare → Add to comparison
└── Continue Browsing → Back to hub

METRICS
├── Avg Clubs Viewed: 5 per session
├── Filter Usage: 70% of users
├── Comparison Usage: 15% of users
├── Save Rate: 40% of viewed
├── Apply Rate: 8% of viewed
└── Time on Page: 3-4 minutes
```

### Flow 3.2: Multi-Club Membership

**Goal:** Users join multiple clubs (power users)  
**Revenue:** Multiple membership fees  

```
ENTRY POINT
├── Power user seeking variety
├── Different clubs for different vibes
└── Tourist visiting multiple cities

JOURNEY
Step 1: Passport View
Screen: "Your Club Passport"
├── Visual stamp collection
├── Stats: "7 of 12 clubs visited"
├── Achievements unlocked
└── Suggestions: "Complete your collection"

Step 2: Discovery
Features:
├── "Clubs you haven't visited" filter
├── "New clubs since your last visit"
├── "Similar to your favorites"
└── District completion: "Visit all Malasaña clubs"

Step 3: Application
Differentiation:
├── Faster approval (existing member)
├── Pre-filled application
├── Cross-club reputation
└── Reduced verification

Step 4: Cross-Club Benefits
Rewards:
├── Multi-club member badge
├── VIP treatment at new clubs
├── Exclusive multi-club events
├── Passport milestone rewards
└── Guide program eligibility

METRICS
├── Single Club Members: 60%
├── Multi-Club (2-3): 30%
├── Power Users (4+): 10%
├── Avg Clubs per User: 2.1
└__) Revenue per User: Higher with multi-club
```

### Flow 3.3: Saved Clubs & Favorites

**Goal:** Re-engagement through saved items  
**Mechanism:** Create "stake" in platform  

```
ENTRY POINTS
├── Heart icon on club cards
├── "Save for later" on detail page
└── Automatic save (application started)

JOURNEY
Step 1: Save Action
Micro-interaction:
├── Heart icon animates
├── Toast: "Saved to favorites"
├── Optional: Add note/tag
└── Count: "You have 12 saved clubs"

Step 2: Access Saved
Locations:
├── Dashboard widget
├── Dedicated /favorites page
├── Mobile bottom nav
└── Profile dropdown

Step 3: Management
Features:
├── Grid/list view
├── Sort: Recently saved, Alphabetically, By neighborhood
├── Filter: Applied to, Not applied, Approved
├── Tags: Personal labels
├── Notes: Personal annotations
└── Share list: "My Madrid Club List"

Step 4: Re-engagement Triggers
Notifications:
├── "Green Harmony now has spots open!"
├── "Chill Zone added new amenities"
├── "New photos from La Plata"
└── "Price change at your saved club"

Email Digest:
├── Weekly: "Updates to your saved clubs"
├── New spots, events, photos
└── Reminder to apply

Step 5: Conversion to Application
Nudges:
├── "You saved this 2 weeks ago, still interested?"
├── "8 spots remaining"
├── "3 of your friends are members"
└── "Apply with one click"

METRICS
├── Save Rate: 40% of club views
├── Return Rate: 60% return to saved
├── Application from Saved: 25%
├── Avg Saved per User: 8 clubs
└── Re-engagement Open Rate: 45%
```

---

## 4. COMMUNITY FLOWS

### Flow 4.1: Review Submission

**Goal:** Generate UGC, build trust  
**Users:** Post-visit members  

```
ENTRY POINTS
├── Automatic prompt (24h post-visit)
├── Club detail page "Write Review"
├── Dashboard "Share your experience"
└── Email: "How was [Club]?"

JOURNEY
Step 1: Review Trigger
Timing: 24-48 hours after first visit
Channel: App notification + Email
Copy: "How was your visit to [Club]? Share with the community"

Step 2: Review Form
Structure:
├── Header: "Review [Club Name]"
├── Overall Rating: 5-star selector
├── Category Ratings:
│   ├── Atmosphere: ⭐⭐⭐⭐⭐
│   ├── Product Quality: ⭐⭐⭐⭐⭐
│   ├── Staff/Service: ⭐⭐⭐⭐⭐
│   ├── Facilities: ⭐⭐⭐⭐⭐
│   └── Vibe Match: ⭐⭐⭐⭐⭐
├── Written Review:
│   ├── Prompts:
│   │   ├── "What did you love?"
│   │   ├── "What could improve?"
│   │   └── "Who would you recommend this to?"
│   ├── Min length: 100 characters
│   ├── Max length: 2000 characters
│   └── Helper: "Be specific and helpful"
├── Photos (optional):
│   ├── Upload up to 5
│   ├── Guidelines popup
│   └── Moderation notice
├── Visit Details:
│   ├── Date picker
│   ├── Time of day
│   └── Crowd level
└── Submit: "Post Review"

Step 3: Submission
Actions:
├── Thank you animation
├── Points awarded (karma)
├── Badge progress: "3 reviews to Guide"
├── Share option: "Share on social"
└── Next review suggestion

Step 4: Moderation
Process:
├── Auto-check: AI content moderation
├── Queue: Human review (if flagged)
├── Approval: Usually instant
├── Rejection: Email with reason
└── Edit: Allow fixes

Step 5: Publication
Visibility:
├── Appears on club page
├── Added to user's profile
├── Notification to club owner
├── Counts toward user's stats
└── Karma points awarded

METRICS
├── Review Prompt Open: 50%
├── Review Start: 30%
├── Review Submit: 60% (of starters)
├── Overall Conversion: 18%
├── Avg Rating: 4.3/5
├── With Photos: 40%
└── Helpful Votes: Avg 3 per review
```

### Flow 4.2: Community Events

**Goal:** Real-world engagement, retention  
**Types:** Club events, platform events, member meetups  

```
ENTRY POINTS
├── Event discovery on club pages
├── Dashboard "Upcoming Events"
├── Email digest
└── Push notification

JOURNEY
Step 1: Event Discovery
Listing:
├── Calendar view / List view
├── Filters: Today, This Week, This Month
├── Categories: Social, Educational, Music, etc.
└── Club filter

Step 2: Event Detail
Content:
├── Hero image/video
├── Title + Description
├── Date, Time, Duration
├── Club host
├── Capacity: "15/30 spots"
├── Member price vs Guest price
├── RSVP button
└── Share

Step 3: RSVP
Process:
├── Click RSVP
├── Confirm club membership (if required)
├── Add to calendar
├── Reminder preferences
└── Success: "You're in!"

Step 4: Pre-Event
Reminders:
├── 24h before: "Tomorrow: [Event]"
├── 2h before: "Starting soon!"
├── Check-in code/QR
└── What to bring

Step 5: Event Day
Check-in:
├── QR scan at door
├── "Welcome!" notification
├── Event chat/channel opens
└── Photo upload encouraged

Step 6: Post-Event
Engagement:
├── "Thanks for attending!"
├── Photo gallery from attendees
├── Next event recommendation
└── Host thank you message

METRICS
├── Event Views: 500 per event avg
├── RSVP Rate: 20% of views
├── Attendance Rate: 70% of RSVPs
├── No-Show Rate: 30%
├── Post-Event Photos: 40% of attendees
└── Repeat Attendance: 50%
```

### Flow 4.3: Guide Program (Power Users)

**Goal:** Recognize experts, generate quality content  
**Elite:** Top 5% of engaged users  

```
ENTRY POINT
├── Qualification notification
├── "You've unlocked Guide status"
└── Application invitation

JOURNEY
Step 1: Qualification
Criteria Met:
├── 6+ months membership
├── 10+ high-quality reviews
├── Complete profile
├── No violations
└── Consistent engagement

Step 2: Application
Form:
├── "Why do you want to be a Guide?"
├── Sample content: Write a mini-guide
├── Topics of expertise
├── Availability
└── References (optional)

Step 3: Review
Process:
├── Internal review: 7 days
├── Sample content evaluation
├── Reference check
└── Decision: Approved / Rejected / Waitlist

Step 4: Onboarding
Approved Guides:
├── Welcome kit
├── Content guidelines
├── Editorial calendar access
├── Compensation structure
└── Community channel invite

Step 5: Contribution
Activities:
├── Write featured articles
├── Curate "Guide Picks" lists
├── Answer community questions
├── Moderate reviews
└── Represent platform at events

Step 6: Rewards
Benefits:
├── Revenue share on content
├── Free club memberships
├── Exclusive Guide events
├── Early access to features
├── Swag and recognition
└── Ambassador opportunities

METRICS
├── Guide Applicants: 10/month
├── Approval Rate: 40%
├── Active Guides: 5% of user base
├── Content per Guide: 2 articles/month
├── Content Views: 10x regular
└── Guide Retention: 90%
```

---

## 5. RETENTION FLOWS

### Flow 5.1: Re-engagement (Lapsed Users)

**Goal:** Win back inactive users  
**Trigger:** 7+ days without activity  

```
ENTRY POINT
├── System detects inactivity
└── Re-engagement campaign triggered

JOURNEY
Day 3 (Early Warning):
├── Channel: Push notification
├── Copy: "New clubs added in your area"
├── CTA: "Check them out"
└── Deep link: /clubs?new=true

Day 7 (Standard Re-engagement):
├── Channel: Email
├── Subject: "We miss you! Here's what's new"
├── Content:
│   ├── New clubs since last visit
│   ├── Updates to saved clubs
│   ├── Community highlights
│   └── Personalized recommendation
└── CTA: "Explore Now"

Day 14 (Aggressive):
├── Channel: Email + Push
├── Subject: "Your clubs have new spots"
├── Offer: "Priority application processing"
└── Incentive: Exclusive content access

Day 30 (Last Chance):
├── Channel: Email
├── Subject: "Account update required"
├── Content: "Log in to keep your account active"
├── Threat: Data deletion notice
└── CTA: "Keep My Account"

Day 45 (Sunset):
├── Account marked dormant
├── Data prepared for deletion
├── Final email: "Last chance to save your data"
└── 7 days later: Soft delete

SUCCESS CRITERIA
├── Day 3 Open: 15%
├── Day 7 Re-engagement: 10%
├── Day 14 Return: 5%
├── Day 30 Save: 2%
└── Overall Win-back: 20% of lapsed
```

### Flow 5.2: Tier Progression (Gamification)

**Goal:** Increase engagement through progression  
**Mechanic:** Novice → Member → Connoisseur → Guide  

```
ENTRY POINT
├── Automatic tier assignment based on activity
└── Progression notification

JOURNEY
Tier 1: Novice (New User)
Requirements: Sign up
Benefits:
├── Browse all clubs
├── Save favorites
└── Basic profile

Progression to Member:
├── Requirement: Join 1+ club
├── Trigger: First approval
├── Notification: "You're now a Member!"
└── New features unlocked

Tier 2: Member (Active Participant)
Requirements: 1+ club membership
Benefits:
├── Write reviews
├── RSVP to events
├── Public profile
├── Member-only content
└── Member events access

Progression to Connoisseur:
├── Requirement: 5+ clubs, 10+ reviews
├── Time: 3+ months active
├── Quality: High review ratings
└── Engagement: Regular visits

Tier 3: Connoisseur (Expert User)
Requirements: 5+ clubs, 10+ reviews, 3+ months
Benefits:
├── Early access to new clubs
├── Exclusive events
├── Verified badge
├── Priority support
├── Reduced fees
└── Guide program eligibility

Progression to Guide:
├── Application-based
├── Content quality review
├── Community voting (optional)
└── Internal approval

Tier 4: Guide (Ambassador)
Requirements: Application + approval
Benefits:
├── Content creation platform
├── Revenue share
├── Free memberships
├── Exclusive events
├── Swag and recognition
└── Ambassador status

VISUALIZATION
Progress Bar:
├── "7/10 clubs to Connoisseur"
├── "3 more reviews needed"
└── Unlock preview: "Next unlock: Early access"

METRICS
├── Novice → Member: 70%
├── Member → Connoisseur: 15%
├── Connoisseur → Guide: 10%
├── Avg Time in Tier: 
│   ├── Novice: 2 weeks
│   ├── Member: 3 months
│   └── Connoisseur: 6 months
└── Retention by Tier: Higher tiers = better retention
```

### Flow 5.3: Notification Preferences

**Goal:** Respect user attention, reduce churn  
**Approach:** Granular control, smart defaults  

```
ENTRY POINTS
├── Settings page
├── Onboarding step
├── Notification click-through
└── Unsubscribe action

JOURNEY
Step 1: Preference Center
Categories:
├── Account (required)
│   └── Security alerts, password resets
├── Applications (default: on)
│   ├── Application status updates
│   ├── Club approvals/rejections
│   └── Reminders
├── Discovery (default: on)
│   ├── New clubs in area
│   ├── New spots at saved clubs
│   └── Personalized recommendations
├── Community (default: on)
│   ├── Event invitations
│   ├── Review responses
│   ├── Follower activity
│   └── Group messages
├── Marketing (default: off)
│   ├── Weekly digest
│   ├── New features
│   ├── Promotions
│   └── Partner offers
└── Retention (default: smart)
    └── Only when inactive

Step 2: Channel Selection
Per Category:
├── Email: [ ] Toggle
├── Push: [ ] Toggle
├── SMS: [ ] Toggle (only critical)
└── In-App: [Always on]

Step 3: Frequency Control
Options:
├── Real-time (immediate)
├── Daily digest
├── Weekly digest
├── Only critical
└── Pause all (vacation mode)

Step 4: Quiet Hours
Setting:
├── Default: 10 PM - 8 AM
├── Custom time range
├── Timezone aware
└── Emergency override

SMART DEFAULTS
New Users:
├── Account: All channels
├── Applications: Email + Push
├── Discovery: Email digest
├── Community: Push only
└── Marketing: Opt-in

Power Users:
├── More real-time notifications
├── Community engagement on
└── Marketing still opt-in

METRICS
├── Notification Open Rate: 25%
├── Click-Through Rate: 5%
├── Opt-out Rate: < 2%
├── Preference Customization: 40% of users
└── Channel Mix: 60% email, 30% push, 10% SMS
```

---

## 6. ADMIN & OPERATIONAL FLOWS

### Flow 6.1: Club Application Review (Admin)

**Actor:** Club admin or platform admin  
**Goal:** Approve/reject membership requests efficiently  

```
ENTRY POINT
├── New application notification
├── Dashboard "Pending Applications" badge
└── Email: "New application for [Club]"

JOURNEY
Step 1: Review Queue
Dashboard:
├── Filter: Pending, Approved, Rejected, All
├── Sort: Date, Name, Status
├── Search: By applicant name
├── Stats: Queue size, avg review time
└── Bulk actions

Step 2: Application Detail
View:
├── Applicant Profile:
│   ├── Name, photo, bio
│   ├── Experience level
│   ├── Other memberships
│   └── Review history (if any)
├── Application Data:
│   ├── Motivation statement
│   ├── Preferences
│   ├── Date submitted
│   └── ID verification status
├── Risk Signals:
│   ├── Previous rejections
│   ├── Incomplete profile
│   └── Verification issues
└── Actions:
    ├── [Approve]
    ├── [Reject]
    ├── [Request More Info]
    └── [Schedule Interview]

Step 3: Decision
Approve:
├── Optional: Add welcome note
├── Set: Orientation date (optional)
├── Trigger: Approval notification
└── Update: Club capacity

Reject:
├── Required: Select reason
│   ├── At capacity
│   ├── Incomplete application
│   ├── Verification failed
│   ├── Not a good fit
│   └── Other
├── Optional: Personal note
├── Trigger: Rejection notification
└── Offer: Alternative clubs

Request More Info:
├── Select: What info needed
├── Message: Custom request
├── Status: "On Hold"
└── Timer: Auto-reject after 7 days

Step 4: Follow-up
Approved:
├── Track: First visit rate
├── Reminder: If no visit in 14 days
└── Survey: Post-visit feedback

Rejected:
├── Track: Re-application rate
├── Offer: Other clubs
└── Cool-down: Prevent spam

METRICS
├── Review Time: < 48 hours
├── Approval Rate: 70%
├── Rejection Rate: 25%
├── On-Hold Rate: 5%
├── Appeals: < 5%
└── Satisfaction: 4.5/5
```

### Flow 6.2: Content Moderation

**Actor:** Moderators (staff + Guides)  
**Goal:** Maintain quality and safety  

```
ENTRY POINTS
├── User reports
├── AI flagging
├── Random sampling
└── New content queue

JOURNEY
Step 1: Flagged Content Queue
Types:
├── Reviews
├── Photos
├── Comments
├── Events
└── Profiles

Step 2: Review Interface
Display:
├── Content in context
├── Reporter reason (if reported)
├── Author history
├── AI confidence score
└── Similar past decisions

Step 3: Decision
Options:
├── Approve: Content is fine
├── Approve with Edit: Minor fix needed
├── Hide: Remove from public view
├── Delete: Permanent removal
└── Ban User: For severe violations

Step 4: Communication
To Author:
├── If edited/deleted: Email with reason
├── If banned: Appeal process explained
└── Transparency: Moderation log

To Reporter:
├── Action taken notification
├── Thanks for reporting
└── Report outcome

Step 5: Learning
Analysis:
├── False positive rate
├── Common violation types
├── User education needed
└── Policy updates

METRICS
├── Review Time: < 24 hours
├── Accuracy: 95%+
├── Appeals: < 5%
├── User Satisfaction: 4.0/5
└── Content Removals: 2% of total
```

### Flow 6.3: Platform Analytics

**Actor:** Platform administrators  
**Goal:** Monitor health and growth  

```
DASHBOARD SECTIONS

1. Acquisition
├── Traffic sources
├── Conversion funnel
├── CAC by channel
└── Organic vs Paid

2. Activation
├── Signup completion rate
├── Time to first application
├── Onboarding drop-off
└── First visit rate

3. Engagement
├── DAU/MAU
├── Session duration
├── Pages per session
├── Feature usage
└── Retention cohorts

4. Revenue (Future)
├── Membership fees
├── Premium subscriptions
├── Transaction revenue
└── LTV by cohort

5. Community
├── UGC volume
├── Review quality
├── Event attendance
├── Guide program
└── Moderation queue

6. System Health
├── Error rates
├── Load times
├── Uptime
├── Security incidents
└── Support tickets

ALERTS
├── Traffic spike (> 200%)
├── Conversion drop (> 20%)
├── Error rate increase
├── Negative sentiment
└── System downtime

REPORTS
├── Daily: Key metrics snapshot
├── Weekly: Trend analysis
├── Monthly: Board report
├── Quarterly: Strategic review
└── Annual: Comprehensive analysis
```

---

## 7. EDGE CASES & FAILURE RECOVERY

### Flow 7.1: Application Rejection Recovery

**Scenario:** User rejected but wants to try again  
**Goal:** Convert rejection into acceptance elsewhere  

```
REJECTION FLOW
Step 1: Rejection Notification
├── Empathetic messaging
├── Clear reason (not generic)
└── Transparency

Step 2: Immediate Alternatives
├── "Based on your profile, try these:"
├── 3-5 similar clubs
├── Match score: "95% match"
└── One-click apply

Step 3: Re-apply Path
├── Cool-down period: 30 days
├── Improved application tips
├── Profile completion suggestions
└── Guide: "How to write a great application"

Step 4: Appeal Process
├── If rejected in error
├── Form: "Request Review"
├── Evidence submission
└── 7-day response guarantee

RECOVERY METRICS
├── Alternative Click: 40%
├── Re-apply Rate: 20%
├── Appeal Rate: 5%
├── Ultimate Approval: 15%
└── Churn After Rejection: 30%
```

### Flow 7.2: Technical Failure Recovery

**Scenarios:** 
- Payment failure
- Upload failure  
- Form submission error
- Timeout

```
RECOVERY PATTERNS

Pattern 1: Auto-Retry
├── Detect: Network error
├── Action: Silent retry (3x)
├── Success: Continue
└── Failure: Show manual retry

Pattern 2: Save Draft
├── Detect: Long form entry
├── Action: Auto-save every 30s
├── Failure: "Restore previous progress?"
└── Recovery: Resume from save point

Pattern 3: Degradation
├── Detect: Image upload fail
├── Fallback: "Continue without photo?"
├── Alternative: "Try again later"
└── Path: Submit without, edit later

Pattern 4: Clear Error
├── Detect: Validation failure
├── Show: Specific field error
├── Suggest: How to fix
└── Allow: Edit and resubmit

USER COMMUNICATION
├── Immediate: "Something went wrong"
├── Specific: "Photo too large (max 5MB)"
├── Helpful: "Try compressing or use smaller photo"
├── Alternative: "Continue without photo for now"
└── Support: "Need help? Contact us"
```

### Flow 7.3: Account Security Incidents

**Scenarios:**
- Suspicious login
- Password breach
- Reported content

```
SECURITY FLOWS

Suspicious Login:
├── Detect: New device/location
├── Action: Email notification
├── Require: Email confirmation
├── Option: "Block this device"
└── Recovery: Change password prompt

Password Breach:
├── Detect: Password in breach DB
├── Action: Force password reset
├── Email: Urgent security notice
├── Login: Blocked until changed
└── Post: Security tips

Reported Content:
├── Receive: User report
├── Action: Content hidden pending review
├── Notify: Author (violation suspected)
├── Review: 24h moderation
└── Result: Restore or remove

Account Recovery:
├── Forgot password: Email reset link
├── Lost 2FA: Identity verification
├── Hacked account: Freeze + restore
└── Deletion request: 7-day grace period
```

---

## 8. MULTI-CHANNEL JOURNEYS

### Flow 8.1: Web → Mobile App Migration

**Goal:** Move web users to app for better retention  

```
TRIGGER POINTS
├── 3rd visit on mobile web
├── Attempt to upload photo on web
├── Share action
└── Push notification permission request

MIGRATION FLOW
Step 1: Value Proposition
Modal: "Get the App for Better Experience"
Benefits:
├── "Offline access to your clubs"
├── "Instant notifications"
├── "Quick check-in with QR"
└── "Exclusive app-only features"

Step 2: Seamless Transition
├── Deep link to app store
├── Pre-fill signup (if existing user)
├── Transfer saved clubs
└── Restore session state

Step 3: App Onboarding
├── Quick tour (3 screens)
├── Enable notifications prompt
├── Enable location prompt
└── "You're all set!"

INCENTIVES
├── "Download app, get priority processing"
├── App-exclusive club previews
└── Early access to events

METRICS
├── Migration Rate: 40% of mobile web
├── App Retention: 2x web retention
├── Feature Usage: Higher in app
└── NPS: +10 points in app
```

### Flow 8.2: Email → In-App Continuity

**Goal:** Seamless transition from email to action  

```
EMAIL TYPES & DEEP LINKS

Application Approval:
├── Email: "You're approved!"
├── CTA: "View Details"
├── Deep Link: /my-requests?highlight=approved
└── Action: One-tap to see club details

New Club Alert:
├── Email: "New club in Malasaña"
├── CTA: "Check it out"
├── Deep Link: /clubs/[slug]?source=email
└── Action: Direct to club page

Event Reminder:
├── Email: "Event tomorrow"
├── CTA: "View Event"
├── Deep Link: /events/[id]
└── Action: RSVP or view details

Weekly Digest:
├── Email: Summary of updates
├── Multiple CTAs per section
├── Deep Links: Specific to each item
└── Action: Contextually relevant

TRACKING
├── UTM parameters on all links
├── Source: email_campaign
├── Medium: email
└── Content: specific CTA

PERSONALIZATION
├── Dynamic content blocks
├── Based on user preferences
├── Time-optimized sending
└── A/B tested subject lines
```

---

## 9. CONVERSION OPTIMIZATION FLOWS

### Flow 9.1: Abandoned Application Recovery

**Trigger:** Started application, didn't finish  
**Goal:** Maximize completion rate  

```
DETECTION
├── Event: Application started
├── Timeout: 30 minutes no activity
├── OR: Session ended mid-form
└── Trigger: Recovery sequence

RECOVERY SEQUENCE

T+30 minutes (Immediate):
├── Channel: In-app (if returned) / Email
├── Subject: "Continue your application"
├── Content: "You were applying to [Club]"
├── Incentive: "Still 8 spots remaining"
├── CTA: "Resume Application"
└── Deep link: Form with saved progress

T+24 hours (Reminder):
├── Channel: Email
├── Subject: "Don't miss out on [Club]"
├── Content: 
│   ├── What you started
│   ├── Why this club is great
│   ├── Social proof: "3 applied today"
│   └── Simplify: "Finish in 2 minutes"
└── CTA: "Complete Application"

T+72 hours (Urgency):
├── Channel: Email + Push
├── Subject: "Last chance: [Club] filling up"
├── Content:
│   ├── Scarcity: "Only 5 spots left"
│   ├── FOMO: "Join 89 members"
│   └── Alternative: "Similar clubs available"
└── CTAs: [Complete Now] [View Similar]

T+7 days (Final):
├── Channel: Email
├── Subject: "Your saved application expires soon"
├── Content:
│   ├── Expiration notice
│   ├── Quick re-apply option
│   └── Feedback: "Why didn't you finish?"
└── CTA: "Re-Apply" / "Tell us why"

METRICS
├── Recovery Open: 50%
├── Resume Click: 30%
├── Complete After Recovery: 15%
├── Alternative Click: 10%
└── Overall Recovery Impact: +8% completion
```

### Flow 9.2: Cross-Sell / Upsell Flows

**Goal:** Increase user value  
**Tactics:** Related clubs, premium features, events  

```
CROSS-SELL OPPORTUNITIES

After First Approval:
├── "Members also join these clubs"
├── 3 club recommendations
├── Match score based on first club
├── One-click apply (pre-filled)
└── Incentive: "Multi-club member badge"

After 3 Visits:
├── "You're a regular! Upgrade your experience"
├── Premium tier introduction
├── Benefits: Priority booking, exclusive events
├── Trial offer: "First month free"
└── Social proof: "500+ premium members"

Event Cross-Sell:
├── "Going to [Club]? Don't miss these events"
├── Upcoming at member clubs
├── Bundle offer: "Event + Membership"
└── Limited time: "Early bird pricing"

Geographic Expansion:
├── "Traveling to Barcelona?"
├── Partner clubs in other cities
├── Passport continuity
├── Tourist guide content
└── Multi-city membership option

UPSELL TIMING
├── Not immediately after signup
├── After positive experience
├── When user shows engagement
├── During milestone moments
└── Never pushy, always value-first

METRICS
├── Cross-sell View: 30% of eligible
├── Click Rate: 10%
├── Conversion: 5%
├── Revenue Impact: +15% per user
└── Satisfaction Impact: Neutral/Positive
```

---

## 10. SUCCESS METRICS BY FLOW

### Acquisition Metrics

| Flow | Entry | Conversion | Time | Quality |
|------|-------|------------|------|---------|
| Organic Search | 60% traffic | 5% signup | 5 min | High intent |
| Direct Club Search | 15% traffic | 15% signup | 2 min | Very high |
| Social Media | 20% traffic | 3% signup | 3 min | Medium |
| Referral | 5% traffic | 25% signup | 4 min | Highest |

### Activation Metrics

| Flow | Start | Complete | Time | Drop-off Point |
|------|-------|----------|------|----------------|
| Signup | 100% | 43% | 2-3 min | Step 3 (preferences) |
| First Application | 100% | 60% | 4-5 min | ID verification |
| First Visit | 85% of approved | N/A | N/A | N/A |

### Retention Metrics

| Flow | Trigger | Success | Impact |
|------|---------|---------|--------|
| Re-engagement | 7 days inactive | 10% return | +20% retention |
| Tier Progression | Automatic | 15% advance | +40% retention |
| Notification | User preference | 25% open | +15% DAU |

### Revenue Metrics (Future)

| Flow | Conversion | ARPU | LTV |
|------|------------|------|-----|
| Membership | 8% of visitors | €50 | €150 |
| Multi-club | 30% of members | €100 | €400 |
| Premium | 5% of members | €200 | €800 |
| Events | 20% of members | €20 | €60 |

---

## SUMMARY

This user flow document maps **complete user journeys** across your platform:

### Key Flows Implemented:
1. **4 Acquisition Flows** (Search, Direct, Social, Referral)
2. **3 Activation Flows** (Signup, Application, First Visit)
3. **3 Core Experience Flows** (Discovery, Multi-club, Favorites)
4. **3 Community Flows** (Reviews, Events, Guide Program)
5. **3 Retention Flows** (Re-engagement, Tiers, Notifications)
6. **3 Admin Flows** (Applications, Moderation, Analytics)
7. **3 Edge Cases** (Rejection, Failure, Security)
8. **2 Multi-channel Flows** (Web→App, Email→In-App)
9. **2 Conversion Flows** (Abandoned App, Cross-sell)

### Conversion Funnel:
**Visitor → Signup (5%) → Application (30%) → Approval (70%) → First Visit (85%) → Review (18%) → Multi-club (30%) → Guide (10%)**

### Next Steps:
1. **Map flows to wireframes** for each screen
2. **Create state diagrams** for complex decision trees
3. **Build prototype** for critical flows (signup → application)
4. **User test** with 5-10 target users
5. **Iterate** based on feedback

These flows are designed for **maximum effectiveness** - not beauty, not complexity, but pure conversion and retention optimization.

---

*Document Version: 1.0*  
*Flows Documented: 30+*  
*Personas Covered: 5*  
*Channels: Web, Mobile, Email, Push*  
*Conversion Optimized: Yes*

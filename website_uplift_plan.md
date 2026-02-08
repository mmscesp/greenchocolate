# 🚀 SCM Website Uplift Strategy: The Verified Navigation Layer

**Date:** Feb 8, 2026  
**Status:** APPROVED FOR EXECUTION  
**Objective:** Pivot from "Directory" to "Trust & Education Platform" to build audience, SEO authority, and compliance-first growth.

---

## 1. Executive Summary
We are not building a "weed map." We are building **Resident Advisor for Cannabis Social Club Culture**.  
Our immediate goal is to launch a platform that offers **value without inventory**. We will do this by becoming the single most authoritative source on **safety, etiquette, and legal reality** for cannabis in Spain.

**The "Stay Alive" Protocol:**
- **Public Layer:** Educational, cultural, safety-focused. (SEO & Social Safe)
- **Private Layer:** Club details and membership requests. (Behind Login/Age-Gate)

---

## 2. New Information Architecture (IA)

The current structure (`Home`, `Blog`, `Clubs`) is insufficient. We will expand to a **Hub-and-Spoke** model.

### 📍 New Sitemap
1.  **Home (`/`)**:  
    *   **Hero**: "Navigate Spain's Cannabis Culture Safely & Respectfully."  
    *   **Primary CTA**: "Get the Visitor Safety Kit" (PLG Lead Magnet).  
    *   **Secondary CTA**: "Explore the Guide" (Link to `/learn`).  
    *   **Trust Signals**: "Verified by SCM," "Privacy First," "Compliance Focused."  
    *   *No club listings immediately visible.*

2.  **The Knowledge Hub (`/learn`)** *[Replaces standard Blog]*:  
    *   **Structure**: Not a chronological feed. A **Categorized Resource Center**.  
    *   **Categories**:  
        *   🏛️ **Legal & Safety**: "Public vs Private," "Fines," "Police Interactions."  
        *   🤝 **Etiquette**: "Do's & Don'ts," "Tipping," "Privacy Rules."  
        *   🎨 **Culture**: "History of CSCs," "Art & Music in Clubs."  
        *   🏙️ **City Guides**: "Barcelona," "Madrid," "Valencia" (SEO Pillars).

3.  **Tools & Resources (`/tools`)** *[The PLG Engine]*:  
    *   **Eligibility Quiz**: "Can I join a club?" (Age, Residency, ID Check).  
    *   **Fine Calculator** (Educational): "Risk of public consumption fines."  
    *   **Download Center**: "Visitor Safety Kit (PDF)," "Club Etiquette Checklist."

4.  **Events (`/events`)** *[The "Resident Advisor" Wedge]*:  
    *   Curated list of **public** industry events (Spannabis, ICBC) and cultural events (Art, Music) relevant to the audience.  
    *   **Goal**: Drive traffic from people looking for *things to do*, not just *places to smoke*.

5.  **Mission & Verification (`/mission`)**:  
    *   **The "Why"**: We exist to protect the culture and the visitor.  
    *   **Verification Methodology**: detailed explanation of *how* we verify clubs (Trust Moat).  
    *   **Transparency**: "We are not a shop. We are a guide."

---

## 3. Product-Led Growth (PLG) Mechanics

We will use **content-as-product** to capture emails and build our audience before we have a full club list.

| Feature | Mechanism | Value Exchange |
| :--- | :--- | :--- |
| **Visitor Safety Kit** | PDF Download | User gets specific, printable safety rules. We get **Email**. |
| **Eligibility Quiz** | Interactive Form | User gets immediate answer ("Yes/No"). We get **Segmented Lead** (Residency/Age). |
| **"Risk Radar"** | Interactive Map/Tool | User sees fine risks in public areas. We build **Authority/Trust**. |
| **Event Calendar** | "Add to Calendar" | User gets reminders. We get **Retargeting Audience**. |

---

## 4. Content Strategy: Hub & Spoke SEO

We will dominate search by clustering content around high-intent keywords, unrelated to "buying weed."

**Pillar: "Cannabis in Spain"**
*   *Spoke 1:* "Is weed legal in Barcelona?" (Legal Hub)
*   *Spoke 2:* "What happens if I get caught with weed in Spain?" (Safety Hub)
*   *Spoke 3:* "Difference between Coffee Shop and Social Club" (Etiquette Hub)
*   *Spoke 4:* "Cannabis Social Club Membership Requirements" (Tools/Quiz)

**Pillar: "Barcelona Culture"**
*   *Spoke 1:* "Best neighborhoods for nightlife in Barcelona" (City Guide)
*   *Spoke 2:* "Spannabis 2026 Guide" (Events)
*   *Spoke 3:* "Art galleries in Barcelona" (Culture Hub)

---

## 5. Technical Implementation Roadmap

### Phase 1: The Trust Foundation (Days 1-14)
- [ ] **Refactor `Blog` to `Knowledge Hub`**:
    - Create new layouts for "Hub" and "Category" pages.
    - Implement "Article" schema for SEO.
- [ ] **Build `Mission` Page**:
    - Static page with high-quality copy and "Verification Badge" explanation.
- [ ] **Homepage Redesign**:
    - Remove "Featured Clubs" (for now).
    - Add "Safety Kit" Email Capture (using Server Actions + Database).

### Phase 2: The PLG Engine (Days 15-30)
- [ ] **Build `/tools` Section**:
    - Develop "Eligibility Quiz" (Client Component).
    - Develop "Fine Estimator" (Simple interactive tool).
- [ ] **Lead Magnet Integration**:
    - "Download PDF" functionality (or email delivery).

### Phase 3: The "Resident Advisor" Layer (Days 30+)
- [ ] **Build `/events` Section**:
    - Event listing with "Add to Calendar" button.
    - SEO schema for `Event`.
- [ ] **City Hubs**:
    - Aggregate content by city (Guides + Events + *Future Clubs*).

---

## 6. Immediate Next Steps (Action Items)

1.  **Design**: Create wireframes for the new `Home` and `Knowledge Hub`.
2.  **Content**: Write the "Visitor Safety Kit" (PDF content) to start capturing emails immediately.
3.  **Dev**: Scaffold the new routes (`/learn`, `/mission`, `/events`, `/tools`).

**Let's build the platform that defines the standard.**

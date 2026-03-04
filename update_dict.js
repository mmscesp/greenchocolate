const fs = require('fs');
const path = require('path');

const newSafetyKit = {
  "eyebrow": "FREE DOWNLOAD — 2026 EDITION",
  "title": "The Spain Safety Kit",
  "subtitle": "Everything between you and a €30,000 fine — in one free guide.",
  "body": "The legal lines tourists don't know. The scam patterns locals see every day. The etiquette rules nobody writes down. Built by our team in Barcelona for anyone navigating Spain's cannabis social club scene for the first time — or the first time properly.",
  "form_placeholder": "Your email address",
  "form_button": "Send Me the Kit — Free",
  "microcopy": "Instant download. No spam. One weekly update. Unsubscribe in one click.",
  "social_proof": "Downloaded by 2,500+ travelers across 40+ countries.",
  "trust_strip": "Education-First · Written by Locals in Barcelona · Independently Published · Last Updated March 2026 · No Sponsored Content",
  "inside_title": "Five Modules. Zero Fluff.",
  "inside_subtitle": "Every module solves a specific problem tourists face in Spain. Read it once before your trip. Screenshot the checklist. You'll use it.",
  "modules": {
    "1": {
      "title": "Module 1 — The Legal Line",
      "desc": "Public vs private — the only distinction that matters. What counts as \"public\" (it's more than you think). The fine range: €601 to €30,000. Three rules to memorize before you leave your hotel."
    },
    "2": {
      "title": "Module 2 — Scam Red Flags",
      "desc": "Nine documented scam patterns with real-world examples. Street promoters. Fake Telegram menus. \"VIP invitation\" cards. Instagram access accounts. How to recognize each one before it reaches you — and exactly what to do."
    },
    "3": {
      "title": "Module 3 — First-Visit Protocol",
      "desc": "Before, during, and after your visit. What to bring. What to say at the door. The 10 etiquette rules every club enforces. How to leave without crossing a legal line. Written by people who've done it hundreds of times."
    },
    "4": {
      "title": "Module 4 — The Pocket Checklist",
      "desc": "One screenshot-ready page. Before / At the door / Inside / Leaving / Never. Save it to your phone. Carry it with you. The only checklist you need."
    },
    "5": {
      "title": "Module 5 — Emergency Contacts & Response",
      "desc": "Every number you need. What happens if you get fined (and how to spot a fake fine). What to do if you've been scammed. How to get medical help. When and how to file a police report."
    }
  },
  "who_title": "Built for You If...",
  "who_bullets": [
    "You're visiting Spain and curious about cannabis social clubs",
    "You've heard about clubs but don't know how they actually work",
    "You've been before but weren't sure you did it right",
    "You want to avoid the mistakes that cost other tourists hundreds or thousands of euros"
  ],
  "not_title": "What This Kit Won't Do",
  "not_bullets": [
    "It won't tell you where to \"buy weed\" — we don't do that",
    "It won't give you legal advice — we're not lawyers",
    "It won't promote any specific club — no paid placements, ever"
  ],
  "not_closing": "It will give you the information that keeps you safe, informed, and on the right side of the rules. That's it. That's the whole point.",
  "quote": "\"We live in Barcelona. We watch tourists get scammed outside cannabis clubs every single day — people who had good intentions but bad information. This kit is everything we wish someone had handed them before they got here.\"",
  "quote_author": "— The SCM Team, Barcelona",
  "age_headline": "One quick thing before your download.",
  "age_q": "Are you 18 or older?",
  "age_yes": "Yes — Show My Download",
  "age_no": "No",
  "age_reject": "This guide is intended for adults. You must be 18 or older to access this content.",
  "dl_headline": "Your Safety Kit is ready.",
  "dl_button": "Download the Safety Kit (PDF)",
  "dl_support": "We've also sent it to your email. Save it. Screenshot Module 4. Read Module 2 first — it's the one that saves people the most money.",
  "dl_cta1": "Ready to find a verified club?",
  "dl_cta1_btn": "Browse the Directory →",
  "dl_cta2": "Want to understand the full legal picture?",
  "dl_cta2_btn": "Read: Spain's Cannabis Laws for Tourists →",
  "final_headline": "Don't wing it.",
  "final_body": "The Safety Kit is free. The fines are not.",
  "final_form_btn": "Get the Kit →",
  "final_microcopy": "Free forever. Instant download. One email per week."
};

const dictsDir = path.join(__dirname, 'dictionaries');
const files = fs.readdirSync(dictsDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const filePath = path.join(dictsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Replace the entire safety_kit block
  data.safety_kit = newSafetyKit;
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Updated', file);
}

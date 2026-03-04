const fs = require('fs');
const path = require('path');

const SCORE_THRESHOLD = 8;
const MAX_DEPTH = 3;

// Example directories and their basic score (from bash: file count * 3, subdirs * 2)
// In a real implementation this would dynamically aggregate from bash and explore agents.
const directories = [
  { path: ".", files: 19, subdirs: 10,  score: 0 }, // Root is always created
  { path: "components/ui", files: 53, subdirs: 0, reason: "high file count, UI primitive library (shadcn)", score: 18 },
  { path: "lib", files: 21, subdirs: 2, reason: "core utilities, types, and prisma generated client", score: 15 },
  { path: "app/actions", files: 19, subdirs: 0, reason: "server actions, high file count", score: 12 },
  { path: "components/landing/editorial-concierge", files: 2, subdirs: 2, reason: "distinct domain with deep hierarchy", score: 10 },
  { path: "hooks", files: 3, subdirs: 0, reason: "custom react hooks and API simulation layer", score: 9 },
  { path: "docs", files: 0, subdirs: 2, reason: "documentation root, low score", score: 4 }, // Skip
];

const locations = directories.filter(d => d.path === "." || d.score >= SCORE_THRESHOLD);

console.log(JSON.stringify(locations, null, 2));

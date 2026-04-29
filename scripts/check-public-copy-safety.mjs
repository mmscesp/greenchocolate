import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['app', 'components', 'lib', 'data', 'dictionaries'];
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.md']);
const PROHIBITED = [
  /\bguaranteed access\b/i,
  /\bguaranteed entry\b/i,
  /\bguaranteed acceptance\b/i,
  /\binstant entry\b/i,
  /\bbest weed clubs?\b/i,
  /\bbuy weed\b/i,
  /\bbuy cannabis\b/i,
  /\border cannabis\b/i,
  /\bbuy your pass\b/i,
  /\bpass now\b/i,
  /\bpublic pass marketplace\b/i,
  /\bVerified Directory\b/i,
  /\bDiscover verified cannabis social clubs throughout Spain\b/i,
  /\bEvery club listed here is personally vetted\b/i,
  /\bEvery listed club is personally vetted\b/i,
  /\bApply for Membership\b/i,
  /\bfill manually\b/i,
  /\btourist-approved\b/i,
  /\btourist-ready\b/i,
  /\bopen today\b/i,
  /\blegal club\b/i,
  /\bsafe club\b/i,
];

const RESTRICTED_WITH_ALLOWED_CONTEXT = [
  {
    pattern: /\bPrice Range\b/i,
    allow: [/admin/i, /priceRange/i],
  },
  {
    pattern: /\bVerified Clubs\b/i,
    allow: [/Verified Profiles/i],
  },
  {
    pattern: /\bplug\b/i,
    allow: [/plugin/i, /registerPlugin/i],
  },
  {
    pattern: /\bdelivery\b/i,
    allow: [/deliveryMode/i, /email/i, /webhook/i, /admin/i, /communications/i, /avoid/i, /do not/i, /promises?/i, /advertising/i, /takeaway/i, /scam/i, /not/i, /falla/i, /fallen/i, /vermeiden/i, /evita/i, /habla/i, /suena/i, /schlagen/i, /console\.error/i],
  },
];

const IGNORE_PATH_PARTS = [
  `${path.sep}.next${path.sep}`,
  `${path.sep}node_modules${path.sep}`,
  `${path.sep}output${path.sep}`,
  `${path.sep}app${path.sep}actions${path.sep}`,
  `${path.sep}app${path.sep}[lang]${path.sep}admin${path.sep}`,
  `${path.sep}components${path.sep}admin${path.sep}`,
  `${path.sep}lib${path.sep}editorial-sprint${path.sep}`,
  `${path.sep}lib${path.sep}public-club-safety.ts`,
  `${path.sep}lib${path.sep}club-utils.ts`,
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (IGNORE_PATH_PARTS.some((part) => full.includes(part))) {
      continue;
    }
    if (entry.isDirectory()) {
      files.push(...await walk(full));
    } else if (EXTENSIONS.has(path.extname(entry.name)) && !entry.name.includes('.test.')) {
      files.push(full);
    }
  }

  return files;
}

const files = [];
for (const dir of SCAN_DIRS) {
  files.push(...await walk(path.join(ROOT, dir)));
}

const findings = [];
for (const file of files) {
  const content = await readFile(file, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const pattern of PROHIBITED) {
      if (pattern.test(line)) {
        findings.push({
          file: path.relative(ROOT, file),
          line: index + 1,
          pattern: String(pattern),
          text: line.trim(),
        });
      }
    }
    for (const rule of RESTRICTED_WITH_ALLOWED_CONTEXT) {
      if (rule.pattern.test(line) && !rule.allow.some((allowed) => allowed.test(line) || allowed.test(file))) {
        findings.push({
          file: path.relative(ROOT, file),
          line: index + 1,
          pattern: String(rule.pattern),
          text: line.trim(),
        });
      }
    }
  });
}

if (findings.length > 0) {
  console.error('Public copy safety scan failed:');
  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line} ${finding.pattern} -> ${finding.text}`);
  }
  process.exit(1);
}

console.log(`Public copy safety scan passed across ${files.length} files.`);

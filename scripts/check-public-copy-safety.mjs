import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['app', 'components', 'lib', 'data'];
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.md']);
const PROHIBITED = [
  /\bguaranteed access\b/i,
  /\binstant entry\b/i,
  /\bbest weed clubs?\b/i,
  /\bbuy weed\b/i,
  /\bbuy your pass\b/i,
  /\bpass now\b/i,
  /\bpublic pass marketplace\b/i,
];

const IGNORE_PATH_PARTS = [
  `${path.sep}.next${path.sep}`,
  `${path.sep}node_modules${path.sep}`,
  `${path.sep}output${path.sep}`,
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
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
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

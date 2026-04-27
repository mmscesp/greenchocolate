import { readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const UNVERIFIED_TEMPLATE = path.join(
  ROOT,
  'app',
  '[lang]',
  'clubs',
  '[slug]',
  'UnverifiedClubProfileContent.tsx'
);
const CLUB_PAGE = path.join(ROOT, 'app', '[lang]', 'clubs', '[slug]', 'page.tsx');

const requiredTemplateSignals = [
  '/safety-kit',
  '/spain/barcelona',
  '/editorial/legal',
  '/verification',
  'listing-correction',
  'SCM provides information, not legal advice',
];

const requiredPageSignals = [
  'buildLanguageAlternates',
  'canonical',
  'LocalBusiness',
  'verificationStatus',
  'UnverifiedClubProfileContent',
];

const checks = [
  { file: UNVERIFIED_TEMPLATE, signals: requiredTemplateSignals },
  { file: CLUB_PAGE, signals: requiredPageSignals },
];

const failures = [];
for (const check of checks) {
  const content = await readFile(check.file, 'utf8');
  for (const signal of check.signals) {
    if (!content.includes(signal)) {
      failures.push(`${path.relative(ROOT, check.file)} missing ${signal}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Club SEO spine scan failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Club SEO spine scan passed.');

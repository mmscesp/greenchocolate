#!/usr/bin/env node

/**
 * Translation Coverage Checker
 * 
 * This script analyzes all translation files and reports missing keys.
 * Uses es.json as the source of truth.
 */

const fs = require('fs');
const path = require('path');

const DICTIONARIES_DIR = path.join(__dirname, '..', 'dictionaries');
const SOURCE_LANG = 'es';
const LANGUAGES = ['es', 'en', 'fr', 'de', 'it', 'pl', 'ru', 'pt'];

/**
 * Flatten a nested object into dot-notation keys
 */
function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], prefixedKey));
    } else {
      acc[prefixedKey] = obj[key];
    }
    
    return acc;
  }, {});
}

/**
 * Load and flatten a translation file
 */
function loadTranslations(lang) {
  const filePath = path.join(DICTIONARIES_DIR, `${lang}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return null;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    return flattenObject(parsed);
  } catch (error) {
    console.error(`❌ Error parsing ${lang}.json:`, error.message);
    return null;
  }
}

/**
 * Find missing keys compared to source
 */
function findMissingKeys(sourceKeys, targetKeys) {
  const missing = [];
  
  for (const key of Object.keys(sourceKeys)) {
    if (!(key in targetKeys)) {
      missing.push(key);
    }
  }
  
  return missing.sort();
}

/**
 * Calculate coverage percentage
 */
function calculateCoverage(total, missing) {
  if (total === 0) return 0;
  return Math.round(((total - missing) / total) * 100);
}

/**
 * Generate colored status indicator
 */
function getStatusIndicator(coverage) {
  if (coverage === 100) return '✅';
  if (coverage >= 80) return '🟡';
  if (coverage >= 50) return '🟠';
  return '🔴';
}

/**
 * Main execution
 */
function main() {
  console.log('\n🌍 Translation Coverage Report');
  console.log('==============================\n');
  
  // Load source language
  const sourceTranslations = loadTranslations(SOURCE_LANG);
  
  if (!sourceTranslations) {
    console.error('❌ Failed to load source language (es.json)');
    process.exit(1);
  }
  
  const sourceKeys = Object.keys(sourceTranslations);
  const totalKeys = sourceKeys.length;
  
  console.log(`Source: ${SOURCE_LANG}.json (${totalKeys} keys)\n`);
  
  const results = {};
  let hasMissingKeys = false;
  
  // Check each language
  for (const lang of LANGUAGES) {
    const translations = loadTranslations(lang);
    
    if (!translations) {
      results[lang] = {
        exists: false,
        total: 0,
        missing: sourceKeys,
        coverage: 0
      };
      hasMissingKeys = true;
      continue;
    }
    
    const missing = findMissingKeys(sourceTranslations, translations);
    const coverage = calculateCoverage(totalKeys, missing.length);
    
    results[lang] = {
      exists: true,
      total: Object.keys(translations).length,
      missing,
      coverage
    };
    
    if (missing.length > 0) {
      hasMissingKeys = true;
    }
    
    const status = getStatusIndicator(coverage);
    console.log(`${status} ${lang.toUpperCase()}: ${results[lang].total}/${totalKeys} (${coverage}%)`);
    
    if (missing.length > 0 && missing.length <= 10) {
      missing.forEach(key => console.log(`   - ${key}`));
    } else if (missing.length > 10) {
      console.log(`   - ... and ${missing.length - 10} more`);
    }
  }
  
  // Summary
  console.log('\n📊 Summary');
  console.log('----------');
  
  const complete = Object.values(results).filter(r => r.coverage === 100).length;
  const incomplete = LANGUAGES.length - complete;
  
  console.log(`Complete: ${complete}/${LANGUAGES.length}`);
  console.log(`Incomplete: ${incomplete}/${LANGUAGES.length}`);
  
  // Calculate total missing
  const totalMissing = Object.values(results).reduce((sum, r) => sum + r.missing.length, 0);
  console.log(`Total missing keys: ${totalMissing}`);
  
  // Save missing keys to file for automation
  const missingKeysPath = path.join(__dirname, 'missing-keys.json');
  const missingKeysData = {};
  
  for (const [lang, data] of Object.entries(results)) {
    if (data.missing.length > 0) {
      missingKeysData[lang] = data.missing;
    }
  }
  
  fs.writeFileSync(missingKeysPath, JSON.stringify(missingKeysData, null, 2));
  console.log(`\n📝 Missing keys saved to: ${missingKeysPath}`);
  
  // Exit with appropriate code
  if (hasMissingKeys) {
    console.log('\n⚠️  Some translations are incomplete. Run with --fix to auto-populate.');
    process.exit(1);
  } else {
    console.log('\n✅ All translations are complete!');
    process.exit(0);
  }
}

/**
 * Auto-populate missing translations with placeholder values
 */
function fixTranslations() {
  console.log('\n🔧 Auto-populating missing translations...\n');
  
  const sourceTranslations = loadTranslations(SOURCE_LANG);
  
  if (!sourceTranslations) {
    console.error('❌ Failed to load source language');
    process.exit(1);
  }
  
  for (const lang of LANGUAGES) {
    if (lang === SOURCE_LANG) continue;
    
    const filePath = path.join(DICTIONARIES_DIR, `${lang}.json`);
    let translations = loadTranslations(lang) || {};
    
    const missing = findMissingKeys(sourceTranslations, translations);
    
    if (missing.length === 0) {
      console.log(`✅ ${lang.toUpperCase()}: Already complete`);
      continue;
    }
    
    // Add missing keys with placeholder values
    for (const key of missing) {
      const sourceValue = sourceTranslations[key];
      // Create placeholder with [LANG] prefix
      translations[key] = `[${lang.toUpperCase()}] ${sourceValue}`;
    }
    
    // Sort keys to match source order
    const sortedTranslations = {};
    for (const key of Object.keys(sourceTranslations).sort()) {
      if (key in translations) {
        sortedTranslations[key] = translations[key];
      }
    }
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(sortedTranslations, null, 2) + '\n');
    console.log(`📝 ${lang.toUpperCase()}: Added ${missing.length} missing keys`);
  }
  
  console.log('\n✅ All translations populated with placeholders!');
  console.log('📝 Please review and update the placeholder values.');
}

// Handle CLI arguments
if (process.argv.includes('--fix')) {
  fixTranslations();
} else {
  main();
}

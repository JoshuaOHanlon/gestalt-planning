#!/usr/bin/env bun
/**
 * dev:skill — Watch mode for SKILL.md template development.
 *
 * Watches .tmpl files, regenerates SKILL.md files on change,
 */

import { discoverTemplates } from './discover-skills';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(import.meta.dir, '..');

const TEMPLATES = discoverTemplates(ROOT).map(t => ({
  tmpl: path.join(ROOT, t.tmpl),
  output: t.output,
}));

function regenerate() {
  // Regenerate
  try {
    execSync('bun run scripts/gen-skill-docs.ts', { cwd: ROOT, stdio: 'pipe' });
  } catch (err: any) {
    console.log(`  [gen]   ERROR: ${err.stderr?.toString().trim() || err.message}`);
    return;
  }
}

// Initial run
console.log('  [watch] Watching *.md.tmpl files...');
regenerate();

// Watch for changes
for (const { tmpl } of TEMPLATES) {
  if (!fs.existsSync(tmpl)) continue;
  fs.watch(tmpl, () => {
    console.log(`\n  [watch] ${path.relative(ROOT, tmpl)} changed`);
    regenerate();
  });
}

// Keep alive
console.log('  [watch] Press Ctrl+C to stop\n');

#!/usr/bin/env node
// Migration runner - executes all migrations in order

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const migrationsDir = __dirname;

async function runMigrations() {
  console.log('🔄 Starting migration runner...\n');

  // Get all migration files, sort by name (which includes order prefix)
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.js') && file !== 'run.js')
    .sort();

  if (files.length === 0) {
    console.log('No migration files found.');
    return;
  }

  console.log(`Found ${files.length} migration(s):`);
  files.forEach(f => console.log(`  - ${f}`));
  console.log('');

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    console.log(`\n▶ Running: ${file}`);

    try {
      // Dynamically import and run the migration
      const migration = require(filePath);
      // The migration files have a default export or run immediately
      // We need to handle both cases
      if (typeof migration === 'function') {
        await migration();
      } else if (migration.default && typeof migration.default === 'function') {
        await migration.default();
      } else {
        // Migration runs on require (IIFE style)
        console.log('  Migration executed on require');
      }
      console.log(`  ✅ Completed: ${file}`);
    } catch (error) {
      console.error(`  ❌ Failed: ${file}`);
      console.error(`  Error: ${error.message}`);
      process.exit(1);
    }
  }

  console.log('\n✅ All migrations completed successfully!');
}

runMigrations().catch(err => {
  console.error('\n❌ Migration runner failed:', err.message);
  process.exit(1);
});
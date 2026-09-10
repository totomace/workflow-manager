#!/usr/bin/env node
// Migration to add auth_provider column to users table

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }
);

async function migrate() {
  const client = await pool.connect();
  try {
    // Check if column already exists
    const checkResult = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'auth_provider'
    `);

    if (checkResult.rows.length > 0) {
      console.log('✅ auth_provider column already exists');
      return;
    }

    console.log('Adding auth_provider column to users table...');

    // Add auth_provider column with default 'local'
    await client.query(`
      ALTER TABLE users
      ADD COLUMN auth_provider VARCHAR(20) DEFAULT 'local',
      ALTER COLUMN password_hash DROP NOT NULL
    `);

    // Update existing Google users (password_hash = 'GOOGLE_ACCOUNT') to have auth_provider = 'google'
    await client.query(`
      UPDATE users
      SET auth_provider = 'google', password_hash = NULL
      WHERE password_hash = 'GOOGLE_ACCOUNT'
    `);

    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

module.exports = migrate;

if (require.main === module) {
  migrate().catch(() => process.exit(1));
}
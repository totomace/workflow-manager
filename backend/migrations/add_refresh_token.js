#!/usr/bin/env node
// Simple migration to add refresh_token column to users table

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
      WHERE table_name = 'users' AND column_name = 'refresh_token'
    `);

    if (checkResult.rows.length > 0) {
      console.log('✅ refresh_token column already exists');
      return;
    }

    console.log('Adding refresh_token column to users table...');

    // Add refresh_token column
    await client.query(`
      ALTER TABLE users
      ADD COLUMN refresh_token TEXT,
      ADD COLUMN refresh_token_expiry TIMESTAMP WITH TIME ZONE
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
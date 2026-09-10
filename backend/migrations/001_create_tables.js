#!/usr/bin/env node
// Initial migration to create users and tasks tables

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
    console.log('Checking if tables exist...');

    // Check if users table exists
    const usersTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'users'
      );
    `);

    if (usersTableCheck.rows[0].exists) {
      console.log('✅ users table already exists');
    } else {
      console.log('Creating users table...');
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255),
          full_name VARCHAR(100) NOT NULL,
          auth_provider VARCHAR(20) DEFAULT 'local',
          refresh_token TEXT,
          refresh_token_expiry TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('✅ users table created');
    }

    // Check if tasks table exists
    const tasksTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'tasks'
      );
    `);

    if (tasksTableCheck.rows[0].exists) {
      console.log('✅ tasks table already exists');
    } else {
      console.log('Creating tasks table...');
      await client.query(`
        CREATE TABLE tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          description TEXT,
          status VARCHAR(20) DEFAULT 'todo',
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          amount DECIMAL(12, 2) DEFAULT 0,
          task_date DATE,
          start_time TIME,
          end_time TIME,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // Create index on user_id for faster queries
      await client.query(`
        CREATE INDEX idx_tasks_user_id ON tasks(user_id);
      `);

      // Create index on status for filtering
      await client.query(`
        CREATE INDEX idx_tasks_status ON tasks(status);
      `);

      // Create index on created_at for date-based queries
      await client.query(`
        CREATE INDEX idx_tasks_created_at ON tasks(created_at);
      `);

      console.log('✅ tasks table created with indexes');
    }

    console.log('✅ Initial migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(() => process.exit(1));
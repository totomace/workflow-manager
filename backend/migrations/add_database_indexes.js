#!/usr/bin/env node
// Migration to add database indexes for performance optimization

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
    console.log('Adding database indexes for performance optimization...');

    // ==================== USERS TABLE INDEXES ====================

    // Index on refresh_token for fast token validation during refresh
    // Query: SELECT * FROM users WHERE refresh_token = $1 AND refresh_token_expiry > NOW()
    await createIndexIfNotExists(client, 'users', 'idx_users_refresh_token', 'refresh_token');

    // Index on auth_provider for filtering users by authentication provider
    // Could be useful for analytics or admin queries
    await createIndexIfNotExists(client, 'users', 'idx_users_auth_provider', 'auth_provider');

    // Composite index on (email, auth_provider) for login queries that might filter by provider
    // Note: email already has UNIQUE constraint which creates an index, but this composite
    // could help if we ever query by both columns
    // Skipping for now as email UNIQUE is sufficient

    // ==================== TASKS TABLE INDEXES ====================

    // Existing indexes from initial migration:
    // - idx_tasks_user_id (user_id)
    // - idx_tasks_status (status)
    // - idx_tasks_created_at (created_at)

    // Composite index for getAllByUser with status filter
    // Query: SELECT * FROM tasks WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC
    await createIndexIfNotExists(client, 'tasks', 'idx_tasks_user_id_status', 'user_id, status');

    // Composite index for date-range queries per user (getMoneyStats, getStatusStats)
    // Query: SELECT ... FROM tasks WHERE user_id = $1 AND created_at >= $2 AND status = 'done'
    await createIndexIfNotExists(client, 'tasks', 'idx_tasks_user_id_created_at', 'user_id, created_at');

    // Composite index for stats queries filtering by user, status, and date
    // Query: SELECT status, COUNT(*) FROM tasks WHERE user_id = $1 AND created_at >= $2 GROUP BY status
    await createIndexIfNotExists(client, 'tasks', 'idx_tasks_user_id_status_created_at', 'user_id, status, created_at');

    // Index on task_date for queries filtering by task date
    // Currently not indexed but could be useful for calendar/scheduling features
    await createIndexIfNotExists(client, 'tasks', 'idx_tasks_task_date', 'task_date');

    // Composite index for user_id + task_date for date-based task queries per user
    await createIndexIfNotExists(client, 'tasks', 'idx_tasks_user_id_task_date', 'user_id, task_date');

    // Partial index for done tasks only (for money stats queries)
    // Query: SELECT COALESCE(SUM(amount), 0) FROM tasks WHERE user_id = $1 AND status = 'done' AND created_at >= $2
    await createPartialIndexIfNotExists(client, 'tasks', 'idx_tasks_user_id_done_created_at',
      'user_id, created_at', "status = 'done'");

    console.log('✅ Database indexes migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

/**
 * Create an index if it doesn't already exist
 */
async function createIndexIfNotExists(client, tableName, indexName, columns) {
  // Check if index exists
  const checkResult = await client.query(`
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND tablename = $1 AND indexname = $2
  `, [tableName, indexName]);

  if (checkResult.rows.length > 0) {
    console.log(`✅ Index ${indexName} already exists`);
    return;
  }

  console.log(`Creating index ${indexName} on ${tableName}(${columns})...`);
  await client.query(`CREATE INDEX ${indexName} ON ${tableName} (${columns})`);
  console.log(`✅ Index ${indexName} created`);
}

/**
 * Create a partial index if it doesn't already exist
 */
async function createPartialIndexIfNotExists(client, tableName, indexName, columns, whereClause) {
  // Check if index exists
  const checkResult = await client.query(`
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND tablename = $1 AND indexname = $2
  `, [tableName, indexName]);

  if (checkResult.rows.length > 0) {
    console.log(`✅ Partial index ${indexName} already exists`);
    return;
  }

  console.log(`Creating partial index ${indexName} on ${tableName}(${columns}) WHERE ${whereClause}...`);
  await client.query(`CREATE INDEX ${indexName} ON ${tableName} (${columns}) WHERE ${whereClause}`);
  console.log(`✅ Partial index ${indexName} created`);
}

module.exports = migrate;

if (require.main === module) {
  migrate().catch(() => process.exit(1));
}
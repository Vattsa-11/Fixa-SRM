import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import 'dotenv/config';

// Use DATABASE_POOL_URL if available, otherwise fallback to DATABASE_URL
const connectionString = process.env.DATABASE_POOL_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or DATABASE_POOL_URL is missing in environment variables');
}

export const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });

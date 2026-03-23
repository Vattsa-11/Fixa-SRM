import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const pwaSubscriptions = pgTable('pwa_subscriptions', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id', { length: 255 }).notNull(), // Links to Supabase Auth User ID
  role: varchar('role', { length: 50 }).notNull(), // Student, Faculty advisor, Academic advisor, HOD
  endpoint: text('endpoint').notNull(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  deviceType: varchar('device_type', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const notificationLogs = pgTable('notification_logs', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id', { length: 255 }).notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('queued'), // queued, sent, failed
  errorReason: text('error_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

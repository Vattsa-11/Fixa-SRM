import { pool } from '../db';

export const PUSH_NOTIFICATIONS_QUEUE = 'push_notifications_queue';

/**
 * Initializes the required pgmq queues.
 * Assumes the pgmq extension is already created in the database.
 */
export const initQueues = async () => {
  const client = await pool.connect();
  try {
    // Attempt to create the pgmq extension and queue
    await client.query(`CREATE EXTENSION IF NOT EXISTS pgmq;`);
    await client.query(`SELECT pgmq.create($1);`, [PUSH_NOTIFICATIONS_QUEUE]);
    console.log(`Queue ${PUSH_NOTIFICATIONS_QUEUE} verified/created.`);
  } catch (error) {
    console.error('Error initializing pgmq queues:', error);
  } finally {
    client.release();
  }
};

export interface PushNotificationJob {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

/**
 * Enqueues a notification job to pgmq.
 */
export const enqueueNotification = async (payload: PushNotificationJob) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT * FROM pgmq.send($1, $2::jsonb);`,
      [PUSH_NOTIFICATIONS_QUEUE, JSON.stringify(payload)]
    );
    return res.rows[0].send; // message id
  } finally {
    client.release();
  }
};

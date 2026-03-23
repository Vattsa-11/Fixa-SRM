import { pool, db } from '../db';
import { pwaSubscriptions, notificationLogs } from '../db/schema';
import { PUSH_NOTIFICATIONS_QUEUE, type PushNotificationJob } from '../lib/queue';
import { sendPushNotification } from './push';
import { eq } from 'drizzle-orm';

const POLL_INTERVAL_MS = 2000;
const BATCH_SIZE = 10;
const VISIBILITY_TIMEOUT_SEC = 30; // 30 seconds to process the job before it reappears

async function processJob(message: any) {
  const msgId = message.msg_id;
  const job = message.message as PushNotificationJob;

  console.log(`Processing job ${msgId} for user ${job.userId}`);
  
  // 1. Log the notification attempt (status queued)
  const [log] = await db.insert(notificationLogs).values({
    userId: job.userId,
    title: job.title,
    body: job.body,
    status: 'processing',
  }).returning();

  if (!log) {
    console.error(`Failed to insert notification log for job ${msgId}`);
    throw new Error('Failed to create notification log');
  }

  try {
    // 2. Fetch all subscriptions for the user
    const subscriptions = await db.select().from(pwaSubscriptions).where(eq(pwaSubscriptions.userId, job.userId));
    
    if (subscriptions.length === 0) {
      console.log(`No active subscriptions found for user ${job.userId}. Marking as done.`);
      await db.update(notificationLogs).set({ status: 'sent', errorReason: 'No Subscriptions' }).where(eq(notificationLogs.id, log.id));
      return; 
    }

    // 3. Dispatch web-push payload
    const payload = {
      title: job.title,
      body: job.body,
      data: job.data || {},
    };

    const pushPromises = subscriptions.map(async (sub) => {
      try {
        await sendPushNotification(
          { endpoint: sub.endpoint, keys: { auth: sub.auth, p256dh: sub.p256dh } },
          payload
        );
      } catch (err: unknown) {
        if (err instanceof Error && err.message === 'EXPIRED_SUBSCRIPTION') {
          // Clean up dead subscription
          await db.delete(pwaSubscriptions).where(eq(pwaSubscriptions.id, sub.id));
        } else {
          throw err;
        }
      }
    });

    // Wait for all deliveries
    await Promise.allSettled(pushPromises);

    // 4. Mark job as successful
    await db.update(notificationLogs).set({ status: 'sent' }).where(eq(notificationLogs.id, log.id));
    console.log(`Successfully dispatched pushes for job ${msgId}`);
  } catch (error: unknown) {
    console.error(`Failed to process job ${msgId}:`, error);
    // Mark as failed in logs
    await db.update(notificationLogs).set({ 
      status: 'failed', 
      errorReason: error instanceof Error ? error.message : 'Unknown error' 
    }).where(eq(notificationLogs.id, log.id));
    
    throw error; // Rethrow to prevent job deletion (so pgmq can retry up to max retries)
  }
}

async function pollQueue() {
  const client = await pool.connect();
  
  try {
    // Pop jobs from queue (reads up to BATCH_SIZE jobs and sets visibility timeout)
    const res = await client.query(
      `SELECT * FROM pgmq.pop($1, $2, $3)`,
      [PUSH_NOTIFICATIONS_QUEUE, VISIBILITY_TIMEOUT_SEC, BATCH_SIZE]
    );

    const messages = res.rows;
    
    if (messages.length > 0) {
      console.log(`Received ${messages.length} background jobs.`);
      
      for (const msg of messages) {
        try {
          await processJob(msg);
          // If successful, physically delete the message from the queue
          await client.query(`SELECT pgmq.delete($1, $2::bigint)`, [PUSH_NOTIFICATIONS_QUEUE, msg.msg_id]);
        } catch (jobError) {
          // If we throw during processJob, pgmq will automatically make the message visible 
          // again after VISIBILITY_TIMEOUT_SEC. 
          // Note: Dead-letter queue (DLQ) requires pgmq v1.0.0+ archive feature, 
          // but for now, pgmq will just retry it forever or until max attempts if configured.
          console.error(`Job ${msg.msg_id} failed and will likely be retried:`, jobError);
        }
      }
    }
  } catch (error) {
    console.error('Error polling pgmq:', error);
  } finally {
    client.release();
  }

  // Schedule next poll
  setTimeout(pollQueue, POLL_INTERVAL_MS);
}

// Start worker
console.log('Starting Notification Worker...');
await pollQueue();

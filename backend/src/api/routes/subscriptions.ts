import { Hono } from 'hono';
import { db } from '../../db';
import { pwaSubscriptions } from '../../db/schema';
import { enqueueNotification } from '../../lib/queue';

import type { User } from '@supabase/supabase-js';

const app = new Hono<{ Variables: { user: User } }>();

interface SubscriptionBody {
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    }
  };
  role?: string;
  deviceType?: string;
}

// Save a PWA subscription for a user
app.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json<SubscriptionBody>();

  const { subscription, role, deviceType } = body;

  try {
    await db.insert(pwaSubscriptions).values({
      userId: user.id,
      role: role || 'Student', // Default or derived from auth context
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      deviceType: deviceType,
    });

    return c.json({ success: true, message: 'Subscription saved' });
  } catch (err) {
    console.error('Subscription Insert Error', err);
    return c.json({ error: 'Failed to save subscription' }, 500);
  }
});

// Enqueue a test push notification for this user
app.post('/test-push', async (c) => {
  const user = c.get('user');
  const { title, body } = await c.req.json();

  try {
    const messageId = await enqueueNotification({
      userId: user.id,
      title: title || 'Test Notification',
      body: body || 'This is a test notification from the Fixa-SRM backend.',
    });

    return c.json({ success: true, messageId });
  } catch (err) {
    console.error('Failed to enqueue notification:', err);
    return c.json({ error: 'Failed to enqueue notification' }, 500);
  }
});

export default app;

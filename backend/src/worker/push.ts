import webPush from 'web-push';
import 'dotenv/config';

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY || !process.env.VAPID_SUBJECT) {
  throw new Error('VAPID keys must be set in the environment variables');
}

webPush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export interface PushSubscriptionDetails {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const sendPushNotification = async (
  subscription: PushSubscriptionDetails,
  payload: Record<string, unknown>
): Promise<void> => {
  try {
    const payloadString = JSON.stringify(payload);
    await webPush.sendNotification(subscription, payloadString);
  } catch (error) {
    if (error instanceof webPush.WebPushError && error.statusCode === 410) {
      // 410 Gone means the subscription is no longer active.
      console.log('Subscription has expired or is no longer valid: ', error.endpoint);
      // It's the worker's responsibility to delete this subscription from the database.
      throw new Error('EXPIRED_SUBSCRIPTION');
    } else {
      console.error('Error sending push notification', error);
      throw error;
    }
  }
};

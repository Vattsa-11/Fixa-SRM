import { supabase } from '../lib/supabase';
import 'dotenv/config';

// For this example, we'll listen to any inserts into "notification_logs".
// In a real app, you might listen to "appointments", "messages", etc.
const setupRealtimeListener = () => {
  const channel = supabase
    .channel('db-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'notification_logs' },
      // Note: You must enable Realtime for this table in your Supabase Dashboard
      (payload) => {
        console.log('Postgres Change Capture (CDC) Event received:', payload);
        
        // This is where the Webhook Listener processes the live update.
        // It could trigger a websocket push to active clients using Hono's websocket,
        // or trigger an API call to another service.
        
        switch (payload.eventType) {
          case 'INSERT':
            console.log('New notification logged:', payload.new);
            break;
          case 'UPDATE':
            console.log('Notification log updated:', payload.new);
            break;
          case 'DELETE':
            console.log('Notification log deleted:', payload.old);
            break;
        }
      }
    )
    .subscribe((status, err) => {
      if (err) {
        console.error('Supabase Realtime subscription error:', err);
      } else {
        console.log('Supabase Realtime CDC subscription status:', status);
      }
    });

  return channel;
};

console.log('Starting Supabase Realtime Listener...');
setupRealtimeListener();

// Keep process alive
setInterval(() => {}, 1000 * 60 * 60);

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import subscriptionsRouter from './routes/subscriptions';
import { authGuard } from './middleware/auth';
import { initQueues } from '../lib/queue';

const app = new Hono();

// Global Middlewares
app.use('*', logger());
app.use('*', cors({
  origin: '*', // Customize for production Nginx Gateway setup
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Setup routes
app.get('/health', (c) => c.json({ status: 'ok', service: 'Fixa-SRM API' }));

// Protected routes (Supabase Auth Guard)
app.use('/api/*', authGuard);

// Route modules
app.route('/api/subscriptions', subscriptionsRouter);

// Database initialization
await initQueues();
console.log('Queues initialized.');

export default app;

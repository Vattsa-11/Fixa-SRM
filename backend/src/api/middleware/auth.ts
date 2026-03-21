import type { Context, Next } from 'hono';
import { supabase } from '../lib/supabase';
import { valkey, connectValkey } from '../lib/valkey';

export const authGuard = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid Authorization header' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    await connectValkey();
    
    // 1. Check Valkey Cache
    const cachedUser = await valkey.get(`auth:${token}`);
    if (cachedUser) {
      c.set('user', JSON.parse(cachedUser));
      return await next();
    }

    // 2. Fallback to Supabase Auth Check (Circuit Breaker logic can be added here)
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return c.json({ error: 'Unauthorized', details: error?.message }, 401);
    }

    // 3. Cache the valid token in Valkey for 1 hour (PX = 3600000 ms)
    await valkey.set(`auth:${token}`, JSON.stringify(user), {
      PX: 3600000,
      NX: true,
    });

    c.set('user', user);
    await next();
  } catch (error) {
    console.error('Auth Guard Error:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
};

import { createClient } from 'valkey';
import 'dotenv/config';

export const valkey = createClient({
  url: process.env.VALKEY_URL || 'redis://localhost:6379',
});

valkey.on('error', (err: unknown) => console.log('Valkey Client Error', err));

let isConnected = false;

export const connectValkey = async () => {
  if (!isConnected) {
    await valkey.connect();
    isConnected = true;
  }
};

# Fixa

Fixa is an appointment booking application for SRM IST Kattankulathur. It allows students, faculty advisors, academic advisors, and heads of departments to schedule and manage meetings.

## Architecture overview

The application uses a Svelte frontend wrapped in Capacitor for mobile deployment. All client traffic passes through an Nginx gateway. Nginx handles load balancing, cross-origin resource sharing, and rate limit headers.

The core backend runs on Hono and Bun. These services handle business logic and data validation using Zod. Supabase Auth manages user authentication. The Hono backend verifies JSON Web Tokens from the client to determine user roles and permissions.

## Data and concurrency

Postgres serves as the primary database. Write operations and row-level security queries route through PgBouncer for connection pooling. A read replica supports heavier queries, such as analytics for department heads. Supabase Realtime monitors database changes and pushes live updates to the Svelte user interface.

Booking appointments requires strict concurrency control to prevent double-booking. The system uses Valkey for distributed locking using SET NX PX commands. Valkey also manages the least-recently-used cache and application-level rate limits.

## Background jobs and notifications

A dedicated Bun background worker processes asynchronous tasks. It reads from pgmq, a Postgres-native queue. 

The queue architecture includes visibility timeouts and automatic retries. If a task fails five times, it moves to an exponential backoff queue. Persistent failures resolve to a dead-letter queue for manual review.

The background worker also handles push notifications. It sends webhook requests to Firebase Cloud Messaging, which delivers the payload to the Capacitor push plugins on student devices. Valkey stores retry data for failed webhook deliveries.

## Tech stack

* Frontend: Svelte, Capacitor
* Gateway: Nginx
* API: Hono, Bun
* Authentication: Supabase Auth
* Database: Postgres (Primary and Replica), PgBouncer
* Realtime: Supabase Realtime
* Cache & Locking: Valkey
* Queue: pgmq
* Notifications: Supabase Real time To svelte ui using Webhook 
* Refer the [architecture](https://github.com/Vattsa-11/Fixa-SRM/blob/main/architecture.png)
***
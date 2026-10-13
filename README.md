# IPO Informer

Next.js app that emails subscribers when a new ordinary-share IPO opens on NepaliPaisa.

- `/` — subscribe form (double opt-in via confirmation email)
- `/api/subscribe` — POST `{ email }`, rate-limited per IP, sends a confirmation email
- `/api/confirm` — confirms a pending subscription via token
- `/api/unsubscribe` — removes a subscriber via token
- `/api/send-mail` — Vercel cron target, protected by `CRON_SECRET`, emails all confirmed subscribers

Subscribers are stored in Postgres (Neon) via Prisma — see `prisma/schema.prisma`.

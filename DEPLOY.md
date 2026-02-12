# DEPLOY

## 1. Overview

Neuroforge is the Phase 1 MVP web application.

- Web-first Next.js application
- TypeScript codebase
- Current runtime persistence uses in-memory repositories (non-production)

## 2. Environment Variables

Required:
- `SESSION_SECRET`: Secret used for session cookie handling.
- `APP_URL`: Public base URL used for auth/magic-link generation.

Optional:
- `OPENAI_API_KEY`: Enables live assistant responses via provider API.

Defined but not yet required at runtime:
- `DATABASE_URL`: Reserved for upcoming DB-backed persistence (Prisma/PostgreSQL wiring phase).

## 3. Install & Build

```bash
npm install
npm run build
npm start
```

## 4. Health Check

Endpoint:
- `GET /api/health`

Expected response shape:

```json
{
  "status": "ok",
  "service": "neuroforge",
  "time": "2026-02-12T00:00:00.000Z"
}
```

## 5. Demo Setup

Run:

```bash
npm run seed:demo
```

This creates a demo user and sample in-memory data set:
- demo user + profile
- protocol enrollment
- daily tasks with completed items
- sample check-ins
- sample assistant conversation messages

## 6. Current MVP Limitations

- Runtime data layer is in-memory repositories.
- Magic link auth is not connected to a production email provider.
- Current architecture is not horizontally scalable yet.

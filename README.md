# Neuroforge

Neuroforge is a protocol-based focus and nervous system regulation trainer web app. It helps users execute structured daily tasks, track basic regulation/focus signals, and receive constrained AI guidance aligned to static behavioral protocols.

## Tech Stack

- Next.js (App Router)
- TypeScript
- In-memory repositories for current runtime persistence
- Prisma schema/migrations prepared for PostgreSQL-backed persistence
- Magic link authentication (MVP flow)

## Local Setup

### Node Version

- Recommended: Node.js 22.x LTS (or newer Node version compatible with Next.js 15 and current toolchain)

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create `.env` from `.env.example` and set required values.

```bash
cp .env.example .env
```

Required for runtime:
- `SESSION_SECRET`
- `APP_URL`

Optional for current runtime:
- `OPENAI_API_KEY` (enables live assistant model responses)

Defined but not yet required for current runtime:
- `DATABASE_URL` (Prisma/PostgreSQL wiring is prepared; runtime currently uses in-memory adapters)

### Run Dev Server

```bash
npm run dev
```

### Run Typecheck

```bash
npm run typecheck
```

### Run Tests

```bash
npm test
```

## Environment Variables Reference

- `SESSION_SECRET`: Secret used for session cookie handling.
- `APP_URL`: Base app URL used in auth link generation (e.g. `http://localhost:3000`).
- `OPENAI_API_KEY`: Optional API key for provider-backed assistant responses.
- `DATABASE_URL`: Postgres connection string reserved for DB-backed persistence phase.

## Scripts

- `npm run dev`: Start local development server.
- `npm run build`: Build production bundle.
- `npm run start`: Start production server from built output.
- `npm run typecheck`: Run TypeScript type checking.
- `npm test`: Run unit + integration tests with Node test runner.

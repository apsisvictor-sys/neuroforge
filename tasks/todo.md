# Task Plan

## Plan
- [x] Finalize simplified Phase 1 architecture boundaries (UI, domain entities, protocol engine, AI provider layer, persistence)
- [x] Establish web-first Next.js TypeScript baseline with modular folder structure
- [x] Implement MVP auth/profile/onboarding flow (non-medical, magic link)
- [x] Implement static protocol engine + daily task loop + phase progression
- [x] Implement basic tracking metrics (completion ratio, streak, focus/calm/energy history)
- [x] Implement constrained Neuroforge assistant via provider-agnostic AI layer
- [x] Add protocol explanations and educational content pages
- [x] Add essential unit tests and lightweight hardening for MVP release

## Tasks
- [x] Foundation: app scaffold, simple `.env` presence checks, lint/typecheck baseline
- [x] Persistence: DB schema, migrations, simple repository adapters
- [x] Auth: magic link sign-in, session handling, protected routes
- [x] Profile: profile CRUD + onboarding questionnaire storage
- [x] Protocol: static protocol schema + seeded templates
- [x] Protocol Engine: day/phase resolution + task materialization
- [x] Today API/UI: fetch tasks, server-confirmed completion toggles
- [x] Progress Metrics: inline completion ratio (`completed/total`) + streak service
- [x] Tracking API/UI: daily focus/calm/energy slider submission + history
- [x] Content: protocol explanations + educational pages
- [x] AI Layer: `LLMProvider` interface + OpenAI adapter + assistant service
- [x] AI Guardrails: fixed Neuroforge system prompt with non-medical/no-adaptation constraints
- [x] Assistant UI: chat thread view + send/reply handling
- [x] Testing: unit tests for core domain/protocol/assistant logic only
- [x] Testing: add unit tests for shared validation helpers (`src/lib/validate.ts`)
- [x] Hardening: simple app/API logging and error boundaries
- [x] Release: MVP QA checklist and deployment config
- [x] Validation: add shared API input helper and apply it to onboarding, tracking daily, and assistant message routes

## Next Iteration Tasks
- [x] Add sign-out endpoint and UI action: Implement session clear API and expose a sign-out control in top navigation.
- [x] Add server-side auth gate for protected routes: Redirect unauthenticated requests for `/today`, `/tracking`, `/assistant`, `/profile`, and `/protocol` to `/auth/sign-in`.
- [x] Add minimal client session awareness: Show auth-aware nav state (signed in/signed out) using a lightweight session check endpoint.
- [x] Add reusable page feedback banner: Standardize success/error/info message rendering across sign-in, verify, today, tracking, assistant, and profile pages.
- [x] Add active navigation highlighting: Highlight the current route in header navigation for faster orientation.
- [x] Add protocol templates list endpoint: Expose `GET /api/protocol/templates` returning all static protocol templates.
- [x] Add tracking history limit query support: Accept `limit` query param on `GET /api/tracking/history` with safe default/max for last-N days.
- [x] Add anti-replay token for critical POSTs: Add one-time request token flow and enforce it on task toggle, tracking daily check-in, and assistant message endpoints.
- [x] Add UI integration happy-path tests: Add minimal render/interaction tests for core pages without expanding beyond Phase 1 scope.

## Run & Ship Readiness
- [x] Fix typecheck by ensuring TypeScript is installed and test/type scripts run clean
- [x] Add README section: local setup and run instructions
- [x] Add demo seed script to create demo user + enrollment + tasks
- [x] Add /api/health endpoint returning { status: "ok" }
- [x] Add minimal request logging middleware for API routes
- [x] Add simple deployment notes for Vercel and Node hosting

---

## Review
- [x] Architecture reviewed against non-goals (no adaptive AI, no medical/supplement logic, no jobs/schedulers)
- [x] Simplicity check: removed DTO/mappers/value-objects/domain-services/view-model/scoring layers
- [x] Security/privacy baseline verified for auth + user data handling
- [x] Summary of delivered MVP changes
- [x] Known limitations and Phase 2 handoff notes

### Summary
- Implemented a web-first Next.js TypeScript MVP scaffold with modular `app` and `src` boundaries.
- Added domain entities and repository interfaces for users, protocols, tracking, auth, and assistant conversations.
- Implemented static protocol engine (phase/day resolution, task materialization, inline completion ratio, streak updates).
- Added magic-link auth endpoints, session cookie handling, profile/onboarding APIs, and protected route checks.
- Added Today, Tracking, Assistant, Protocol, Content, and Profile pages with server-confirmed interactions.
- Added provider-agnostic AI layer (`LLMProvider`) with OpenAI adapter and fixed non-medical/no-adaptation system prompt.
- Added simple logging utilities, error boundary UI, `.env` presence check, Prisma schema, and initial SQL migration.
- Added unit tests for progression metrics/day math/check-in validation.

### Known Limitations
- Persistence is currently in-memory for runtime behavior; Prisma schema/migration is prepared but DB adapter wiring is deferred.
- Magic-link delivery is dev-mode (link logged/returned) and not connected to an email provider.
- AI provider defaults to fallback messaging when `OPENAI_API_KEY` is missing.
- No integration/e2e tests in Phase 1 by design.

## Master Roadmap Added
- [ ] Created `MASTER_ROADMAP_TODO.md` with full long-term application build roadmap

## Architecture Docs
- [ ] Added repository and dependency-injection architecture document (`ARCHITECTURE_REPOSITORY_DI.md`)

## Phase 1.2
- [x] Implement PrismaUserRepository adapter
- [x] Implement PrismaAuthRepository adapter
- [x] Implement PrismaTrackingRepository adapter
- [x] Implement PrismaConversationRepository adapter
- [x] Implement PrismaProtocolRepository adapter
- [x] Swap DI bindings to Prisma repositories
- [x] Add Prisma integration parity tests
- [x] Add protocol catalog metadata endpoint
- [x] Add protocol selector UI page
- [x] Add protocol detail read-only page

## Phase 1.3
- [x] Add protocol enrollment action from detail page
- [x] Add enrollment status CTA logic on protocol page
- [x] Add today page protocol context display
- [x] Enrich protocol catalog card preview metadata

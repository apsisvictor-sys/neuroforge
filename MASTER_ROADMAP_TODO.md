# Master Application Build Roadmap

This file defines the full product and architecture evolution plan from MVP backbone to platform-scale system. Items are not automatically in scope — they are activated phase by phase only.

---

## Phase 1 — MVP to Product-Grade Application

### Phase 1.1 — UX Stabilization Layer

Goal: Make MVP comfortable, low-friction, and demo-ready without architecture changes.

- [ ] Add loading states for all async pages and panels
- [ ] Add empty states for lists and dashboards
- [ ] Standardize feedback banners across all pages
- [ ] Add inline form validation messages
- [ ] Add assistant typing indicator
- [ ] Add lightweight task completion animations
- [ ] Improve onboarding clarity and step guidance
- [ ] Add consistent button disabled/loading behavior

No schema or architecture changes allowed in this phase.

---

### Phase 1.2 — Persistence Swap (In-Memory to Database)

Goal: Replace in-memory repositories with database-backed repositories safely.

- [ ] Implement Prisma repository adapters
- [ ] Keep repository interfaces unchanged
- [ ] Swap dependency injection binding only
- [ ] Add database migration command
- [ ] Add database seed script version
- [ ] Add transaction safety where needed
- [ ] Add unique constraints at DB layer
- [ ] Verify parity with in-memory behavior

No domain model changes allowed.

---

### Phase 1.3 — Protocol System Expansion

Goal: Expand from single protocol to protocol catalog system.

- [ ] Add protocol catalog registry
- [ ] Add protocol metadata schema
- [ ] Add protocol version field enforcement
- [ ] Add protocol selector UI
- [ ] Add protocol preview screen
- [ ] Add protocol explanation screens
- [ ] Add protocol metadata endpoint
- [ ] Support multiple static protocol templates

Protocols remain static and deterministic.

---

### Phase 1.4 — Assistant Capability Upgrade (Guarded)

Goal: Improve assistant usefulness without autonomy.

- [ ] Add richer context packaging
- [ ] Add protocol-aware prompts
- [ ] Add streak-aware encouragement logic
- [ ] Add task-aware suggestions
- [ ] Add structured reply modes
- [ ] Add refusal templates
- [ ] Add escalation guidance responses
- [ ] Expand safety guardrail templates

No protocol mutation allowed.

---

### Phase 1.5 — Authentication and Email Productionization

Goal: Replace development auth plumbing with production-safe auth.

- [ ] Add real email provider adapter
- [ ] Implement real magic-link delivery
- [ ] Add token hashing
- [ ] Add signed tokens
- [ ] Enforce token expiry checks
- [ ] Add session rotation
- [ ] Add device session tracking
- [ ] Add revoke-all-sessions endpoint

---

## Phase 2 — Production Readiness and Reliability

### Phase 2.1 — Observability Layer

- [ ] Add structured logging format
- [ ] Add request IDs
- [ ] Add tracing IDs
- [ ] Add error classification
- [ ] Add slow request detection
- [ ] Add metrics dashboard hooks

---

### Phase 2.2 — Performance Layer

- [ ] Add read-path caching
- [ ] Memoize protocol definitions
- [ ] Add assistant context cache
- [ ] Add database index tuning
- [ ] Add pagination to list endpoints
- [ ] Add query optimization passes

---

### Phase 2.3 — Background Jobs Layer

- [ ] Add job queue system
- [ ] Move email sending to jobs
- [ ] Add assistant summarization jobs
- [ ] Add analytics aggregation jobs
- [ ] Add streak recompute jobs
- [ ] Add retry policies

---

### Phase 2.4 — Security Hardening

- [ ] Add CSRF protection
- [ ] Add rate limiting
- [ ] Add abuse detection rules
- [ ] Add audit log system
- [ ] Add admin action logging
- [ ] Add permission model

---

### Phase 2.5 — Deployment and Infrastructure

- [ ] Add staging environment
- [ ] Add preview deploys
- [ ] Add CI pipeline
- [ ] Add automated CI tests
- [ ] Add migration safety checks
- [ ] Add rollback scripts

---

## Phase 3 — Intelligence and Personalization

### Phase 3.1 — Behavioral Analytics Engine

- [ ] Add task completion analytics
- [ ] Add streak pattern analytics
- [ ] Add drop-off detection
- [ ] Add protocol friction metrics
- [ ] Add assistant usage metrics

---

### Phase 3.2 — Adaptive Protocol Engine (Rule-Based)

- [ ] Add rule-based protocol adjustments
- [ ] Add load scaling rules
- [ ] Add task difficulty modulation
- [ ] Add recovery day insertion rules
- [ ] Add protocol branching logic

---

### Phase 3.3 — AI-Assisted Adaptation (Guarded)

- [ ] Add protocol tweak suggestion layer
- [ ] Add explainable adaptation proposals
- [ ] Add human approval workflow
- [ ] Prevent silent protocol mutation

---

### Phase 3.4 — Personalization Models

- [ ] Add user state model
- [ ] Add fatigue index
- [ ] Add compliance score
- [ ] Add resilience score
- [ ] Add adaptation thresholds

---

## Phase 4 — Platform and Ecosystem

### Phase 4.1 — Multi-Protocol Marketplace

- [ ] Add protocol author tools
- [ ] Add protocol publishing flow
- [ ] Add protocol version control
- [ ] Add protocol templates
- [ ] Add protocol marketplace UI

---

### Phase 4.2 — Creator and Coach Layer

- [ ] Add coach dashboards
- [ ] Add client group management
- [ ] Add shared protocols
- [ ] Add coach notes
- [ ] Add progress views

---

### Phase 4.3 — Mobile Native Clients

- [ ] Build mobile client
- [ ] Add offline mode
- [ ] Add sync engine
- [ ] Add push notifications

---

### Phase 4.4 — Device and Sensor Integration

- [ ] Add wearable integrations
- [ ] Add sleep metrics ingestion
- [ ] Add HRV feeds
- [ ] Add activity feeds
- [ ] Add passive signal ingestion

---

## Phase 5 — Advanced Automation and Moat

### Phase 5.1 — Closed-Loop Optimization

- [ ] Add outcome feedback loop
- [ ] Add predictive overload detection
- [ ] Add proactive recovery injection

---

### Phase 5.2 — AI Multi-Agent Layer

- [ ] Add protocol agent
- [ ] Add behavior agent
- [ ] Add recovery agent
- [ ] Add planning agent
- [ ] Add assistant coordinator

---

### Phase 5.3 — Knowledge Graph Layer

- [ ] Build user behavior graph
- [ ] Build protocol effectiveness graph
- [ ] Build intervention graph
- [ ] Add outcome mapping

---

### Phase 5.4 — Enterprise Layer

- [ ] Add organization accounts
- [ ] Add team dashboards
- [ ] Add compliance exports
- [ ] Add admin controls
- [ ] Add SSO support

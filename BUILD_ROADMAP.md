# BUILD_ROADMAP

This document is the long-term architecture and feature memory for Neuroforge. It tracks what is implemented in Phase 1 and what is intentionally deferred for later phases.

## 1) Phase 1 — MVP (already implemented)

### Implemented foundation
- Web-first Next.js + TypeScript application scaffold.
- Modular structure with separated domain entities, use-cases, protocol engine, AI provider abstraction, and infrastructure folders.
- Magic-link authentication flow (dev-mode link generation + verify endpoint + session cookie).
- Profile and non-medical onboarding questionnaire storage.
- Static protocol templates and deterministic day/phase progression.
- Daily task checklist with server-confirmed completion toggles.
- Basic progress metrics: completion ratio (`completed/total`) and streak tracking.
- Daily self-report tracking for focus/calm/energy with historical retrieval.
- Constrained Neuroforge assistant with fixed system prompt and provider abstraction (`LLMProvider`).
- Protocol explanation and educational content pages.
- Simple logging and UI error boundary.
- Unit tests for core progression/metrics and validation logic.

### Intentionally deferred from Phase 1 MVP
- Adaptive protocol engine and autonomous protocol changes.
- AI personalization logic and user state modeling.
- Vector knowledge base / RAG.
- Coaching layer and advanced analytics.
- Wearables, biometrics, diagnosis/treatment, therapy, medication/drug logic.
- Supplement stack logic and recommendations.
- Background jobs/schedulers.
- Integration/E2E test suites (unit tests only in Phase 1).

---

## 2) Phase 2 — Post-MVP Stability & Security

### Security hardening postponed
- CSRF/anti-replay protection for critical POST endpoints.
- Session lifecycle hardening (explicit sign-out invalidation, rotation, revocation strategy).
- Production-grade magic-link delivery (email provider integration, abuse controls).
- Auth event logging/auditing and suspicious activity detection.
- Stricter cookie and security header policy review.
- Input validation tightening across API boundaries.

### Infrastructure upgrades postponed
- Replace runtime in-memory repositories with fully wired PostgreSQL adapters.
- Run and enforce DB migrations in deployment workflow.
- Add CI pipeline for lint/typecheck/tests.
- Add production observability (centralized logs, error monitoring, uptime checks).
- Introduce reliable environment management and secret handling policy.

### Product stability tasks
- Complete missing UI auth/session flows (auth-aware nav, protected route UX consistency).
- Improve user feedback consistency for success/error/info states across pages.
- Add API pagination/limits consistency (including tracking history query limits).
- Add baseline UI integration happy-path tests.

---

## 3) Phase 3 — Intelligence & Personalization

### AI capability upgrades postponed
- Provider routing/failover strategy and model selection policy.
- Persistent conversation quality controls and prompt/version management.
- Optional retrieval layer (RAG) using approved Neuroforge content corpus.
- Richer context assembly (recent completion patterns + check-in trends).

### Advanced protocol adaptation postponed
- Protocol parameter tuning based on behavior history.
- Adaptive phase pacing and task intensity adjustments.
- Rule-based safety constraints for any future adaptation layer.
- Explainable adaptation logs (why a parameter changed) for trust and debugging.

### Analytics postponed
- User-level and cohort-level protocol adherence analytics.
- Longitudinal behavior trend dashboards.
- Outcome instrumentation for protocol iteration.

---

## 4) Phase 4 — Mobile App Layer

### Mobile layer postponed
- React Native mobile client sharing core domain/protocol logic.
- Mobile auth/session UX parity with web.
- Mobile today loop, tracking, and assistant experiences.
- Mobile-first navigation and offline-aware UX where feasible.
- App distribution/deployment pipelines and release process.

---

## 5) Phase 5 — Advanced Neuroforge Systems

### Supplement stack module postponed
- Structured supplement catalog and data model.
- Safety-first supplement education content (non-medical framing).
- User supplement tracking workflows.
- Any recommendation logic only after policy and safety framework approval.

### Advanced Neuroforge systems postponed
- Multi-layer state modeling for regulation, focus capacity, and execution stability.
- Coaching layer with scoped protocol support workflows.
- Scenario-aware protocol orchestration across longer training cycles.
- Advanced experimentation framework for protocol variants.
- Enterprise-grade auditability and governance for AI-assisted decisions.

---

## Scope guardrails (applies to all phases)
- Neuroforge is not a medical app and does not provide diagnosis or treatment.
- Behavioral protocol guidance remains the core product boundary.
- New complexity should be introduced only when it is required by validated product needs.

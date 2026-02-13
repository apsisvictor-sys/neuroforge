PROJECT: Neuroforge App

CURRENT PHASE
Phase 1.3 — Protocol System Expansion (UI + catalog slices)

LAST COMPLETED SLICES
- Protocol catalog endpoint
- Protocol selector UI
- Protocol detail page
- Enrollment endpoint (/api/protocol/enroll)
- Enrollment CTA + status logic
- Today page protocol context
- Catalog card preview enrichment
- Seed script type narrowing (partial repo typing)

NEXT TASK
Protocol detail phase expand/collapse UI (UI only)

ARCHITECTURE GUARDRAILS
- Persistence logic must not drift
- Repository interfaces cannot change without explicit approval
- Repository adapters cannot change outside persistence phases
- API routes are protected surface — UI slices cannot modify them
- UI must call API, never repositories or prisma
- Domain entities additive-only changes allowed
- No schema or migration changes in this phase
- DI wiring cannot change
- No protocol engine behavior changes

LAYER RULES
UI → API → Repository → Adapter → DB
Never bypass layers.

TEST RULE
Tests must follow same layer entry as production unless explicitly unit-testing a lower layer.

SEED SCRIPTS
Seed/demo scripts may use partial repository typing — do not expand them to match full interfaces.

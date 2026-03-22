import test from "node:test";
import assert from "node:assert/strict";
import { evaluateAdaptationRules } from "../../src/application/use-cases/evaluate-adaptation-rules.ts";
import { resolveAdaptationProposal } from "../../src/application/use-cases/resolve-adaptation-proposal.ts";
import { InMemoryAdaptationRepository } from "../../src/infrastructure/db/repositories/in-memory-adaptation-repository.ts";
import type { UserState } from "../../src/domain/entities/user-state.ts";
import type { DailyCheckin } from "../../src/domain/entities/tracking.ts";
import type { DailyCompletionSummary } from "../../src/domain/entities/protocol.ts";

const USER_ID = "user-integration-1";

function makeUserState(overrides: Partial<UserState> = {}): UserState {
  return {
    userId: USER_ID,
    computedAt: "2026-03-22T00:00:00.000Z",
    nervousSystemType: null,
    fatigueIndex: 0.3,
    complianceScore: 20, // triggers compliance-difficulty-reduction
    resilienceScore: 1.0,
    overstimulationFlag: false,
    improvementTrend: "stable",
    ...overrides
  };
}

function makeCheckin(dayKey: string, energy: number): DailyCheckin {
  return {
    id: `ci-${dayKey}`,
    userId: USER_ID,
    dayKey,
    focus: 3,
    calm: 3,
    energy,
    note: null,
    createdAt: new Date().toISOString()
  };
}

function makeSummary(dayKey: string, completed: number, total: number): DailyCompletionSummary {
  return {
    dayKey,
    completedCount: completed,
    totalCount: total,
    completionScore: total > 0 ? completed / total : 0
  };
}

let idCounter = 0;
function generateId() {
  return `proposal-${++idCounter}`;
}

// Stub repositories for integration tests
function makeStubTrackingRepo(checkins: DailyCheckin[]) {
  return {
    getHistory: async (_userId: string, _days: number) => checkins,
    saveCheckin: async () => {},
    getByDayKey: async () => null
  } as any;
}

function makeStubProtocolRepo(summaries: DailyCompletionSummary[]) {
  return {
    getDailyCompletionSummaries: async (_userId: string, _days: number) => summaries,
    getActiveEnrollment: async () => null,
    listTemplates: async () => [],
    listTemplateCatalog: async () => [],
    getTemplateById: async () => null,
    getTemplateBySlug: async () => null,
    enroll: async () => ({}),
    listDailyTasks: async () => [],
    replaceDailyTasks: async () => {},
    toggleTask: async () => null,
    getStreak: async () => ({ userId: USER_ID, currentStreak: 0, lastQualifiedDayKey: null }),
    saveStreak: async () => {}
  } as any;
}

function makeStubUserStateRepo(state: UserState | null) {
  return {
    getState: async (_userId: string) => state,
    saveState: async () => {}
  } as any;
}

// ─── Test: evaluate creates proposals for triggered rules ──────────────────

test("evaluate: creates proposals for triggered rules", async () => {
  const adaptationRepo = new InMemoryAdaptationRepository();
  const state = makeUserState({ complianceScore: 20 }); // triggers compliance rule

  const newProposals = await evaluateAdaptationRules({
    userId: USER_ID,
    trackingRepository: makeStubTrackingRepo([]),
    protocolRepository: makeStubProtocolRepo([]),
    userStateRepository: makeStubUserStateRepo(state),
    adaptationRepository: adaptationRepo,
    generateId,
    today: new Date("2026-03-22")
  });

  assert.ok(newProposals.length >= 1);
  const complianceProposal = newProposals.find((p) => p.ruleId === "compliance-difficulty-reduction");
  assert.ok(complianceProposal, "expected compliance-difficulty-reduction proposal");
  assert.equal(complianceProposal.status, "proposed");
  assert.equal(complianceProposal.userId, USER_ID);
  assert.ok(complianceProposal.reasoning.length > 0);
  assert.equal(complianceProposal.resolvedAt, null);
});

test("evaluate: does not create duplicate proposals for same rule", async () => {
  const adaptationRepo = new InMemoryAdaptationRepository();
  const state = makeUserState({ complianceScore: 20 });

  // First evaluation
  const first = await evaluateAdaptationRules({
    userId: USER_ID,
    trackingRepository: makeStubTrackingRepo([]),
    protocolRepository: makeStubProtocolRepo([]),
    userStateRepository: makeStubUserStateRepo(state),
    adaptationRepository: adaptationRepo,
    generateId,
    today: new Date("2026-03-22")
  });

  // Second evaluation — same conditions
  const second = await evaluateAdaptationRules({
    userId: USER_ID,
    trackingRepository: makeStubTrackingRepo([]),
    protocolRepository: makeStubProtocolRepo([]),
    userStateRepository: makeStubUserStateRepo(state),
    adaptationRepository: adaptationRepo,
    generateId,
    today: new Date("2026-03-22")
  });

  // No new proposals on second run (dedup)
  assert.equal(second.length, 0);

  // Total stored proposals unchanged
  const all = await adaptationRepo.getProposals(USER_ID);
  assert.equal(all.length, first.length);
});

test("evaluate: returns empty when no rules trigger", async () => {
  const adaptationRepo = new InMemoryAdaptationRepository();
  const state = makeUserState({ complianceScore: 80, overstimulationFlag: false });

  const newProposals = await evaluateAdaptationRules({
    userId: USER_ID,
    trackingRepository: makeStubTrackingRepo([
      makeCheckin("2026-03-22", 8),
      makeCheckin("2026-03-21", 8),
      makeCheckin("2026-03-20", 8)
    ]),
    protocolRepository: makeStubProtocolRepo([]),
    userStateRepository: makeStubUserStateRepo(state),
    adaptationRepository: adaptationRepo,
    generateId,
    today: new Date("2026-03-22")
  });

  assert.equal(newProposals.length, 0);
});

test("evaluate: returns empty when user has no state", async () => {
  const adaptationRepo = new InMemoryAdaptationRepository();

  const newProposals = await evaluateAdaptationRules({
    userId: USER_ID,
    trackingRepository: makeStubTrackingRepo([]),
    protocolRepository: makeStubProtocolRepo([]),
    userStateRepository: makeStubUserStateRepo(null),
    adaptationRepository: adaptationRepo,
    generateId,
    today: new Date("2026-03-22")
  });

  assert.equal(newProposals.length, 0);
});

// ─── Test: accept a proposal ───────────────────────────────────────────────

test("accept: marks proposal as accepted", async () => {
  const adaptationRepo = new InMemoryAdaptationRepository();
  const state = makeUserState({ complianceScore: 20 });

  const proposals = await evaluateAdaptationRules({
    userId: USER_ID,
    trackingRepository: makeStubTrackingRepo([]),
    protocolRepository: makeStubProtocolRepo([]),
    userStateRepository: makeStubUserStateRepo(state),
    adaptationRepository: adaptationRepo,
    generateId,
    today: new Date("2026-03-22")
  });

  const proposal = proposals[0];
  assert.ok(proposal);

  const resolved = await resolveAdaptationProposal({
    proposalId: proposal.id,
    userId: USER_ID,
    resolution: "accepted",
    adaptationRepository: adaptationRepo
  });

  assert.ok(resolved);
  assert.equal(resolved.status, "accepted");
  assert.ok(resolved.resolvedAt !== null);

  const stored = await adaptationRepo.getProposalById(proposal.id);
  assert.equal(stored?.status, "accepted");
});

// ─── Test: reject a proposal ───────────────────────────────────────────────

test("reject: marks proposal as rejected", async () => {
  const adaptationRepo = new InMemoryAdaptationRepository();
  const state = makeUserState({ complianceScore: 20 });

  const proposals = await evaluateAdaptationRules({
    userId: USER_ID,
    trackingRepository: makeStubTrackingRepo([]),
    protocolRepository: makeStubProtocolRepo([]),
    userStateRepository: makeStubUserStateRepo(state),
    adaptationRepository: adaptationRepo,
    generateId,
    today: new Date("2026-03-22")
  });

  const proposal = proposals[0];
  assert.ok(proposal);

  const resolved = await resolveAdaptationProposal({
    proposalId: proposal.id,
    userId: USER_ID,
    resolution: "rejected",
    adaptationRepository: adaptationRepo
  });

  assert.ok(resolved);
  assert.equal(resolved.status, "rejected");
  assert.ok(resolved.resolvedAt !== null);
});

test("reject: cannot reject a proposal from another user", async () => {
  const adaptationRepo = new InMemoryAdaptationRepository();
  const state = makeUserState({ complianceScore: 20 });

  const proposals = await evaluateAdaptationRules({
    userId: USER_ID,
    trackingRepository: makeStubTrackingRepo([]),
    protocolRepository: makeStubProtocolRepo([]),
    userStateRepository: makeStubUserStateRepo(state),
    adaptationRepository: adaptationRepo,
    generateId,
    today: new Date("2026-03-22")
  });

  const proposal = proposals[0];
  assert.ok(proposal);

  const resolved = await resolveAdaptationProposal({
    proposalId: proposal.id,
    userId: "different-user",
    resolution: "rejected",
    adaptationRepository: adaptationRepo
  });

  assert.equal(resolved, null);

  // Original proposal status unchanged
  const stored = await adaptationRepo.getProposalById(proposal.id);
  assert.equal(stored?.status, "proposed");
});

test("resolve: cannot resolve an already-resolved proposal", async () => {
  const adaptationRepo = new InMemoryAdaptationRepository();
  const state = makeUserState({ complianceScore: 20 });

  const proposals = await evaluateAdaptationRules({
    userId: USER_ID,
    trackingRepository: makeStubTrackingRepo([]),
    protocolRepository: makeStubProtocolRepo([]),
    userStateRepository: makeStubUserStateRepo(state),
    adaptationRepository: adaptationRepo,
    generateId,
    today: new Date("2026-03-22")
  });

  const proposal = proposals[0];
  assert.ok(proposal);

  // Accept once
  await resolveAdaptationProposal({
    proposalId: proposal.id,
    userId: USER_ID,
    resolution: "accepted",
    adaptationRepository: adaptationRepo
  });

  // Try to reject an already-accepted proposal
  const second = await resolveAdaptationProposal({
    proposalId: proposal.id,
    userId: USER_ID,
    resolution: "rejected",
    adaptationRepository: adaptationRepo
  });

  assert.equal(second, null);
});

// ─── Test: after acceptance, duplicate evaluation creates new proposal ──────

test("evaluate: after acceptance, can create a new proposal for same rule", async () => {
  const adaptationRepo = new InMemoryAdaptationRepository();
  const state = makeUserState({ complianceScore: 20 });

  const deps = {
    userId: USER_ID,
    trackingRepository: makeStubTrackingRepo([]),
    protocolRepository: makeStubProtocolRepo([]),
    userStateRepository: makeStubUserStateRepo(state),
    adaptationRepository: adaptationRepo,
    generateId,
    today: new Date("2026-03-22")
  };

  const firstRun = await evaluateAdaptationRules(deps);
  assert.ok(firstRun.length >= 1);

  // Accept the compliance proposal
  const complianceProposal = firstRun.find((p) => p.ruleId === "compliance-difficulty-reduction");
  assert.ok(complianceProposal);
  await resolveAdaptationProposal({
    proposalId: complianceProposal.id,
    userId: USER_ID,
    resolution: "accepted",
    adaptationRepository: adaptationRepo
  });

  // Re-evaluate — should create a new proposal since old one is accepted (not pending)
  const secondRun = await evaluateAdaptationRules(deps);
  const newComplianceProposal = secondRun.find((p) => p.ruleId === "compliance-difficulty-reduction");
  assert.ok(newComplianceProposal, "expected a new compliance proposal after acceptance");
  assert.notEqual(newComplianceProposal.id, complianceProposal.id);
});

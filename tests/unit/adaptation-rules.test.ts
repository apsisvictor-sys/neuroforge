import test from "node:test";
import assert from "node:assert/strict";
import { evaluateAllRules } from "../../src/domain/adaptation/adaptation-rules.ts";
import type { AdaptationContext } from "../../src/domain/adaptation/adaptation-rules.ts";
import type { UserState } from "../../src/domain/entities/user-state.ts";
import type { DailyCheckin } from "../../src/domain/entities/tracking.ts";
import type { DailyCompletionSummary, ProtocolPhase } from "../../src/domain/entities/protocol.ts";

function makeState(overrides: Partial<UserState> = {}): UserState {
  return {
    userId: "user-1",
    computedAt: "2026-03-22T00:00:00.000Z",
    nervousSystemType: null,
    fatigueIndex: 0.3,
    complianceScore: 75,
    resilienceScore: 1.0,
    overstimulationFlag: false,
    improvementTrend: "stable",
    ...overrides
  };
}

function makeCheckin(dayKey: string, energy: number, calm: number = 7): DailyCheckin {
  return {
    id: `ci-${dayKey}`,
    userId: "user-1",
    dayKey,
    focus: 7,
    calm,
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

function makePhase(startDay: number, endDay: number): ProtocolPhase {
  return {
    id: "phase-1",
    name: "Stabilize",
    dayRange: { startDay, endDay },
    tasks: []
  };
}

// ─── Rule 1: fatigue-recovery-day ──────────────────────────────────────────

test("fatigue-recovery-day: NOT triggered with fewer than 3 check-ins", () => {
  const ctx: AdaptationContext = {
    state: makeState(),
    recentCheckins: [makeCheckin("2026-03-22", 2), makeCheckin("2026-03-21", 2)],
    recentSummaries: []
  };
  const triggered = evaluateAllRules(ctx);
  assert.equal(triggered.filter((r) => r.ruleId === "fatigue-recovery-day").length, 0);
});

test("fatigue-recovery-day: NOT triggered when any of last 3 check-ins has energy >= 4", () => {
  const ctx: AdaptationContext = {
    state: makeState(),
    recentCheckins: [
      makeCheckin("2026-03-22", 2),
      makeCheckin("2026-03-21", 4), // energy = 4 = not low
      makeCheckin("2026-03-20", 2)
    ],
    recentSummaries: []
  };
  const triggered = evaluateAllRules(ctx);
  assert.equal(triggered.filter((r) => r.ruleId === "fatigue-recovery-day").length, 0);
});

test("fatigue-recovery-day: triggered when last 3 check-ins all have energy < 4", () => {
  const ctx: AdaptationContext = {
    state: makeState(),
    recentCheckins: [
      makeCheckin("2026-03-22", 3),
      makeCheckin("2026-03-21", 2),
      makeCheckin("2026-03-20", 1)
    ],
    recentSummaries: []
  };
  const triggered = evaluateAllRules(ctx);
  const rule = triggered.find((r) => r.ruleId === "fatigue-recovery-day");
  assert.ok(rule, "expected fatigue-recovery-day to be triggered");
  assert.ok(rule.reasoning.length > 0);
});

// ─── Rule 2: overstimulation-regulation-shift ──────────────────────────────

test("overstimulation-regulation-shift: NOT triggered when overstimulationFlag is false", () => {
  const ctx: AdaptationContext = {
    state: makeState({ overstimulationFlag: false }),
    recentCheckins: [],
    recentSummaries: []
  };
  const triggered = evaluateAllRules(ctx);
  assert.equal(triggered.filter((r) => r.ruleId === "overstimulation-regulation-shift").length, 0);
});

test("overstimulation-regulation-shift: triggered when overstimulationFlag is true", () => {
  const ctx: AdaptationContext = {
    state: makeState({ overstimulationFlag: true }),
    recentCheckins: [],
    recentSummaries: []
  };
  const triggered = evaluateAllRules(ctx);
  const rule = triggered.find((r) => r.ruleId === "overstimulation-regulation-shift");
  assert.ok(rule, "expected overstimulation-regulation-shift to be triggered");
  assert.ok(rule.reasoning.includes("Pillar 3"));
});

// ─── Rule 3: compliance-difficulty-reduction ───────────────────────────────

test("compliance-difficulty-reduction: NOT triggered when complianceScore >= 40", () => {
  const ctx: AdaptationContext = {
    state: makeState({ complianceScore: 40 }),
    recentCheckins: [],
    recentSummaries: []
  };
  const triggered = evaluateAllRules(ctx);
  assert.equal(triggered.filter((r) => r.ruleId === "compliance-difficulty-reduction").length, 0);
});

test("compliance-difficulty-reduction: triggered when complianceScore < 40", () => {
  const ctx: AdaptationContext = {
    state: makeState({ complianceScore: 39 }),
    recentCheckins: [],
    recentSummaries: []
  };
  const triggered = evaluateAllRules(ctx);
  const rule = triggered.find((r) => r.ruleId === "compliance-difficulty-reduction");
  assert.ok(rule, "expected compliance-difficulty-reduction to be triggered");
  assert.ok(rule.reasoning.includes("39%"));
});

test("compliance-difficulty-reduction: triggered at complianceScore = 0", () => {
  const ctx: AdaptationContext = {
    state: makeState({ complianceScore: 0 }),
    recentCheckins: [],
    recentSummaries: []
  };
  const triggered = evaluateAllRules(ctx);
  const rule = triggered.find((r) => r.ruleId === "compliance-difficulty-reduction");
  assert.ok(rule);
});

// ─── Rule 4: early-phase-advance ───────────────────────────────────────────

test("early-phase-advance: NOT triggered when no enrollment context", () => {
  const ctx: AdaptationContext = {
    state: makeState({ complianceScore: 95 }),
    recentCheckins: [],
    recentSummaries: []
    // no enrollment
  };
  const triggered = evaluateAllRules(ctx);
  assert.equal(triggered.filter((r) => r.ruleId === "early-phase-advance").length, 0);
});

test("early-phase-advance: NOT triggered when complianceScore <= 90", () => {
  const ctx: AdaptationContext = {
    state: makeState({ complianceScore: 90 }),
    recentCheckins: [],
    recentSummaries: [],
    enrollment: { dayNumber: 2, currentPhase: makePhase(1, 7) }
  };
  const triggered = evaluateAllRules(ctx);
  assert.equal(triggered.filter((r) => r.ruleId === "early-phase-advance").length, 0);
});

test("early-phase-advance: NOT triggered when at or past 60% of phase", () => {
  // Phase 1-7, day 5 = 5/7 ≈ 71% > 60%
  const ctx: AdaptationContext = {
    state: makeState({ complianceScore: 95 }),
    recentCheckins: [],
    recentSummaries: [],
    enrollment: { dayNumber: 5, currentPhase: makePhase(1, 7) }
  };
  const triggered = evaluateAllRules(ctx);
  assert.equal(triggered.filter((r) => r.ruleId === "early-phase-advance").length, 0);
});

test("early-phase-advance: triggered when complianceScore > 90 and within first 60% of phase", () => {
  // Phase 1-7, day 3 = 3/7 ≈ 43% < 60%, compliance = 95%
  const ctx: AdaptationContext = {
    state: makeState({ complianceScore: 95 }),
    recentCheckins: [],
    recentSummaries: [],
    enrollment: { dayNumber: 3, currentPhase: makePhase(1, 7) }
  };
  const triggered = evaluateAllRules(ctx);
  const rule = triggered.find((r) => r.ruleId === "early-phase-advance");
  assert.ok(rule, "expected early-phase-advance to be triggered");
  assert.ok(rule.reasoning.includes("Stabilize"));
});

// ─── Multiple rules can trigger simultaneously ──────────────────────────────

test("evaluateAllRules: multiple rules can trigger simultaneously", () => {
  const ctx: AdaptationContext = {
    state: makeState({ complianceScore: 20, overstimulationFlag: true }),
    recentCheckins: [
      makeCheckin("2026-03-22", 2, 2),
      makeCheckin("2026-03-21", 2, 2),
      makeCheckin("2026-03-20", 2, 2)
    ],
    recentSummaries: []
  };
  const triggered = evaluateAllRules(ctx);
  // compliance-difficulty-reduction + overstimulation-regulation-shift + fatigue-recovery-day
  assert.ok(triggered.length >= 3);
});

test("evaluateAllRules: returns empty array when no rules are triggered", () => {
  const ctx: AdaptationContext = {
    state: makeState({ complianceScore: 80, overstimulationFlag: false }),
    recentCheckins: [
      makeCheckin("2026-03-22", 8),
      makeCheckin("2026-03-21", 8),
      makeCheckin("2026-03-20", 8)
    ],
    recentSummaries: []
  };
  const triggered = evaluateAllRules(ctx);
  assert.equal(triggered.length, 0);
});

import test from "node:test";
import assert from "node:assert/strict";
import { computeUserState } from "../../src/domain/entities/user-state.ts";
import type { DailyCheckin } from "../../src/domain/entities/tracking.ts";
import type { DailyCompletionSummary } from "../../src/domain/entities/protocol.ts";

function makeCheckin(dayKey: string, focus: number, calm: number, energy: number): DailyCheckin {
  return { id: `ci-${dayKey}`, userId: "user-1", dayKey, focus, calm, energy, note: null, createdAt: new Date().toISOString() };
}

function makeSummary(dayKey: string, completedCount: number, totalCount: number): DailyCompletionSummary {
  return { dayKey, completedCount, totalCount, completionScore: totalCount > 0 ? completedCount / totalCount : 0 };
}

test("computeUserState returns 100 complianceScore when no tasks", () => {
  const state = computeUserState("user-1", [], [], null);
  assert.equal(state.complianceScore, 100);
});

test("computeUserState computes complianceScore from last 7 summaries", () => {
  const summaries = [
    makeSummary("2026-03-22", 3, 4),
    makeSummary("2026-03-21", 2, 4),
    makeSummary("2026-03-20", 4, 4),
  ];
  const state = computeUserState("user-1", [], summaries, null);
  // total=12, completed=9 → 75%
  assert.equal(state.complianceScore, 75);
});

test("computeUserState computes fatigueIndex from compliance and energy", () => {
  const checkins = [makeCheckin("2026-03-22", 7, 6, 8)];
  const summaries = [makeSummary("2026-03-22", 4, 4)]; // 100% compliance
  const state = computeUserState("user-1", checkins, summaries, null);
  // fatigueIndex = 1 - ((1.0 + 0.8) / 2) = 1 - 0.9 = 0.1
  assert.equal(state.fatigueIndex, 0.1);
});

test("computeUserState sets overstimulationFlag when calm < 4 and compliance < 50", () => {
  const checkins = [
    makeCheckin("2026-03-22", 3, 3, 3),
    makeCheckin("2026-03-21", 3, 3, 3),
    makeCheckin("2026-03-20", 3, 3, 3),
  ];
  const summaries = [makeSummary("2026-03-22", 1, 4)]; // 25% compliance
  const state = computeUserState("user-1", checkins, summaries, null);
  assert.equal(state.overstimulationFlag, true);
});

test("computeUserState does not set overstimulationFlag when calm is normal", () => {
  const checkins = [makeCheckin("2026-03-22", 7, 7, 7)];
  const summaries = [makeSummary("2026-03-22", 1, 4)]; // 25% compliance
  const state = computeUserState("user-1", checkins, summaries, null);
  assert.equal(state.overstimulationFlag, false);
});

test("computeUserState resilienceScore is 1.0 when no failed days", () => {
  const summaries = [
    makeSummary("2026-03-22", 4, 4),
    makeSummary("2026-03-21", 3, 4),
  ];
  const state = computeUserState("user-1", [], summaries, null);
  assert.equal(state.resilienceScore, 1.0);
});

test("computeUserState resilienceScore reflects recovery after failed day", () => {
  // Day 1 (index 0): failed (25%), Day 2 (index 1): recovered (100%)
  const summaries = [
    makeSummary("2026-03-22", 4, 4), // recovery day — index 1
    makeSummary("2026-03-21", 1, 4), // failed day — index 0
  ];
  // summaries are desc order, so index 0 = most recent
  // failed at index 1 (older day), recovery check at index 0 → score 1.0
  const state = computeUserState("user-1", [], summaries, null);
  assert.equal(state.resilienceScore, 1.0);
});

test("computeUserState improvementTrend is stable with no check-ins", () => {
  const state = computeUserState("user-1", [], [], null);
  assert.equal(state.improvementTrend, "stable");
});

test("computeUserState improvementTrend is improving when recent scores are higher", () => {
  const checkins = [
    // Recent (index 0-1): high scores
    makeCheckin("2026-03-22", 9, 8, 9),
    makeCheckin("2026-03-21", 8, 8, 8),
    // Older (index 2-3): low scores
    makeCheckin("2026-03-20", 3, 3, 3),
    makeCheckin("2026-03-19", 3, 3, 3),
  ];
  const state = computeUserState("user-1", checkins, [], null);
  assert.equal(state.improvementTrend, "improving");
});

test("computeUserState improvementTrend is regressing when recent scores are lower", () => {
  const checkins = [
    // Recent (index 0-1): low scores
    makeCheckin("2026-03-22", 2, 2, 2),
    makeCheckin("2026-03-21", 2, 2, 2),
    // Older (index 2-3): high scores
    makeCheckin("2026-03-20", 9, 9, 9),
    makeCheckin("2026-03-19", 9, 9, 9),
  ];
  const state = computeUserState("user-1", checkins, [], null);
  assert.equal(state.improvementTrend, "regressing");
});

test("computeUserState includes provided nervousSystemType", () => {
  const state = computeUserState("user-1", [], [], "Overstimulated");
  assert.equal(state.nervousSystemType, "Overstimulated");
});

test("computeUserState userId and computedAt are set", () => {
  const state = computeUserState("user-42", [], [], null);
  assert.equal(state.userId, "user-42");
  assert.ok(typeof state.computedAt === "string" && state.computedAt.length > 0);
});

test("computeUserState fatigueIndex is clamped to 0-1", () => {
  // All scores = 10: fatigueIndex should approach 0
  const checkins = [makeCheckin("2026-03-22", 10, 10, 10)];
  const summaries = [makeSummary("2026-03-22", 4, 4)];
  const state = computeUserState("user-1", checkins, summaries, null);
  assert.ok(state.fatigueIndex >= 0 && state.fatigueIndex <= 1);
});

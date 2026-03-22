import test from "node:test";
import assert from "node:assert/strict";
import { computeRecoveryScore } from "../../src/domain/progress/compute-recovery-score.ts";
import type { DailyCheckin } from "../../src/domain/entities/tracking.ts";
import type { DailyCompletionSummary } from "../../src/domain/entities/protocol.ts";

function makeCheckin(focus: number, calm: number, energy: number): DailyCheckin {
  return {
    id: "test",
    userId: "u1",
    dayKey: "2026-01-01",
    focus,
    calm,
    energy,
    note: null,
    createdAt: "2026-01-01T00:00:00Z",
  };
}

function makeSummary(completionScore: number): DailyCompletionSummary {
  return {
    dayKey: "2026-01-01",
    completedCount: Math.round(completionScore * 3),
    totalCount: 3,
    completionScore,
  };
}

test("returns 0 when no data provided", () => {
  const score = computeRecoveryScore([], []);
  assert.equal(score, 0);
});

test("returns 100 for perfect check-ins and full completion", () => {
  const checkins = [makeCheckin(5, 5, 5)];
  const summaries = [makeSummary(1)];
  const score = computeRecoveryScore(checkins, summaries);
  assert.equal(score, 100);
});

test("returns 60 for perfect check-ins but zero completion", () => {
  const checkins = [makeCheckin(5, 5, 5)];
  const summaries = [makeSummary(0)];
  const score = computeRecoveryScore(checkins, summaries);
  assert.equal(score, 60);
});

test("returns 40 for no check-ins but full completion", () => {
  const checkins: DailyCheckin[] = [];
  const summaries = [makeSummary(1)];
  const score = computeRecoveryScore(checkins, summaries);
  assert.equal(score, 40);
});

test("mid-range: 3/5 check-ins + 0.5 completion", () => {
  const checkins = [makeCheckin(3, 3, 3)];
  const summaries = [makeSummary(0.5)];
  const score = computeRecoveryScore(checkins, summaries);
  // check-in score = (3+3+3)/3/5*100 = 60; completion = 0.5*100 = 50
  // result = 60*0.6 + 50*0.4 = 36 + 20 = 56
  assert.equal(score, 56);
});

test("averages multiple days correctly", () => {
  const checkins = [makeCheckin(5, 5, 5), makeCheckin(1, 1, 1)];
  const summaries = [makeSummary(1), makeSummary(0)];
  const score = computeRecoveryScore(checkins, summaries);
  // check-in avg = (100 + 20) / 2 = 60; completion avg = (100+0)/2 = 50
  // result = 60*0.6 + 50*0.4 = 36 + 20 = 56
  assert.equal(score, 56);
});

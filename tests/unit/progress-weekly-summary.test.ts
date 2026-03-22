import test from "node:test";
import assert from "node:assert/strict";
import { computeWeeklySummary } from "../../src/domain/progress/compute-weekly-summary.ts";
import type { DailyCheckin } from "../../src/domain/entities/tracking.ts";
import type { DailyCompletionSummary } from "../../src/domain/entities/protocol.ts";

function makeCheckin(dayKey: string, focus: number, calm: number, energy: number): DailyCheckin {
  return {
    id: `ci-${dayKey}`,
    userId: "u1",
    dayKey,
    focus,
    calm,
    energy,
    note: null,
    createdAt: `${dayKey}T00:00:00Z`,
  };
}

function makeSummary(dayKey: string, score: number): DailyCompletionSummary {
  return { dayKey, completedCount: Math.round(score * 3), totalCount: 3, completionScore: score };
}

test("returns N/A when no check-ins provided", () => {
  const summary = computeWeeklySummary([], []);
  assert.equal(summary.bestDay, "N/A");
});

test("identifies best day as the highest-scoring day", () => {
  const checkins = [
    makeCheckin("2026-03-16", 2, 2, 2), // Monday — low
    makeCheckin("2026-03-17", 5, 5, 5), // Tuesday — best
    makeCheckin("2026-03-18", 3, 3, 3), // Wednesday — mid
  ];
  const summaries = [
    makeSummary("2026-03-16", 0.5),
    makeSummary("2026-03-17", 1),
    makeSummary("2026-03-18", 0.7),
  ];
  const summary = computeWeeklySummary(checkins, summaries);
  assert.equal(summary.bestDay, "Tuesday");
});

test("identifies focus area as the lowest-scoring metric", () => {
  const checkins = [
    makeCheckin("2026-03-17", 1, 4, 4), // focus is low
  ];
  const summary = computeWeeklySummary(checkins, []);
  assert.ok(summary.focusArea.toLowerCase().includes("focus"));
});

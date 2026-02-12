import test from "node:test";
import assert from "node:assert/strict";
import { calculateCompletionSummary, updateStreak } from "../../src/protocol-engine/progression/metrics.ts";

test("calculateCompletionSummary computes completed over total", () => {
  const summary = calculateCompletionSummary("2026-01-01", [
    { completed: true },
    { completed: false },
    { completed: true }
  ] as any);

  assert.equal(summary.completedCount, 2);
  assert.equal(summary.totalCount, 3);
  assert.equal(summary.completionScore, 2 / 3);
});

test("updateStreak increments only when above threshold", () => {
  const base = { userId: "u1", currentStreak: 2, lastQualifiedDayKey: "2026-01-01" };

  const grown = updateStreak({
    streak: base,
    dayKey: "2026-01-02",
    completionScore: 0.9,
    threshold: 0.8
  });

  assert.equal(grown.currentStreak, 3);

  const reset = updateStreak({
    streak: grown,
    dayKey: "2026-01-03",
    completionScore: 0.4,
    threshold: 0.8
  });

  assert.equal(reset.currentStreak, 0);
});

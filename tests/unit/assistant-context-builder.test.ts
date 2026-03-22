import test from "node:test";
import assert from "node:assert/strict";
import { buildAssistantContext } from "../../src/domain/assistant/assistant-context-builder.ts";

test("assistant context builder composes expected fields from minimal input", () => {
  const context = buildAssistantContext({
    protocolTemplate: {
      id: "protocol-core-reset-v1",
      slug: "core-reset",
      name: "Core Reset",
      description: "desc",
      version: 1,
      phases: [
        {
          id: "phase-a",
          name: "Phase A",
          dayRange: { startDay: 1, endDay: 14 },
          tasks: []
        },
        {
          id: "phase-b",
          name: "Phase B",
          dayRange: { startDay: 15, endDay: 30 },
          tasks: []
        }
      ]
    },
    enrollment: {
      id: "enrollment-1",
      userId: "user-1",
      protocolId: "protocol-core-reset-v1",
      startDate: "2026-01-01T00:00:00.000Z",
      active: true
    },
    todayTasks: [
      { title: "Morning breathing", completed: true },
      { title: "Focus block", completed: false }
    ],
    todayPhaseName: "Phase A",
    currentDay: 15,
    streak: 4
  });

  assert.equal(context.protocolId, "protocol-core-reset-v1");
  assert.equal(context.protocolName, "Core Reset");
  assert.equal(context.isEnrolled, true);
  assert.equal(context.phaseCount, 2);
  assert.equal(context.totalDays, 30);
  assert.equal(context.todayTaskCount, 2);
  assert.equal(context.completedTaskCount, 1);
  assert.equal(context.protocolProgressPercent, 50);
  assert.equal(context.todayPhaseName, "Phase A");
  assert.deepEqual(context.todayTaskTitles, ["Morning breathing", "Focus block"]);
  assert.equal(context.streakCount, 4);
});

test("assistant context builder handles missing optional inputs safely", () => {
  const context = buildAssistantContext({});

  assert.equal(context.protocolId, undefined);
  assert.equal(context.protocolName, undefined);
  assert.equal(context.isEnrolled, undefined);
  assert.equal(context.phaseCount, undefined);
  assert.equal(context.totalDays, undefined);
  assert.equal(context.todayTaskCount, undefined);
  assert.equal(context.completedTaskCount, undefined);
  assert.equal(context.protocolProgressPercent, undefined);
  assert.equal(context.todayPhaseName, null);
  assert.deepEqual(context.todayTaskTitles, []);
  assert.equal(context.streakCount, null);
});

test("assistant context builder computes check-in averages from recentCheckins", () => {
  const context = buildAssistantContext({
    recentCheckins: [
      { dayKey: "2026-03-22", focus: 8, calm: 6, energy: 7 },
      { dayKey: "2026-03-21", focus: 6, calm: 4, energy: 5 }
    ]
  });

  assert.equal(context.avgFocus, 7);
  assert.equal(context.avgCalm, 5);
  assert.equal(context.avgEnergy, 6);
});

test("assistant context builder sets null averages when no check-ins", () => {
  const context = buildAssistantContext({ recentCheckins: [] });

  assert.equal(context.avgFocus, null);
  assert.equal(context.avgCalm, null);
  assert.equal(context.avgEnergy, null);
});

test("assistant context builder includes enhanced user state fields", () => {
  const context = buildAssistantContext({
    nervousSystemType: "BurnedOut",
    recentCompletionRate: 65,
    userState: {
      userId: "user-1",
      computedAt: "2026-03-22T00:00:00.000Z",
      nervousSystemType: "BurnedOut",
      fatigueIndex: 0.6,
      complianceScore: 65,
      resilienceScore: 0.8,
      overstimulationFlag: false,
      improvementTrend: "improving"
    }
  });

  assert.equal(context.nervousSystemType, "BurnedOut");
  assert.equal(context.recentCompletionRate, 65);
  assert.equal(context.fatigueIndex, 0.6);
  assert.equal(context.overstimulationFlag, false);
  assert.equal(context.improvementTrend, "improving");
});

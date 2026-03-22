import test from "node:test";
import assert from "node:assert/strict";
import { protocolTemplates } from "../../src/protocol-engine/definitions/templates.ts";
import { buildAssistantContextInput } from "../../src/application/assistant/assistant-context-provider.ts";
import type { ProtocolRepository } from "../../src/domain/repositories/protocol-repository.ts";

test("assistant context provider returns expected structured context input from repository reads", async () => {
  const repositoryStub: ProtocolRepository = {
    listTemplates: async () => [],
    listTemplateCatalog: async () => [],
    getTemplateById: async () => protocolTemplates[0],
    getTemplateBySlug: async () => null,
    getActiveEnrollment: async () => ({
      id: "enrollment-1",
      userId: "user-1",
      protocolId: protocolTemplates[0].id,
      startDate: "2026-01-01T00:00:00.000Z",
      active: true
    }),
    enroll: async () => {
      throw new Error("not used");
    },
    listDailyTasks: async () => [
    {
      id: "daily-task-1",
      userId: "user-1",
      protocolId: protocolTemplates[0].id,
      phaseId: protocolTemplates[0].phases[0].id,
      dayKey: "2026-02-14",
      taskDefinitionId: "task-1",
      title: "Task A",
      instructions: "Do A",
      category: "focus",
      estimatedMinutes: 10,
      order: 1,
      required: true,
      completed: true,
      completedAt: "2026-02-14T10:00:00.000Z"
    },
    {
      id: "daily-task-2",
      userId: "user-1",
      protocolId: protocolTemplates[0].id,
      phaseId: protocolTemplates[0].phases[0].id,
      dayKey: "2026-02-14",
      taskDefinitionId: "task-2",
      title: "Task B",
      instructions: "Do B",
      category: "planning",
      estimatedMinutes: 5,
      order: 2,
      required: false,
      completed: false,
      completedAt: null
    }
    ],
    replaceDailyTasks: async () => {
      throw new Error("not used");
    },
    toggleTask: async () => null,
    getStreak: async () => ({ userId: "user-1", currentStreak: 0, lastQualifiedDayKey: null }),
    saveStreak: async () => {
      throw new Error("not used");
    },
    getDailyCompletionSummaries: async () => []
  };

  const contextInput = await buildAssistantContextInput("user-1", repositoryStub);

  assert.equal(typeof contextInput.protocolTemplate?.id, "string");
  assert.equal(contextInput.protocolTemplate?.phases.length, protocolTemplates[0].phases.length);
  assert.equal(contextInput.enrollment?.active, true);
  assert.equal(contextInput.todayTasks?.length, 2);
  assert.equal(contextInput.todayTasks?.[0]?.title, "Task A");
  assert.equal(contextInput.todayTasks?.[0]?.completed, true);
  assert.equal(typeof contextInput.todayPhaseName, "string");
  assert.equal(typeof contextInput.currentDay, "number");
  assert.equal(contextInput.streak, undefined);
});

test("assistant context provider is deterministic for the same repository state", async () => {
  const repositoryStub: ProtocolRepository = {
    listTemplates: async () => [],
    listTemplateCatalog: async () => [],
    getTemplateById: async () => protocolTemplates[0],
    getTemplateBySlug: async () => null,
    getActiveEnrollment: async () => ({
      id: "enrollment-1",
      userId: "user-1",
      protocolId: protocolTemplates[0].id,
      startDate: "2026-01-01T00:00:00.000Z",
      active: true
    }),
    enroll: async () => {
      throw new Error("not used");
    },
    listDailyTasks: async () => [],
    replaceDailyTasks: async () => {
      throw new Error("not used");
    },
    toggleTask: async () => null,
    getStreak: async () => ({ userId: "user-1", currentStreak: 0, lastQualifiedDayKey: null }),
    saveStreak: async () => {
      throw new Error("not used");
    },
    getDailyCompletionSummaries: async () => []
  };

  const first = await buildAssistantContextInput("user-1", repositoryStub);
  const second = await buildAssistantContextInput("user-1", repositoryStub);

  assert.deepEqual(first, second);
});

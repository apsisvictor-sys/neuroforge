import test from "node:test";
import assert from "node:assert/strict";
import type { ProtocolRepository } from "../../src/domain/repositories/protocol-repository.ts";
import { loadProtocolDetail } from "../../src/application/protocol/load-protocol-detail.ts";

function createProtocolRepositoryStub(
  overrides: Partial<ProtocolRepository>
): ProtocolRepository {
  const fail = async () => {
    throw new Error("ProtocolRepository method not stubbed");
  };

  return {
    listTemplates: fail,
    listTemplateCatalog: fail,
    getTemplateById: fail,
    getTemplateBySlug: fail,
    getActiveEnrollment: fail,
    enroll: fail,
    listDailyTasks: fail,
    replaceDailyTasks: fail,
    toggleTask: fail,
    getStreak: fail,
    saveStreak: fail,
    getDailyCompletionSummaries: fail,
    ...overrides
  };
}

test("protocol template immutability invariant: loadProtocolDetail does not mutate source template entity", async () => {
  const template = {
    id: "protocol-core-reset-v1",
    slug: "core-reset",
    name: "Core Reset",
    description: "desc",
    version: 1,
    phases: [
      {
        id: "phase-1",
        name: "Phase 1",
        dayRange: { startDay: 1, endDay: 7 },
        tasks: [
          {
            id: "task-1",
            title: "Task One",
            instructions: "Do task one",
            category: "focus" as const,
            estimatedMinutes: 15,
            order: 1,
            required: true
          }
        ]
      }
    ]
  };
  const snapshot = structuredClone(template);

  const repository = createProtocolRepositoryStub({
    getTemplateBySlug: async () => template,
    getActiveEnrollment: async () => ({
      id: "enrollment-1",
      userId: "user-1",
      protocolId: "protocol-core-reset-v1",
      startDate: "2026-01-01T00:00:00.000Z",
      active: true
    })
  });

  const result = await loadProtocolDetail("core-reset", "user-1", repository);
  assert.equal(result.status, "ok");
  if (result.status !== "ok") {
    assert.fail("Expected ok result");
  }

  assert.deepEqual(template, snapshot);

  result.template.phases[0].tasks[0].title = "Mutated DTO Title";
  assert.equal(template.phases[0].tasks[0].title, "Task One");
});

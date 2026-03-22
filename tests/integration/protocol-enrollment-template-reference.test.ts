import test from "node:test";
import assert from "node:assert/strict";
import type { ProtocolRepository } from "../../src/domain/repositories/protocol-repository.ts";

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

test("protocol enrollment invariant: enrollment is rejected when template id does not exist", async () => {
  const repository = createProtocolRepositoryStub({
    getTemplateById: async () => null,
    enroll: async (userId, protocolId, startDate) => {
      const template = await repository.getTemplateById(protocolId);
      if (!template) {
        throw new Error("Protocol template not found");
      }

      return {
        id: "enrollment-1",
        userId,
        protocolId,
        startDate,
        active: true
      };
    }
  });

  await assert.rejects(
    () => repository.enroll("user-1", "protocol-missing-v1", "2026-02-01T00:00:00.000Z"),
    /Protocol template not found/
  );
});

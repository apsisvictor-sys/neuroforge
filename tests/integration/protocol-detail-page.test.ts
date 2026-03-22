import test from "node:test";
import assert from "node:assert/strict";
import { loadProtocolDetail } from "../../src/application/protocol/load-protocol-detail.ts";
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

test("protocol detail loader returns not-found for unknown slug", async () => {
  const repository = createProtocolRepositoryStub({
    getTemplateBySlug: async () => null
  });

  const result = await loadProtocolDetail("does-not-exist", "user-1", repository);

  assert.equal(result.status, "not-found");
});

test("protocol detail loader marks enrolled when active enrollment matches template", async () => {
  const repository = createProtocolRepositoryStub({
    getTemplateBySlug: async () => ({
      id: "protocol-core-reset-v1",
      slug: "core-reset",
      name: "Core Reset",
      description: "desc",
      version: 1,
      phases: []
    }),
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
  assert.equal(result.isEnrolledInThisProtocol, true);
});

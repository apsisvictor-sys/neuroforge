import test from "node:test";
import assert from "node:assert/strict";
import { loadProtocolDetailBySlug } from "../../app/protocol/page-loader.ts";

test("protocol detail loader returns not-found for unknown slug", async () => {
  const result = await loadProtocolDetailBySlug("does-not-exist", "user-1", async () => null);

  assert.equal(result.status, "not-found");
  assert.equal(result.template, null);
  assert.equal(result.isEnrolledInThisProtocol, false);
});

test("protocol detail loader marks enrolled when active enrollment matches template", async () => {
  const result = await loadProtocolDetailBySlug(
    "core-reset",
    "user-1",
    async () => ({
      id: "protocol-core-reset-v1",
      slug: "core-reset",
      name: "Core Reset",
      description: "desc",
      version: 1,
      phases: []
    }),
    async () => ({
      id: "enrollment-1",
      userId: "user-1",
      protocolId: "protocol-core-reset-v1",
      startDate: "2026-01-01T00:00:00.000Z",
      active: true
    })
  );

  assert.equal(result.status, "ok");
  assert.equal(result.isEnrolledInThisProtocol, true);
});

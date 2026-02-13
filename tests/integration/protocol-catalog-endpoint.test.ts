import test from "node:test";
import assert from "node:assert/strict";
import type { ProtocolCatalogItem } from "../../src/domain/entities/protocol.ts";
const hasDatabase = Boolean(process.env.DATABASE_URL);

test("protocol catalog repository returns catalog items with expected shape", { skip: !hasDatabase }, async () => {
  const { repositories } = await import("../../src/infrastructure/db/repositories/index.ts");
  const body = { items: await repositories.protocol.listTemplateCatalog() };

  assert.ok(Array.isArray(body.items));
  assert.ok(body.items.length > 0);

  const item = body.items[0];
  assert.equal(typeof item.id, "string");
  assert.equal(typeof item.slug, "string");
  assert.equal(typeof item.title, "string");
  assert.equal(typeof item.shortDescription, "string");
  assert.equal(typeof item.totalDays, "number");
  assert.equal(typeof item.phaseCount, "number");
  assert.equal(typeof (item as ProtocolCatalogItem & { firstPhaseName?: unknown }).firstPhaseName, "string");
});

import test from "node:test";
import assert from "node:assert/strict";
import { protocolTemplates } from "../../src/protocol-engine/definitions/templates.ts";
import { toProtocolCatalogItem } from "../../src/protocol-engine/definitions/map-catalog-item.ts";

test("all protocol templates have required metadata fields", () => {
  for (const template of protocolTemplates) {
    assert.ok(template.difficulty, `${template.slug}: missing difficulty`);
    assert.ok(template.pillar, `${template.slug}: missing pillar`);
    assert.ok(template.scientificRationale, `${template.slug}: missing scientificRationale`);
    assert.ok(template.scienceSummary, `${template.slug}: missing scienceSummary`);
    assert.ok(template.expectedOutcome, `${template.slug}: missing expectedOutcome`);
    assert.ok(Array.isArray(template.prerequisites), `${template.slug}: prerequisites must be an array`);
  }
});

test("difficulty is one of the valid values for all templates", () => {
  const valid = ["beginner", "intermediate", "advanced"];
  for (const template of protocolTemplates) {
    assert.ok(
      valid.includes(template.difficulty!),
      `${template.slug}: invalid difficulty "${template.difficulty}"`
    );
  }
});

test("toProtocolCatalogItem passes through metadata fields", () => {
  const template = protocolTemplates[0];
  const item = toProtocolCatalogItem(template);

  assert.equal(item.difficulty, template.difficulty);
  assert.equal(item.pillar, template.pillar);
  assert.equal(item.scienceSummary, template.scienceSummary);
  assert.equal(item.expectedOutcome, template.expectedOutcome);
  assert.deepEqual(item.prerequisites, template.prerequisites);
});

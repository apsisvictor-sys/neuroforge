import test from "node:test";
import assert from "node:assert/strict";
import { resolveProtocolDayNumber } from "../../src/protocol-engine/progression/day-number.ts";

test("resolveProtocolDayNumber starts at one", () => {
  const start = "2026-01-10T00:00:00.000Z";
  const sameDay = new Date("2026-01-10T12:00:00.000Z");
  assert.equal(resolveProtocolDayNumber(start, sameDay), 1);
});

test("resolveProtocolDayNumber increments per elapsed day", () => {
  const start = "2026-01-10T00:00:00.000Z";
  const later = new Date("2026-01-12T12:00:00.000Z");
  assert.equal(resolveProtocolDayNumber(start, later), 3);
});

import test from "node:test";
import assert from "node:assert/strict";
import { requireArray, requireNumberInRange, requireString } from "../../src/lib/validate.ts";

test("requireString accepts non-empty string", () => {
  assert.equal(requireString("value", "field"), "value");
});

test("requireString rejects empty string", () => {
  assert.throws(() => requireString("", "field"), /field/);
});

test("requireString rejects null and undefined", () => {
  assert.throws(() => requireString(null, "field"), /field/);
  assert.throws(() => requireString(undefined, "field"), /field/);
});

test("requireString error includes field name", () => {
  assert.throws(() => requireString("", "workRhythm"), /workRhythm/);
});

test("requireNumberInRange accepts number inside range", () => {
  assert.equal(requireNumberInRange(5, "Focus", 0, 10), 5);
});

test("requireNumberInRange rejects below min", () => {
  assert.throws(() => requireNumberInRange(-1, "Focus", 0, 10), /Focus/);
});

test("requireNumberInRange rejects above max", () => {
  assert.throws(() => requireNumberInRange(11, "Focus", 0, 10), /Focus/);
});

test("requireNumberInRange rejects NaN and non-number", () => {
  assert.throws(() => requireNumberInRange(Number.NaN, "Focus", 0, 10), /Focus/);
  assert.throws(() => requireNumberInRange("abc", "Focus", 0, 10), /Focus/);
});

test("requireArray accepts array", () => {
  const value = [1, 2, 3];
  assert.deepEqual(requireArray(value, "items"), value);
});

test("requireArray rejects non-array", () => {
  assert.throws(() => requireArray("not-array", "items"), /items/);
});

test("requireArray preserves element values unchanged", () => {
  const value = ["alpha", "beta"];
  const result = requireArray<string>(value, "items");
  assert.deepEqual(result, ["alpha", "beta"]);
  assert.equal(result[0], value[0]);
  assert.equal(result[1], value[1]);
});

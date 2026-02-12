import test from "node:test";
import assert from "node:assert/strict";
import { submitDailyCheckin } from "../../src/application/use-cases/submit-daily-checkin.ts";

const trackingRepository = {
  async upsertDailyCheckin(input: any) {
    return {
      id: "1",
      createdAt: new Date().toISOString(),
      note: null,
      ...input
    };
  },
  async getHistory() {
    return [];
  },
  async getLatest() {
    return null;
  }
};

test("submitDailyCheckin rejects out-of-range focus", async () => {
  await assert.rejects(() =>
    submitDailyCheckin({
      userId: "u1",
      payload: { dayKey: "2026-01-01", focus: 11, calm: 5, energy: 5 },
      trackingRepository
    })
  );
});

test("submitDailyCheckin accepts 0-10 values", async () => {
  const result = await submitDailyCheckin({
    userId: "u1",
    payload: { dayKey: "2026-01-01", focus: 5, calm: 6, energy: 7 },
    trackingRepository
  });

  assert.equal(result.focus, 5);
  assert.equal(result.calm, 6);
  assert.equal(result.energy, 7);
});

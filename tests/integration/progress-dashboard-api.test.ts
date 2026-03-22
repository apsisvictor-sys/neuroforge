import test from "node:test";
import assert from "node:assert/strict";
import { getProgressDashboard } from "../../src/application/use-cases/get-progress-dashboard.ts";
import { getPatternInsights } from "../../src/application/use-cases/get-pattern-insights.ts";
import { requireSubscriptionTier } from "../../src/infrastructure/auth/access-control.ts";
import type { DailyCheckin } from "../../src/domain/entities/tracking.ts";
import type { DailyCompletionSummary, StreakState, UserProtocolEnrollment } from "../../src/domain/entities/protocol.ts";
import type { User } from "../../src/domain/entities/user.ts";

// ── Stub helpers ──────────────────────────────────────────────────────────────

function makeCheckin(dayKey: string, focus = 4, calm = 4, energy = 4): DailyCheckin {
  return { id: dayKey, userId: "u1", dayKey, focus, calm, energy, note: null, createdAt: `${dayKey}T00:00:00Z` };
}

function makeSummary(dayKey: string, score = 1): DailyCompletionSummary {
  return { dayKey, completedCount: Math.round(score * 3), totalCount: 3, completionScore: score };
}

const stubEnrollment: UserProtocolEnrollment = {
  id: "e1",
  userId: "u1",
  protocolId: "core-reset",
  startDate: "2026-01-01",
  active: true,
};

const stubStreak: StreakState = { userId: "u1", currentStreak: 5, lastQualifiedDayKey: "2026-01-05" };

function makeStubRepositories(tier: "free" | "premium" = "free") {
  const checkins = [
    makeCheckin("2026-01-07"),
    makeCheckin("2026-01-06"),
    makeCheckin("2026-01-05"),
    makeCheckin("2026-01-04"),
    makeCheckin("2026-01-03"),
  ];
  const summaries = Array.from({ length: 56 }, (_, i) => {
    const d = new Date("2026-01-01");
    d.setDate(1 + i);
    return makeSummary(d.toISOString().slice(0, 10), i < 7 ? 1 : 0);
  });

  const trackingRepository = {
    getHistory: async (_userId: string, _limit: number) => checkins,
    getLatest: async () => null,
    upsertDailyCheckin: async () => checkins[0],
  };

  const protocolRepository = {
    getActiveEnrollment: async () => stubEnrollment,
    getStreak: async () => stubStreak,
    getDailyCompletionSummaries: async (_userId: string, _days: number) => summaries.slice(0, _days),
    listTemplates: async () => [],
    listTemplateCatalog: async () => [],
    getTemplateById: async () => null,
    getTemplateBySlug: async () => null,
    enroll: async () => stubEnrollment,
    listDailyTasks: async () => [],
    replaceDailyTasks: async () => undefined,
    toggleTask: async () => null,
    saveStreak: async () => undefined,
  };

  const stubUser: User = {
    id: "u1",
    email: "test@example.com",
    subscriptionTier: tier,
    createdAt: "2026-01-01T00:00:00Z",
    lastActiveAt: "2026-01-01T00:00:00Z",
  };

  const userRepository = {
    getById: async () => stubUser,
    save: async () => stubUser,
    getByEmail: async () => null,
    saveAssessment: async () => null,
    getProfile: async () => null,
  };

  return { trackingRepository, protocolRepository, userRepository };
}

// ── Tests ──────────────────────────────────────────────────────────────────────

test("getProgressDashboard returns null when no active enrollment", async () => {
  const repos = makeStubRepositories();
  repos.protocolRepository.getActiveEnrollment = async () => null as any;

  const result = await getProgressDashboard({
    userId: "u1",
    trackingRepository: repos.trackingRepository as any,
    protocolRepository: repos.protocolRepository as any,
    userRepository: repos.userRepository as any,
  });

  assert.equal(result, null);
});

test("getProgressDashboard returns correct shape with 56-day checkIns", async () => {
  const repos = makeStubRepositories();

  const result = await getProgressDashboard({
    userId: "u1",
    trackingRepository: repos.trackingRepository as any,
    protocolRepository: repos.protocolRepository as any,
    userRepository: repos.userRepository as any,
  });

  assert.ok(result !== null);
  assert.equal(result.totalDays, 56);
  assert.equal(result.checkIns.length, 56);
  assert.equal(result.streak, 5);
  assert.ok(result.recoveryScore >= 0 && result.recoveryScore <= 100);
  assert.ok(["up", "down", "stable"].includes(result.recoveryTrend));
  assert.ok(typeof result.weeklyInsight.bestDay === "string");
});

test("getProgressDashboard sets isPremium based on user tier", async () => {
  const freeRepos = makeStubRepositories("free");
  const premiumRepos = makeStubRepositories("premium");

  const freeResult = await getProgressDashboard({
    userId: "u1",
    trackingRepository: freeRepos.trackingRepository as any,
    protocolRepository: freeRepos.protocolRepository as any,
    userRepository: freeRepos.userRepository as any,
  });

  const premiumResult = await getProgressDashboard({
    userId: "u1",
    trackingRepository: premiumRepos.trackingRepository as any,
    protocolRepository: premiumRepos.protocolRepository as any,
    userRepository: premiumRepos.userRepository as any,
  });

  assert.equal(freeResult?.isPremium, false);
  assert.equal(premiumResult?.isPremium, true);
});

test("requireSubscriptionTier throws 403 AppError for free user requesting premium feature", async () => {
  const repos = makeStubRepositories("free");

  await assert.rejects(
    () => requireSubscriptionTier("u1", "premium", repos.userRepository as any),
    (err: unknown) => {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes("higher subscription tier"));
      return true;
    }
  );
});

test("requireSubscriptionTier does not throw for premium user", async () => {
  const repos = makeStubRepositories("premium");
  // Should not throw
  await requireSubscriptionTier("u1", "premium", repos.userRepository as any);
});

test("getPatternInsights returns baselineTrends for 3 metrics", async () => {
  const repos = makeStubRepositories();

  const result = await getPatternInsights({
    userId: "u1",
    trackingRepository: repos.trackingRepository as any,
    protocolRepository: repos.protocolRepository as any,
  });

  assert.equal(result.baselineTrends.length, 3);
  const metrics = result.baselineTrends.map((t) => t.metric);
  assert.ok(metrics.includes("focus"));
  assert.ok(metrics.includes("calm"));
  assert.ok(metrics.includes("energy"));
  assert.ok(typeof result.bestDayProfile === "string");
  assert.ok(typeof result.worstDayProfile === "string");
});

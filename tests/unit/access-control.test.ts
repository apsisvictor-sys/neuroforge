import test from "node:test";
import assert from "node:assert/strict";
import { requireSubscriptionTier, hasTier } from "../../src/infrastructure/auth/access-control.ts";
import { AppError } from "../../src/infrastructure/errors/app-error.ts";
import type { User } from "../../src/domain/entities/user.ts";

// ─── Minimal stub user repo ───────────────────────────────────────────────────

function makeUserRepo(user: User | null) {
  return {
    getById: async (_id: string) => user,
  };
}

function makeUser(tier: User["subscriptionTier"]): User {
  return {
    id: "user-test",
    email: "test@example.com",
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    subscriptionTier: tier,
  };
}

// ─── requireSubscriptionTier ─────────────────────────────────────────────────

test("requireSubscriptionTier: free user passes free requirement", async () => {
  const repo = makeUserRepo(makeUser("free"));
  await assert.doesNotReject(() => requireSubscriptionTier("user-test", "free", repo));
});

test("requireSubscriptionTier: premium user passes premium requirement", async () => {
  const repo = makeUserRepo(makeUser("premium"));
  await assert.doesNotReject(() => requireSubscriptionTier("user-test", "premium", repo));
});

test("requireSubscriptionTier: professional user passes all requirements", async () => {
  const repo = makeUserRepo(makeUser("professional"));
  await assert.doesNotReject(() => requireSubscriptionTier("user-test", "premium", repo));
  await assert.doesNotReject(() => requireSubscriptionTier("user-test", "professional", repo));
});

test("requireSubscriptionTier: free user fails premium requirement", async () => {
  const repo = makeUserRepo(makeUser("free"));
  await assert.rejects(
    () => requireSubscriptionTier("user-test", "premium", repo),
    (err) => {
      assert.ok(err instanceof AppError);
      assert.equal((err as AppError).httpStatus, 403);
      assert.equal((err as AppError).code, "INSUFFICIENT_TIER");
      return true;
    }
  );
});

test("requireSubscriptionTier: free user fails professional requirement", async () => {
  const repo = makeUserRepo(makeUser("free"));
  await assert.rejects(
    () => requireSubscriptionTier("user-test", "professional", repo),
    (err) => {
      assert.ok(err instanceof AppError);
      assert.equal((err as AppError).httpStatus, 403);
      return true;
    }
  );
});

test("requireSubscriptionTier: premium user fails professional requirement", async () => {
  const repo = makeUserRepo(makeUser("premium"));
  await assert.rejects(
    () => requireSubscriptionTier("user-test", "professional", repo),
    (err) => {
      assert.ok(err instanceof AppError);
      assert.equal((err as AppError).httpStatus, 403);
      return true;
    }
  );
});

test("requireSubscriptionTier: unknown user throws 404", async () => {
  const repo = makeUserRepo(null);
  await assert.rejects(
    () => requireSubscriptionTier("user-missing", "free", repo),
    (err) => {
      assert.ok(err instanceof AppError);
      assert.equal((err as AppError).httpStatus, 404);
      assert.equal((err as AppError).code, "NOT_FOUND");
      return true;
    }
  );
});

// ─── hasTier ─────────────────────────────────────────────────────────────────

test("hasTier: free meets free", () => {
  assert.equal(hasTier("free", "free"), true);
});

test("hasTier: premium meets free and premium", () => {
  assert.equal(hasTier("premium", "free"), true);
  assert.equal(hasTier("premium", "premium"), true);
});

test("hasTier: professional meets all tiers", () => {
  assert.equal(hasTier("professional", "free"), true);
  assert.equal(hasTier("professional", "premium"), true);
  assert.equal(hasTier("professional", "professional"), true);
});

test("hasTier: free does not meet premium", () => {
  assert.equal(hasTier("free", "premium"), false);
});

test("hasTier: premium does not meet professional", () => {
  assert.equal(hasTier("premium", "professional"), false);
});

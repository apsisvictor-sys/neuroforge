import test from "node:test";
import assert from "node:assert/strict";

import { handleStripeWebhookPost } from "../../src/infrastructure/api-handlers/stripe-webhook-handler.ts";

process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
process.env.STRIPE_PRICE_PREMIUM_MONTHLY = "price_premium_monthly_test";
process.env.STRIPE_PRICE_PREMIUM_ANNUAL = "price_premium_annual_test";
process.env.STRIPE_PRICE_PRO_MONTHLY = "price_pro_monthly_test";

test("stripe webhook rejects requests without signature", async () => {
  const request = new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    body: "{}"
  });

  const response = await handleStripeWebhookPost(request as any, {
    userRepository: {
      updateSubscription: async () => {},
      getByStripeCustomerId: async () => null
    },
    getStripeClient: () => ({}) as any
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Missing stripe-signature" });
});

test("stripe webhook returns 400 for invalid signature", async () => {
  const request = new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    headers: { "stripe-signature": "invalid" },
    body: "{}"
  });

  const response = await handleStripeWebhookPost(request as any, {
    userRepository: {
      updateSubscription: async () => {},
      getByStripeCustomerId: async () => null
    },
    getStripeClient: () => ({
      webhooks: {
        constructEvent: () => {
          throw new Error("invalid");
        }
      }
    } as any)
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Invalid signature" });
});

test("stripe webhook handles checkout.session.completed", async () => {
  const updateCalls: Array<{ userId: string; tier: string; stripeCustomerId?: string }> = [];

  const request = new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    headers: { "stripe-signature": "sig_ok" },
    body: "evt_checkout"
  });

  const response = await handleStripeWebhookPost(request as any, {
    userRepository: {
      updateSubscription: async (userId, tier, stripeCustomerId) => {
        updateCalls.push({ userId, tier, stripeCustomerId });
      },
      getByStripeCustomerId: async () => null
    },
    getStripeClient: () => ({
      webhooks: {
        constructEvent: () => ({
          type: "checkout.session.completed",
          data: {
            object: {
              customer: "cus_123",
              subscription: "sub_123",
              metadata: { userId: "user_meta_1" }
            }
          }
        })
      },
      subscriptions: {
        retrieve: async () => ({
          items: {
            data: [{ price: { id: "price_premium_annual_test" } }]
          }
        })
      }
    } as any)
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { received: true });
  assert.deepEqual(updateCalls, [{ userId: "user_meta_1", tier: "premium", stripeCustomerId: "cus_123" }]);
});

test("stripe webhook handles customer.subscription.updated and deleted", async () => {
  const updateCalls: Array<{ userId: string; tier: string; stripeCustomerId?: string }> = [];

  const updatedRequest = new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    headers: { "stripe-signature": "sig_ok" },
    body: "evt_updated"
  });

  const updatedResponse = await handleStripeWebhookPost(updatedRequest as any, {
    userRepository: {
      updateSubscription: async (userId, tier, stripeCustomerId) => {
        updateCalls.push({ userId, tier, stripeCustomerId });
      },
      getByStripeCustomerId: async (customerId) =>
        customerId === "cus_updated" ? { id: "user_updated" } : { id: "user_deleted" }
    },
    getStripeClient: () => ({
      webhooks: {
        constructEvent: (_body: string) => ({
          type: "customer.subscription.updated",
          data: {
            object: {
              customer: "cus_updated",
              status: "past_due",
              items: {
                data: [{ price: { id: "price_pro_monthly_test" } }]
              }
            }
          }
        })
      }
    } as any)
  });

  assert.equal(updatedResponse.status, 200);

  const deletedRequest = new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    headers: { "stripe-signature": "sig_ok" },
    body: "evt_deleted"
  });

  const deletedResponse = await handleStripeWebhookPost(deletedRequest as any, {
    userRepository: {
      updateSubscription: async (userId, tier, stripeCustomerId) => {
        updateCalls.push({ userId, tier, stripeCustomerId });
      },
      getByStripeCustomerId: async () => ({ id: "user_deleted" })
    },
    getStripeClient: () => ({
      webhooks: {
        constructEvent: () => ({
          type: "customer.subscription.deleted",
          data: {
            object: {
              customer: "cus_deleted"
            }
          }
        })
      }
    } as any)
  });

  assert.equal(deletedResponse.status, 200);
  assert.deepEqual(updateCalls, [
    { userId: "user_updated", tier: "free", stripeCustomerId: undefined },
    { userId: "user_deleted", tier: "free", stripeCustomerId: undefined }
  ]);
});

test("stripe webhook deduplicates duplicate checkout.session.completed event", async () => {
  let updateCalled = false;

  const request = new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    headers: { "stripe-signature": "sig_ok" },
    body: "evt_checkout_dup"
  });

  const response = await handleStripeWebhookPost(request as any, {
    userRepository: {
      updateSubscription: async () => {
        updateCalled = true;
      },
      getByStripeCustomerId: async () => null
    },
    getStripeClient: () => ({
      webhooks: {
        constructEvent: () => ({
          id: "evt_dup_1",
          type: "checkout.session.completed",
          created: 1700000000,
          data: {
            object: {
              customer: "cus_dup",
              subscription: "sub_dup",
              metadata: { userId: "user_dup" }
            }
          }
        })
      },
      subscriptions: {
        retrieve: async () => ({
          items: { data: [{ price: { id: "price_premium_monthly_test" } }] }
        })
      }
    } as any),
    acquireIdempotencyKey: async () => false // simulate duplicate
  });

  assert.equal(response.status, 200);
  assert.equal(updateCalled, false, "updateSubscription must not be called for duplicate event");
});

test("stripe webhook deduplicates duplicate customer.subscription.deleted event", async () => {
  let updateCalled = false;

  const request = new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    headers: { "stripe-signature": "sig_ok" },
    body: "evt_deleted_dup"
  });

  const response = await handleStripeWebhookPost(request as any, {
    userRepository: {
      updateSubscription: async () => {
        updateCalled = true;
      },
      getByStripeCustomerId: async () => ({ id: "user_del_dup" })
    },
    getStripeClient: () => ({
      webhooks: {
        constructEvent: () => ({
          id: "evt_del_dup_1",
          type: "customer.subscription.deleted",
          created: 1700000000,
          data: { object: { customer: "cus_del_dup" } }
        })
      }
    } as any),
    acquireIdempotencyKey: async () => false // simulate duplicate
  });

  assert.equal(response.status, 200);
  assert.equal(updateCalled, false, "updateSubscription must not be called for duplicate event");
});

test("stripe webhook skips stale out-of-order subscription.updated event", async () => {
  let updateCalled = false;

  const request = new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    headers: { "stripe-signature": "sig_ok" },
    body: "evt_stale"
  });

  const response = await handleStripeWebhookPost(request as any, {
    userRepository: {
      updateSubscription: async () => {
        updateCalled = true;
      },
      getByStripeCustomerId: async () => ({ id: "user_stale" })
    },
    getStripeClient: () => ({
      webhooks: {
        constructEvent: () => ({
          id: "evt_stale_1",
          type: "customer.subscription.updated",
          created: 1699999999, // older timestamp
          data: {
            object: {
              customer: "cus_stale",
              status: "active",
              items: { data: [{ price: { id: "price_pro_monthly_test" } }] }
            }
          }
        })
      }
    } as any),
    acquireIdempotencyKey: async () => true, // not a duplicate
    checkEventOrder: async () => false // simulate stale/out-of-order
  });

  assert.equal(response.status, 200);
  assert.equal(updateCalled, false, "updateSubscription must not be called for stale event");
});

test("stripe webhook ignores unknown event types", async () => {
  const request = new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    headers: { "stripe-signature": "sig_ok" },
    body: "evt_unknown"
  });

  let updated = false;

  const response = await handleStripeWebhookPost(request as any, {
    userRepository: {
      updateSubscription: async () => {
        updated = true;
      },
      getByStripeCustomerId: async () => null
    },
    getStripeClient: () => ({
      webhooks: {
        constructEvent: () => ({
          type: "invoice.upcoming",
          data: { object: {} }
        })
      }
    } as any)
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { received: true });
  assert.equal(updated, false);
});

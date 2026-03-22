import test from "node:test";
import assert from "node:assert/strict";
import "../register-paths.ts";

import {
  handleSupplementList,
  handleSupplementDetail,
  handleSupplementStack,
} from "../../src/infrastructure/api-handlers/supplement-handler.ts";

// ── List tests ─────────────────────────────────────────────────────────────

test("GET /api/supplements returns all published supplements", async () => {
  const req = new Request("http://localhost/api/supplements");
  const res = await handleSupplementList(req as any);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(Array.isArray(body.data.supplements));
  assert.ok(body.data.supplements.length > 0);
  for (const s of body.data.supplements) {
    assert.equal(s.status, "published");
  }
});

test("GET /api/supplements?category=adaptogen filters by category", async () => {
  const req = new Request("http://localhost/api/supplements?category=adaptogen");
  const res = await handleSupplementList(req as any);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(body.data.supplements.every((s: any) => s.category === "adaptogen"));
  assert.ok(body.data.supplements.length >= 2);
});

test("GET /api/supplements?category=invalid returns 400", async () => {
  const req = new Request("http://localhost/api/supplements?category=invalid_cat");
  const res = await handleSupplementList(req as any);
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.success, false);
});

// ── Detail tests ────────────────────────────────────────────────────────────

test("GET /api/supplements/:id returns supplement by id", async () => {
  const req = new Request("http://localhost/api/supplements/supp-ashwagandha");
  const res = await handleSupplementDetail(req as any, { id: "supp-ashwagandha" });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.data.supplement.slug, "ashwagandha");
  assert.equal(body.data.supplement.category, "adaptogen");
});

test("GET /api/supplements/:slug returns supplement by slug", async () => {
  const req = new Request("http://localhost/api/supplements/l-tyrosine");
  const res = await handleSupplementDetail(req as any, { id: "l-tyrosine" });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.data.supplement.name, "L-Tyrosine");
});

test("GET /api/supplements/:id returns 404 for unknown id", async () => {
  const req = new Request("http://localhost/api/supplements/does-not-exist");
  const res = await handleSupplementDetail(req as any, { id: "does-not-exist" });
  assert.equal(res.status, 404);
  const body = await res.json();
  assert.equal(body.success, false);
});

// ── Stack tests ─────────────────────────────────────────────────────────────

test("GET /api/supplements/stacks/:phase returns stack for valid phase", async () => {
  const req = new Request("http://localhost/api/supplements/stacks/stabilize");
  const res = await handleSupplementStack(req as any, { phase: "stabilize" });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.data.stack.phase, "stabilize");
  assert.ok(Array.isArray(body.data.stack.supplements));
  assert.ok(body.data.stack.supplements.length > 0);
});

test("GET /api/supplements/stacks/:phase includes supplement detail in response", async () => {
  const req = new Request("http://localhost/api/supplements/stacks/rebuild");
  const res = await handleSupplementStack(req as any, { phase: "rebuild" });
  const body = await res.json();
  const first = body.data.stack.supplements[0];
  assert.ok(first.supplement);
  assert.ok(first.supplement.name);
  assert.ok(first.rationale);
});

test("GET /api/supplements/stacks/:phase returns 400 for invalid phase", async () => {
  const req = new Request("http://localhost/api/supplements/stacks/invalid");
  const res = await handleSupplementStack(req as any, { phase: "invalid" });
  assert.equal(res.status, 400);
});

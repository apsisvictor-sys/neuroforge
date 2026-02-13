import test from "node:test";
import assert from "node:assert/strict";
import { postProtocolEnrollment, runEnrollClick } from "../../src/components/protocol/protocol-enroll-action.ts";

test("protocol enroll button action posts and toggles pending state", async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const mockFetch = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init });
    return {
      ok: true,
      async json() {
        return {
          enrollment: {
            protocolId: "protocol-core-reset-v1",
            startDate: "2026-02-12T00:00:00.000Z"
          }
        };
      }
    } as Response;
  }) as typeof fetch;

  const submitStates: boolean[] = [];
  let message: string | null = "initial";

  await runEnrollClick({
    protocolId: "protocol-core-reset-v1",
    isSubmitting: false,
    setIsSubmitting: (value) => {
      submitStates.push(value);
    },
    setMessage: (value) => {
      message = value;
    },
    enrollImpl: (protocolId) => postProtocolEnrollment(protocolId, mockFetch)
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "/api/protocol/enroll");
  assert.equal(calls[0].init?.method, "POST");
  assert.equal(submitStates[0], true);
  assert.equal(submitStates[1], false);
  assert.equal(message, "Enrolled in protocol-core-reset-v1");
});

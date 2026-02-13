import test from "node:test";
import assert from "node:assert/strict";
import { loadProtocolCatalog } from "../../app/protocols/catalog-loader.ts";

test("protocol selector page renders catalog titles when API returns items", async () => {
  const mockFetch = (async () =>
    ({
      ok: true,
      async json() {
        return {
          items: [
            {
              id: "protocol-core-reset-v1",
              slug: "core-reset",
              title: "Core Reset",
              shortDescription: "Daily regulation and focus restoration protocol.",
              totalDays: 30,
              phaseCount: 2
            }
          ]
        };
      }
    }) as Response) as typeof fetch;

  const result = await loadProtocolCatalog(mockFetch);
  assert.deepEqual(result.items.map((item) => item.title), ["Core Reset"]);
  assert.equal(result.error, null);
});

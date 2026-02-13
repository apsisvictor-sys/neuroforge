import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TodayProtocolHeader } from "../../src/components/today/TodayProtocolHeader.ts";

test("today protocol header renders protocol title and slug", () => {
  const html = renderToStaticMarkup(createElement(TodayProtocolHeader, { title: "Core Reset", slug: "core-reset" }));

  assert.match(html, /Protocol: Core Reset \(core-reset\)/);
});

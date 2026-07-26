import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const script = await readFile(new URL("../web-app.js", import.meta.url), "utf8");

test("web dashboard exposes the real gateway workflow", () => {
  for (const required of [
    'id="gatewayBaseUrl"',
    'id="siteId"',
    'id="refreshStatus"',
    'id="shortDurationCount"',
    'id="reviewQueue"',
  ]) {
    assert.ok(html.includes(required), `missing ${required}`);
  }
});

test("web dashboard provides one deterministic review demo control", () => {
  assert.ok(html.includes('id="generateDemoEvent"'));
  assert.ok(html.includes("生成演示事件"));

  for (const forbidden of ["实时模拟", "data-mode="]) {
    assert.ok(!html.includes(forbidden), `unexpected simulation UI: ${forbidden}`);
  }

  for (const forbidden of ["Math.random", "setInterval(", "simulatedSeconds"]) {
    assert.ok(!script.includes(forbidden), `unexpected simulation logic: ${forbidden}`);
  }
});

test("web dashboard keeps the clinical decision boundary visible", () => {
  assert.ok(html.includes("不作为个人手卫生依从性的最终质控依据"));
  assert.ok(html.includes("等待真实设备事件"));
});

import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("site routes the first screen to the hand-hygiene dashboard", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
  ]);

  assert.match(page, /redirect\("\/prototype\/index\.html"\)/);
  assert.match(layout, /手护智感 AI 智能体/);
  assert.match(layout, /lang="zh-CN"/);
  assert.doesNotMatch(page, /codex-preview|SkeletonPreview/);
});

test("site packages the validated static dashboard", async () => {
  const [html, script, packageJson] = await Promise.all([
    readFile(new URL("public/prototype/index.html", root), "utf8"),
    readFile(new URL("public/prototype/web-app.js", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);

  assert.match(html, /id="generateDemoEvent"/);
  assert.match(html, /id="shortDurationCount"/);
  assert.doesNotMatch(html, /实时模拟/);
  assert.doesNotMatch(script, /Math\.random|setInterval\(/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await access(new URL("public/prototype/styles.css", root));
});

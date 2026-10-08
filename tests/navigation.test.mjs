import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const script = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");

// 用真实客户端脚本覆盖页面底部无法继续滚动的情况，不依赖浏览器计时。
function pageAtBottom(hash) {
  const positions = { top: 78, projects: 704, records: 1563, about: 1823 };
  const links = Object.keys(positions).map((id) => ({
    dataset: { section: id },
    current: false,
    setAttribute() { this.current = true; },
    removeAttribute() { this.current = false; },
  }));
  const handlers = {};
  const window = {
    scrollY: 1187, innerHeight: 1106, location: { hash },
    addEventListener(name, handler) { handlers[name] = handler; },
    requestAnimationFrame(handler) { handler(); },
  };
  const document = {
    documentElement: { scrollHeight: 2293 },
    querySelectorAll() { return links; },
    getElementById(id) { return { id, offsetTop: positions[id] }; },
    querySelector() { return { offsetHeight: 78 }; },
  };
  runInNewContext(script, { window, document });
  return { window, handlers, active: () => links.find((link) => link.current)?.dataset.section };
}

test("日志锚点在视口底部可见时保留日志高亮", () => {
  assert.equal(pageAtBottom("#records").active(), "records");
});

test("手动滚到底部时不会继续高亮已离开视口的项目锚点", () => {
  assert.equal(pageAtBottom("#projects").active(), "about");
});

test("不发生额外滚动的锚点切换也更新导航", () => {
  const page = pageAtBottom("#projects");
  page.window.location.hash = "#records";
  page.handlers.hashchange?.();
  assert.equal(page.active(), "records");
});

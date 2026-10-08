import assert from "node:assert/strict";
import test from "node:test";
import { renderPage } from "../src/render.mjs";
import { siteData } from "../src/site-data.mjs";

test("首页与分享资料使用零页品牌和新的 X 入口", () => {
  const html = renderPage();
  assert.match(html, /<title>零页/);
  assert.match(html, /https:\/\/x\.com\/page0lab/);
  assert.match(html, /这里从第 0 页/);
  assert.doesNotMatch(html, /序川|@seqriver|avatar-720|avatar-256/);
});

test("未发布日志时四个章节仍然可达，并显示真实空状态", () => {
  const html = renderPage({ ...siteData, records: [] });
  for (const id of ["top", "projects", "records", "about"]) {
    assert.match(html, new RegExp(`href="#${id}"`));
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /还没有发布构建日志/);
  assert.doesNotMatch(html, /class="record"/);
});

test("日志按日期倒序显示，编号保持资料中的稳定值", () => {
  const html = renderPage({
    ...siteData,
    records: [
      { id: "B001", date: "2026-10-01", title: "较早的记录", summary: "第一次尝试。", url: "" },
      { id: "B007", date: "2026-10-08", title: "最近的记录", summary: "新的取舍。", url: "https://example.com/log" },
    ],
  });
  assert.ok(html.indexOf("最近的记录") < html.indexOf("较早的记录"));
  assert.match(html, /B007/);
  assert.match(html, /B001/);
  assert.doesNotMatch(html, /还没有发布构建日志|href=""/);
});

test("项目与日志文字被转义，缺失的项目入口不会生成空按钮", () => {
  const html = renderPage({
    ...siteData,
    records: [{ id: "B001", date: "2026-10-08", title: '<script>alert("x")</script>', summary: "A & B", url: "" }],
  });
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /A &amp; B/);
  assert.doesNotMatch(html, /<script>alert|href=""|查看下载/);
});

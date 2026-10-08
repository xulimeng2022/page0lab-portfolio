import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSite } from "./build.mjs";
import { siteData } from "../src/site-data.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { outDir, html } = buildSite();
const failures = [];
const requiredText = [
  "零页",
  "学着写代码，也学着把想法做成真的东西。",
  "智能收纳助手",
  "Obsidian Bridge",
  "多 Agent 开发实践",
  "https://x.com/page0lab",
  "https://github.com/xulimeng2022/SmartStorageAssistant",
  "构建日志",
  "关于零页",
];
const forbiddenText = [
  "徐力萌",
  "湖南大学",
  "hnu.edu.cn",
  "xulimeng2022.github.io/app",
  "xulimeng2026",
  "cdn.jsdelivr.net",
  "序川",
  "@seqriver",
  "avatar-720",
  "avatar-256",
];

for (const text of requiredText) {
  if (!html.includes(text)) failures.push(`缺少必需内容: ${text}`);
}

for (const text of forbiddenText) {
  if (html.toLowerCase().includes(text.toLowerCase())) failures.push(`发现禁止内容: ${text}`);
}

if (!siteData.records.length && !html.includes("还没有发布构建日志")) {
  failures.push("日志列表为空时缺少真实空状态");
}

for (const bad of ['href=""', 'src=""']) {
  if (html.includes(bad)) failures.push(`发现空链接或空图片: ${bad}`);
}

const attributes = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
for (const value of attributes) {
  if (value.startsWith("#")) {
    if (!html.includes(`id="${value.slice(1)}"`)) failures.push(`章节链接没有目标: ${value}`);
    continue;
  }
  if (value.startsWith("https://") || value.startsWith("mailto:") || value.startsWith("data:")) {
    continue;
  }
  const localPath = value.startsWith("/") ? value.slice(1) : value;
  if (!existsSync(path.join(outDir, localPath))) failures.push(`本地资源不存在: ${value}`);
}

for (const asset of ["avatar-720.jpg", "avatar-256.jpg", "avatar-source.png"]) {
  if (existsSync(path.join(outDir, "assets", asset))) failures.push(`构建产物仍包含旧头像: ${asset}`);
}

if (failures.length) {
  console.error("内容校验失败：");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`内容校验通过：${siteData.projects.length} 个项目，${siteData.records.length} 篇文章。`);


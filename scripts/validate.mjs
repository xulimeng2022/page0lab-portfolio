import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSite } from "./build.mjs";
import { siteData } from "../src/site-data.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { outDir, html } = buildSite();
const failures = [];
const requiredText = [
  "序川",
  "用 AI 做点自己真正用得上的东西。",
  "智能收纳助手",
  "Obsidian Bridge",
  "多 Agent 开发实践",
  "https://x.com/seqriver",
  "https://github.com/xulimeng2022/SmartStorageAssistant",
  "Created By Deerflow",
];
const forbiddenText = [
  "徐力萌",
  "湖南大学",
  "hnu.edu.cn",
  "xulimeng2022.github.io/app",
  "xulimeng2026",
  "cdn.jsdelivr.net",
];

for (const text of requiredText) {
  if (!html.includes(text)) failures.push(`缺少必需内容: ${text}`);
}

for (const text of forbiddenText) {
  if (html.toLowerCase().includes(text.toLowerCase())) failures.push(`发现禁止内容: ${text}`);
}

if (!siteData.records.length && html.includes('href="#records"')) {
  failures.push("文章列表为空时仍渲染了“记录”导航项");
}

for (const bad of ['href=""', 'src=""']) {
  if (html.includes(bad)) failures.push(`发现空链接或空图片: ${bad}`);
}

const attributes = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
for (const value of attributes) {
  if (value.startsWith("#") || value.startsWith("https://") || value.startsWith("mailto:") || value.startsWith("data:")) {
    continue;
  }
  const localPath = value.startsWith("/") ? value.slice(1) : value;
  if (!existsSync(path.join(outDir, localPath))) failures.push(`本地资源不存在: ${value}`);
}

const avatarSource = path.join(root, "public", "assets", "avatar-source.png");
if (!existsSync(avatarSource)) failures.push("缺少头像原始文件");

if (failures.length) {
  console.error("内容校验失败：");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`内容校验通过：${siteData.projects.length} 个项目，${siteData.records.length} 篇文章。`);


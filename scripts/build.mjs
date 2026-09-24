import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { renderPage } from "../src/render.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// 只允许清理项目内的构建目录，避免误删工作区外部文件。
function ensureSafeOutput(outputDir) {
  const resolved = path.resolve(root, outputDir);
  const relative = path.relative(root, resolved);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`不安全的输出目录: ${resolved}`);
  }
  return resolved;
}

export function buildSite({ outputDir = "dist" } = {}) {
  const outDir = ensureSafeOutput(outputDir);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const html = renderPage();
  writeFileSync(path.join(outDir, "index.html"), html, "utf8");
  cpSync(path.join(root, "src", "styles.css"), path.join(outDir, "styles.css"));
  cpSync(path.join(root, "src", "app.js"), path.join(outDir, "app.js"));
  cpSync(path.join(root, "public", "assets"), path.join(outDir, "assets"), {
    recursive: true,
    filter: (source) => !source.endsWith("avatar-source.png"),
  });
  cpSync(path.join(root, "public", "favicon.svg"), path.join(outDir, "favicon.svg"));

  return { outDir, html };
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const result = buildSite();
  console.log(`构建完成: ${result.outDir}`);
}


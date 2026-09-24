import { buildSite } from "./build.mjs";

// 生成 GitHub Pages 使用的静态产物，保留在 docs 目录中。
const result = buildSite({ outputDir: "docs" });
console.log(`GitHub Pages 构建完成: ${result.outDir}`);

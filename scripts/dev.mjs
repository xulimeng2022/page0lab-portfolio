import { createServer } from "node:http";
import { existsSync, readFileSync, statSync, watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSite } from "./build.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const previewDir = path.resolve(root, ".preview", String(process.pid));
const host = "127.0.0.1";
const port = Number(process.env.PORT || 4173);
buildSite({ outputDir: path.join(".preview", String(process.pid)) });

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

const server = createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    let filePath = path.resolve(previewDir, requested);
    const relative = path.relative(previewDir, filePath);

    if (relative.startsWith("..") || path.isAbsolute(relative) || !existsSync(filePath)) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("404 Not Found");
      return;
    }

    if (statSync(filePath).isDirectory()) filePath = path.join(filePath, "index.html");
    if (!existsSync(filePath)) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("404 Not Found");
      return;
    }

    const body = readFileSync(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(body);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`500 Internal Server Error\n${error.message}`);
  }
});

let rebuildTimer;
function scheduleRebuild() {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(() => {
    try {
      buildSite({ outputDir: path.join(".preview", String(process.pid)) });
      console.log("检测到修改，预览已更新");
    } catch (error) {
      console.error(`重建失败: ${error.message}`);
    }
  }, 100);
}

watch(path.join(root, "src"), { recursive: true }, scheduleRebuild);
watch(path.join(root, "public"), { recursive: true }, scheduleRebuild);

server.listen(port, host, () => {
  console.log(`本地预览: http://${host}:${port}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

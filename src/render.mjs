import { siteData } from "./site-data.mjs";

// 资料以纯文本维护，统一转义后再写入页面。
function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function externalLink(url, label, className = "text-link") {
  if (!url) return "";
  return `<a class="${className}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
}

function chapterHeading(number, title, id, subtitle) {
  return `<div class="chapter-heading">
    <p class="chapter-number" aria-hidden="true">${number}</p>
    <h2 id="${id}">${title}</h2>
    <p class="chapter-subtitle">${subtitle}</p>
  </div>`;
}

function projectDetails(project) {
  return `<details class="project-details">
    <summary>实践过程与限制</summary>
    <div class="details-body">
      <p><strong>实践过程</strong>${escapeHtml(project.process)}</p>
      <p><strong>当前限制</strong>${escapeHtml(project.limitations)}</p>
    </div>
  </details>`;
}

function projectLinks(project) {
  return [["source", "查看源码"], ["download", "查看下载"], ["article", "阅读记录"]]
    .map(([key, label]) => externalLink(project.links[key], label))
    .join("");
}

function renderProjects(projects) {
  return projects.map((project, index) => {
    const featured = index === 0;
    const screenshots = featured && project.media.type === "screenshot-group"
      ? `<figure class="project-preview">
          <div class="screenshot-pair">${project.media.items.slice(0, 2).map((item) =>
            `<img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" width="720" height="1583" loading="lazy" decoding="async">`
          ).join("")}</div>
          <figcaption>${escapeHtml(project.media.label)} · 已有版本</figcaption>
        </figure>`
      : "";
    return `<article class="project${featured ? " project--featured" : ""}" id="project-${escapeHtml(project.id)}">
      <div class="project-copy">
        <p class="project-kind">${escapeHtml(project.kicker)}</p>
        <h3>${escapeHtml(project.name)}</h3>
        <p class="project-summary">${escapeHtml(project.summary)}</p>
        <p class="project-status">${escapeHtml(project.status)}</p>
        <div class="project-links">${projectLinks(project)}</div>
        ${projectDetails(project)}
      </div>
      ${screenshots}
    </article>`;
  }).join("");
}

function renderRecords(records) {
  if (!records.length) {
    return `<div class="records-empty">
      <p class="empty-title">还没有发布构建日志。</p>
      <p>这里会留下每一次尝试、取舍，以及下一步。</p>
    </div>`;
  }
  return `<div class="record-list">${[...records]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((record) => `<article class="record">
      <div class="record-meta"><span>${escapeHtml(record.id || record.date)}</span><time datetime="${escapeHtml(record.date)}">${escapeHtml(record.date)}</time></div>
      <div><h3>${record.url ? externalLink(record.url, record.title) : escapeHtml(record.title)}</h3><p>${escapeHtml(record.summary)}</p></div>
    </article>`).join("")}</div>`;
}

export function renderPage(data = siteData) {
  const canonicalUrl = data.productionUrl ? new URL(".", data.productionUrl).href : "";
  const shareImage = canonicalUrl ? new URL(data.brand.image, canonicalUrl).href : "";
  const navigation = [["00", "top", "首页"], ["01", "projects", "正在构建"], ["02", "records", "构建日志"], ["03", "about", "关于"]]
    .map(([number, id, label]) => `<a href="#${id}" data-section="${id}"${id === "top" ? ' aria-current="location"' : ""}><span class="nav-number" aria-hidden="true">${number}</span><span>${label}</span></a>`).join("");

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#f7f5ef">
    <title>${escapeHtml(data.title)}</title>
    <meta name="description" content="${escapeHtml(data.description)}">
    <link rel="icon" href="${escapeHtml(data.brand.image)}" type="image/png">
    <link rel="preload" href="${escapeHtml(data.brand.image)}" as="image" fetchpriority="high">
    <link rel="stylesheet" href="./styles.css">
    ${canonicalUrl ? `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">` : ""}
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(data.title)}">
    <meta property="og:description" content="${escapeHtml(data.description)}">
    <meta property="og:locale" content="zh_CN">
    ${canonicalUrl ? `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">` : ""}
    ${shareImage ? `<meta property="og:image" content="${escapeHtml(shareImage)}">` : ""}
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${escapeHtml(data.title)}">
    <meta name="twitter:description" content="${escapeHtml(data.description)}">
    ${shareImage ? `<meta name="twitter:image" content="${escapeHtml(shareImage)}">` : ""}
    <script src="./app.js" defer></script>
  </head>
  <body>
    <a class="skip-link" href="#main">跳到主要内容</a>
    <header class="site-header" id="site-header">
      <div class="header-inner">
        <a class="brand" href="#top" aria-label="零页，回到首页">
          <img src="${escapeHtml(data.brand.image)}" alt="" width="48" height="48">
          <span>${escapeHtml(data.name)}</span>
        </a>
        <nav class="site-nav" aria-label="主导航">${navigation}</nav>
      </div>
    </header>

    <main id="main" class="page">
      <section class="hero" id="top" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">${escapeHtml(data.hero.eyebrow)}</p>
          <h1 id="hero-title">${data.hero.title.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}</h1>
          <p class="hero-lead">${escapeHtml(data.hero.lead)}</p>
          <p class="hero-intro">${escapeHtml(data.hero.intro)}</p>
          <div class="hero-actions">
            <a class="button" href="#projects">看我正在构建</a>
            <a class="text-link" href="#records">读构建日志</a>
          </div>
        </div>
        <figure class="hero-art">
          <img src="${escapeHtml(data.brand.image)}" alt="${escapeHtml(data.brand.alt)}" width="1024" height="1024" fetchpriority="high" decoding="async">
          <figcaption>PAGE 0 — build from here.</figcaption>
        </figure>
        <p class="hero-folio" aria-hidden="true">00 / 首页</p>
      </section>

      <section class="chapter projects" id="projects" aria-labelledby="projects-title">
        ${chapterHeading("01", "正在构建", "projects-title", "从身边的问题开始。")}
        <div class="project-list">${renderProjects(data.projects)}</div>
      </section>

      <section class="chapter records" id="records" aria-labelledby="records-title">
        ${chapterHeading("02", "构建日志", "records-title", "不太完美，但真实。")}
        ${renderRecords(data.records)}
      </section>

      <section class="chapter about" id="about" aria-labelledby="about-title">
        ${chapterHeading("03", "关于零页", "about-title", "边学边做，持续往后翻。")}
        <div class="about-body">
          <div class="about-copy">${data.about.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
            <div class="about-links">${externalLink(data.xUrl, "在 X 继续交流")}${externalLink(data.githubUrl, "GitHub")}</div>
          </div>
          <aside class="about-aside" aria-label="正在学习与探索">
            <p class="aside-label">正在学习与探索</p>
            <ul>${data.about.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>
            <p class="aside-note">从一个小问题，到一个能用的东西。</p>
          </aside>
        </div>
      </section>
    </main>

    <footer class="site-footer page">
      <p>© ${new Date().getFullYear()} ${escapeHtml(data.name)} · 这里从第 0 页开始。</p>
      <div>${externalLink(data.xUrl, `X / ${data.xHandle}`)}<a class="text-link" href="#top">回到第 0 页</a></div>
    </footer>
  </body>
</html>`.replace(/[ \t]+$/gm, "");
}

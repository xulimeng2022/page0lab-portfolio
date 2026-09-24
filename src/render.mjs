import { siteData } from "./site-data.mjs";

// 转义来自资料的文本，避免生成阶段破坏 HTML 结构。
function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderExternalLink(url, label, className = "button button--ghost") {
  if (!url) return "";
  return `<a class="${className}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}<span aria-hidden="true">↗</span></a>`;
}

function renderMedia(media) {
  if (media.type === "screenshot-group") {
    const shots = media.items
      .map(
        (item, index) => `
          <figure class="phone-shot phone-shot--${index + 1}">
            <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" width="720" height="1583" loading="lazy" decoding="async">
          </figure>`,
      )
      .join("");

    return `
      <div class="media-card media-card--screens" aria-label="${escapeHtml(media.label)}">
        <div class="media-label">${escapeHtml(media.label)}</div>
        <div class="phone-stack">${shots}</div>
      </div>`;
  }

  if (media.type === "concept-diagram") {
    return `
      <div class="media-card media-card--diagram" aria-label="${escapeHtml(media.label)}">
        <div class="media-label">${escapeHtml(media.label)}</div>
        <div class="bridge-diagram" role="img" aria-label="概念示意：Google Docs 在手机端编辑，进入 Drive Inbox，再同步到本地 Obsidian，并可反向刷新 Google Doc">
          <div class="diagram-node diagram-node--doc">
            <span class="diagram-icon" aria-hidden="true">✎</span>
            <strong>Google Docs</strong>
            <small>手机编辑</small>
          </div>
          <div class="diagram-flow" aria-hidden="true"><span>Inbox</span></div>
          <div class="diagram-hub">
            <span class="diagram-icon" aria-hidden="true">⌁</span>
            <strong>Drive</strong>
            <small>中转与状态</small>
          </div>
          <div class="diagram-flow diagram-flow--reverse" aria-hidden="true"><span>刷新</span></div>
          <div class="diagram-node diagram-node--obsidian">
            <span class="diagram-icon" aria-hidden="true">◇</span>
            <strong>Obsidian</strong>
            <small>唯一主库</small>
          </div>
          <p class="diagram-note">冲突不覆盖 · 不确定时人工确认</p>
        </div>
      </div>`;
  }

  if (media.type === "workflow-image") {
    return `
      <div class="media-card media-card--workflow">
        <div class="media-label">${escapeHtml(media.label)}</div>
        <img src="${escapeHtml(media.src)}" alt="${escapeHtml(media.alt)}" width="900" height="1620" loading="lazy" decoding="async">
      </div>`;
  }

  return "";
}

function renderProject(project) {
  const points = project.points
    .map((point) => `<li><span aria-hidden="true"></span>${escapeHtml(point)}</li>`)
    .join("");
  const facts = project.facts
    .map((fact) => `<span>${escapeHtml(fact)}</span>`)
    .join("");
  const links = [
    ["source", "GitHub 仓库"],
    ["download", "查看下载"],
    ["article", "阅读文章"],
  ]
    .filter(([key]) => project.links[key])
    .map(([key, label]) => renderExternalLink(project.links[key], label, "text-link"))
    .join("");

  return `
    <article class="project project--${escapeHtml(project.id)} reveal" id="project-${escapeHtml(project.id)}">
      <div class="project-media">${renderMedia(project.media)}</div>
      <div class="project-copy">
        <div class="project-topline">
          <span class="project-index">${escapeHtml(project.index)}</span>
          <span class="project-kicker">${escapeHtml(project.kicker)}</span>
        </div>
        <h3>${escapeHtml(project.name)}</h3>
        <p class="project-summary">${escapeHtml(project.summary)}</p>
        <p class="project-status"><span aria-hidden="true"></span>${escapeHtml(project.status)}</p>
        <div class="project-facts">${facts}</div>
        ${links ? `<div class="project-links">${links}</div>` : ""}
        <ul class="project-points">${points}</ul>
        <details class="project-details">
          <summary>实践过程与限制</summary>
          <div class="details-body">
            <p><strong>实践过程</strong>${escapeHtml(project.process)}</p>
            <p><strong>当前限制</strong>${escapeHtml(project.limitations)}</p>
          </div>
        </details>
      </div>
    </article>`;
}

function renderRecords() {
  if (!siteData.records.length) return { nav: "", section: "" };

  const items = siteData.records
    .map(
      (record) => `
        <article class="record reveal">
          <time datetime="${escapeHtml(record.date)}">${escapeHtml(record.date)}</time>
          <div>
            <h3><a href="${escapeHtml(record.url)}">${escapeHtml(record.title)}<span aria-hidden="true">↗</span></a></h3>
            <p>${escapeHtml(record.summary)}</p>
          </div>
        </article>`,
    )
    .join("");

  return {
    nav: '<a href="#records" data-section="records">记录</a>',
    section: `
      <section class="section records" id="records" aria-labelledby="records-title">
        <div class="section-heading reveal">
          <p class="section-label">RECORDS</p>
          <h2 id="records-title">最近记录</h2>
          <p>把已经发布、值得回看的实践整理在这里。</p>
        </div>
        <div class="record-list">${items}</div>
      </section>`,
  };
}

function renderPage() {
  const records = renderRecords();
  const projectList = siteData.projects.map(renderProject).join("");
  const tags = siteData.about.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("");
  const aboutParagraphs = siteData.about.paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
  const xHero = renderExternalLink(siteData.xUrl, "在 X 找我", "button button--light");
  const xAbout = renderExternalLink(siteData.xUrl, "在 X 继续交流", "text-link text-link--large");
  const canonical = siteData.productionUrl
    ? `<link rel="canonical" href="${escapeHtml(new URL(".", siteData.productionUrl).href)}">`
    : "";
  const ogUrl = siteData.productionUrl
    ? `<meta property="og:url" content="${escapeHtml(new URL(".", siteData.productionUrl).href)}">`
    : "";
  const ogImage = siteData.productionUrl
    ? `<meta property="og:image" content="${escapeHtml(new URL(siteData.avatar.web, siteData.productionUrl).href)}">`
    : "";
  const year = new Date().getFullYear();

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#f7f3ea">
    <title>${escapeHtml(siteData.title)}</title>
    <meta name="description" content="${escapeHtml(siteData.description)}">
    <link rel="icon" href="./favicon.svg" type="image/svg+xml">
    <link rel="preload" href="${escapeHtml(siteData.avatar.web)}" as="image" fetchpriority="high">
    <link rel="stylesheet" href="./styles.css">
    ${canonical}
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(siteData.title)}">
    <meta property="og:description" content="${escapeHtml(siteData.description)}">
    <meta property="og:locale" content="zh_CN">
    ${ogUrl}
    ${ogImage}
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${escapeHtml(siteData.title)}">
    <meta name="twitter:description" content="${escapeHtml(siteData.description)}">
    <script>document.documentElement.classList.add('js');</script>
    <script src="./app.js" defer></script>
  </head>
  <body>
    <a class="skip-link" href="#main">跳到主要内容</a>
    <header class="site-header" id="site-header">
      <a class="brand" href="#top" aria-label="回到页面顶部">
        <img src="${escapeHtml(siteData.avatar.thumb)}" alt="" width="256" height="256">
        <span>${escapeHtml(siteData.name)}</span>
      </a>
      <nav class="site-nav" aria-label="主导航">
        <a href="#projects" data-section="projects">作品</a>
        ${records.nav}
        <a href="#about" data-section="about">关于</a>
      </nav>
    </header>

    <main id="main">
      <section class="hero" id="top" aria-labelledby="hero-title">
        <div class="hero-river" aria-hidden="true">
          <svg viewBox="0 0 760 230" preserveAspectRatio="none">
            <path d="M-20 180C130 30 246 214 410 92S642 24 790 150"/>
            <path d="M-20 208C142 66 260 230 432 119S655 54 792 180"/>
          </svg>
        </div>
        <div class="hero-copy">
          <p class="eyebrow reveal">${escapeHtml(siteData.hero.eyebrow)}</p>
          <h1 id="hero-title" class="reveal">${escapeHtml(siteData.name)}</h1>
          <p class="hero-lead reveal">${escapeHtml(siteData.hero.lead)}</p>
          <p class="hero-intro reveal">${escapeHtml(siteData.hero.intro)}</p>
          <div class="hero-actions reveal">
            <a class="button button--primary" href="#projects">看看我的项目<span aria-hidden="true">↓</span></a>
            ${xHero}
          </div>
        </div>
        <figure class="portrait reveal">
          <div class="portrait-frame">
            <span class="portrait-orbit portrait-orbit--one" aria-hidden="true"></span>
            <span class="portrait-orbit portrait-orbit--two" aria-hidden="true"></span>
            <img src="${escapeHtml(siteData.avatar.web)}" alt="${escapeHtml(siteData.avatar.alt)}" width="720" height="720" fetchpriority="high" decoding="async">
          </div>
          <figcaption><span aria-hidden="true">⌁</span> 从自己的需求出发</figcaption>
        </figure>
      </section>

      <section class="section projects" id="projects" aria-labelledby="projects-title">
        <div class="section-heading reveal">
          <p class="section-label">SELECTED WORK</p>
          <h2 id="projects-title">做过的东西</h2>
          <p>优先展示真实成果、实际做法，以及还没有解决好的部分。</p>
        </div>
        <div class="project-list">${projectList}</div>
      </section>

      ${records.section}

      <section class="section about" id="about" aria-labelledby="about-title">
        <div class="about-copy reveal">
          <p class="section-label">ABOUT</p>
          <h2 id="about-title">关于序川</h2>
          ${aboutParagraphs}
          ${xAbout}
        </div>
        <aside class="about-side reveal" aria-label="关注方向">
          <p>常在做的事</p>
          <ul>${tags}</ul>
        </aside>
      </section>
    </main>

    <footer class="site-footer">
      <p>© ${year} ${escapeHtml(siteData.name)} · 把想法做成能用的东西</p>
      <p>
        ${siteData.xUrl ? `<a href="${escapeHtml(siteData.xUrl)}" target="_blank" rel="noopener noreferrer">X / @seqriver</a><span aria-hidden="true">·</span>` : ""}
        <a href="https://deerflow.tech" target="_blank" rel="noopener noreferrer">Created By Deerflow</a>
      </p>
    </footer>
  </body>
</html>`;
}

export { renderPage };





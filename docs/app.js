// 四个页码是同页章节。内容默认可见，关闭 JavaScript 仍然能够浏览。
const navLinks = [...document.querySelectorAll(".site-nav a[data-section]")];
const sections = navLinks
  .map((link) => document.getElementById(link.dataset.section))
  .filter(Boolean);

function updateActiveNav() {
  const marker = window.scrollY + document.querySelector("#site-header").offsetHeight + 40;
  const atPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
  const hashTarget = sections.find((section) => `#${section.id}` === window.location.hash);
  // 锚点位于末尾且无法继续滚动时，仍保留用户实际选择的可见章节。
  const clampedTarget = atPageEnd && hashTarget && hashTarget.offsetTop >= marker
    && hashTarget.offsetTop < window.scrollY + window.innerHeight;
  const active = clampedTarget ? hashTarget : atPageEnd
    ? sections.at(-1)
    : [...sections].reverse().find((section) => marker >= section.offsetTop) || sections[0];

  navLinks.forEach((link) => {
    if (link.dataset.section === active?.id) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

let ticking = false;
function scheduleUpdate() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    updateActiveNav();
    ticking = false;
  });
}

window.addEventListener("scroll", scheduleUpdate, { passive: true });
window.addEventListener("resize", scheduleUpdate);
window.addEventListener("hashchange", scheduleUpdate);
window.addEventListener("load", scheduleUpdate);
updateActiveNav();

// 页面的轻量交互：滚动状态、导航高亮和进入视口动画。
const header = document.querySelector("#site-header");
const navLinks = [...document.querySelectorAll(".site-nav a[data-section]")];
const sections = navLinks
  .map((link) => document.querySelector(`#${link.dataset.section}`))
  .filter(Boolean);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateActiveNav() {
  const marker = window.scrollY + Math.min(window.innerHeight * 0.35, 320);
  const atPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
  const active = atPageEnd
    ? sections.at(-1)
    : sections.find(
        (section) => marker >= section.offsetTop && marker < section.offsetTop + section.offsetHeight,
      );

  navLinks.forEach((link) => {
    if (active && link.dataset.section === active.id) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function updatePageChrome() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
  updateActiveNav();
}

let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updatePageChrome();
      ticking = false;
    });
  },
  { passive: true },
);
updatePageChrome();

if (reduceMotion || !("IntersectionObserver" in window)) {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -9% 0px", threshold: 0.08 },
  );
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
}


(() => {
  const root = document.documentElement;

  // Theme (saved preference, else system)
  const saved = (() => { try { return localStorage.getItem("theme"); } catch { return null; } })();
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = saved || (prefersDark ? "dark" : "light");
  document.getElementById("themeToggle").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
  });

  // Mobile menu (sidebar slides in)
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const links = document.getElementById("navLinks");
  const setOpen = open => {
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  };
  burger.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setOpen(false)));

  // Collapse / expand sidebar (desktop), remembered
  const collapseBtn = document.getElementById("collapseBtn");
  const applyCollapsed = c => {
    document.body.classList.toggle("sidebar-collapsed", c);
    collapseBtn.setAttribute("aria-expanded", !c);
    collapseBtn.setAttribute("aria-label", c ? "Expand sidebar" : "Collapse sidebar");
  };
  const savedC = (() => { try { return localStorage.getItem("sidebarCollapsed") === "1"; } catch { return false; } })();
  applyCollapsed(savedC);
  collapseBtn.addEventListener("click", () => {
    const c = !document.body.classList.contains("sidebar-collapsed");
    applyCollapsed(c);
    try { localStorage.setItem("sidebarCollapsed", c ? "1" : "0"); } catch {}
  });

  // Active link on scroll
  const sections = [...document.querySelectorAll("main section[id]")];
  const navAnchors = [...links.querySelectorAll("a")];
  const onScroll = () => {
    const y = window.scrollY + 120;
    const current = sections.filter(s => s.offsetTop <= y).pop();
    navAnchors.forEach(a => a.classList.toggle("active", current && a.getAttribute("href") === "#" + current.id));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Typing effect
  const roles = ["Software Engineer", "Java / Spring Boot Developer", "Event-Driven Systems", "LLM Integration with Spring AI"];
  const typed = document.getElementById("typed");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    typed.textContent = roles[0];
  } else {
    let r = 0, c = 0, deleting = false;
    const tick = () => {
      const word = roles[r];
      typed.textContent = word.slice(0, c);
      if (!deleting && c === word.length) { deleting = true; return setTimeout(tick, 1400); }
      if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; }
      c += deleting ? -1 : 1;
      setTimeout(tick, deleting ? 35 : 70);
    };
    tick();
  }

  // Count-up
  const countUp = el => {
    const target = +el.dataset.count, suffix = el.dataset.suffix || "";
    const start = performance.now(), dur = 1200;
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      e.target.querySelectorAll("[data-count]").forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  document.getElementById("year").textContent = new Date().getFullYear();
})();

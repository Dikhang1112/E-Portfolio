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

  // Mobile menu
  const burger = document.getElementById("burger");
  const links = document.getElementById("navLinks");
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    links.classList.remove("open");
    burger.setAttribute("aria-expanded", false);
  }));

  // Nav border on scroll + active link
  const nav = document.getElementById("nav");
  const sections = [...document.querySelectorAll("main section[id]")];
  const navAnchors = [...links.querySelectorAll("a")];
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 10);
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

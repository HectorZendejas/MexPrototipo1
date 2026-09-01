// ==========================================================================
// MEX — interações de front-end (sem dependências externas)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {

  const siteLinks = {
    "whatsapp-contact": "https://wa.me/5585920032695?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20mex!",
    "whatsapp-footer": "https://wa.me/5585920032695",
    instagram: "#",
    linkedin: "https://www.linkedin.com/company/mex-solu%C3%A7%C3%B5es-digitais/home/?viewAsMember=true"
  };

  document.querySelectorAll("[data-link-key]").forEach((link) => {
    const key = link.dataset.linkKey;
    const url = siteLinks[key];

    if (url) {
      link.href = url;
    }
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------- Menu mobile -------------------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  /* -------------------- Scroll reveal (fade-in / títulos / grids) -------------------- */
  const revealTargets = document.querySelectorAll(".fade-in, .reveal-text, .services-grid, .pillars-grid");

  if ("IntersectionObserver" in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("in-view"));
  }

  /* -------------------- Cascata dos cards (bento) -------------------- */
  document.querySelectorAll(".services-grid, .pillars-grid").forEach((grid) => {
    Array.from(grid.children).forEach((card, index) => {
      card.style.setProperty("--stagger", index);
    });
  });


  /* -------------------- Ano no rodapé -------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------- Header: encolhe e ganha sombra ao rolar -------------------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

});

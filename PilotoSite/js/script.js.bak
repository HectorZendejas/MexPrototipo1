// ==========================================================================
// MEX — interações de front-end (sem dependências externas)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------- Logo do header: animação de entrada (uma vez) --------------------
     Só dispara depois que o ícone do dino termina de carregar (ou de
     imediato, se já estiver em cache) — timeout de segurança caso o
     evento de load nunca chegue a disparar.
  ------------------------------------------------------------------- */
  const brand = document.querySelector(".site-header .brand");
  const brandIcon = brand ? brand.querySelector(".brand-icon") : null;

  if (brand && brandIcon) {
    let brandAnimTriggered = false;
    const triggerBrandAnim = () => {
      if (brandAnimTriggered) return;
      brandAnimTriggered = true;
      requestAnimationFrame(() => brand.classList.add("is-ready"));
    };

    if (brandIcon.complete) {
      triggerBrandAnim();
    } else {
      brandIcon.addEventListener("load", triggerBrandAnim, { once: true });
      brandIcon.addEventListener("error", triggerBrandAnim, { once: true });
      setTimeout(triggerBrandAnim, 800);
    }
  }

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

  /* -------------------- Scroll reveal (fade-in) -------------------- */
  const revealTargets = document.querySelectorAll(".fade-in");

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

  /* -------------------- Contagem crescente das estatísticas -------------------- */
  const statValues = document.querySelectorAll("[data-count-to]");

  if (statValues.length) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.countTo, 10);
      const suffix = el.dataset.suffix || "";

      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        el.textContent = target.toLocaleString("pt-BR") + suffix;
        return;
      }

      const duration = 1200;
      let start = null;

      const step = (timestamp) => {
        if (start === null) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(eased * target).toLocaleString("pt-BR");
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      const countObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      statValues.forEach((el) => countObserver.observe(el));
    } else {
      statValues.forEach((el) => animateCount(el));
    }
  }

  /* -------------------- Setas do "O que a gente faz?" -------------------- */
  const orbit = document.querySelector(".orbit");

  if (orbit) {
    if ("IntersectionObserver" in window) {
      const orbitObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.35 }
      );
      orbitObserver.observe(orbit);
    } else {
      orbit.classList.add("in-view");
    }
  }

  /* -------------------- Setas do orbit: alinhar a ponta com a curva --------------------
     A ponta é desenhada como um triângulo próprio (não um marker de SVG,
     que ignora stroke-dasharray). Calculamos a posição e o ângulo exatos a
     partir da geometria real de cada curva, em vez de valores fixos — assim
     a ponta sempre encosta certinho no fim do traço, sem depender de conta
     de trigonometria feita à mão.
  ------------------------------------------------------------------- */
  // Quanto a ponta avança pra frente do fim da linha (unidades do viewBox,
  // que vai de 0 a 100). Aumente pra jogar o triângulo mais pra frente;
  // 0 deixa a ponta exatamente onde a linha termina.
  const ORBIT_ARROWHEAD_FORWARD_OFFSET = 2.5;

  document.querySelectorAll(".orbit-arrow").forEach((group) => {
    const line = group.querySelector(".orbit-path");
    const head = group.querySelector(".orbit-arrowhead");
    if (!line || !head || typeof line.getTotalLength !== "function") return;

    const length = line.getTotalLength();
    const end = line.getPointAtLength(length);
    const justBefore = line.getPointAtLength(Math.max(0, length - 1));

    const dx = end.x - justBefore.x;
    const dy = end.y - justBefore.y;
    const dist = Math.hypot(dx, dy) || 1;
    const dirX = dx / dist;
    const dirY = dy / dist;

    const tipX = end.x + dirX * ORBIT_ARROWHEAD_FORWARD_OFFSET;
    const tipY = end.y + dirY * ORBIT_ARROWHEAD_FORWARD_OFFSET;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    head.setAttribute("transform", `translate(${tipX},${tipY}) rotate(${angle})`);
  });

  /* -------------------- "O que a gente faz?": itens interativos --------------------
     Desktop: hover/foco já revela a descrição via CSS (:hover / :focus-visible).
     Aqui garantimos: 1) a seta correspondente também acende junto com o item
     (item e seta vivem em listas separadas no DOM, então isso precisa de JS);
     2) toque/clique funciona como toggle (abre no 1º toque, fecha no 2º ou ao
     tocar fora) — o mesmo comportamento serve tanto pra touch quanto como um
     "fixar aberto" a clique no desktop.
  ------------------------------------------------------------------- */
  const orbitItems = Array.from(document.querySelectorAll(".orbit-item"));
  const orbitArrows = Array.from(document.querySelectorAll(".orbit-arrow"));

  // Acende só a seta (hover/foco passageiro — some ao sair, a menos que o item esteja fixado)
  function setArrowHighlight(index, active) {
    orbitArrows[index]?.classList.toggle("is-active", active);
  }

  // Fixa o item aberto (clique/toque) — mantém item + seta ativos até novo clique
  function pinOrbitItem(index, active) {
    orbitItems[index]?.classList.toggle("is-active", active);
    orbitItems[index]?.setAttribute("aria-expanded", String(active));
    setArrowHighlight(index, active);
  }

  orbitItems.forEach((item, index) => {
    item.addEventListener("mouseenter", () => setArrowHighlight(index, true));
    item.addEventListener("mouseleave", () => {
      if (!item.classList.contains("is-active")) setArrowHighlight(index, false);
    });
    item.addEventListener("focus", () => setArrowHighlight(index, true));
    item.addEventListener("blur", () => {
      if (!item.classList.contains("is-active")) setArrowHighlight(index, false);
    });

    item.addEventListener("click", (event) => {
      const willActivate = !item.classList.contains("is-active");
      orbitItems.forEach((_, i) => pinOrbitItem(i, false));
      if (willActivate) pinOrbitItem(index, true);
      event.stopPropagation();
    });
  });

  if (orbitItems.length) {
    document.addEventListener("click", () => {
      orbitItems.forEach((_, i) => pinOrbitItem(i, false));
    });
  }

  /* -------------------- Cards de serviço (mobile): toque pra expandir -------------------- */
  const serviceCards = Array.from(document.querySelectorAll(".service-card"));

  serviceCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const willActivate = !card.classList.contains("is-active");
      serviceCards.forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-expanded", "false");
      });
      if (willActivate) {
        card.classList.add("is-active");
        card.setAttribute("aria-expanded", "true");
      }
      event.stopPropagation();
    });
  });

  if (serviceCards.length) {
    document.addEventListener("click", () => {
      serviceCards.forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-expanded", "false");
      });
    });
  }

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

  /* -------------------- Mascote: barra de progresso de leitura --------------------
     O dino "corre" em cima de uma barrinha fixa no topo, marcando o quanto
     já foi lido da página — e some/reaparece no canto conforme a rolagem.
  ------------------------------------------------------------------- */
  const scrollTrack = document.querySelector(".scroll-progress-track");
  const scrollDino = document.querySelector(".scroll-progress-dino");
  const cornerMascot = document.getElementById("cornerMascot");
  const cornerMascotIcon = cornerMascot ? cornerMascot.querySelector(".corner-mascot-icon") : null;

  let scrollStopTimer = null;

  const onMascotScroll = () => {
    if (scrollTrack && scrollDino) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
      scrollTrack.style.width = pct + "%";
      scrollDino.style.left = pct + "%";

      if (!prefersReducedMotion) {
        scrollDino.classList.add("is-moving");
        clearTimeout(scrollStopTimer);
        scrollStopTimer = setTimeout(() => scrollDino.classList.remove("is-moving"), 200);
      }
    }

    if (cornerMascot) {
      cornerMascot.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.6);
    }
  };

  window.addEventListener("scroll", onMascotScroll, { passive: true });
  onMascotScroll();

  /* -------------------- Mascote de canto: repara no cursor --------------------
     Sem sprite de olhos separado, então simulamos "atenção" inclinando o
     ícone inteiro na direção horizontal do mouse (referência ao Clawd). */
  if (cornerMascotIcon && !prefersReducedMotion) {
    window.addEventListener("mousemove", (event) => {
      const rect = cornerMascot.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const tilt = Math.max(-16, Math.min(16, (event.clientX - centerX) / 40));
      cornerMascotIcon.style.setProperty("--tilt", tilt + "deg");
    }, { passive: true });
  }

  /* -------------------- Botão do WhatsApp: dino comemora o clique -------------------- */
  const whatsappBtn = document.querySelector(".whatsapp-btn");
  if (whatsappBtn && cornerMascot) {
    whatsappBtn.addEventListener("click", () => {
      cornerMascot.classList.add("is-visible");
      if (prefersReducedMotion || !cornerMascotIcon) return;
      cornerMascotIcon.classList.remove("is-celebrating");
      void cornerMascotIcon.offsetWidth;
      cornerMascotIcon.classList.add("is-celebrating");
    });
  }

  /* -------------------- Mascote do rodapé: espia ao rolar até o fim -------------------- */
  const footerMascot = document.getElementById("footerMascot");
  if (footerMascot) {
    if ("IntersectionObserver" in window) {
      const footerMascotObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      footerMascotObserver.observe(footerMascot);
    } else {
      footerMascot.classList.add("in-view");
    }
  }

});

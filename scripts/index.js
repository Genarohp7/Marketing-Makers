// ==========================
// Helpers
// ==========================
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

// Año en el footer
const yearSpan = $(".footer__year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ==========================
// NAV: toggle hamburguesa (arreglado)
// ==========================
const navToggle = $(".nav__toggle");
const navMenu = $(".nav__menu");
const mq = window.matchMedia("(max-width: 1023px)");

function collapseForMobile() {
  if (!navMenu) return;
  if (mq.matches) {
    navMenu.classList.remove("is-open");
    navMenu.style.maxHeight = "0px";
    navToggle?.setAttribute("aria-expanded", "false");
  } else {
    // Desktop intacto
    navMenu.style.maxHeight = "";
    navMenu.classList.remove("is-open");
    navToggle?.removeAttribute("aria-expanded");
  }
}
collapseForMobile();
mq.addEventListener
  ? mq.addEventListener("change", collapseForMobile)
  : mq.addListener(collapseForMobile);

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    // Altura dinámica para que no se corte si agregas más items
    navMenu.style.maxHeight = isOpen ? `${navMenu.scrollHeight}px` : "0px";
  });

  // Cerrar al elegir una opción
  navMenu.querySelectorAll(".nav__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navMenu.style.maxHeight = "0px";
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ==========================
// NAV: scroll suave + scroll-spy
// ==========================
const navButtons = $$(".nav__btn");
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(btn.dataset.target);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// activar estado is-active según sección visible
const sections = ["#hero", "#about", "#services", "#clients", "#contact"].map(
  (id) => $(id)
);

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navButtons.forEach((b) =>
          b.classList.toggle(
            "is-active",
            b.dataset.target === "#" + entry.target.id
          )
        );
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
);

sections.forEach((s) => spy.observe(s));

// ==========================
// Animaciones de entrada (clase .reveal)
// ==========================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.2 }
);

$$(".reveal").forEach((el) => revealObserver.observe(el));

// ==========================
// Carrusel de clientes
// ==========================
(function () {
  const root = $("[data-carousel]");
  if (!root) return;

  const track = $(".clients__track", root);
  const slides = $$(".clients__slide", root);
  const prev = $(".clients__prev", root);
  const next = $(".clients__next", root);
  const dotsWrap = $(".clients__dots", root);
  let index = 0;

  // Crear puntitos
  slides.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "clients__dot" + (i === 0 ? " is-active" : "");
    d.addEventListener("click", () => go(i));
    dotsWrap.appendChild(d);
  });
  const dots = $$(".clients__dot", dotsWrap);

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle("is-active", di === index));
  }

  prev.addEventListener("click", () => go(index - 1));
  next.addEventListener("click", () => go(index + 1));

  // autoplay
  let auto = setInterval(() => go(index + 1), 5000);
  root.addEventListener("pointerenter", () => clearInterval(auto));
  root.addEventListener("pointerleave", () => {
    auto = setInterval(() => go(index + 1), 5000);
  });
})();

// ==========================
// Formulario de contacto
// ==========================
(function () {
  const form = $("#contactForm");
  if (!form) return;

  const btn = form.querySelector(".contact__send");
  const inputs = $$("input[required], textarea[required]", form);

  function check() {
    const ok = inputs.every(
      (i) =>
        i.value.trim().length &&
        (i.type !== "email" || /\S+@\S+\.\S+/.test(i.value))
    );
    btn.disabled = !ok;
  }

  inputs.forEach((i) => i.addEventListener("input", check));
  check();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = "Enviando…";

    setTimeout(() => {
      btn.textContent = "¡Enviado!";
    }, 700);
  });
})();

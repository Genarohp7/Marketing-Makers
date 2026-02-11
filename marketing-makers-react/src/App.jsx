import { useEffect, useMemo, useRef, useState } from "react";

// ✅ Importa tus imágenes locales (tú solo cambia nombres/extensiones)
import client1 from "../public/image/Clientes/Altradent.png";
import client2 from "../public/image/Clientes/faster-fitness.png";
import client3 from "../public/image/Clientes/kelom.png";
import client4 from "../public/image/Clientes/natural_force.png";
import client5 from "../public/image/Clientes/republicaAltradent.png";

export default function App() {
  // ==========================
  // Helpers
  // ==========================
  const isMobileOrTablet = () =>
    window.matchMedia("(max-width: 1023px)").matches;

  // ==========================
  // NAV: Hamburguesa (React)
  // ==========================
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setMenuOpen((v) => !v);

  const closeMenuIfMobile = () => {
    if (isMobileOrTablet()) setMenuOpen(false);
  };

  // Ajusta maxHeight dinámico (solo en tablet/móvil)
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;

    if (isMobileOrTablet()) {
      el.style.maxHeight = menuOpen ? `${el.scrollHeight}px` : "0px";
    } else {
      el.style.maxHeight = "";
    }
  }, [menuOpen]);

  // Cerrar menú al pasar a desktop
  useEffect(() => {
    const onResize = () => {
      const el = menuRef.current;
      if (!el) return;

      if (!isMobileOrTablet()) {
        el.style.maxHeight = "";
        setMenuOpen(false);
      } else {
        el.style.maxHeight = menuOpen ? `${el.scrollHeight}px` : "0px";
      }
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  // ==========================
  // Scroll suave + scroll-spy
  // ==========================
  const sectionIds = useRef(["hero", "about", "services", "clients", "contact"]);
  const [activeSection, setActiveSection] = useState("hero");
  const sectionRefs = useRef({});

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id];
    if (!el) return;

    const offset = isMobileOrTablet() ? 80 : 0;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
    closeMenuIfMobile();
  };

  useEffect(() => {
    const els = sectionIds.current
      .map((id) => sectionRefs.current[id])
      .filter(Boolean);

    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: [0, 0.15, 0.25, 0.4, 0.6, 0.8],
      }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ==========================
  // Reveal animations (.reveal)
  // ==========================
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ==========================
  // Carrusel de clientes (React)
  // ==========================
  const clientSlides = useMemo(
    () => [
      {
        src: client1,
        alt: "Proyecto 1",
        caption: "Proyecto · Lanzamiento / Contenido",
      },
      {
        src: client2,
        alt: "Proyecto 2",
        caption: "Proyecto · Branding / Identidad",
      },
      {
        src: client3,
        alt: "Proyecto 3",
        caption: "Proyecto · Campaña digital",
      },
      {
        src: client4,
        alt: "Proyecto 4",
        caption: "Proyecto · Impresos / Producción",
      },
      {
        src: client5,
        alt: "Proyecto 5",
        caption: "Proyecto · Redes / Community",
      },
    ],
    []
  );

  const [clientIndex, setClientIndex] = useState(0);

  const goClient = (i) => {
    const len = clientSlides.length;
    setClientIndex(((i % len) + len) % len);
  };

  // Opcional: autoplay (pausa al hover)
  const autoRef = useRef(null);
  const [pauseAuto, setPauseAuto] = useState(false);

  useEffect(() => {
    if (pauseAuto) return;

    autoRef.current = setInterval(() => {
      setClientIndex((v) => (v + 1) % clientSlides.length);
    }, 5000);

    return () => clearInterval(autoRef.current);
  }, [pauseAuto, clientSlides.length]);

  // ==========================
  // Render
  // ==========================
  return (
    <div className="page">
      {/* Navegación */}
      <nav className="nav" aria-label="Secciones">
        <div className="nav__brand">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("hero");
            }}
          >
            <img
              src="/image/Logo-1.png"
              alt="Logo Marketing Makers"
              className="nav__logo"
            />
          </a>
        </div>

        {/* Botón hamburguesa */}
        <button
          className="nav__toggle"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        {/* Menú */}
        <div ref={menuRef} className={`nav__menu ${menuOpen ? "is-open" : ""}`}>
          <button
            className={`nav__btn ${activeSection === "hero" ? "is-active" : ""}`}
            onClick={() => scrollToSection("hero")}
          >
            Inicio
          </button>

          <button
            className={`nav__btn ${
              activeSection === "about" ? "is-active" : ""
            }`}
            onClick={() => scrollToSection("about")}
          >
            Quiénes somos
          </button>

          <button
            className={`nav__btn ${
              activeSection === "services" ? "is-active" : ""
            }`}
            onClick={() => scrollToSection("services")}
          >
            Qué hacemos
          </button>

          <button
            className={`nav__btn ${
              activeSection === "clients" ? "is-active" : ""
            }`}
            onClick={() => scrollToSection("clients")}
          >
            Clientes
          </button>

          <button
            className={`nav__btn ${
              activeSection === "contact" ? "is-active" : ""
            }`}
            onClick={() => scrollToSection("contact")}
          >
            Contacto
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="content">
        {/* Hero */}
        <section
          id="hero"
          className="hero section"
          ref={(el) => (sectionRefs.current.hero = el)}
        >
          <div className="hero__container">
            <div className="hero__text">
              <h2 className="hero__tag">Ideas que venden</h2>
              <h1 className="hero__title">
                Impulsamos marcas con estrategia, creatividad y ejecución
                medible.
              </h1>
              <p className="hero__description">
                Desde campañas digitales hasta impresos con acabados finos. Un
                solo equipo, una sola página, todo el impacto.
              </p>
              <a
                href="#contact"
                className="hero__cta"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
              >
                Agenda una llamada
              </a>
            </div>

            <div className="hero__card">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop"
                alt="Creativos trabajando"
                className="hero__image"
              />
              <p className="hero__note">
                <b>Marketing 360°:</b> planificación, diseño, pauta y producción.
                Todo en casa.
              </p>
            </div>
          </div>
        </section>

        {/* About */}
        <section
          id="about"
          className="about section"
          ref={(el) => (sectionRefs.current.about = el)}
        >
          <div className="about__container">
            <div className="about__text">
              <h2 className="about__eyebrow">Quiénes somos</h2>
              <h3 className="about__title">
                Un equipo pequeño, enfoque grande: estrategia + diseño + ejecución.
              </h3>

              <p className="about__description">
                Marketing Makers nace para ayudar a negocios reales (los que venden,
                atienden, resuelven y se ensucian las manos). Trabajamos contigo de
                forma cercana, con procesos claros y entregables listos para usar.
              </p>

              <div className="about__highlights">
                <article className="about__highlight">
                  <h4 className="about__highlight-title">Atención directa</h4>
                  <p className="about__highlight-text">
                    Hablas con quien ejecuta. Menos vueltas, más avance y decisiones
                    rápidas.
                  </p>
                </article>

                <article className="about__highlight">
                  <h4 className="about__highlight-title">Proceso simple</h4>
                  <p className="about__highlight-text">
                    Diagnóstico → propuesta → producción → entrega. Sin misterio, sin
                    promesas mágicas.
                  </p>
                </article>

                <article className="about__highlight">
                  <h4 className="about__highlight-title">Resultados medibles</h4>
                  <p className="about__highlight-text">
                    Definimos objetivos claros y medimos lo esencial para mejorar cada
                    iteración.
                  </p>
                </article>
              </div>

              <div className="about__cta">
                <button
                  className="about__cta-btn"
                  onClick={() => scrollToSection("contact")}
                >
                  Cuéntanos tu proyecto
                </button>
                <p className="about__cta-note">
                  Primera llamada para entender tu necesidad (sin compromiso).
                </p>
              </div>
            </div>

            <div className="about__card">
              <img
                src="/image/trabajo en equipo.jpg"
                alt="Reunión de equipo"
                className="about__image"
              />
            </div>
          </div>
        </section>

        {/* Services */}
        <section
          id="services"
          className="services section"
          ref={(el) => (sectionRefs.current.services = el)}
        >
          <div className="services__container">
            <h2 className="services__eyebrow">Qué hacemos</h2>
            <h3 className="services__title">De la estrategia a la pieza final.</h3>

            <div className="services__grid">
              <article className="service">
                <div className="service__img">
                  <img
                    src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1200&auto=format&fit=crop"
                    alt="Marketing digital"
                    className="service__image"
                  />
                </div>
                <div className="service__body">
                  <h4 className="service__title">Marketing Digital</h4>
                  <p className="service__description">
                    Contamos con un equipo multidisciplinario, que podemos ayudar en llevar tu negocio al siguiente nivel, desde desarrolladoras, organización de eventos, diseño digital e impreso, redes sociales, desarrollo web, entre otros.
                  </p>
                </div>
              </article>

              <article className="service">
                <div className="service__img">
                  <img
                    src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop"
                    alt="Branding"
                    className="service__image"
                  />
                </div>
                <div className="service__body">
                  <h4 className="service__title">Branding</h4>
                  <p className="service__description">
                    Algunos servicios ofrecen métricas, análisis, datos y reportes. Con el fin de informarte si tus campañas son efectivas y mejorar siempre la planeación de futuras.
                  </p>
                </div>
              </article>

              <article className="service">
                <div className="service__img">
                  <img
                    src="/image/impresos.jpg"
                    alt="Impresos"
                    className="service__image"
                  />
                </div>
                <div className="service__body">
                  <h4 className="service__title">Impresos &amp; Producción</h4>
                  <p className="service__description">
                    Muchos aspectos pueden ser importantes para lograr impacto y conexión con tu cliente, es importante conocerlos, para esto haremos una investigación contigo para conocerlo, y una vez detectado el mejor canal, ¡lanzamos la propuesta!
                  </p>
                </div>
              </article>
            </div>

            <p className="services__note reveal">
              Somos una agencia con varios niveles de apoyo, podemos hacerlo sin importar el tamaño de tu negocio, una persona física con actividad empresarial o comercial, emprendedor, freelancer, doctor, micro, pequeño y mediano negocio, hasta proyectos de gran escala.
            </p>
          </div>
        </section>

        {/* ✅ Clientes (con imágenes locales + carrusel React) */}
        <section
          id="clients"
          className="clients section"
          ref={(el) => (sectionRefs.current.clients = el)}
        >
          <div className="clients__container">
            <h2 className="clients__eyebrow">Clientes</h2>
            <h3 className="clients__title">Marcas que confían en nosotros</h3>

            <div
              className="clients__carousel"
              onMouseEnter={() => setPauseAuto(true)}
              onMouseLeave={() => setPauseAuto(false)}
            >
              <div
                className="clients__track"
                style={{ transform: `translateX(-${clientIndex * 100}%)` }}
              >
                {clientSlides.map((s, i) => (
                  <div className="clients__slide" key={i}>
                    <img src={s.src} alt={s.alt} className="clients__image" />
                    <div className="clients__caption">{s.caption}</div>
                  </div>
                ))}
              </div>

              <div className="clients__ctrl">
                <button
                  className="clients__prev"
                  type="button"
                  aria-label="Anterior"
                  onClick={() => goClient(clientIndex - 1)}
                >
                  ◀
                </button>
                <button
                  className="clients__next"
                  type="button"
                  aria-label="Siguiente"
                  onClick={() => goClient(clientIndex + 1)}
                >
                  ▶
                </button>
              </div>
            </div>

            <div className="clients__dots">
              {clientSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`clients__dot ${i === clientIndex ? "is-active" : ""}`}
                  aria-label={`Ir a slide ${i + 1}`}
                  onClick={() => goClient(i)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section
          id="contact"
          className="contact section"
          ref={(el) => (sectionRefs.current.contact = el)}
        >
          <div className="contact__container">
            <div className="contact__form-wrapper">
              <h2 className="contact__eyebrow">Contacto</h2>
              <h3 className="contact__title">
                Hagamos algo que valga la pena contar.
              </h3>

              <form id="contactForm" className="contact__form">
                <label htmlFor="name" className="contact__label">
                  Nombre
                </label>
                <input id="name" name="name" required className="contact__input" />

                <label htmlFor="email" className="contact__label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="contact__input"
                />

                <label htmlFor="msg" className="contact__label">
                  Mensaje
                </label>
                <textarea
                  id="msg"
                  name="msg"
                  required
                  className="contact__textarea"
                ></textarea>

                <button className="contact__send" type="submit">
                  Enviar mensaje
                </button>
              </form>
            </div>

            <div className="contact__map">
              <img
                src="https://images.unsplash.com/photo-1502920514313-52581002a659?q=80&w=1600&auto=format&fit=crop"
                alt="Mapa/Ubicación"
                className="contact__map-image"
              />
            </div>
          </div>

          <footer className="footer">
            © <span className="footer__year">{new Date().getFullYear()}</span>{" "}
            Marketing Makers · Hecho con ♥ en CDMX
          </footer>
        </section>
      </main>

      {/* Redes sociales */}
      <aside className="social" aria-label="Redes sociales">
        <a
          href="https://www.facebook.com/people/Marketingmakersmx/61556090288615/?rdid=zuWdAVZLQZwmWDm5&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F17J5mcdB1x%2F"
          target="_blank"
          rel="noreferrer"
          className="social__link"
        >
          <i className="fa-brands fa-facebook"></i>
        </a>
        <a
          href="https://www.instagram.com/marketingmakersmx/"
          target="_blank"
          rel="noreferrer"
          className="social__link"
        >
          <i className="fa-brands fa-square-instagram"></i>
        </a>
        <a
          href="https://www.linkedin.com/company/marketing-makers-mx/posts/?feedView=all"
          target="_blank"
          rel="noreferrer"
          className="social__link"
        >
          <i className="fa-brands fa-linkedin"></i>
        </a>
      </aside>
    </div>
  );
}

// =========================================================
// EL DORADO — interacciones de la página
// =========================================================

// ---- Número de WhatsApp del negocio (formato internacional, sin +) ----
// TODO: reemplazar por el número real del supermercado.
const WHATSAPP_NUMBER = "59899123456";

document.addEventListener("DOMContentLoaded", () => {
  buildHeroRays();
  setupHeaderScroll();
  setupMobileNav();
  setupPriceTagOrders();
  setupPhoneCopy();
  setupScrollReveal();
  document.getElementById("year").textContent = new Date().getFullYear();
});

// ---- Dibuja los rayos del sol dorado detrás del hero ----
function buildHeroRays() {
  const group = document.getElementById("heroRays");
  if (!group) return;
  const svgNS = "http://www.w3.org/2000/svg";
  const rayCount = 28;
  const cx = 400, cy = 400, rInner = 150, rOuter = 380;

  for (let i = 0; i < rayCount; i++) {
    const angle = (i / rayCount) * Math.PI * 2;
    const x1 = cx + Math.cos(angle) * rInner;
    const y1 = cy + Math.sin(angle) * rInner;
    const x2 = cx + Math.cos(angle) * rOuter;
    const y2 = cy + Math.sin(angle) * rOuter;
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", x1.toFixed(1));
    line.setAttribute("y1", y1.toFixed(1));
    line.setAttribute("x2", x2.toFixed(1));
    line.setAttribute("y2", y2.toFixed(1));
    group.appendChild(line);
  }

  const core = document.createElementNS(svgNS, "circle");
  core.setAttribute("cx", cx);
  core.setAttribute("cy", cy);
  core.setAttribute("r", rInner);
  core.setAttribute("class", "sun-core");
  group.appendChild(core);
}

// ---- Header: sombra al hacer scroll ----
function setupHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ---- Menú móvil ----
function setupMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ---- Botón "Pedir" en cada cartelito de precio -> WhatsApp con mensaje armado ----
function setupPriceTagOrders() {
  document.querySelectorAll(".price-tag").forEach((tag) => {
    const button = tag.querySelector(".tag-order");
    const productName = tag.dataset.product || "un producto";
    if (!button) return;

    button.addEventListener("click", () => {
      const message = `Hola El Dorado, quiero pedir: ${productName}. ¿Me confirmás precio y stock?`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener");
    });
  });
}

// ---- Copiar el teléfono al portapapeles desde el bloque de contacto ----
function setupPhoneCopy() {
  const phoneBtn = document.getElementById("phoneBig");
  const toast = document.getElementById("copyToast");
  if (!phoneBtn || !toast) return;

  phoneBtn.addEventListener("click", async () => {
    const number = phoneBtn.dataset.phone || phoneBtn.textContent.trim();
    try {
      await navigator.clipboard.writeText(number);
      toast.textContent = "Teléfono copiado ✓";
    } catch {
      toast.textContent = number;
    }
    toast.classList.add("show");
    clearTimeout(setupPhoneCopy._t);
    setupPhoneCopy._t = setTimeout(() => toast.classList.remove("show"), 2200);
  });
}

// ---- Animación de aparición al hacer scroll ----
function setupScrollReveal() {
  const targets = document.querySelectorAll(
    ".price-tag, .cat-card, .steps li, .branch-card, .section-head"
  );
  targets.forEach((el) => el.classList.add("reveal"));

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

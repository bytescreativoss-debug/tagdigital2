/* TAGDIGITAL — comportamiento mínimo de la landing. */
(function () {
  // Número de WhatsApp en formato internacional, sin "+" ni espacios.
  var WHATSAPP = "5491156913265";

  function whatsappUrl(message) {
    var base = "https://wa.me/" + WHATSAPP;
    return message ? base + "?text=" + encodeURIComponent(message) : base;
  }
  function formatARS(n) {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
  }

  // Año del copyright
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Menú móvil
  var toggle = document.getElementById("menu-toggle");
  var menu = document.getElementById("menu-movil");
  if (toggle && menu) {
    function setMenu(open) {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "✕" : "☰";
    }
    toggle.addEventListener("click", function () { setMenu(menu.hidden); });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
  }

  // QR del hero: se "arma" celda por celda
  var grid = document.querySelector(".qr-grid");
  if (grid) setTimeout(function () { grid.classList.add("built"); }, 150);

  // Tarjetas de producto: elegir versión actualiza precio y mensaje de WhatsApp
  document.querySelectorAll(".product-card").forEach(function (card) {
    var buttons = card.querySelectorAll(".variant");
    if (!buttons.length) return;
    var name = card.getAttribute("data-name");
    var price = card.querySelector(".product-price");
    var cta = card.querySelector(".product-cta");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          var on = b === btn;
          b.setAttribute("aria-checked", String(on));
          b.classList.toggle("is-active", on);
        });
        var p = Number(btn.getAttribute("data-price"));
        price.textContent = formatARS(p);
        cta.href = whatsappUrl(
          "Hola Tagdigital! Quiero pedir: " + name + " (" + btn.getAttribute("data-label") + ") - " + formatARS(p) + "."
        );
      });
    });
  });

  // Formulario: arma el mensaje y abre WhatsApp
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      function get(k) { return String(d.get(k) || "").trim(); }
      var lines = [
        "Hola Tagdigital! Quiero hacer un pedido / pedir presupuesto.",
        "Nombre: " + get("name"),
        "Negocio: " + get("business"),
        "Producto: " + get("product"),
        "Cantidad: " + (get("quantity") || "1"),
      ];
      if (get("link")) lines.push("Link para el QR: " + get("link"));
      if (get("message")) lines.push("Mensaje: " + get("message"));
      window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
    });
  }
})();

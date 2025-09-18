





//DONACION
const BASE = "https://getnet-volviendo-a-casa.onrender.com"; // tu backend

// Bloquea decimales y caracteres raros en el input
const inputMonto = document.getElementById("monto");
inputMonto.addEventListener("keydown", (e) => {
  // bloquea: e, E, +, -, ., , y espacios
  if (["e","E","+","-",".",","," "].includes(e.key)) e.preventDefault();
});
inputMonto.addEventListener("input", (e) => {
  // solo dígitos
  e.target.value = e.target.value.replace(/[^\d]/g, "");
});

function pickRedirectUrl(d) {
  if (!d || typeof d !== "object") return null;
  const c = [
    d.redirect_url, d.checkout_url, d.payment_url, d.processUrl, d.url,
    d?.data?.links?.checkout, d?.data?.redirect_url, d?.data?.url
  ];
  return c.find(u => typeof u === "string" && u.startsWith("http")) || null;
}

async function call(path, opts){
  const r = await fetch(BASE + path, opts);
  let data; try { data = await r.json(); } catch { data = await r.text(); }
  return { status: r.status, data };
}

const form = document.getElementById("form");
const inputMontoValor = document.getElementById("monto_valor");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = parseInt(inputMonto.value, 10);
  if (!Number.isInteger(amount) || amount <= 0) {
    alert("Ingresá un monto válido (solo números enteros, sin centavos).");
    inputMonto.focus();
    return;
  }
  inputMontoValor.value = String(amount);

  // abrir nueva pestaña antes del fetch (evita bloqueo de pop-ups)
  const win = window.open("about:blank", "_blank");

  const btn = form.querySelector("button[type=submit]");
  const prevText = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Creando orden...";

  try {
    const { status, data } = await call("/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });

    if (status >= 400) {
      if (win) win.close();
      alert("No se pudo crear la intención de pago.\n" + (typeof data === "string" ? data : JSON.stringify(data)));
      return;
    }

    const url = pickRedirectUrl(data);
    if (url) {
      if (win) win.location = url;
      else window.open(url, "_blank");
    } else {
      if (win) win.close();
      alert("La API no devolvió un link de checkout.\n" + JSON.stringify(data, null, 2));
      console.log("Respuesta /payment-intent:", data);
    }
  } catch (err) {
    if (win) win.close();
    alert("Error de red: " + err);
  } finally {
    btn.disabled = false;
    btn.textContent = prevText;
  }
});
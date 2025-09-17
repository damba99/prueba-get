





//DONACION
const input = document.getElementById("monto");
    const hidden = document.getElementById("monto_valor");
    const form = document.getElementById("form");

    const formatter = new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    input.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, ""); // solo dígitos
      let numberValue = parseFloat(value) / 100;

      if (!isNaN(numberValue)) {
        input.value = formatter.format(numberValue);
        hidden.value = Math.round(numberValue * 100); // guarda en centavos, sin coma ni punto
      } else {
        input.value = "";
        hidden.value = "";
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Monto enviado: " + hidden.value); // ejemplo: 123450
      // acá podrías hacer fetch() o dejar que se envíe al servidor
    });
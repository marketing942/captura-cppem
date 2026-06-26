/* =========================================================
   CPPEM — Formulário → Google Sheets via Apps Script
   ========================================================= */

/* ⚠️  COLE AQUI A URL DO SEU WEB APP (Google Apps Script)
   Passo a passo abaixo no README / instruções do arquivo.   */
const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxdFplWVSfhTjvyIA7HIWb645xRjGNhBVhTdTf5UMjo0lSpW_A_jCuys0qB4uImKXPQ/exec";

/* -------------------------------------------------------
   Máscara: +55 (00) 00000-0000
------------------------------------------------------- */
const telefoneInput = document.getElementById("telefone");

telefoneInput.addEventListener("input", () => {
  let d = telefoneInput.value.replace(/\D/g, "");
  if (d.startsWith("55")) d = d.slice(2);
  d = d.slice(0, 11);

  let out = "+55";
  if (d.length > 0) out += " (" + d.slice(0, 2);
  if (d.length >= 2) out += ") ";
  if (d.length > 2) out += d.slice(2, 7);
  if (d.length > 7) out += "-" + d.slice(7, 11);

  telefoneInput.value = out;
});

/* -------------------------------------------------------
   Validação — todos os campos obrigatórios
------------------------------------------------------- */
function setError(id, msg) {
  document.getElementById(id).classList.add("is-invalid");
  document.querySelector(`[data-error-for="${id}"]`).textContent = msg;
}
function clearError(id) {
  document.getElementById(id).classList.remove("is-invalid");
  document.querySelector(`[data-error-for="${id}"]`).textContent = "";
}
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function validate() {
  let ok = true;
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const tel = telefoneInput.value.replace(/\D/g, ""); // 55 + DDD(2) + 9 dígitos = 13

  ["nome", "email", "telefone"].forEach(clearError);

  if (nome.length < 2) {
    setError("nome", "Informe seu nome completo.");
    ok = false;
  }
  if (!isEmail(email)) {
    setError("email", "Informe um e-mail válido.");
    ok = false;
  }
  if (tel.length < 13) {
    setError("telefone", "Informe o telefone com DDD.");
    ok = false;
  }

  return ok;
}

/* -------------------------------------------------------
   Envio para o Google Sheets
------------------------------------------------------- */
document.getElementById("lead-form").addEventListener("submit", async e => {
  e.preventDefault();
  if (!validate()) return;

  const btn = e.target.querySelector("button[type=submit]");
  btn.disabled = true;
  btn.textContent = "ENVIANDO...";

  const payload = {
    nome: document.getElementById("nome").value.trim(),
    email: document.getElementById("email").value.trim(),
    telefone: telefoneInput.value.trim(),
  };

  try {
    /* Google Apps Script exige no-cors para evitar erro de CORS.
       Os dados chegam normalmente na planilha mesmo assim.      */
    await fetch(SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    e.target.reset();
    telefoneInput.value = "+55"; // resetar máscara
    document.getElementById("form-success").hidden = false;
    document
      .getElementById("form-success")
      .scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (err) {
    setError("telefone", "Erro ao enviar. Tente novamente.");
  } finally {
    btn.disabled = false;
    btn.textContent = "QUERO RECEBER ORIENTAÇÃO";
  }
});

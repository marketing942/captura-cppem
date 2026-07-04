/* =========================================================
   CPPEM — Formulário → Google Sheets + redirect WhatsApp
   ========================================================= */

const SHEET_URL = "https://script.google.com/macros/s/AKfycbxdFplWVSfhTjvyIA7HIWb645xRjGNhBVhTdTf5UMjo0lSpW_A_jCuys0qB4uImKXPQ/exec?aba=CPPEM";

// ⚠️ TROQUE pelo número de WhatsApp de atendimento (somente dígitos, com DDI 55)
const WHATSAPP_NUM = "5581973105354";

/* --- Máscara: (00) 00000-0000 --- */
const telefoneInput = document.getElementById("telefone");

telefoneInput.addEventListener("input", () => {
  let d = telefoneInput.value.replace(/\D/g, "").slice(0, 11);
  let out = "";
  if (d.length > 0)  out  = "(" + d.slice(0, 2);
  if (d.length >= 2) out += ") ";
  if (d.length > 2)  out += d.slice(2, 7);
  if (d.length > 7)  out += "-" + d.slice(7, 11);
  telefoneInput.value = out;
});

/* --- Validação --- */
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
  const nome  = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const tel   = telefoneInput.value.replace(/\D/g, "");

  ["nome","email","telefone"].forEach(clearError);

  if (nome.length < 2) { setError("nome",     "Informe seu nome completo.");  ok = false; }
  if (!isEmail(email)) { setError("email",    "Informe um e-mail válido.");   ok = false; }
  if (tel.length < 11) { setError("telefone", "Informe o telefone com DDD."); ok = false; }

  return ok;
}

/ --- Envio --- /
document.getElementById("lead-form").addEventListener("submit", async (e) => {
e.preventDefault();
if (!validate()) return;

const form = e.target;
const btn = form.querySelector("button[type=submit]");

btn.disabled = true;
btn.textContent = "ENVIANDO...";

const payload = {
nome: document.getElementById("nome").value.trim(),
email: document.getElementById("email").value.trim(),
telefone: telefoneInput.value.trim(),
};

try {
// 1. Envia primeiro para o Google Sheets
await fetch(SHEET_URL, {
method: "POST",
mode: "no-cors",
headers: {
"Content-Type": "text/plain;charset=utf-8"
},
body: JSON.stringify(payload),
});

// 2. Mostra sucesso
form.reset();

const successEl = document.getElementById("form-success");
successEl.hidden = false;
successEl.scrollIntoView({ behavior: "smooth", block: "center" });

// 3. Dispara o evento Lead sem travar o envio
try {
if (typeof fbq === "function") {
fbq("track", "Lead", {
content_name: "captura_cppem",
page_url: window.location.href
});

console.log("[Pixel] Lead disparado com sucesso.");
} else {
console.warn("[Pixel] fbq não encontrado.");
}
} catch (pixelError) {
console.warn("[Pixel] Erro ao disparar Lead:", pixelError);
}

// 4. Redireciona para o WhatsApp depois de uma pequena pausa
const msg = encodeURIComponent("Quero começar minha preparação!");

setTimeout(() => {
window.location.href = https://wa.me/${WHATSAPP_NUM}?text=${msg};
}, 700);

} catch (err) {
console.error("[Form] Erro ao enviar:", err);
setError("telefone", "Erro ao enviar. Tente novamente.");

btn.disabled = false;
btn.textContent = "QUERO RECEBER ORIENTAÇÃO";
}
});
